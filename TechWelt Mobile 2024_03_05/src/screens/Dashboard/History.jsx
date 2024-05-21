import React, { useState, useEffect, useRef } from "react";
import { SafeAreaView, View, Text, ActivityIndicator, StatusBar, FlatList, StyleSheet, ProgressBarAndroid,
  TouchableOpacity, Image, Modal } from "react-native";
import { IconComponentProvider, Icon } from "@react-native-material/core";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useFocusEffect } from "@react-navigation/native";
import {useTranslation} from "react-i18next";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useSelector, useDispatch } from 'react-redux';
import { vehicleHistory,action_vehicle_history } from "../../actions/vehicles"
import MapView from "react-native-map-clustering";
import { Marker } from 'react-native-maps';
import { toastr } from "../../services/navRef";
import moment from "moment";
import Header from "../Header";
import MapDirection from './MapDirection';
import DateRangePicker from './DateRangePicker';
import { TextInput } from "react-native-gesture-handler";

let timeIntervalID = undefined;
let datalength = 0;
let posIndex = 0;
let intervalSpeed = 1000;
let playSpeedArray = [{val:10,disp:'10Sec'},{val:20,disp:'20Sec'},{val:50,disp:'50Sec'},{val:100,disp:'100Sec'}];
let speedIndex = 0;
let tempArray = [];

export default function History({ navigation,route }) {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const vehicleReducer = useSelector(state => state.vehicles)
  const userReducer = useSelector(state => state.auth);

  let historyData = vehicleReducer.vehicleHistory;

  const { infos } = route.params !== undefined ? route.params : undefined;
  const [vehicleData, setVehicleData] = useState(infos === undefined ? undefined : infos.vehicle);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startTime, setStarTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const [mapType, setMapType] = useState('standard');
  const mapRef = useRef(null);
  const [region, setRegion] = useState({
    latitude: 25.9219133,
    longitude: 56.0663866,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });
  

  const [isShowVehicleList, setIsShowVehicleList] = useState(false);
  const [isShowVehicle, setIsShowVehicle] = useState(false);

  const [isShowDatePicker, setIsShowDatePicker] = useState(false);
  const [isShowTimeLine, setIsShowTimeLine] = useState(false);

  const [markerLat, setMarkerLat] = useState(null);
  const [markerLng, setMarkerLng] = useState(null);
  
  const [progressBarValue, setProgressBarValue] = useState(0);
  const [onVehiclePlay, setOnVehiclePlay] = useState(false);
  const [polylineData, setPolyLineData] = useState([]);

  const [totalPlayTime, setTotalPlayTime] = useState(0);
  const [curPlayTime, setCurPlayTime] = useState(0);

  const [currentAddress, setCurrentAddress] = useState('');
  const [currentSpeed, setCurrentSpeed] = useState('');
  const [progressBarWidth, setProgressBarWidth] = useState(0);

  const markerRef = useRef(null);
  const [zoomLevel, setZoomLevel] = useState(15);
  const [speedText,setSpeedText] = useState('10Sec');

  const [dataVehiclelist, setDataVehicleList] = useState();
  const [checkVehicleList, setCheckVehicleList] = useState([]);
  // const tempData = {"_id": "6500d85b42aa1d932e68208b", "createdAt": "2023-09-12T21:30:03.518Z", "deviceModel": "FMB202", "deviceType": "Teltonika", "teltonikas": {"FW_Version": "0", "IOvalue": [[Object]], "__v": 0, "_id": "6535807ed7bfa7706933a584", "createdAt": "2023-10-22T20:05:18.271Z", "deviceImei": "863719061186400", "deviceType": "Teltonika", "fuel": "0", "ignition": "0", "isChange": 0, "lat": 24.9883883, "lng": 55.1910366, "movement": "0", "output1": 0, "output2": 0, "output3": 0, "speed": 0, "transferDate": "2023-10-23T00:05:12.011Z", "updatedAt": "2023-10-22T20:05:18.271Z"}, "title": "Teltonika", "updatedAt": "2023-11-02T17:45:01.103Z", "userId": "6575cbdfdb3c76971e4f405d", "vehicleName": "BMW"};
  
  useFocusEffect(React.useCallback(() => {
    if(vehicleData === undefined){
      if(vehicleReducer && vehicleReducer.vehiclesList.length > 0){
        const tempVehicleData = []
        for(let i=0;i<vehicleReducer.vehiclesList.length ;i++){
          tempVehicleData.push(vehicleReducer.vehiclesList[i].vehicle.vehicleName);
        }
        setVehicleData(vehicleReducer.vehiclesList[0].vehicle);
        setDataVehicleList(tempVehicleData);
        
        let tempCheckVehicleList = [];
        tempCheckVehicleList.push(true)
        for(var i=1;i<tempVehicleData.length;i++){
          tempCheckVehicleList.push(false);
        }
        setCheckVehicleList(tempCheckVehicleList); 
      }
      setMarkerLat(vehicleReducer.vehiclesList[0].vehicle.teltonikas[0]?.lat);
      setMarkerLng(vehicleReducer.vehiclesList[0].vehicle.teltonikas[0]?.lng);

      setIsShowVehicleList(true);

    }else{
      // from location
      //setIsShowVehicleList(false);
    }

  }, []));


  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      initVariable();
    });
    return () => {
    };
  }, []);


  const initVariable = () =>{
    clearInterval(timeIntervalID);
    setProgressBarValue(0);
    setPolyLineData([]);
    setOnVehiclePlay(false);
    setSpeedText('10Sec');  
    setCurPlayTime(0);
    historyData = null;
  }

  const handleSubmit = () => {
    tempArray = [];
    if (!startDate || !endDate) {
      toastr("Please Select Date")
      return;
    }
    
    const dateFrom = new Date(startDate + "T" + convert12HourTo24Hour(f_h + ":" + f_m + " " + f_meridian) + ":00");
    const dateTo = new Date(endDate + "T" + convert12HourTo24Hour(t_h + ":" + t_m + " " + t_meridian) + ":00");
    const diffInMilliseconds = Math.abs(dateTo - dateFrom);
    setTotalPlayTime(Math.floor(diffInMilliseconds / 1000));
    setCurPlayTime(0);
    let startHours= f_h;
    let endHours = t_h;

    if(f_meridian === "PM") {
      let tmpVal = parseInt(f_h);
      if(tmpVal === 0) {
        tmpVal === parseInt(f_h.substring(1,2))
        if(tmpVal === 0) {
          startHours = "12";
        } else {
          startHours = (tmpVal + 12).toString();
        }
      } else {
        startHours = (tmpVal + 12).toString();
      }
    }

    if(t_meridian === "PM") {
      let tmpVal = parseInt(t_h);
      if(tmpVal === 0) {
        tmpVal === parseInt(t_h.substring(1,2))
        if(tmpVal === 0) {
          endHours = "12";
        } else {
          endHours = (tmpVal + 12).toString();
        }
      } else {
        endHours = (tmpVal + 12).toString();
      }
    }
    dispatch(vehicleHistory(userReducer.token, vehicleData.teltonikas[0].deviceImei, 
      `${startDate}T${startHours.toString().padStart(2, '0')}:${f_m}:00`, `${endDate}T${endHours.toString().padStart(2, '0')}:${t_m}:00`));

    setIsShowDatePicker(false);
    setIsShowTimeLine(true);
  }

  function secToHr(sec) {
    let hours = Math.floor(sec / 3600);
    let minutes = Math.floor((sec % 3600) / 60);
    let seconds = sec % 60;
    let formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    return formattedTime;
  }

  function convert12HourTo24Hour(time12) {
    const [time, period] = time12.split(' ');
    const [hours, minutes] = time.split(':');
  
    let hours24 = parseInt(hours);
    if (period === 'PM' && hours !== '12') {
      hours24 += 12;
    } else if (period === 'AM' && hours === '12') {
      hours24 = 0;
    }
  
    const time24 = `${hours24.toString().padStart(2, '0')}:${minutes}`;
    return time24;
  }

  const handleSpeedCtrl = (speedFlag) => {
    if (!onVehiclePlay) return;
    if(speedFlag){
      speedIndex++;
    }else{
      speedIndex--;
    }
    
    if(speedIndex < 0) speedIndex = 0;
    if(speedIndex >= playSpeedArray.length) speedIndex = playSpeedArray.length - 1;
    
    clearInterval(timeIntervalID);
    setSpeedText(playSpeedArray[speedIndex].disp)
    posIndex = 0;

    timeIntervalID = setInterval(moveVehicle, intervalSpeed);
  }

  const handleStartPlay = () => {
    if (onVehiclePlay) {
      setOnVehiclePlay(false)
      setProgressBarValue(0)
      setCurPlayTime(0);
      clearInterval(timeIntervalID)
    } else {
      if (!historyData || historyData.length == 0) {
        toastr(t('Empty'));
        return;
      }

      setOnVehiclePlay(true)

      datalength = totalPlayTime;
      posIndex = 0;
      setPolyLineData([])        
      timeIntervalID = setInterval(moveVehicle, intervalSpeed);
    }
  }


  const moveVehicle = () => {
    if (curPlayTime + playSpeedArray[speedIndex].val *posIndex >= totalPlayTime) {
      clearInterval(timeIntervalID);
      setOnVehiclePlay(false);
      setProgressBarValue(0);
      setCurPlayTime(0);
      return;
    }

    let tmpStart = new Date(startDate + "T" + convert12HourTo24Hour(f_h+ ":" + f_m + " " + f_meridian) + ":00");
    tmpStart.setSeconds(tmpStart.getSeconds() + curPlayTime + playSpeedArray[speedIndex].val *posIndex);
    let tmpEnd = new Date(startDate + "T" + convert12HourTo24Hour(f_h + ":" + f_m + " " + f_meridian) + ":00");
    tmpEnd.setSeconds(tmpEnd.getSeconds() + curPlayTime + playSpeedArray[speedIndex].val *(posIndex + 1));
    
    const filteredData = historyData.filter(obj => {
      const transferDate = new Date(obj.transferDate);
      return transferDate >= tmpStart && transferDate <= tmpEnd;
    });
    if(filteredData && filteredData.length > 0) {
      setMarkerLat(filteredData[filteredData.length - 1].lat)
      setMarkerLng(filteredData[filteredData.length - 1].lng)
      setCurrentSpeed(filteredData[filteredData.length - 1].speed);
      setCurrentAddress(filteredData[filteredData.length - 1].address);

      for (let index = 0; index < filteredData.length; index++) {
        setMarkerLat(filteredData[filteredData.length - 1].lat)
        setMarkerLng(filteredData[filteredData.length - 1].lng)
        setCurrentSpeed(filteredData[filteredData.length - 1].speed);
        setCurrentAddress(filteredData[filteredData.length - 1].address);
        tempArray.push({ latitude: filteredData[index].lat, longitude: filteredData[index].lng })
      }
      setPolyLineData(tempArray)
      setRegion({
        latitude: filteredData[filteredData.length - 1].lat,
        longitude: filteredData[filteredData.length - 1].lng,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      })
    }

    setCurPlayTime(curPlayTime + playSpeedArray[speedIndex].val *posIndex)
    setProgressBarValue( (curPlayTime + playSpeedArray[speedIndex].val * posIndex) / totalPlayTime)
    posIndex++;
  }

  const handleLayout = (event) => {
    const { width } = event.nativeEvent.layout;
    setProgressBarWidth(width);
  };

  const handleMapRegionChange = (region) => {
    const LONGITUDE_DELTA_THRESHOLD = 0.01;
    const currentZoomLevel = Math.round(Math.log(360 / region.longitudeDelta) / Math.LN2);
    setZoomLevel(currentZoomLevel);
  };

  const renderVehicleItem = (item,index) => {
    return (
      <TouchableOpacity
        onPress={() => { 
          let tempCheckList = checkVehicleList;
          tempCheckList[index] = tempCheckList[index]; 
          tempCheckList = tempCheckList.map( (data, pos) => { 
            if(pos !== index)
             return false;
            else
              return !data;
          })

          setCheckVehicleList(tempCheckList);
          setIsShowVehicle(false);

          setVehicleData(vehicleReducer.vehiclesList[index].vehicle);

          setTimeout(() => {
            setIsShowVehicle(true);
          }, 10);
        }}>
        <View style={{alignItems:'center',width:'100%', height:33, flexDirection:'row',justifyContent:'flex-start'}}>
          <View style={{marginLeft:12}}>
              <View style={{width:15,height:15,alignItems:'center', justifyContent:'center', borderColor:'#7A7D8B',borderRadius:4,borderWidth:2}}>
                {checkVehicleList[index] ? (<IconComponentProvider IconComponent={MaterialCommunityIcons}>
                  <Icon name="check-bold" size={11} color="#FF0000" />
                </IconComponentProvider>) : null }
              </View>
          </View>
          <View style={{marginLeft:12}}>
            {index == 0 ? <Text style={{ fontSize:16,fontWeight:'bold',color:'#7A7D8B',textDecorationLine:'underline'}}>{item}</Text> :
            <Text style={{ fontSize:16,fontWeight:'bold',color:'#7A7D8B'}}>{item}</Text>}
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  const selectedDateRange = (s, e) => {
    setStartDate(s);
    setEndDate(e);
  }

  const [f_h, setF_H] = useState("00");
  const [f_m, setF_M] = useState("00");
  const [t_h, setT_H] = useState("00");
  const [t_m, setT_M] = useState("00");
  const [f_meridian, setFMeridian] = useState("AM")
  const [t_meridian, setTMeridian] = useState("AM")
  const [curTimeType, setCurTimeType] = useState("");
  const [showTimeModal, setShowTimeModal] = useState(false);

  const handleTime = (data) => {
    setShowTimeModal(true);
    setCurTimeType(data);
  }

  const decreaseVal = () => {
    if(curTimeType === 'f_h') {
      if(f_h === 0){
        setF_H(11);
      } else {
        setF_H(f_h - 1);
      }
    } else if(curTimeType === 'f_m') {
      if(f_m === 0){
        setF_M(59);
      } else {
        setF_M(f_m - 1);
      }
    } else if(curTimeType === 't_h') {
      if(t_h === 0){
        setT_H(11);
      } else {
        setT_H(t_h - 1);
      }
    } else if(curTimeType === 't_m') {
      if(t_m === 0){
        setT_M(59);
      } else {
        setT_M(t_m - 1);
      }
    }
  }

  const increaseVal = () => {
    if(curTimeType === 'f_h') {
      if(f_h === 11) {
        setF_H(0);
      } else {
        setF_H(f_h + 1);
      }
    } else if(curTimeType === 'f_m') {
      if(f_m === 59){
        setF_M(0);
      } else {
        setF_M(f_m + 1);
      }
    } else if(curTimeType === 't_h') {
      if(t_h === 11){
        setT_H(0);
      } else {
        setT_H(t_h + 1);
      }
    } else if(curTimeType === 't_m') {
      if(t_m === 59){
        setT_M(0);
      } else {
        setT_M(t_m + 1);
      }
    }
  }

  const handleBlurF_H = () => {
    if( parseInt(f_h) >= 12) {
      setF_H("11");
    } else {
      setF_H(f_h.toString().padStart(2, '0'));
    }
  }
  const handleBlurF_M = () => {
    if( parseInt(f_m) >= 60) {
      setF_M("59");
    } else {
      setF_M(f_m.toString().padStart(2, '0'));
    }
  }
  const handleBlurT_H = () => {
    if( parseInt(t_h) >= 12) {
      setT_H("11");
    } else {
      setT_H(t_h.toString().padStart(2, '0'));
    }
  }
  const handleBlurT_M = () => {
    if( parseInt(t_m) >= 60) {
      setT_M("59");
    } else {
      setT_M(t_m.toString().padStart(2, '0'));
    }
  }

  return (
    <View style={styles.v1}>
      <Header screenName={t('history')} back="true" subTitle="AUDI" setting={true} curNavigation={navigation}></Header>
      <Text style={{position:'absolute', top:45, fontSize:24, fontWeight:'bold', color:'white', alignSelf:'center',
        textAlign:'center', width:100}}>{vehicleData?.vehicleName}</Text>

      <MapView
        ref={mapRef}
        mapType={mapType} // Set the initial map type
        region={region}
        style={styles.map}
        initialRegion={region}
        onRegionChangeComplete={handleMapRegionChange}
      >  
        { vehicleData && <Marker
          key={vehicleData._id}
          ref={markerRef}
          coordinate={{ latitude: markerLat, longitude: markerLng }}
          onPress={(event) => {
          }}
        >
          {/* <View style={{ alignItems: 'center', width: 80, height: 50,  alignSelf: 'center' }}> */}
            <Image style={{ width: 80, height: 50, resizeMode:'contain' }} source={require('../../../assets/car.png')} />
          {/* </View> */}
        </Marker>}
        {polylineData.length > 1 && polylineData.map((item,index) =>{
          return (
            polylineData[index-1] && <MapDirection key={index} coordinate1={polylineData[index-1]} coordinate2 ={item} index={index}/>
          )
        })}      
      </MapView>

      <View style={{ width:wp('100%'), position:'absolute',top:85}}>
        <TouchableOpacity style={{backgroundColor:'rgba(41,45,50,0.76)'}} 
          onPress={()=>{
            setIsShowDatePicker(!isShowDatePicker);
            setIsShowTimeLine(false);
          }}>
          <Text style={{ color:'white', fontSize:16, marginTop:0, textAlign:'center', width:wp('100%'), height:25}}>
          {startDate + " " + f_h.toString().padStart(2, '0') + ":" + f_m.toString().padStart(2, '0') + " " + f_meridian + " ~ "
           + endDate + " " + t_h.toString().padStart(2, '0') + ":" + t_m.toString().padStart(2, '0') + " " + t_meridian}
          </Text>
        </TouchableOpacity>
          
        {/* show daterange picker */}
        {isShowDatePicker && <View>
          <Image style={{alignSelf:'center', width:22,height:13, resizeMode:'contain'}} 
              source={require('../../../assets/arrow_up.png')}></Image>
          <View style={{backgroundColor:'white',width:wp('90%'), alignSelf:'center', backgroundColor:'#DFE0EB', 
            borderRadius:10, marginTop:-5, height:350}}>
            <DateRangePicker
              onSuccess={(s, e) => selectedDateRange(s,e)}
              theme={{ markColor: '#132C14', markTextColor: 'white' }}/>
        
          </View>
          <View style={{flexDirection:'row'}}>
            <View style={{width:120, height:42, backgroundColor:'#7A7D8B', marginTop:-50, marginLeft:30, paddingLeft:10, 
              borderWidth:2, borderColor:'#76A9FF', borderRadius:12}}>
              <Text style={{color:'#76A9FF'}}>From</Text>
              <View style={{flexDirection:'row'}}>
                <TextInput maxLength={2} keyboardType="number-pad" style={{color:'white', width:20, marginTop:-5}} 
                  value={f_h} onChangeText={(val) => setF_H(val)} onBlur={handleBlurF_H} />
                <Text style={{color:'white', marginTop:-2}}>{" : "}</Text>
                <TextInput maxLength={2} keyboardType="number-pad" style={{ marginLeft:3, color:'white', width:22, marginTop:-5}}
                  value={f_m} onChangeText={(val) => setF_M(val)} onBlur={handleBlurF_M} />
                <TouchableOpacity 
                    onPress={ ()=> {
                      setFMeridian(f_meridian === 'AM' ? 'PM' : 'AM')
                    }}>
                  <Text style={{color:'white', marginLeft:3, marginTop:-1}}>{f_meridian}</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                onPress={ () => {
                  setF_H("00"); setF_M("00"); setFMeridian("AM");
                }}>
                <Image style={{position:'absolute',right:5, top:-32, width:20,height:20, resizeMode:'contain'}} source={require('../../../assets/x.png')}></Image>
              </TouchableOpacity>
            </View>
            <View style={{width:120, height:42, backgroundColor:'#7A7D8B', marginTop:-50, marginLeft:10, paddingLeft:10, 
              borderWidth:2, borderColor:'#76A9FF', borderRadius:12}}>
                <Text style={{color:'#76A9FF'}}>To</Text>
                <View style={{flexDirection:'row'}}>
                  <TextInput maxLength={2} keyboardType="number-pad" style={{color:'white', width:20, marginTop:-5}}
                    value={t_h} onChangeText={(val) => setT_H(val)} onBlur={handleBlurT_H} />
                  <Text style={{color:'white'}}>{" : "}</Text>
                  <TextInput maxLength={2} keyboardType="number-pad" style={{marginLeft:3, color:'white', width:20, marginTop:-5}}
                    value={t_m.toString()} onChangeText={(val) => setT_M(val)} onBlur={handleBlurT_M} />
                  <TouchableOpacity 
                    onPress={ ()=> {
                      setTMeridian(t_meridian === 'AM' ? 'PM' : 'AM')
                    }}>
                    <Text style={{color:'white', marginLeft:3, marginTop:-1}}>{t_meridian}</Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  onPress={ () => {
                    setT_H("00"); setT_M("00"); setTMeridian("AM");
                  }}>
                  <Image style={{position:'absolute',right:5, top:-32, width:20,height:20, resizeMode:'contain'}} source={require('../../../assets/x.png')}></Image>
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={{borderRadius:5, alignSelf:'center', alignItems: 'center', 
              justifyContent:'center', backgroundColor:'#18AFF5', width:60, height:30,
              position:'absolute',right:34,bottom:15}} onPress={()=>{handleSubmit()}}>
              <Text style={styles.submit}>{t('Submit')}</Text>
            </TouchableOpacity>
          </View>
        </View>}
      </View>

      {/* show vehicle list */}
      {isShowVehicleList && <View style={styles.vVehicle}>
        <TouchableOpacity onPress={()=>{setIsShowVehicle(!isShowVehicle)}}>
          <View style={{flexDirection:'row',justifyContent:'space-between',borderRadius:10,borderColor:'#EBECF0', borderWidth:1, height:27, backgroundColor:'white'}}>
            <Text style={{fontSize:16,fontWeight:'bold',color:'#364153',marginLeft:40}}>{t('vehicle')}</Text>
            <View style={{marginRight:23,marginTop:2}}>
              <IconComponentProvider IconComponent={MaterialCommunityIcons}>
                <Icon name="chevron-down" size={20} color="rgba(24, 86, 127, 1)" />
              </IconComponentProvider>
            </View>
          </View>
        </TouchableOpacity>
        {isShowVehicle && <View style={{borderRadius:7, backgroundColor:'white', borderWidth:1, borderColor:'#EBECF0'}}>
          <FlatList 
            data={dataVehiclelist}
            renderItem={({ item,index }) => renderVehicleItem(item,index)}
          />
        </View>}
      </View>}       
        
      {/* Timeline show */}
      {isShowTimeLine && <View style={styles.v2}>
        <Image style={{position:'absolute',left:19,top:8,width:20,height:20, resizeMode:'contain'}} source={require('../../../assets/history_blue.png')}></Image>
        <Text style={{position:'absolute',left:45,top:10,fontSize:12,fontWeight:'bold',color:'#1E6B97'}}>{secToHr(curPlayTime)}</Text>
        <Text style={{position:'absolute',left:95,top:10,fontSize:12,fontWeight:'bold',color:'#1E6B97'}}> / {secToHr(totalPlayTime)}</Text>
        <Text style={{position:'absolute',right:15,top:8, width:50, fontSize:13,fontWeight:'bold',color:'#1E6B97'}}>{currentSpeed? currentSpeed : 0}km/h</Text>
        <Image style={{position:'absolute',right:69,top:6,width:20,height:20, resizeMode:'contain'}} source={require('../../../assets/speed_blue.png')}></Image>
        <TouchableOpacity onPress={()=>{handleStartPlay()}}>
          {onVehiclePlay ?
          <View>
          {/* <Image style={{position:'absolute',left:20,top:36,width:20,height:20, resizeMode:'contain'}} source={require('../../../assets/pause.png')}></Image> */}
          <Image style={{position:'absolute',left:20,top:36,width:20,height:20, resizeMode:'contain'}} source={require('../../../assets/stop.png')}></Image>
          </View>
          :
          <Image style={{position:'absolute',left:20,top:36,width:20,height:20, resizeMode:'contain'}} source={require('../../../assets/play.png')}></Image>
          }
        </TouchableOpacity>
        <Text style={{position:'absolute',right:13,top:34,fontSize:13,fontWeight:'bold',color:'#1E6B97'}}>{speedText}</Text>
        <View style={{backgroundColor:'green', borderRadius:10,overflow:'hidden',position:'absolute',left:47,right:60,top:42}}>
          <ProgressBarAndroid styleAttr="Horizontal" indeterminate={false}
            progress={progressBarValue} style={{ color: '#18567F', backgroundColor:'#D9D9D9', height:6 }}
            onLayout={handleLayout}
            ></ProgressBarAndroid>
        </View>
        <TouchableOpacity onPress={()=>{handleSpeedCtrl(true)}}>
          <Image style={{position:'absolute',right:15,top:57,width:16,height:16, resizeMode:'contain'}} source={require('../../../assets/speedup.png')}></Image>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>{handleSpeedCtrl(false)}}>
          <Image style={{position:'absolute',right:55,top:57,width:16,height:16, resizeMode:'contain'}} source={require('../../../assets/speeddown.png')}></Image>
        </TouchableOpacity>
        <View style={{position:'absolute',left:40,top:60,fontSize:13,fontWeight:'bold',color:'#1E6B97'}}>
          <Text style={{fontSize:10,color:'#1E6B97'}}>{currentAddress}</Text>
        </View>
      </View>}
    </View>
  );
}

const styles = StyleSheet.create({
  v1: {
    flex: 1,
    backgroundColor: "white",
  },
  daterange: {
    width: wp('86%'), height: hp('37%'),
  },
  map: {
    width: wp('100%'),
    height: hp('100%'),
    flex: 1
  },
  submit: {
    fontSize:12,color:"#FFFFFF", fontWeight:'500',
    textAlign:'center',
  },
  v2: {
    position: 'absolute',
    bottom: 0, marginBottom:-10,
    width: wp('100%'), height: 95,
    backgroundColor:'white',
    borderRadius:10,
    flexDirection:'column',
  },
  vVehicle: {
    width: 150, height: 150,
    position:'absolute',right:10,top:110
  },
  selectedDateContainerStyle: {
    height: 35,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#132C14",
  },
  selectedDateStyle: {
    fontWeight: "bold",
    color: "#A9D3AB",
  },
});
