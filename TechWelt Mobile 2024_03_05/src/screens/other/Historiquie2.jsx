import React, { useState, useRef, useEffect, useCallback  } from 'react'
import { SafeAreaView, StatusBar, View, TouchableOpacity, Modal,ActivityIndicator,
  Image, Text, StyleSheet, TouchableWithoutFeedback, ProgressBarAndroid,BackHandler,Alert } from 'react-native'
import MapView, { Marker, Polyline } from 'react-native-maps';
import { IconComponentProvider, Icon } from "@react-native-material/core";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import DateRangePicker from "rn-select-date-range";
import LoadingComponent from '../components/Loading';
import { vehicleHistory,action_vehicle_history } from "../actions/vehicles";
import moment from "moment";
import { useDispatch, useSelector } from 'react-redux';
import { toastr } from "../services/navRef";
import {useTranslation} from "react-i18next";
import { useFocusEffect } from '@react-navigation/native';
import MapDirection from './MapDirection';
import MapViewDirections from 'react-native-maps-directions';

function getStyleTime(today) {
  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  return time;
}

let timeIntervalID = undefined;
let datalength = 0;
let posIndex = 0;
let intervalSpeed = 2000;
let dispSpeed = [{val:1,disp:'1sec'},{val:5,disp:'5sec'},{val:60,disp:'1min'},{val:60*5,disp:'5min'},{val:60*10,disp:'10min'}];
//let dispSpeed = [{val:1,disp:'1sec'},{val:3,disp:'5sec'},{val:5,disp:'1min'},{val:8,disp:'5min'},{val:10,disp:'10min'}];
let speedIndex = 0;

function Historiquie2({ navigation, route }) {
  const {t} = useTranslation()
  const { infos } = route.params;
  const vehicle = infos.vehicle;
  const userReducer = useSelector(state => state.auth);
  const vehicleReducer = useSelector(state => state.vehicles)
  let HistoryData = vehicleReducer.vehicleHistory;

  const token = userReducer.token;
  const dispatch = useDispatch();

  const [selectedRange, setRange] = useState({});
  const [showDataRangePicker, setshowDataRangePicker] = useState(false);
  const [markerLat, setMarkerLat] = useState(vehicle.teltonikas.lat);
  const [markerLng, setMarkerLng] = useState(vehicle.teltonikas.lng);
  const [progressBarValue, setProgressBarValue] = useState(0);
  const [onVehiclePlay, setVehiclePlay] = useState(false);
  const [polylineData, setPolyLineData] = useState([]);
  const [currentTime, setCurrentTime] = useState(getStyleTime(new Date()));

  const markerRef = useRef(null);
  const [zoomLevel, setZoomLevel] = useState(15);
  const [speedText,setSpeedText] = useState('1sec');
  const [intervalID,setintervalID] = useState(0);
  const [isShowModal, setIsShowModal] = useState(!vehicleReducer.isVehicleHistory);

  //console.log("@@@@@@@ vehicle history :: " ,HistoryData)


  const [region, setRegion] = useState({
    latitude: markerLat,
    longitude: markerLng,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  });

  // const progressbarRef = useRef(null);

  // useFocusEffect(useCallback(() => {

  //   console.log("@@@@@@@histprogressbar",progressbarRef);
  //   progressbarRef.current ('onclick',(e)=>{
  //     console.log("@@@@@@@@clickprogressbar",e)
  //   })
  //   return () => {     
  //   }
  // },[]))

  useEffect(() => {

    const unsubscribe = navigation.addListener('blur', () => {
      // Perform actions when the screen loses focus
      // Stop any ongoing processes or clear intervals
      console.log("@@@@@@@@@@@@backhandler")
      initVariable();
      setRange({});
    });
    
    return () => {
      
    };

    // const backAction = () => {
    //   Alert.alert('Hold on!', 'Are you sure you want to go back?', [
    //     {
    //       text: 'Cancel',
    //       onPress: () => null,
    //       style: 'cancel',
    //     },
    //     {text: 'YES', onPress: () => BackHandler.exitApp()},
    //   ]);
    //   return true;
    // };

    // const backHandler = BackHandler.addEventListener(
    //   'hardwareBackPress',
    //   backAction,
    // );

    //return () => backHandler.remove();
  }, []);

  const initVariable = () =>{
    
    console.log("Hist initVariable func");
    clearInterval(timeIntervalID);
    setProgressBarValue(0);
    setPolyLineData([]);
    setVehiclePlay(false);
    setSpeedText('1sec');  
    setCurrentTime(getStyleTime(new Date()));
    HistoryData = null;
  }
  

  const handleMapRegionChange = (region) => {
    const LONGITUDE_DELTA_THRESHOLD = 0.01;
    const currentZoomLevel = Math.round(Math.log(360 / region.longitudeDelta) / Math.LN2);
    setZoomLevel(currentZoomLevel);
  };

  const confirmDataRangeSelect = () => {
    if (!selectedRange.firstDate || !selectedRange.secondDate)
      return;
    initVariable();
    //console.log("@@@@@@@@@@ confirmDataRangeSelect",vehicle.teltonikas.deviceImei, selectedRange.firstDate, selectedRange.secondDate)
    console.log("@@@@@@@@@@confirmDataRange vehicleReducer.isVehicleHistory",vehicleReducer.isVehicleHistory)
    dispatch(vehicleHistory(token, vehicle.teltonikas.deviceImei, `${selectedRange.firstDate}T00:00:00`, `${selectedRange.secondDate}T23:59:59`));
    setshowDataRangePicker(false);    
    setIsShowModal(true)
  }

  const handleSpeedPlay = () => {
    if (!onVehiclePlay) return;
    speedIndex++;
    
    if(speedIndex == dispSpeed.length)
      speedIndex = 0;
    clearInterval(timeIntervalID);
    //intervalSpeed = dispSpeed[speedIndex].val;
    
    console.log("@@@@@ handleSpeedPlay :: " ,intervalSpeed)
    
    timeIntervalID = setInterval(moveVehicle, intervalSpeed);

    setSpeedText(dispSpeed[speedIndex].disp)

    //setIntervalSpeed(newInterval);
  }

  const handleStartPlay = () => {
    //console.log("onVehiclePlay::::", onVehiclePlay)
    
    if (onVehiclePlay) {

      setVehiclePlay(false)
      setProgressBarValue(0)
      console.log("timeInterval before CLEAR::::", timeIntervalID)
      clearInterval(timeIntervalID)
    }

    else {
      if (!selectedRange.firstDate || !selectedRange.secondDate)
      {
        toastr(t('please_select_date_range'));
        return;
      }

      //console.log("@@@@@@@@@@History data",vehicleReducer.vehicleHistory)
      HistoryData = vehicleReducer.vehicleHistory;      
      if (!HistoryData || HistoryData.length == 0) {
        toastr(t('HISTORY_DATA_IS_EMPTY'));
        return
      }

      console.log("@@@@@@hist len",HistoryData.length)

      setVehiclePlay(true)
      datalength = HistoryData.length;
      posIndex = 0;
      
      setPolyLineData([])        

      timeIntervalID = setInterval(moveVehicle, intervalSpeed);

      //console.log("timeInterval after SET:::::", timeIntervalID);

    }
  }

  const moveVehicle = () => {
    //console.log("posIndex::::", timeIntervalID)
    if (posIndex >= datalength) {
      //console.log("Play finished and timeInterval is :::::", timeIntervalID);
      //clearInterval(timeInterval)
      clearInterval(timeIntervalID);
      setVehiclePlay(false);
      setProgressBarValue(0);
      return
    }
    setMarkerLat(HistoryData[posIndex].lat)
    setMarkerLng(HistoryData[posIndex].lng)
    setCurrentTime(HistoryData[posIndex].transferDate);
    //console.log("@@@@marker coord",markerLat,markerLng)
    
    let tempArray = [];
    for (let index = 0; index <= posIndex; index++) {
      tempArray.push({ latitude: HistoryData[index].lat, longitude: HistoryData[index].lng })
    }
    setPolyLineData(tempArray)

    // let tempIndex = posIndex + dispSpeed[speedIndex].val

    // if(tempIndex >= datalength)
    //   tempIndex = datalength-1

    // tempArray = {latitude: HistoryData[tempIndex].lat, longitude: HistoryData[tempIndex].lng }
    // console.log("@@@@@@Hist",polylineData)
    // if(polylineData.length > 0)
    // {
    //   tempArray = [...polylineData,tempArray]
    //   setPolyLineData([tempArray]);
    //   console.log("@@@@@@@@@@@@@len is not 0 ")
    // } else{
    //   setPolyLineData([tempArray]);
    //   console.log("@@@@@@@@@@@@@len 0 ")
    // }


    //if (Math.abs(region.latitude - HistoryData[posIndex].lat) > 0.0001 || Math.abs(region.longitude - HistoryData[posIndex].lng) > 0.0002)
    //if(posIndex > 1)
      setRegion({
        latitude: HistoryData[posIndex].lat,
        longitude: HistoryData[posIndex].lng,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      })

    //console.log("@@@@@@@@@@@ percent",(posIndex + 1) / datalength)
    setProgressBarValue((posIndex + 1) / datalength)
    //posIndex++;
    posIndex = posIndex + dispSpeed[speedIndex].val;
    console.log("@@@@@@posindexval",posIndex)
  }

  const renderMapDirection = (polylineData) =>{
    //console.log("@@@@@@@@render,poly",polylineData)
    return polylineData.map((item,index)=>{

      // if(index > 0)
      //   console.log("@@@@@rendermapdirection",polylineData[index-1],polylineData[index])
      if(index > 0 && polylineData[index-1].latitude != polylineData[index].latitude){
      //  <Polyline
      //     coordinates={[polylineData[index-1],polylineData[index]]}
      //     strokeColor="#18567F"
      //     strokeWidth={4}
      //     fillColor="#18567F"
      //   /> 
        // {console.log("inrendermap",item,index)}

        <MapDirection coordinate1={polylineData[index-1]} coordinate2={polylineData[index]} /> 
        // <MapViewDirections
        //     origin={{
        //       latitude: polylineData[index-1].latitude, // Replace with your start latitude
        //       longitude: polylineData[index-1].longitude, // Replace with your start longitude
        //     }}
        //     destination={{
        //       latitude: polylineData[index].latitude, // Replace with your end latitude
        //       longitude: polylineData[index].longitude, // Replace with your end longitude
        //     }}
        //     //waypoints={roadPointList.slice(1, roadPointList.length - 1)}          
        //     apikey={global.GOOGLE_MAPS_API_KEY} // Replace with your Google Maps API key
        //     strokeWidth={4}
        //     strokeColor="#18567F"
        //     fillColor="#18567F"
        //   />
      }
    })
  }

  const [progressBarWidth, setProgressBarWidth] = useState(0);
  const handleLayout = (event) => {
    const { width } = event.nativeEvent.layout;
    setProgressBarWidth(width);
    console.log("@@@@progressbar len",width)
  };
  const handleProgressBarClick = (e) => {
    if(onVehiclePlay){

      const newProgress = e.nativeEvent.locationX / progressBarWidth
      console.log("(@@@@",newProgress)
      posIndex = Math.floor(HistoryData.length * newProgress);
    }
  };

  //console.log("@@@@@@@,region",region)

  return (
    <SafeAreaView>
      <Modal visible={vehicleReducer.isVehicleHistory} transparent={true}
          onRequestClose={() => {
            dispatch(action_vehicle_history(false));
            setIsShowModal(vehicleReducer.isVehicleHistory);
          }}
      >
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.1)' }}>
              <ActivityIndicator size="large" color="rgba(54, 52, 53, 1)" />
          </View>
      </Modal>
      {showDataRangePicker ? (
        <View style={styles.container}>
          <DateRangePicker
            onSelectDateRange={(range) => {
              console.log("select datereanger",range)
              setRange(range);
            }}
            blockSingleDateSelection={false}
            responseFormat="YYYY-MM-DD"
            maxDate={moment()}
            minDate={moment().subtract(100, "days")}
            selectedDateContainerStyle={styles.selectedDateContainerStyle}
            selectedDateStyle={styles.selectedDateStyle}
            clearBtnTitle=""
            confirmBtnTitle=''
          />
          <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', padding: 8, borderRadius: 4, margin: 8, borderColor: '#EEEEEE', borderWidth: 1 }}>
            <Text>{t('FROM')}: {selectedRange.firstDate}</Text>
            <Text>{t('TO')}: {selectedRange.secondDate}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
            <TouchableOpacity style={styles.confirmButton} onPress={confirmDataRangeSelect}>
              <Text style={{ color: 'white', fontSize: 14 }}>{t('confirm')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmButton} onPress={() => setshowDataRangePicker(false)}>
              <Text style={{ color: 'white', fontSize: 14 }}>{t('cancel')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : null}
      <StatusBar backgroundColor={'#18567F'} barStyle={'light'} />
      <MapView
        initialRegion={region}
        region={region}
        onRegionChangeComplete={handleMapRegionChange}

        style={{ width: wp('97%'), height: hp('90%'), borderRadius: 10, alignSelf: 'center', margin: 5 }}>
        <Marker
          key={vehicle._id}
          ref={markerRef}
          coordinate={{ latitude: markerLat, longitude: markerLng }}
          onPress={(event) => {
          }}
        >
          <View style={{ alignItems: 'center', borderWidth: 0.8, borderColor: 'red', width: 34, height: 18, alignSelf: 'center' }}>
            <Image style={{ width: 32, height: 16 }} source={require('../../assets/bigcar.png')} />
          </View>
        </Marker>
        {/* <Polyline
          coordinates={polylineData}
          strokeColor="#18567F"
          strokeWidth={4}
          fillColor="#18567F"
        /> */}
        {/* <MapDirection coordinate1={region} coordinate2={region} /> */}
        {/* {renderMapDirection(polylineData)} */}
        
        {/* { polylineData.length > 1 && <MapDirection coordinate1={polylineData[polylineData.length-2]} coordinate2 ={polylineData.length - 1} index={polylineData.length - 1}></MapDirection>} */}
        
        {polylineData.length > 1 && polylineData.map((item,index) =>{
          //console.log("@@@@@",polylineData[index-1])
          return (
            polylineData[index-1] && <MapDirection key={index} coordinate1={polylineData[index-1]} coordinate2 ={item} index={index}/>
            
            
            // polylineData[index-1] && <MapViewDirections
            //   key={index}
            //   origin={{
            //     latitude:polylineData[index-1].latitude , // Replace with your start latitude
            //     longitude: polylineData[index-1].longitude, // Replace with your start longitude
            //   }}
            //   destination={{
            //     latitude: item.latitude, // Replace with your end latitude
            //     longitude: item.longitude, // Replace with your end longitude
            //   }}
            //   //waypoints={roadPointList.slice(1, roadPointList.length - 1)}          
            //   apikey={global.GOOGLE_MAPS_API_KEY} // Replace with your Google Maps API key
            //   strokeWidth={4}
            //   strokeColor="#ff0000"
            //   fillColor="#18567F"
            // /> 
          )
        })}
         
      </MapView>

      {/* <View style={styles.view6}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', margin: 7 }}>
          <Text style={{ fontSize: 12, fontWeight: '500', textDecorationLine: 'underline' }}>
            arrêt
          </Text>
          <View style={{ flexDirection: 'row' }}>
            <Text style={{ fontSize: 10, fontWeight: '400' }}>
              2023-03-03
            </Text>
            <Text style={{ fontSize: 10, fontWeight: '400', color: '#18567F' }}>
              | 02:13:15
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', margin: 7 }}>
          <Text style={{ fontSize: 12, fontWeight: '500', textDecorationLine: 'underline' }}>
            démarrer
          </Text>
          <View style={{ flexDirection: 'row' }}>
            <Text style={{ fontSize: 10, fontWeight: '400' }}>
              2023-03-03
            </Text>
            <Text style={{ fontSize: 10, fontWeight: '400', color: '#18567F' }}>
              | 02:13:15
            </Text>
          </View>

        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', margin: 9 }}>
          <Text style={{ fontSize: 9, fontWeight: '500', color: '#18567F' }}>
            Show complete address
          </Text>
          <IconComponentProvider IconComponent={MaterialCommunityIcons}>
            <Icon name="arrow-right" size={10} color="#18567F" style={{ alignSelf: 'center', paddingTop: 3 }} />
          </IconComponentProvider>
        </View>
      </View> */}

      <View style={styles.view2}>
        <View style={{ flexDirection: 'row', marginTop: 20, justifyContent: 'space-evenly', alignItems: 'center' }}>
          <TouchableOpacity
            onPress={() => handleStartPlay()}
          >
            <IconComponentProvider IconComponent={MaterialCommunityIcons}>
              <Icon name={`${onVehiclePlay ? "stop-circle-outline" : "play-circle-outline"}`} size={20} color="#18567F" style={{}} />
            </IconComponentProvider>
          </TouchableOpacity>
          <TouchableWithoutFeedback onPress={handleProgressBarClick}>
            <ProgressBarAndroid
              //ref={progressbarRef}
              styleAttr="Horizontal"
              indeterminate={false}
              progress={progressBarValue}
              onLayout={handleLayout}
              style={{ color: '#18567F', width: wp('70%') }} />
          </TouchableWithoutFeedback>
          <View style={{flexDirection:'column'}}>
            <TouchableOpacity
              onPress={() =>handleSpeedPlay()} 
            >
              <IconComponentProvider IconComponent={MaterialCommunityIcons} >
                <Icon name="fast-forward" size={20} color="#000000" />
              </IconComponentProvider>
              <Text>{speedText}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => setshowDataRangePicker(true)}
        >
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', width: wp('70%'), alignSelf: 'center' }}>
            <Text style={{ fontSize: 11, fontWeight: '500', alignSelf: 'center' }}>{t('select_date')} </Text>
            <Text style={{ fontSize: 11, fontWeight: '400', alignSelf: 'center' }}>{selectedRange.firstDate ? selectedRange.firstDate : '0000-00-00'}</Text>
            {/* <Text style={{ fontSize: 11, fontWeight: '400', alignSelf: 'center' }}>00:00:00 </Text> */}
            <Text style={{ fontSize: 11, fontWeight: '400', alignSelf: 'center' }}> - </Text>
            <Text style={{ fontSize: 11, fontWeight: '400', alignSelf: 'center' }}> {selectedRange.secondDate ? selectedRange.secondDate : '0000-00-00'}</Text>
            {/* <Text style={{ fontSize: 11, fontWeight: '400', alignSelf: 'center' }}>00:00:00</Text> */}
          </View>
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', marginVertical: hp('2%') }}>
          <IconComponentProvider IconComponent={MaterialCommunityIcons}>
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-evenly', alignSelf: 'center', width: wp('75%') }}>
              <View style={{ flexDirection: 'row' }}>
                <Image source={require('../../assets/clock.png')} style={{ width: 15, height: 15 }} />
                <Text style={{ fontSize: 11, fontWeight: '600', marginLeft: 5 }}>{currentTime}</Text>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <Image source={require('../../assets/meter1.png')} style={{ width: 15, height: 15 }} />
                <Text style={{ fontSize: 11, fontWeight: '600', marginLeft: 5 }}>0Km/h</Text>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <Image source={require('../../assets/meter1.png')} style={{ width: 15, height: 15 }} />
                <Text style={{ fontSize: 11, fontWeight: '600', marginLeft: 5 }}>167.08Km</Text>
              </View>
            </View>
          </IconComponentProvider>
        </View>
        {/* <Text style={{ fontSize: 9, fontWeight: '400', marginTop: hp('0.5%'), marginLeft: wp('18%'), marginBottom: hp('2.5%') }}>{currentDate}</Text> */}
      </View>
      {/* </TouchableOpacity> */}
    </SafeAreaView >
  )
}

export default Historiquie2;

const styles = StyleSheet.create({
  v1: {
    flex: 1,
    backgroundColor: 'white'
  },
  t1: {
    fontSize: 14,
    fontWeight: '400',
    color: '#FFFF',
    alignSelf: 'center',
    textAlign: 'center',
    marginTop: hp('5%')
  },
  to1: {
    position: 'absolute',
    width: 30,
    height: 30,
    left: 30,
    top: hp('4%'),
    borderRadius: 40,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFF',
    borderColor: '#FFFF'
  },
  view1: {
    width: 38, height: 38, borderRadius: 30,
    backgroundColor: '#18567F', justifyContent: 'center', alignItems: 'center', position: 'absolute',
  },
  view2: {
    position: 'absolute',
    width: wp('94%'),
    alignSelf: 'center',
    // height: 160,
    backgroundColor: 'white',
    borderRadius: 10,

    bottom: hp('8%')
  },
  view3: { flexDirection: 'row', marginHorizontal: 40, marginTop: 20 },
  view4: {
    position: 'absolute',
    width: 342,
    height: 55,
    backgroundColor: '#FFFF',
    borderRadius: 10,
    top: 80,
    left: 10,
    flexDirection: 'row'
  },
  view5: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 25,
    height: 25,
    borderWidth: 0.7,
    borderRadius: 20
  },
  view6: {
    position: 'absolute',
    backgroundColor: '#ffff',
    width: wp('60%'),
    borderRadius: 10,
    left: wp('4%'),
    top: hp('27%'),
    paddingBottom: 5,
    paddingTop: 8,
    zIndex: 99,
    paddingRight: 10
  },

  container: {
    zIndex: 999,
    backgroundColor: 'white',
    position: 'absolute',
    width: wp('80%'),
    borderRadius: 20,
    padding: 10,
    alignSelf: 'center',
    marginTop: hp('10%')
  },
  selectedDateContainerStyle: {
    height: 35,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#18567F",
    borderRadius: 70

  },
  selectedDateStyle: {
    fontWeight: "bold",
    color: "white",
  },
  confirmButton: {
    backgroundColor: "#18567F",
    width: '48%',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center'
  }
});