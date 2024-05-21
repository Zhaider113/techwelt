import React, { useState,useCallback, useEffect } from 'react'
import {
  SafeAreaView, StyleSheet, View, ToastAndroid, BackHandler,
  TouchableOpacity, Alert, Image, Text, StatusBar, Modal, TextInput
} from 'react-native'

import { IconComponentProvider, Icon } from "@react-native-material/core";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Ionicons from "@expo/vector-icons/Ionicons";

import { useSelector, useDispatch } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { deleteVehicle, setReceivePeriod, sendGprsIgnition, sendGprsRestart, sendGprsBluetooth,
  sendGprsReset, sendSetTrackMode, setLimitSpeed, showVehicles } from '../actions/vehicles';
import { teltonika } from '../actions/teltonika';
import LoadingComponent from '../components/Loading';
import { toastr } from '../services/navRef';
import {useTranslation} from "react-i18next";
import { getIOValue,ID_IOIGNITION,validDigitNumber} from '../utils/util';


export default function Regiage({ navigation, route }) {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  let { infos,index } = route.params;
  const userReducer = useSelector(state => state.auth);
  const vehicleReducer = useSelector(state => state.realtimeVehicles);
  const teltonikaReducer = useSelector(state => state.teltonika);
  const [speedModal, setSpeedModal] = useState(false);
  const [speed, setSpeed] = useState("0");
  
  const [stopPeriod, setStopPeriod] = useState();
  const [movePeriod, setMovePeriod] = useState();

  //console.log("Setting Dlg",infos)

  const [isShowModal, setIsShowModal] = useState(false);
  const [isStartGetCmdResult, setIsStartGetCmdResult] = useState(false);

  const [updateTime,setUpdateTime] = useState(new Date());
  let realtimeVehicleData = vehicleReducer.vehicles[index];

  //console.log("@@@regiageselindex",index,realtimeVehicleData.vehicle.trackMode, vehicleReducer.vehicles[0].vehicle.trackMode,vehicleReducer.vehicles[2].vehicle.trackMode,new Date())
  //console.log("@@@regiageselindex", teltonikaReducer.trackMode,new Date())
  console.log("@@@regiageselindex", realtimeVehicleData.vehicle.trackMode,new Date())
  //console.log("@@@regiageselindex",vehicleReducer.vehicles)

  const [ignitionVal, setIgnitionVal] = useState(getIOValue(realtimeVehicleData.vehicle.teltonikas.IOvalue,ID_IOIGNITION));


  useFocusEffect(useCallback(() => {
    if(isStartGetCmdResult){
      const interval = setInterval(() => {
        console.log("@@@@@@@@@ isStartGetCmdResult")
      }, 5000); // Set the interval time here
    }

    //setStopPeriod(realtimeVehicleData.vehicle.trackMode ? realtimeVehicleData.vehicle.trackMode.split(";")[0].split(":")[1] : "10")
    //setMovePeriod(realtimeVehicleData.vehicle.trackMode ? realtimeVehicleData.vehicle.trackMode.split(";")[1].split(":")[1] : "10")

    const handleBackPress = () =>{
    
      //console.log("@@@ Regiage Back press",global.pageNav)
      if(global.pageNav.pageName == "List"){
        navigation.navigate('List') 
        return true;
      }
      else{
        global.pageNav = {};
        navigation.navigate('MapScreen') 
        return true;
      }
    }

    BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    const intervalRegiage = setInterval(() => {
      //console.log("@@@@@@@regiage intervalfunc",intervalRegiage,new Date())

      //dispatch(teltonika(userReducer.token, userReducer.user._id,infos.vehicle.deviceImei));
      dispatch(getRealtimeVehicles(userReducer.token, userReducer.user._id));
      //console.log("@@@@@@@regiage",new Date());
      setUpdateTime(new Date()); // Update the state with current time
    },1000 * 5);
    
    if(infos.vehicle.deviceModel == "TL1"){
      if(!stopPeriod){
      }
      setStopPeriod(realtimeVehicleData.vehicle.trackMode ? realtimeVehicleData.vehicle.trackMode.split(";")[0].split(":")[1] : "360")
      setMovePeriod(realtimeVehicleData.vehicle.trackMode ? realtimeVehicleData.vehicle.trackMode.split(";")[1].split(":")[1] : "360")
      if(!movePeriod){
      }
    }else if(infos.vehicle.deviceModel == "Eyecut"){
      if(!stopPeriod){
      }
      setStopPeriod(realtimeVehicleData.vehicle.trackMode ? realtimeVehicleData.vehicle.trackMode.split(";")[0].split(":")[1] : "10")
      setMovePeriod(realtimeVehicleData.vehicle.trackMode ? realtimeVehicleData.vehicle.trackMode.split(";")[1].split(":")[1] : "10")
      if(!movePeriod){
      }          
    }


    return () => {
      //console.log("@@@@@@@regiage focusreturn",intervalRegiage)
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
      clearInterval(intervalRegiage);
      //console.log("@@@@@@@@@@Regiagefocuseffect")
      //setStopPeriod(0);
      //setMovePeriod(0);
    }

  }, [realtimeVehicleData]))

  // useEffect(() => {
  //   BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    
  //   return () => {
  //     BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
  //   }
  // },[navigation])

  const handleTrackMode = () => {

    //console.log("@@@@@@@@@@@handletrackmode",realtimeVehicleData.vehicle.trackMode)
    try{
      if(infos.vehicle.deviceModel == "TL1"){
        if(!stopPeriod){
        }
        setStopPeriod(realtimeVehicleData.vehicle.trackMode ? realtimeVehicleData.vehicle.trackMode.split(";")[0].split(":")[1] : "360")
        setMovePeriod(realtimeVehicleData.vehicle.trackMode ? realtimeVehicleData.vehicle.trackMode.split(";")[1].split(":")[1] : "360")
        if(!movePeriod){
        }
      }else if(infos.vehicle.deviceModel == "Eyecut"){
        if(!stopPeriod){
        }
        setStopPeriod(realtimeVehicleData.vehicle.trackMode ? realtimeVehicleData.vehicle.trackMode.split(";")[0].split(":")[1] : "10")
        setMovePeriod(realtimeVehicleData.vehicle.trackMode ? realtimeVehicleData.vehicle.trackMode.split(";")[1].split(":")[1] : "10")
        if(!movePeriod){
        }          
      }

      setIsShowModal(true);
    }catch(e){
      console.log("@@@@@get TrackMode error",e)
    }
  }

  const setPeriod = () => {
    //console.log("@@@@@ssetperiodfunc",stopPeriod,movePeriod,infos.vehicle.deviceModel)
    
    if(!validDigitNumber(stopPeriod) || !validDigitNumber(movePeriod))
    {
      toastr(t('please_enter_digit'))
      return;
    }

    if(infos.vehicle.deviceModel == "TL1"){
      // 360~28800
      if(!(parseInt(stopPeriod) >= 360 && parseInt(stopPeriod) <= 28800))
      {
        toastr(t('invalid_onstop_period'))
        return;
      }
      if(!(parseInt(movePeriod) >= 360 && parseInt(movePeriod) <= 28800))
      {
        toastr(t('invalid_onmove_period'))
        return;
      }
    }else if(infos.vehicle.deviceModel == "Eyecut"){
      // 0~2592000
      if(!(parseInt(stopPeriod) >= 0 && parseInt(stopPeriod) <= 2592000))
      {
        toastr(t('invalid_onstop_period_eyecut'))
        return;
      }
      if(!(parseInt(movePeriod) >= 0 && parseInt(movePeriod) <= 2592000))
      {
        toastr(t('invalid_onmove_period_eyecut'))
        return;
      }
    }

    var commandStop = 0;
    var commandMove = 0;
    if(infos.vehicle.deviceModel == "TL1"){
      commandStop = 185;
      commandMove = 186;
    }else if(infos.vehicle.deviceModel == "Eyecut"){
      commandStop = 10005;
      commandMove = 10055;    
    }

    dispatch(sendSetTrackMode(userReducer.token,infos.vehicle.teltonikas.deviceImei,"setparam",`${commandStop}:${stopPeriod};${commandMove}:${movePeriod}`));

    setIsShowModal(false);
    // navigation.navigate("MapScreen");
  }

  const setlimitSpeed = () => {

    //console.log("@@@@@@@ setlimitSpeed ",userReducer.token)
    dispatch(setLimitSpeed(userReducer.token, userReducer.user._id, infos.vehicle.teltonikas.deviceImei, speed));
    infos.vehicle.limitspeed = speed;
    setSpeedModal(false);
  }

  const showBluetoothDevices = () => {
    //console.log("@@@@showBluetoothDevicesfunc",infos.vehicle.teltonikas.deviceImei)
    global.g_CntGetCmdResult = 0;
    dispatch(sendGprsBluetooth(userReducer.token,infos.vehicle.teltonikas.deviceImei,"btgetlist","#"));
    
    // console.log(infos.vehicle.teltonikas.bluetooth);
    // if (infos.vehicle.teltonikas.bluetooth) {
    //   Alert.alert(
    //     t('bluetooth_info'),
    //     `${infos.vehicle.teltonikas.bluetooth}`,
    //     [
    //       {
    //         text: t('close'),
    //         onPress: () => Alert.dismiss(),
    //       },
    //     ],
    //   );
    // }
    // else {
    //   ToastAndroid.show(
    //     t('any_bluetooth_device_not_exist'),
    //     ToastAndroid.SHORT
    //   );
    // }
  }

  const handleIgnition = () => {
    //const newIgnition = Math.abs(parseInt(realtimeVehicleData.vehicle.teltonikas.ignition) - 1);
    const newIgnition = Math.abs(parseInt(getIOValue(realtimeVehicleData.vehicle.teltonikas.IOvalue,ID_IOIGNITION))- 1);
    console.log("handleignition param",newIgnition);
    let dispText = "";
    //if(newIgnition == 1){
    if(ignitionVal == 0){
      dispText = t('are_you_sure_to_TurnON_Ignition');      
    }else{
      dispText = t('are_you_sure_to_TurnOFF_Ignition');  
    }
    if(dispText == "") return;
    Alert.alert(
      t('warning'),
      dispText,
      [
        {
          text: t('yes'),
          onPress: () => {
            //dispatch(sendGprsIgnition(userReducer.token,infos.vehicle.teltonikas.deviceImei,"setdigout",newIgnition));
            dispatch(sendGprsIgnition(userReducer.token,infos.vehicle.teltonikas.deviceImei,"setdigout",`${newIgnition}??`));
            setIgnitionVal(newIgnition);

          },
        },
        {
          text: t('no'),
          onPress: () => {()=>{}},
        },
      ],
    );    
  }

  const handleRestart = () => {
    dispatch(sendGprsRestart(userReducer.token,infos.vehicle.teltonikas.deviceImei,"cpureset",""));
  }

  const handleResetCommand = () => {
    dispatch(sendGprsReset(userReducer.token,infos.vehicle.teltonikas.deviceImei,"cpureset",""));
  }

  const handleDeleteVehicle = () => {
    Alert.alert(
      t('warning'),
      t('are_you_going_to_delete_this_vehicle'),
      [
        {
          text: t('yes'),
          onPress: () => removeVehicle(),
        },
        {
          text: t('no'),
          onPress: () => setIsShowModal(false),
        },
      ],
    );
  }

  const removeVehicle = () => {
    dispatch(deleteVehicle(userReducer.token, userReducer.user._id, infos.vehicle.deviceImei, navigation));
  }

  return (
    <SafeAreaView style={{ marginTop: 10, marginBottom: 25, flex: 1, backgroundColor: '#F9F9F9' }}>
      <StatusBar backgroundColor={'white'} barStyle={'dark-content'} />
      {/* <LoadingComponent isLoading={vehicleReducer.isRemovingVehicle} /> */}
      <Modal visible={speedModal} >
        <View style={styles.modalContent}>
          <View style={{ flexDirection: 'column',textAlign:'center' , padding:10}}>
            <Text style={{textAlign:'center'}}>{t('current_limit')} </Text>
            <Text style={{ padding:10,textAlign:'center'}}>{infos.vehicle.limitspeed}</Text>
          </View>
          <View>
            <Text style={{ flexDirection: 'column',textAlign:'center' , padding:10}}>{t('new_limit_speed')} </Text>
            <TextInput style={styles.passwordInput} onChangeText={(val) => setSpeed(val)}></TextInput>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',padding:20 }}>
            <TouchableOpacity style={styles.modalButton} onPress={setlimitSpeed}>
              <Text style={{ color: 'white', fontSize: 16 }}>{t('ok')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setSpeedModal(false)}
            >
              <Text style={{ color: 'white', fontSize: 16 }}>{t('cancel')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        // animationType="slide"
        transparent={true}
        visible={isShowModal}
        onRequestClose={() => {
          setIsShowModal(false);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modeview}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between',paddingBottom:15 }}>
              <Text style={{ padding: 5 }}>{t('on_stop')} </Text>
              <TextInput style={styles.modeInput} value={stopPeriod} keyboardType='numeric'
                onChangeText={(val) => setStopPeriod(val)}
              ></TextInput><Text style={{ padding: 5}}>{t('sec')}</Text>

            </View>
            <Text style={{ marginTop: -10,paddingBottom : 10 }}>{infos.vehicle.deviceModel == "TL1" ? "360 ~ 28800" : "0 ~ 2592000"}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between',paddingBottom:15 }}>
              <Text style={{ padding: 5, }}>{t('on_move')} </Text>
              <TextInput style={styles.modeInput} value={movePeriod} keyboardType='numeric'
                onChangeText={(val) => setMovePeriod(val)}
              ></TextInput><Text style={{ padding: 5}}>{t('sec')}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>  
                <TouchableOpacity
                    style={[styles.modalButton,{marginLeft:10}]}
                    onPress={() => setIsShowModal(false)}
                >
                    <Text style={{ color: 'white', fontSize: 16 }}>{t('cancel')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.modalButton,{marginLeft:10}]}
                    onPress={() => setPeriod()}
                >
                    <Text style={{ color: 'white', fontSize: 16 }}>{t('confirm')}</Text>
                </TouchableOpacity>
            </View>        
          </View>
        </View>
      </Modal>
      <View
        style={{
          backgroundColor: '#18567F',
          width: wp('90%'),
          height: hp('10%'),
          borderRadius: 10,
          alignSelf: 'center',
          marginTop: hp('1%'),
          position: 'relative',
          overflow: 'hidden'
        }}>
        <Image
          source={require('../../assets/1back.png')}
          style={{
            width: 120,
            height: 120,
            position: 'absolute',
            top: hp('-3%'),
            right: wp('0%'),
          }} />
        <Image
          source={require('../../assets/2back.png')}
          style={{
            width: 120,
            height: 120,
            position: 'absolute',
            top: hp('-1%'),
            right: wp('0%'),
          }} />
        <Image
          source={require('../../assets/3.png')}
          style={{
            width: 120,
            height: 120,
            position: 'absolute',
            top: hp('6%'),
            left: wp('0%'),
          }} />
        <View
          style={{
            flexDirection: 'row',
            marginLeft: 15,
            marginTop: hp('-1.5%'),
          }}>

          <Text bold style={{ fontSize: 20, fontWeight: "400", color: '#FFFF', marginTop: hp('5%') }}>{infos.vehicle.vehicleName}</Text>
        </View>
      </View>

      <View style={{ flex: 1, flexDirection: 'column', marginTop: hp('5.5%') }}>
        <TouchableOpacity style={styles.v3} onPress={() => handleTrackMode()}>
          <View style={styles.v5}>
            <View style={styles.v2}>
              <IconComponentProvider IconComponent={MaterialCommunityIcons}>
                <Icon name="map-marker" size={16} color="#18567F" />
              </IconComponentProvider>
            </View>
            <Text style={styles.v6}>{t('tracking_mode')}</Text>
          </View>
          <View>
            <IconComponentProvider IconComponent={MaterialCommunityIcons}>
              <Icon name="chevron-right" size={20} color="#000000" style={{}} />
            </IconComponentProvider>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.v3} onPress={() =>{ 
          // global.pageNav = {
          //   "pageName":"Regiage",
          //   "param":infos
          // }
          //console.log("@@@@@@@@@@@@Regiage ", global.pageNav);
          navigation.navigate('NotificationSetting', { "infos": infos })
        }}>
          <View style={styles.v5}>
            <View style={styles.v2}>
              <IconComponentProvider IconComponent={MaterialCommunityIcons}>
                <Icon name="bell-badge" size={16} color="#18567F" />
              </IconComponentProvider>
            </View>
            <Text style={styles.v6}>{t('notifications')}</Text>
          </View>
          <View>
            <IconComponentProvider IconComponent={MaterialCommunityIcons}>
              <Icon name="chevron-right" size={20} color="#000000" style={{}} />
            </IconComponentProvider>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.v3} onPress={() => {
          global.pageNav = {...global.pageNav,"param":infos}
          //console.log("@@@@@ regiage to membership",)
          navigation.navigate('Membership', { "infos": infos })
          }}>
          <View style={styles.v5}>
            <View style={styles.v2}>
              <Image source={require('../../assets/frame.png')} style={{ width: 12, height: 9 }} />
            </View>
            <Text style={styles.v6}>{t('subscription')}</Text>
          </View>
          <View>
            <IconComponentProvider IconComponent={MaterialCommunityIcons}>
              <Icon name="chevron-right" size={20} color="#000000" style={{}} />
            </IconComponentProvider>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.v3} onPress={showBluetoothDevices}>
          <View style={styles.v5}>
            <View style={styles.v2}>
              <IconComponentProvider IconComponent={MaterialCommunityIcons}>
                <Icon name="bluetooth" size={16} color="#18567F" />
              </IconComponentProvider>
            </View>
            <Text style={styles.v6}>{t('related_devices')}</Text>
          </View>
          <View>
            <IconComponentProvider IconComponent={MaterialCommunityIcons}>
              <Icon name="chevron-right" size={20} color="#000000" style={{}} />
            </IconComponentProvider>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.v3} onPress={handleIgnition}>
          <View style={styles.v5}>
            <View style={styles.v2}>
              <IconComponentProvider IconComponent={MaterialCommunityIcons}>
                <Icon name="car" size={16} color="#18567F" />
              </IconComponentProvider>
            </View>
            <Text style={styles.v6}>{t('circuit_break')}</Text>
          </View>
          <View>
          <Text style={{ color: '#18567F', fontSize: 12, fontWeight: '600'}}>{ignitionVal == "0" ? "Off":"On"}</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.v3} onPress={handleRestart}>
          <View style={styles.v5}>
            <View style={styles.v2}>
              <Image source={require('../../assets/monitor.png')} style={{ width: 12, height: 11 }} />
            </View>
            <Text style={styles.v6}>{t('restart')}</Text>
          </View>
          <View>
            <IconComponentProvider IconComponent={MaterialCommunityIcons}>
              <Icon name="chevron-right" size={20} color="#000000" style={{}} />
            </IconComponentProvider>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.v3} onPress={() => setSpeedModal(true)}>
          <View style={styles.v5}>
            <View style={styles.v2}>
              <IconComponentProvider IconComponent={Ionicons}>
                <Icon name="ios-speedometer-outline" size={16} color="#18567F" />
              </IconComponentProvider>
            </View>
            <Text style={styles.v6}>{t('speed_alert')}</Text>
          </View>
          <IconComponentProvider IconComponent={MaterialCommunityIcons}>
            <Text style={{ color: '#18567F', fontSize: 12, fontWeight: '600'}}>{speed == "0" ? infos.vehicle.limitspeed : speed}Km/h</Text>
          </IconComponentProvider>
        </TouchableOpacity>

        <TouchableOpacity style={styles.v3} onPress={handleResetCommand}>
          <View style={styles.v5}>
            <View style={styles.v2}>
              <IconComponentProvider IconComponent={MaterialCommunityIcons}>
                <Icon name="history" size={16} color="#18567F" />
              </IconComponentProvider>
            </View>
            <Text style={styles.v6}>{t('reset')}</Text>
          </View>
          <View>
            <IconComponentProvider IconComponent={MaterialCommunityIcons}>
              <Icon name="chevron-right" size={20} color="#000000" style={{}} />
            </IconComponentProvider>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.v3} onPress={handleDeleteVehicle}>
          <View style={styles.v5}>
            <View style={styles.v2}>
              <IconComponentProvider IconComponent={MaterialCommunityIcons}>
                <Icon name="trash-can-outline" size={16} color="#18567F" />
              </IconComponentProvider>
            </View>
            <Text style={styles.v6}>{t('delete_the_device')}</Text>
          </View>
          <View>
            <IconComponentProvider IconComponent={MaterialCommunityIcons}>
              <Icon name="chevron-right" size={20} color="#000000" style={{}} />
            </IconComponentProvider>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView >
  )
}

const styles = StyleSheet.create({
  t1: {
    fontSize: 14,
    fontWeight: '500',
    alignSelf: "center",
    textAlign: 'center',
    justifyContent: 'center'
  },
  to1: {
    position: 'absolute',
    width: 30,
    height: 30,
    left: 5,
    borderRadius: wp('10%'),
    borderWidth: 0.2,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20
  },
  v1: {
    backgroundColor: '#18567F',
    borderRadius: 10,
    width: 320,
    height: 70,
    margin: 10,
    marginHorizontal: 20
  },
  v2: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#18567F21',
    justifyContent: 'center',
    alignItems: 'center'
  },
  v3: {
    flexDirection: 'row',
    marginLeft: 20,
    flex: 1,
    justifyContent: 'space-between',
    width: wp('90%'),
    marginBottom: hp('3%')

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
    justifyContent: "space-between",
    alignItems: 'center',
    paddingHorizontal: 19,
    position: 'absolute',
    top: hp('90%'),
    zIndex: 99
  },
  detailHeader: {
    flexDirection: 'row',
    position: 'relative',
    marginTop: hp('5.5%'),
    marginBottom: hp('3.5%'),
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  v5: {
    flex: 1,
    flexDirection: 'row',
    gap: 10,
  },
  v6: {
    fontSize: 14,
    fontWeight: '400',
    marginLeft: 10
  },

  // modalView: {
  //   flex: 1,
  //   alignItems: 'center',
  //   backgroundColor: '#f7021a',
  //   padding: 100
  // },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modeview:{
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
        width: 0,
        height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    textAlign: "center",
    alignItems: "center"
  },
  // modalView: {
  //   margin: 20,
  //   backgroundColor: 'white',
  //   borderRadius: 20,
  //   padding: 35,
  //   alignItems: 'center',
  //   shadowColor: '#000',
  //   shadowOffset: {
  //     width: 0,
  //     height: 2,
  //   },
  //   shadowOpacity: 0.25,
  //   shadowRadius: 4,
  //   elevation: 5,
  // },
  modeInput: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'gray',
    paddingBottom: 5,
    paddingHorizontal: 11,
    width: '40%',
    textAlign:'right'
  },
  passwordInput: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'gray',
    padding: 4,
    paddingHorizontal: 12,
    width: '100%'
  },
  modalButton: {
    backgroundColor: "#18567F",
    width: '48%',
    borderRadius: 4,
    padding: 8,
    alignItems: 'center'
  },
  modalContent: {
    //flex: 1,
    width: wp('60%'),
    alignSelf: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 24,
    justifyContent: 'space-evenly',
    marginVertical: hp('20%'),
    justifyContent: 'center',
  }
})