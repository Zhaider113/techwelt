import React, { useState , useRef, useEffect } from 'react'
import {Text, TextInput, StyleSheet, View, TouchableOpacity, BackHandler, ImageBackground,Switch,
  FlatList, StatusBar, Alert, Image
} from 'react-native';
import { ScrollView } from 'react-native-virtualized-view';
import { IconComponentProvider, Icon } from "@react-native-material/core";
import { useFocusEffect } from '@react-navigation/native';
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useSelector, useDispatch } from 'react-redux';
import {useTranslation} from "react-i18next";
import { vehicleList, deleteVehicle } from '../../actions/vehicles';
import moment from 'moment';
import Header from "../Header";
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { logout } from '../../actions/auth';
import {sendGprsIgnition, sendCommand} from '../../actions/vehicles';
import ModalDropdown from 'react-native-modal-dropdown';
import { toastr } from "../../services/navRef";
import Geocoder from 'react-native-geocoding';
import axios from 'axios';

Geocoder.init("AIzaSyBCCB4SR4Quw831qlj_IQapiKPnjyEW2Bg");

export default function List({ navigation }) {
  const { t } = useTranslation();
  const dispatch = useDispatch()
  const userReducer = useSelector(state => state.auth);
  const vehicleReducer = useSelector(state => {
    return state.vehicles
  });
  const [isIgnition, setIsIgnition] = useState(true);
  const toggleSwitch = () => {
    setIsIgnition(previousState => !previousState);
  }

  const [selTotal, setSelTotal] = useState(true);
  const [selOnline, setSelOnline] = useState(false);
  const [selOffline, setSelOffline] = useState(false);
 
  const [isTimerId, setIsTimerId] = useState(null)
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchText, setSearchText] = React.useState("");
  const changeText = (newText) => {
    setSearchText(newText);
  };

  const timerIdRef = useRef(null);

  const startTimer = () => {
    const timerId = setInterval(() => {
      dispatch(vehicleList(userReducer.token, userReducer.user._id));
      console.log(">>>>>>>>>List Timer", timerId);
    }, 5000);
    timerIdRef.current = timerId;
    setIsTimerId(timerId);
  }

  useEffect(() => {
  }, []);

  useFocusEffect(React.useCallback(() => {
    console.log(">>>>>>List Focus", isTimerId)
    // if(!isShowDropdown) {
      startTimer();
    // }

    const onBackPress = () => {
      Alert.alert(
        t('warning'),
        t('are_you_going_to_logout'),
        [
          {
            text: t('yes'),
            onPress: () => dispatch(logout(navigation)) ,
          },
          {
            text: t('no'),
            onPress: () => console.log("cancel"),
          },
        ],
      );
      return true;
    };

    BackHandler.addEventListener(
      'hardwareBackPress', onBackPress
    );

    return () => {
      console.log(">>>>>>>>>List End", timerIdRef.current)
      clearInterval(timerIdRef.current);
      BackHandler.removeEventListener(
        'hardwareBackPress', onBackPress
      );}

  }, []));

  const handleDeleteVehicle = (imei) => {
    dispatch(deleteVehicle(userReducer.token, userReducer.user._id, imei, navigation));
  };


  const handleTotal = () =>{
    setSelTotal(true);
    setSelOnline(false);
    setSelOffline(false);
  }

  const handleOnline = () =>{
    setSelTotal(false);
    setSelOnline(true);
    setSelOffline(false);
  }

  const handleOffline = () =>{
    setSelTotal(false);
    setSelOnline(false);
    setSelOffline(true);
  }

  function filterData(data) {
    //return data;
    let tmpData = data.filter(
      function (item) {
        if (item.vehicle.vehicleName.toLowerCase().includes(searchText.toLowerCase())) {
          return item;
        }
        if (item.vehicle.deviceImei.toLowerCase().includes(searchText.toLowerCase())) {
          return item;
        }
      }
    );

    tmpData.sort((a, b) => {
      const nameA = a.vehicle.vehicleName.toUpperCase(); // ignore upper and lowercase
      const nameB = b.vehicle.vehicleName.toUpperCase(); // ignore upper and lowercase
    
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0; // names must be equal
    });
  
    return tmpData;
  }

  const handleDropdownShow = React.useCallback(() => {
    // setTimeout(() => {
    //   setShowDropdown(true);
    // }, 5000);
    console.log(">>>>>>>>>>>>>1111",timerIdRef.current);
    clearInterval(timerIdRef.current);
  }, []);
  
  const handleDropdownHide = React.useCallback(() => {
    // setShowDropdown(false);
    startTimer();
  }, []);
  
  const handleImagePress = () => {
    setTimeout(() => {
      setShowDropdown(true);
    }, 2000);
  };

  const VehicleItem = (item,index, length) => {
    console.log(">>>>>", item.vehicle.lat, item.vehicle.lng, item.vehicle.vehicleName, item.vehicle.address, item.vehicle.stopTime)

    let prevTrans = item.vehicle.teltonikas[item.vehicle.teltonikas.length - 1]?.transferDate;
    let onlineStatus = false;
    let diffMin = 0;
    let curBattery = null;
    if(item.vehicle?.deviceType === "Ruptela") {
      curBattery = item.vehicle?.teltonikas[item.vehicle?.teltonikas?.length - 1]?.IOvalue.find(item => item.dataId === 30)?.dataValue * 100 / 4.2;
    } else if(item.vehicle?.deviceType === "Teltonika") {
      curBattery = item.vehicle?.teltonikas[item.vehicle?.teltonikas?.length - 1]?.IOvalue.find(item => item.dataId === 113)?.dataValue;
    }
    if(prevTrans !== undefined) {
      prevTrans = prevTrans?.substring(0, 10) + " " + prevTrans?.substring(11, 19)
      const curDate = moment().utcOffset(240).format('YYYY-MM-DD HH:mm:ss');
      const prevDate = moment(prevTrans);
      const timeDiff = prevDate.diff(curDate, 'minutes');
      diffMin = timeDiff;
      if(diffMin >= 0 && diffMin < 5){
        onlineStatus = true;
      }
    }

    let transDate = "";
    if(item.vehicle.teltonikas[item.vehicle.teltonikas.length - 1]?.transferDate.length>15) {
      let transTime = item.vehicle.teltonikas[item.vehicle.teltonikas.length - 1]?.transferDate.substring(11,13) +
       + ":" + item.vehicle.teltonikas[item.vehicle.teltonikas.length - 1]?.transferDate.substring(14,16);
      let formattedTime = moment(transTime, "HH:mm").format("hh:mm A");
      transDate = formattedTime +  "   " + item.vehicle.teltonikas[item.vehicle.teltonikas.length - 1]?.transferDate.substring(8,10) + 
        "-" + item.vehicle.teltonikas[item.vehicle.teltonikas.length - 1]?.transferDate.substring(5,7) +
        "-" + item.vehicle.teltonikas[item.vehicle.teltonikas.length - 1]?.transferDate.substring(0,4)
    }

    // console.log(">>>", length, index)

    if (length === 1 || index === length - 1) {
      return (
        <TouchableOpacity
          onPress={ () => {
            if(item.vehicle.lat.length !== 0) {
              navigation.navigate('Locations', { "infos": item});
            }
        }}>
          <View style={{flexDirection:'row', alignSelf:'center', width:wp('100%'), height:190, marginBottom:5}}>
            <Image 
              source={require("../../../assets/list_bg.png")} 
              style={{position:'absolute', width: '100%',  height: 189, resizeMode: 'stretch'}}/> 
            <View style={{flexDirection:'column', width:wp('97%'), paddingLeft:15, paddingRight:3, marginTop:20, height:190}}>
              <View style={{ flexDirection: 'row', justifyContent: "space-between", height:30}}>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                  <Text numberOfLines={1} style={{width:wp('35%'), fontSize: 20, fontWeight: '600', color: '#1E6B97' }}>{item.vehicle.vehicleName}</Text>
                  { item.vehicle.title === "Car" ?
                  <Image 
                    source={require("../../../assets/type_car.png")} 
                    style={{alignSelf:'center', width: 33, height: 13, resizeMode: 'contain' }}/> 
                  :
                  <Image 
                    source={require("../../../assets/type_truck.png")} 
                    style={{alignSelf:'center', width: 23, height: 13, resizeMode: 'contain' }}/> 
                  }
                  <View style={{flexDirection: 'row', flex:1, alignItems:'flex-end', justifyContent:'flex-end'}}>
                    <Text style={{ fontSize: 10, color: '#1E6B97', fontWeight:'500', marginRight:5, alignSelf:'center' }}>
                      {transDate}
                    </Text>
                    { onlineStatus ?
                    <Image 
                      source={require("../../../assets/link_green.png")} 
                      style={{alignSelf:'center', width: 20.75, height: 20, resizeMode: 'contain' }}/> 
                    :
                    <Image 
                      source={require("../../../assets/link_red.png")} 
                      style={{alignSelf:'center', width: 20.75, height: 20, resizeMode: 'contain' }}/> 
                    }
                  </View>
                </View>
              </View>

              <View style={{flexDirection: 'row'}}>
                <Text style={{ fontSize: 10, color: '#1E6B97', fontWeight:'500' }}>IMEI : </Text>
                <Text style={{ fontSize: 10, color: '#1E6B97', fontWeight:'500' }}>{item.vehicle.deviceImei} </Text>
              </View>

              <View style={{ height:70,flexDirection: 'row', marginTop:7}}>
                <View style={{ width:(wp('100%') - 50) * 0.8, alignSelf:'center', flexDirection: 'column', alignItems: 'center'}}>
                  <View style={{ flex: 1, flexDirection: 'row', justifyContent: "space-between"}}>
                    <View style={{ flex:1, flexDirection: 'column', justifyContent:'center', alignItems:'center'}}>
                      { onlineStatus ?
                      <Image 
                        source={require("../../../assets/speed_green.png")} 
                        style={{alignSelf:'center', width: 20, height: 15, resizeMode: 'contain' }}/> 
                      :
                      <Image 
                        source={require("../../../assets/speed_red.png")} 
                        style={{alignSelf:'center', width: 20, height: 15, resizeMode: 'contain' }}/> 
                      }
                      <Text style={{ fontSize: 8, marginTop:3, color: '#1E6B97', fontWeight:'bold' }}>
                        {
                          (item.vehicle.teltonikas[item.vehicle.teltonikas.length - 1]?.speed  >= 0)
                          && (item.vehicle.teltonikas[item.vehicle.teltonikas.length - 1]?.speed  < 500) ?
                          item.vehicle.teltonikas[item.vehicle.teltonikas.length - 1].speed : 0
                        }km/h
                      </Text>
                    </View>
                    <View style={{ flex:1, flexDirection: 'column', justifyContent:'center', alignItems:'center'}}>
                      <View>
                        {curBattery > 0 ?
                        <View style={{position:'absolute', top:1.8, left:3.3, width: curBattery / 100* 20, height:8, backgroundColor:'#28A745'}}></View>
                        :
                        <View style={{position:'absolute', top:1.8, left:3.3, width:20, height:8, backgroundColor:'none'}}></View>
                        }
                        <Image 
                          source={require("../../../assets/battery_bg.png")} 
                          style={{alignSelf:'center', width: 30, height: 13, resizeMode: 'contain' }}/> 
                      </View>
                      <Text style={{ fontSize: 8, color: '#1E6B97', marginTop:4, fontWeight:'600' }}>
                        { Math.round(curBattery) ? Math.round(curBattery) : 0}%
                      </Text>
                    </View>
                    <View style={{ flex:1, flexDirection: 'column', justifyContent:'center', alignItems:'center'}}>
                      <Image 
                        source={require("../../../assets/temperature.png")} 
                        style={{alignSelf:'center', width: 20, height: 12, resizeMode: 'contain' }}/> 
                      <Text style={{ fontSize: 8, color: '#1E6B97', marginTop:5, fontWeight:'600' }}>{item.vehicle.temperature}°C </Text>
                    </View>
                    { item?.vehicle?.engineStatus === "On" ? 
                    <View style={{ flex:1, flexDirection: 'column', justifyContent:'center', alignItems:'center'}}>
                      <Image 
                        source={require("../../../assets/engine_green.png")} 
                        style={{alignSelf:'center', width: 20, height: 14, resizeMode: 'contain' }}/> 
                      <Text style={{ fontSize: 8, color: '#1E6B97', marginTop:2, fontWeight:'bold' }}>ON </Text>
                    </View>
                    :
                    <View style={{ flex:1, flexDirection: 'column', justifyContent:'center', alignItems:'center'}}>
                      <Image 
                        source={require("../../../assets/engine_red.png")} 
                        style={{alignSelf:'center', width: 20, height: 14, resizeMode: 'contain' }}/> 
                      <Text style={{ fontSize: 8, color: '#1E6B97', marginTop:2, fontWeight:'bold' }}>OFF </Text>
                    </View>
                    }
                  </View>
    
                  <View style={{flex:1, flexDirection: 'row', alignItems: 'center', marginLeft:5}}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                      <View style={{ width:60, flexDirection: 'column', justifyContent:'center', alignItems:'center'}}>
                        <Image 
                          source={require("../../../assets/video_enable.png")} 
                          style={{alignSelf:'center', width: 35, height: 15, resizeMode: 'contain' }}/> 
                        <Text style={{ fontSize: 8, color: '#1E6B97', fontWeight:'600', marginTop:3 }}>Video</Text>
                      </View>
                      <View style={{ width:60, flexDirection: 'column', justifyContent:'center', alignItems:'center', marginLeft:5}}>
                      <Image 
                        source={require("../../../assets/camera_enable.png")} 
                        style={{alignSelf:'center', width: 22, height: 15, resizeMode: 'contain' }}/> 
                        <Text style={{ fontSize: 8, color: '#1E6B97', fontWeight:'600', marginTop:3 }}>Snapshot </Text>
                      </View>
                    </View>
                  </View>
                </View>
                <View style={{ width:(wp('100%') - 30) * 0.2, flexDirection: 'column'}}>
                { item.vehicle.title === "Car" ?
                <View style={{ flexDirection: 'column',  alignItems:'center'}}>
                  <Image 
                    source={require("../../../assets/tank_red.png")} 
                    style={{alignSelf:'center', width: 16, height: 14, resizeMode: 'contain' }}/> 
                  <Text style={{ fontSize: 8, color: '#1E6B97', marginTop:3, fontWeight:'bold' }}>
                    {
                      item.vehicle.teltonikas[item.vehicle.teltonikas.length - 1]?.fuel ?
                      item.vehicle.teltonikas[item.vehicle.teltonikas.length - 1].fuel : 0
                    }L
                  </Text>
                </View>
                :
                <View style={{ flexDirection: 'column',  alignItems:'center'}}>
                  <View style={{ flexDirection: 'row',  alignItems:'center'}}>
                    <Text style={{marginLeft:5, marginRight:2, fontSize: 8, color: '#1E6B97', fontWeight:'bold' }}>Tank-1</Text>
                    <Image 
                      source={require("../../../assets/tank_red.png")} 
                      style={{alignSelf:'center', width: 16, height: 14, resizeMode: 'contain' }}/> 
                    <Text style={{marginLeft:2, fontSize: 8, color: '#1E6B97', fontWeight:'bold' }}>
                    {
                      item.vehicle.teltonikas[item.vehicle.teltonikas.length - 1]?.fuel ?
                      item.vehicle.teltonikas[item.vehicle.teltonikas.length - 1].fuel : 0
                    }L
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row',  alignItems:'center', marginTop:2}}>
                    <Text style={{marginLeft:5, marginRight:2, fontSize: 8, color: '#1E6B97', fontWeight:'bold' }}>Tank-2</Text>
                    <Image 
                      source={require("../../../assets/tank_yellow.png")} 
                      style={{alignSelf:'center', width: 16, height: 14, resizeMode: 'contain' }}/> 
                    <Text style={{marginLeft:2, fontSize: 8, color: '#1E6B97', fontWeight:'bold' }}>
                    {
                      item.vehicle.teltonikas[item.vehicle.teltonikas.length - 1]?.fuel ?
                      item.vehicle.teltonikas[item.vehicle.teltonikas.length - 1].fuel : 0
                    }L
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row',  alignItems:'center', marginTop:2}}>
                    <Text style={{marginLeft:5, marginRight:2, fontSize: 8, color: '#1E6B97', fontWeight:'bold' }}>Tank-3</Text>
                    <Image 
                      source={require("../../../assets/tank_green.png")} 
                      style={{alignSelf:'center', width: 16, height: 14, resizeMode: 'contain' }}/> 
                    <Text style={{marginLeft:2, fontSize: 8, color: '#1E6B97', fontWeight:'bold' }}>
                    {
                      item.vehicle.teltonikas[item.vehicle.teltonikas.length - 1]?.fuel ?
                      item.vehicle.teltonikas[item.vehicle.teltonikas.length - 1].fuel : 0
                    }L
                    </Text>
                  </View>
                </View>
                }
                </View>
                <View style={{flex:1, flexDirection: 'column', justifyContent:'flex-end',
                  position:'absolute', right:0, top:45}}>
                  <ModalDropdown data={item} 
                    onDropdownWillHide={handleDropdownHide}
                    onDropdownWillShow={handleDropdownShow}
                    options={dropdownOptions}
                    dropdownStyle={{ height:161, borderRadius:10, elevation:10, shadowColor:'black', top: 10, right:45 }} // Change the position of the modal here
                    renderRow={() => renderDropdownRow(item)}>
                    <View style={{width:40, height:40}}>
                      <Image
                      source={require("../../../assets/menu_ico.png")} 
                      style={{alignSelf:'center', width: 25, height: 25, marginRight:-10, marginTop:10, resizeMode: 'contain' }}/> 
                    </View>
                  </ModalDropdown>
                </View>
              </View>
              <View style={{ flexDirection: 'row'}}>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                  <IconComponentProvider IconComponent={MaterialCommunityIcons}>
                    <Icon name="map-marker" size={13} color="#D01400" style={{alignSelf:'center'}} />
                  </IconComponentProvider>
                  <Text numberOfLines={1} style={{ fontSize: 10, fontWeight:'500', color: '#1E6B97', marginLeft:5, width:wp('100%') - 80 }}>
                    {item.vehicle.address}
                    {/* {item.vehicle.teltonikas[item.vehicle.teltonikas.length - 1]?.address} */}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      )
    } 
    else {
      return (
        <TouchableOpacity
          onPress={ () => {
            if(item.vehicle.lat.length !== 0) {
              navigation.navigate('Locations', { "infos": item});
            }
        }}>
          <View style={{flexDirection:'row', alignSelf:'center', width:wp('100%'), marginBottom:5}}>
            <Image 
              source={require("../../../assets/list_bg.png")} 
              style={{position:'absolute', width: '100%',  height: 189, resizeMode: 'stretch'}}/> 
            <View style={{flexDirection:'column', width:wp('97%'), paddingLeft:15, paddingRight:3, marginTop:20, alignSelf:'center'}}>
              <View style={{ flexDirection: 'row', justifyContent: "space-between"}}>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                  <Text numberOfLines={1} style={{width:wp('35%'), fontSize: 20, fontWeight: '600', color: '#1E6B97' }}>{item.vehicle.vehicleName}</Text>
                  { item.vehicle.title === "Car" ?
                  <Image 
                    source={require("../../../assets/type_car.png")} 
                    style={{alignSelf:'center', width: 33, height: 13, resizeMode: 'contain' }}/> 
                  :
                  <Image 
                    source={require("../../../assets/type_truck.png")} 
                    style={{alignSelf:'center', width: 23, height: 13, resizeMode: 'contain' }}/> 
                  }
                  <View style={{flexDirection: 'row', flex:1, alignItems:'flex-end', justifyContent:'flex-end'}}>
                    <Text style={{ fontSize: 10, color: '#1E6B97', fontWeight:'500', marginRight:5, alignSelf:'center' }}>
                      {transDate}
                    </Text>
                    { onlineStatus ?
                    <Image 
                      source={require("../../../assets/link_green.png")} 
                      style={{alignSelf:'center', width: 20.75, height: 20, resizeMode: 'contain' }}/> 
                    :
                    <Image 
                      source={require("../../../assets/link_red.png")} 
                      style={{alignSelf:'center', width: 20.75, height: 20, resizeMode: 'contain' }}/> 
                    }
                  </View>
                </View>
              </View>

              <View style={{flexDirection: 'row'}}>
                <Text style={{ fontSize: 10, color: '#1E6B97', fontWeight:'500' }}>IMEI : </Text>
                <Text style={{ fontSize: 10, color: '#1E6B97', fontWeight:'500' }}>{item.vehicle.deviceImei} </Text>
              </View>

              <View style={{ flexDirection: 'row', marginTop:10}}>
                <View style={{ width:(wp('100%') - 50) * 0.8, alignSelf:'center', flexDirection: 'column', alignItems: 'center'}}>
                  <View style={{ flex: 1, flexDirection: 'row', justifyContent: "space-between"}}>
                    <View style={{ flex:1, flexDirection: 'column', justifyContent:'center', alignItems:'center'}}>
                      { onlineStatus ?
                      <Image 
                        source={require("../../../assets/speed_green.png")} 
                        style={{alignSelf:'center', width: 20, height: 15, resizeMode: 'contain' }}/> 
                      :
                      <Image 
                        source={require("../../../assets/speed_red.png")} 
                        style={{alignSelf:'center', width: 20, height: 15, resizeMode: 'contain' }}/> 
                      }
                      <Text style={{ fontSize: 8, marginTop:3, color: '#1E6B97', fontWeight:'bold' }}>
                        {
                          (item.vehicle.teltonikas[item.vehicle.teltonikas.length - 1]?.speed  >= 0)
                          && (item.vehicle.teltonikas[item.vehicle.teltonikas.length - 1]?.speed  < 500) ?
                          item.vehicle.teltonikas[item.vehicle.teltonikas.length - 1].speed : 0
                        }km/h
                      </Text>
                    </View>
                    <View style={{ flex:1, flexDirection: 'column', justifyContent:'center', alignItems:'center'}}>
                      <View>
                        {curBattery > 0 ?
                        <View style={{position:'absolute', top:2, left:3, width: curBattery / 100* 20, height:8, backgroundColor:'#28A745'}}></View>
                        :
                        <View style={{position:'absolute', top:2, left:3, width:20, height:8, backgroundColor:'none'}}></View>
                        }
                        <Image 
                          source={require("../../../assets/battery_bg.png")} 
                          style={{alignSelf:'center', width: 30, height: 13, resizeMode: 'contain' }}/> 
                      </View>
                      <Text style={{ fontSize: 8, color: '#1E6B97', marginTop:4, fontWeight:'600' }}>
                        { Math.round(curBattery) ? Math.round(curBattery) : 0}%
                      </Text>
                    </View>
                    <View style={{ flex:1, flexDirection: 'column', justifyContent:'center', alignItems:'center'}}>
                      <Image 
                        source={require("../../../assets/temperature.png")} 
                        style={{alignSelf:'center', width: 20, height: 12, resizeMode: 'contain' }}/> 
                      <Text style={{ fontSize: 8, color: '#1E6B97', marginTop:5, fontWeight:'600' }}>{item.vehicle.temperature}°C </Text>
                    </View>
                    { item?.vehicle?.engineStatus === "On" ? 
                    <View style={{ flex:1, flexDirection: 'column', justifyContent:'center', alignItems:'center'}}>
                      <Image 
                        source={require("../../../assets/engine_green.png")} 
                        style={{alignSelf:'center', width: 20, height: 14, resizeMode: 'contain' }}/> 
                      <Text style={{ fontSize: 8, color: '#1E6B97', marginTop:2, fontWeight:'bold' }}>ON </Text>
                    </View>
                    :
                    <View style={{ flex:1, flexDirection: 'column', justifyContent:'center', alignItems:'center'}}>
                      <Image 
                        source={require("../../../assets/engine_red.png")} 
                        style={{alignSelf:'center', width: 20, height: 14, resizeMode: 'contain' }}/> 
                      <Text style={{ fontSize: 8, color: '#1E6B97', marginTop:2, fontWeight:'bold' }}>OFF </Text>
                    </View>
                    }
                  </View>
    
                  <View style={{ flex:1, flexDirection: 'row', alignItems: 'center', marginTop:7, marginLeft:5}}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                      <View style={{ width:60, flexDirection: 'column', justifyContent:'center', alignItems:'center'}}>
                        <Image 
                          source={require("../../../assets/video_enable.png")} 
                          style={{alignSelf:'center', width: 35, height: 15, resizeMode: 'contain' }}/> 
                        <Text style={{ fontSize: 8, color: '#1E6B97', fontWeight:'600', marginTop:3 }}>Video</Text>
                      </View>
                      <View style={{ width:60, flexDirection: 'column', justifyContent:'center', alignItems:'center', marginLeft:5}}>
                      <Image 
                        source={require("../../../assets/camera_enable.png")} 
                        style={{alignSelf:'center', width: 22, height: 15, resizeMode: 'contain' }}/> 
                        <Text style={{ fontSize: 8, color: '#1E6B97', fontWeight:'600', marginTop:3 }}>Snapshot </Text>
                      </View>
                    </View>
                  </View>
                </View>
                <View style={{ width:(wp('100%') - 30) * 0.2, flexDirection: 'column'}}>
                { item.vehicle.title === "Car" ?
                <View style={{ flexDirection: 'column',  alignItems:'center'}}>
                  <Image 
                    source={require("../../../assets/tank_red.png")} 
                    style={{alignSelf:'center', width: 16, height: 14, resizeMode: 'contain' }}/> 
                  <Text style={{ fontSize: 8, color: '#1E6B97', marginTop:3, fontWeight:'bold' }}>
                    {
                      item.vehicle.teltonikas[item.vehicle.teltonikas.length - 1]?.fuel ?
                      item.vehicle.teltonikas[item.vehicle.teltonikas.length - 1].fuel : 0
                    }L
                  </Text>
                </View>
                :
                <View style={{ flexDirection: 'column',  alignItems:'center'}}>
                  <View style={{ flexDirection: 'row',  alignItems:'center'}}>
                    <Text style={{marginLeft:5, marginRight:2, fontSize: 8, color: '#1E6B97', fontWeight:'bold' }}>Tank-1</Text>
                    <Image 
                      source={require("../../../assets/tank_red.png")} 
                      style={{alignSelf:'center', width: 16, height: 14, resizeMode: 'contain' }}/> 
                    <Text style={{marginLeft:2, fontSize: 8, color: '#1E6B97', fontWeight:'bold' }}>
                    {
                      item.vehicle.teltonikas[item.vehicle.teltonikas.length - 1]?.fuel ?
                      item.vehicle.teltonikas[item.vehicle.teltonikas.length - 1].fuel : 0
                    }L
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row',  alignItems:'center', marginTop:2}}>
                    <Text style={{marginLeft:5, marginRight:2, fontSize: 8, color: '#1E6B97', fontWeight:'bold' }}>Tank-2</Text>
                    <Image 
                      source={require("../../../assets/tank_yellow.png")} 
                      style={{alignSelf:'center', width: 16, height: 14, resizeMode: 'contain' }}/> 
                    <Text style={{marginLeft:2, fontSize: 8, color: '#1E6B97', fontWeight:'bold' }}>
                    {
                      item.vehicle.teltonikas[item.vehicle.teltonikas.length - 1]?.fuel ?
                      item.vehicle.teltonikas[item.vehicle.teltonikas.length - 1].fuel : 0
                    }L
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row',  alignItems:'center', marginTop:2}}>
                    <Text style={{marginLeft:5, marginRight:2, fontSize: 8, color: '#1E6B97', fontWeight:'bold' }}>Tank-3</Text>
                    <Image 
                      source={require("../../../assets/tank_green.png")} 
                      style={{alignSelf:'center', width: 16, height: 14, resizeMode: 'contain' }}/> 
                    <Text style={{marginLeft:2, fontSize: 8, color: '#1E6B97', fontWeight:'bold' }}>
                    {
                      item.vehicle.teltonikas[item.vehicle.teltonikas.length - 1]?.fuel ?
                      item.vehicle.teltonikas[item.vehicle.teltonikas.length - 1].fuel : 0
                    }L
                    </Text>
                  </View>
                </View>
                }
                </View>
                <View style={{flex:1, flexDirection: 'column', justifyContent:'flex-end',
                  position:'absolute', right:0, top:45}}>
                  <ModalDropdown data={item}
                    onDropdownWillHide={handleDropdownHide}
                    onDropdownWillShow={handleDropdownShow}
                    options={dropdownOptions}
                    dropdownStyle={{ height:161, borderRadius:10, elevation:10, shadowColor:'black', top: 10, right:45 }} // Change the position of the modal here
                    renderRow={() => renderDropdownRow(item)}>
                    <View style={{width:40, height:40}}>
                      <Image
                      source={require("../../../assets/menu_ico.png")} 
                      style={{alignSelf:'center', width: 25, height: 25, marginRight:-10, marginTop:10, resizeMode: 'contain' }}/> 
                    </View>
                  </ModalDropdown>
                </View>
              </View>
              <View style={{ flexDirection: 'row', marginTop:10}}>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                  <IconComponentProvider IconComponent={MaterialCommunityIcons}>
                    <Icon name="map-marker" size={13} color="#D01400" style={{alignSelf:'center'}} />
                  </IconComponentProvider>
                  <Text numberOfLines={1} style={{ fontSize: 10, fontWeight:'500', color: '#1E6B97', marginLeft:5, width:wp('100%') - 80 }}>
                    {item.vehicle.address}
                    {/* {item.vehicle.teltonikas[item.vehicle.teltonikas.length - 1]?.address} */}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      )
    }
  }

  const sendIgnitionCommand = (imei, value) => {
    // token,deviceImei,command,param
    const sendCommandData =
    {
      token: userReducer.token,
      command: `setdigout ${value}??`,
      deviceImei: imei
    }
    // const sendCommandData =
    // {
    //   token: userReducer.token,
    //   type: 'Digital Output',
    //   params: {
    //     out1: `${value}`,
    //     out2: "?",
    //     out3: "?",
    //     ignore1: "?",
    //     ignore2: "?",
    //     ignore3: "?",
    //   },
    //   devImei: imei
    // }
    console.log("sendIgnitionCommand", sendCommandData)
    dispatch(sendCommand(sendCommandData));
  }

  const renderDropdownRow = (data) => {
    let ignition = data.vehicle?.teltonikas[data.vehicle?.teltonikas?.length - 1]?.IOvalue.find(item => item.dataId === 179)?.dataValue;

    return (

      <View style={{flexDirection:"column", padding:5, borderRadius:10, width:105}}>
        <TouchableOpacity style={{flex:1 }} onPress={() => { navigation.navigate('Vehicle_Detail', { "infos": data, "index" : 0}) }}>
          <View style={{ height:30, flexDirection: 'row', alignItems: 'center' }}>
            <Image 
              source={require("../../../assets/vehicle_view.png")} 
              style={{width: 25, height: 18, resizeMode: 'contain' }}/> 
            <Text style={styles.menuString}>{t('view')}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={{flex:1 }} onPress={() => { navigation.navigate('Vehicle_Edit', { "infos": data, "index" : 0}) }}>
          <View style={{ height:30, flexDirection: 'row', alignItems: 'center' }}>
            <Image 
              source={require("../../../assets/vehicle_edit.png")} 
              style={{width: 25, height: 15, resizeMode: 'contain' }}/> 
            <Text style={styles.menuString}>{t('edit')}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={{flex:1 }} 
          onPress={() => {
            Alert.alert(
              t('warning'),
              t('are_you_going_to_delete_this_vehicle'),
              [
                {
                  text: t('yes'),
                  onPress: () => handleDeleteVehicle(data.vehicle.deviceImei),
                },
                {
                  text: t('no'),
                  onPress: () => console.log("cancel"),
                },
              ],
            );
          }} >
          <View style={{ height:30, flexDirection: 'row', alignItems: 'center' }}>
            <Image 
              source={require("../../../assets/vehicle_delete.png")} 
              style={{width: 25, height: 15, resizeMode: 'contain' }}/> 
            <Text style={styles.menuString}>{t('delete')}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={{flex:1 }} onPress={() => { navigation.navigate('Vehicle_Setting', { "infos": data, "index" : 0}) }}>
          <View style={{ height:30, flexDirection: 'row', alignItems: 'center' }}>
            <Image 
              source={require("../../../assets/vehicle_setting.png")} 
              style={{width: 25, height: 16, resizeMode: 'contain' }}/> 
            <Text style={styles.menuString}>{t('settings')}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={{flex:1 }} 
          onPress={() => {
            let dispText = "", value = 0;
            //if(newIgnition == 1){
            if(ignition === 1) {
              value = 0;
              dispText = t('are_you_going_to_unignition_this_vehicle');      
            }else{
              value = 1
              dispText = t('are_you_going_to_ignition_this_vehicle');  
            }
            
            Alert.alert(
              t('warning'),
              dispText,
              [
                {
                  text: t('yes'),
                  onPress: () => sendIgnitionCommand(data.vehicle.deviceImei, value),
                },
                {
                  text: t('no'),
                  onPress: () => console.log("cancel"),
                },
              ],
            );
        }} >
          { data?.vehicle?.ignitionStatus === "On" ? 
          <View style={{ height:30, flexDirection: 'row', alignItems: 'center' }}>
            <Image
              source={require("../../../assets/slider_on.png")} 
              style={{alignSelf:'center', width: 40, height: 30, marginLeft:-8, resizeMode: 'contain' }}/> 
            <Text style={[styles.menuString, {marginLeft:0}]}>{t('ignition')}</Text>
          </View>
              :
          <View style={{ height:30, flexDirection: 'row', alignItems: 'center' }}>
            <Image
              source={require("../../../assets/slider_off.png")} 
              style={{alignSelf:'center', width: 40, height: 30, marginLeft:-10, resizeMode: 'contain' }}/> 
            <Text style={[styles.menuString, {marginLeft:0}]}>{t('ignition')}</Text>
          </View>
          }
        </TouchableOpacity>
      </View>
    );
  };
  const dropdownOptions = ['Menu'];

  const VehicleList = () => {
    if (!vehicleReducer.vehiclesList || vehicleReducer.vehiclesList.length === 0) {
      return (
        <View style={{ flex: 1, alignSelf: 'center' }}>
          <Text style={{ alignItems: 'center', marginTop: hp('30%') }}>Empty</Text>
        </View>
      )
    } else {
      if(selTotal === true) {
        return (
          <View style={{width:wp('97%'), alignSelf:'center'}}>
            <FlatList
                data={filterData(vehicleReducer.vehiclesList)}
                renderItem={({ item,index }) => VehicleItem(item, index, filterData(vehicleReducer.vehiclesList).length)}/>
          </View>
        )
      } else if(selOnline === true) {
        return (
          <View style={{width:wp('97%'), alignSelf:'center'}}>
            <FlatList
              data={filterData(vehicleReducer.vehiclesList.filter(obj => obj.vehicle.isConnected=== "Connected"))}
              renderItem={({ item,index }) => VehicleItem(item, index, filterData(vehicleReducer.vehiclesList.filter(obj => obj.vehicle.isConnected=== "Connected")).length)}/>
          </View>
        )
      } else if(selOffline === true) {
        return (
          <View style={{width:wp('97%'), alignSelf:'center'}}>
            <FlatList
              data={filterData(vehicleReducer.vehiclesList.filter(obj => obj.vehicle.isConnected=== "Not Connected"))}
              renderItem={({ item,index }) => VehicleItem(item, index, filterData(vehicleReducer.vehiclesList.filter(obj => obj.vehicle.isConnected=== "Not Connected")).length)}/>
          </View>
        )
      }
    }

  }

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <StatusBar backgroundColor={"#364153"} barStyle={"light-content"} />
      <Header screenName={t('vehicles_list')} curNavigation={navigation}></Header>
      {/* <LoadingComponent isLoading={vehicleReducer.isVehicleList} /> */}
      {/* <LoadingComponent isLoading={vehicleReducer.isRemovingVehicle} /> */}
      <View style={{flexDirection:'row', alignSelf:'center', width:wp('97%'), marginTop:3}}>
        <View style={{ borderWidth: 1, width: wp('85%'), borderRadius: 10, borderColor: "#A9A9A9", backgroundColor: 'white' }}>
          <View style={{ flexDirection: 'row', marginVertical: 5, alignItems: 'center' }}>
            <TextInput placeholder={t('search_vehicle')} style={{ width: wp('72%'), marginLeft: 5, zIndex: 9 }}
              value={searchText}
              onChangeText={changeText}
            />
          </View>
        </View>
        <TouchableOpacity style={{flex:1 }}
          onPress={() => {
            if(userReducer.user.role === 'Admin' || userReducer.user.role === 'Manager') {
              navigation.navigate('Vehicle_Add') 
            } else {
              toastr(t('access_denied'));
            }
          }}
        >
          <Image
              source={require("../../../assets/add_btn.png")} 
              style={{alignSelf:'center', width: 40, height: 40, resizeMode: 'contain' }}/> 
        </TouchableOpacity>
      </View>

      

      <View style={{flexDirection:'row', alignSelf:'center', marginTop:10}}>
        <View>
          <TouchableOpacity style={{width:98, height:90}}
            onPress={()=>{handleTotal()}}
          >
            <Image style={{width:100, height:100, resizeMode:'contain', alignSelf:'center'}} source={selTotal ? require("../../../assets/total-boder.png") : require("../../../assets/total-noboder.png")} />
            <Text style={{color:'white', position:'absolute', marginTop:10, alignSelf:'center', fontSize:16, fontWeight:'bold'}}>{t('total')}</Text>
            <AnimatedCircularProgress style={{marginTop:38, marginLeft:29, position:'absolute'}}
              size={40} width={4} fill={100} tintColor="#FFF">
              {
                (fill) => (
                  <Text>
                    <Text style={{color:'white', fontSize:14, fontWeight:'600'}}>{vehicleReducer.vehiclesList.length}</Text>
                  </Text>
                )
              }
            </AnimatedCircularProgress>
          </TouchableOpacity>
        </View>

        <View style={{marginLeft:wp('7%')}}>
          <TouchableOpacity style={{width:98, height:98}} 
            onPress={()=>{handleOnline()}}
          >
            <Image style={{width:100, height:100, resizeMode:'contain', alignSelf:'center'}} source={selOnline ? require("../../../assets/online-boder.png") : require("../../../assets/online-noboder.png")} />
            <Text style={{color:'white', position:'absolute', marginTop:10, alignSelf:'center', fontSize:16, fontWeight:'bold'}}>{t('online')}</Text>
            <AnimatedCircularProgress style={{marginTop:38, marginLeft:29, position:'absolute'}}
              size={40} width={4} fill={vehicleReducer.vehiclesList.length ===0 ? 100 : vehicleReducer.vehiclesList.filter(obj => obj.vehicle.isConnected=== "Connected").length /
              vehicleReducer.vehiclesList.length * 100} rotation={270} tintColor="#FFF">
              {
                (fill) => (
                  <Text>
                    <Text style={{color:'white', fontSize:14, fontWeight:'600'}}>{vehicleReducer.vehiclesList.filter(obj => obj.vehicle.isConnected=== "Connected").length}</Text>
                  </Text>
                )
              }
            </AnimatedCircularProgress>
          </TouchableOpacity>
        </View>

        <View style={{marginLeft:wp('7%')}}>
          <TouchableOpacity style={{width:98, height:98}}
            onPress={()=>{handleOffline()}}
          >
            <Image style={{width:100, height:100, resizeMode:'contain', alignSelf:'center'}} source={selOffline ? require("../../../assets/offline-boder.png") : require("../../../assets/offline-noboder.png")} />
            <Text style={{color:'white', position:'absolute', marginTop:10, alignSelf:'center', fontSize:16, fontWeight:'bold'}}>{t('offline')}</Text>
            <AnimatedCircularProgress style={{marginTop:38, marginLeft:29, position:'absolute'}}
              size={40} width={4} rotation={270} fill={vehicleReducer.vehiclesList.length ===0 ? 100 : vehicleReducer.vehiclesList.filter(obj => obj.vehicle.isConnected=== "Not Connected").length /
              vehicleReducer.vehiclesList.length * 100} tintColor="#FFF">
              {
                (fill) => (
                  <Text>
                    <Text style={{color:'white', fontSize:14, fontWeight:'600'}}>{vehicleReducer.vehiclesList.filter(obj => obj.vehicle.isConnected=== "Not Connected").length}</Text>
                  </Text>
                )
              }
            </AnimatedCircularProgress>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView>
        <VehicleList />
      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  to1: {
    width: 30,
    height: 30,
    borderRadius: 40,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin: wp('4%')
  },
  t1: {
    fontSize: 15,
    fontWeight: '500',
    marginLeft: wp('30%'),
    marginTop: 22
  },
  v1:
  {
    backgroundColor: '#18567F',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    right: wp('3%'),
    flexDirection: 'row'
  },
  icon: {
    width: 30,
    height: 20,
    marginLeft: 10,
    resizeMode:'contain'
  },
  cardview:
  {
    width: wp('100%'),
    alignSelf: 'center',
  },
  text1: {
    fontSize: 11,
    fontWeight: '400',
    marginLeft: 10,
    marginTop: 4

  },
  to2: {
    marginTop: 13,
    flexDirection: 'row'
  },
  newCar: {
    position: 'absolute',
    width: 40,
    height: 40,
    top: hp('87%'),
    alignItems: 'center',
    backgroundColor: '#18567F',
    justifyContent: 'center',
    borderRadius: 15,
    alignSelf: 'center',
    elevation: 5,
    zIndex: 100
  },
  tabView: {
    width: '100%',
    height: hp('8%'),
    flex: 1,
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: 'center',
    paddingHorizontal: 19,
    position: 'absolute',
    top: hp('90%'),
    zIndex: 99
  },
  menuString: {
    height:25,
    marginLeft:5,
    fontSize: 16,
    fontWeight:'bold',
    color:'#1E6B97'
  },
  menuOptions: {
    paddingTop:5, paddingBottom:5,
    marginTop:-150,
    alignItems: 'center',
    borderRadius: 8,
    width: 110,
  },
  v4: {
    alignItems:'center',
    flexDirection:'row',
    borderWidth: 1,
    borderColor: '#364153',
    backgroundColor: '#364153',
    borderRadius: 10,
    width: wp('23.5%'),
    height: hp('9.9%')
  },
  v5: {
    marginLeft: wp('10%'),
    alignItems:'center',
    flexDirection:'row',
    borderWidth: 1,
    borderColor: '#364153',
    backgroundColor: '#364153',
    borderRadius: 10,
    width: wp('23.5%'),
    height: hp('9.9%')
  },
  imgBg1: {
    flex: 1,
    width: 98,
    height: 90,
    resizeMode: 'contain'
  },
  imgBg2: {
    alignSelf:'center',
    marginTop:2,
    width: 92,
    height: 92,
    resizeMode: 'contain'
  },
})