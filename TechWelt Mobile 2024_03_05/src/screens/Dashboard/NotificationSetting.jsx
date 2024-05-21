import React, { useState } from "react";
import { SafeAreaView, View, Text, ScrollView, StyleSheet, Switch,Animated,
  TouchableOpacity, Image, FlatList } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import * as Notifications from 'expo-notifications';
import { useFocusEffect } from "@react-navigation/native";
import {useTranslation} from "react-i18next";
import { useSelector, useDispatch } from 'react-redux';

import Header from "../Header";

import { confirmNotificationSettings } from "../../actions/vehicles"

export default function NotificationSetting({ navigation,route }) {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const userReducer = useSelector(state => state.auth);
  const { infos } = route.params;

  const vehicleData = infos.vehicle;

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

  const handleNotification = (type, vehicle) => {
    Notifications.scheduleNotificationAsync({
      content: {
        title: type,
        body: vehicle,
      },
      trigger: 2,
    });
  }


  const [isVibration, setIsVibration] = useState(true);
  const [isMovement, setIsMovement] = useState(false);
  const [isStop, setIsStop] = useState(false);
  const [isEnterGeofence, setIsEnterGeofence] = useState(true);
  const [isExitGeofence, setIsExitGeofence] = useState(false);
  const [isOverspeed, setIsOverspeed] = useState(true);
  const [isNotinRoute, setIsNotinRoute] = useState(false);
  const [isEngineON, setIsEngineON] = useState(true);
  const [isEngineOFF, setIsEngineOFF] = useState(false);
  const [isFuelTank1Low, setIsFuelTank1Low] = useState(true);
  const [isTemperatureLow, setIsTemperatureLow] = useState(false);
  const [isFuelTank2Low, setIsFuelTank2Low] = useState(false);
  const [isRefueled, setIsRefueled] = useState(true);
  const [isBatteryLow, setIsBatteryLow] = useState(false);
  const [isDeviceDisconnected, setIsDeviceDisconnected] = useState(false);
  const [isDeviceconnected, setIsDeviceconnected] = useState(true);
  const [isTowingDetection, setIsTowingDetection] = useState(false);
  const [isCrashDetection, setIsCrashDetection] = useState(true);
  const [isFuelTank3Low, setIsFuelTank3Low] = useState(false);
  const [isFuelTheft, setIsFuelTheft] = useState(false);
  const [isDoorStatus, setIsDoorStatus] = useState(true);
  const [isDigitalInputHIGH, setIsDigitalInputHIGH] = useState(true);

  const toggleVibration = () => {
    console.log(">>>>>>>>>Vibration")
    handleNotification("1","2");
    setIsVibration(previousState => !previousState)
  };
  
  const toggleMovement = () => setIsMovement(previousState => !previousState);
  const toggleStop = () => setIsStop(previousState => !previousState);
  const toggleEnterGeofence = () => setIsEnterGeofence(previousState => !previousState);
  const toggleExitGeofence = () => setIsExitGeofence(previousState => !previousState);
  const toggleOverspeed = () => setIsOverspeed(previousState => !previousState);
  const toggleNotinRoute = () => setIsNotinRoute(previousState => !previousState);
  const toggleEngineON = () => setIsEngineON(previousState => !previousState);
  const toggleEngineOFF = () => setIsEngineOFF(previousState => !previousState);
  const toggleFuelTank1Low = () => setIsFuelTank1Low(previousState => !previousState);
  const toggleTemperatureLow = () => setIsTemperatureLow(previousState => !previousState);
  const toggleFuelTank2Low = () => setIsFuelTank2Low(previousState => !previousState);
  const toggleRefueled = () => setIsRefueled(previousState => !previousState);
  const toggleBatteryLow = () => setIsBatteryLow(previousState => !previousState);
  const toggleDeviceDisconnected = () => setIsDeviceDisconnected(previousState => !previousState);
  const toggleDeviceconnected = () => setIsDeviceconnected(previousState => !previousState);
  const toggleTowingDetection = () => setIsTowingDetection(previousState => !previousState);
  const toggleCrashDetection = () => setIsCrashDetection(previousState => !previousState);
  const toggleFuelTank3Low = () => setIsFuelTank3Low(previousState => !previousState);
  const toggleFuelTheft = () => setIsFuelTheft(previousState => !previousState);
  const toggleDigitalInputHIGH = () => setIsDigitalInputHIGH(previousState => !previousState);
  const toggleDoorStatus = () => setIsDoorStatus(previousState => !previousState);
  

  useFocusEffect(React.useCallback(() => {
    // setIsVibration(vehicleData.isVibration);
    // setIsMovement(vehicleData.isMovement);
    // setIsStop(vehicleData.isStop);
    // setIsEnterGeofence(vehicleData.isEnterGeofence);
    // setIsExitGeofence(vehicleData.isExitGeofence);
    // setIsOverspeed(vehicleData.isOverspeed);
    // setIsNotinRoute(vehicleData.isNotinRoute);
    // setIsEngineON(vehicleData.isEngineON);
    // setIsEngineOFF(vehicleData.isEngineOFF);
    // setIsFuelTank1Low(vehicleData.isFuelTank1Low);
    // setIsTemperatureLow(vehicleData.isTemperatureLow);
    // setIsFuelTank2Low(vehicleData.isFuelTank2Low);
    // setIsRefueled(vehicleData.isRefueled);
    // setIsBatteryLow(vehicleData.isBatteryLow);
    // setIsDeviceDisconnected(vehicleData.isDeviceDisconnected);
    // setIsDeviceconnected(vehicleData.isDeviceconnected);
    // setIsTowingDetection(vehicleData.isTowingDetection);
    // setIsCrashDetection(vehicleData.isCrashDetection);
    // setIsFuelTank3Low(vehicleData.isFuelTank3Low);
    // setIsFuelTheft(vehicleData.isFuelTheft);
    // setIsDigitalInputHIGH(vehicleData.isDigitalInputHIGH);
  }, []));

  const handleConfirm = () => {
  };

  const [isKeepLoggedIn, setIsKeepLoggedIn] = useState(true);
  const switchTranslateX = useState(new Animated.Value(20))[0];
  const handleToggle = () => {
    setIsKeepLoggedIn(!isKeepLoggedIn);
    Animated.timing(switchTranslateX, {
      toValue: isKeepLoggedIn ? 0 : 20,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };


  return (
    <View style={styles.v1}>
      <Header screenName={t('notifications_settings')} back="true" curNavigation={navigation}></Header>
      <Text style={{position:'absolute', top:45, fontSize:24, fontWeight:'bold', color:'white', alignSelf:'center',
        textAlign:'center', width:100}}>{infos.vehicle.vehicleName}</Text>
        <View style={{height:hp('100%')-220}}>
        <ScrollView
        scrollEnabled={true}
      >
        <View style={styles.v2}>
          <Text style={styles.vTxt}>{t('vibration')}</Text>
          <TouchableOpacity activeOpacity={0.8} onPress={toggleVibration}>
            {isVibration ? 
            <Image source={require('../../../assets/switch_on.png')} style={{alignSelf:'flex-end', width:80, height:40, resizeMode:'contain'}} />
            :
            <Image source={require('../../../assets/switch_off.png')} style={{right:5, alignSelf:'flex-end', width:80, height:40, resizeMode:'contain'}} />
            }
           </TouchableOpacity>
        </View>
        <View style={styles.v2}>
          <Text style={styles.vTxt}>{t('movement')}</Text>
          <TouchableOpacity activeOpacity={0.8} onPress={toggleMovement}>
            {isMovement ? 
            <Image source={require('../../../assets/switch_on.png')} style={{alignSelf:'flex-end', width:80, height:40, resizeMode:'contain'}} />
            :
            <Image source={require('../../../assets/switch_off.png')} style={{right:5, alignSelf:'flex-end', width:80, height:40, resizeMode:'contain'}} />
            }
           </TouchableOpacity>
        </View>
        <View style={styles.v2}>
          <Text style={styles.vTxt}>{t('stop')}</Text>
          <TouchableOpacity activeOpacity={0.8} onPress={toggleStop}>
            {isStop ? 
            <Image source={require('../../../assets/switch_on.png')} style={{alignSelf:'flex-end', width:80, height:40, resizeMode:'contain'}} />
            :
            <Image source={require('../../../assets/switch_off.png')} style={{right:5, alignSelf:'flex-end', width:80, height:40, resizeMode:'contain'}} />
            }
           </TouchableOpacity>
        </View>
        <View style={styles.v2}>
          <Text style={styles.vTxt}>{t('enter_geofence')}</Text>
          <TouchableOpacity activeOpacity={0.8} onPress={toggleEnterGeofence}>
            {isEnterGeofence ? 
            <Image source={require('../../../assets/switch_on.png')} style={{alignSelf:'flex-end', width:80, height:40, resizeMode:'contain'}} />
            :
            <Image source={require('../../../assets/switch_off.png')} style={{right:5, alignSelf:'flex-end', width:80, height:40, resizeMode:'contain'}} />
            }
           </TouchableOpacity>
        </View>
        <View style={styles.v2}>
          <Text style={styles.vTxt}>{t('exit_geofence')}</Text>
          <TouchableOpacity activeOpacity={0.8} onPress={toggleExitGeofence}>
            {isExitGeofence ? 
            <Image source={require('../../../assets/switch_on.png')} style={{alignSelf:'flex-end', width:80, height:40, resizeMode:'contain'}} />
            :
            <Image source={require('../../../assets/switch_off.png')} style={{right:5, alignSelf:'flex-end', width:80, height:40, resizeMode:'contain'}} />
            }
           </TouchableOpacity>
        </View>
        <View style={styles.v2}>
          <Text style={styles.vTxt}>{t('overspeed')}</Text>
          <TouchableOpacity activeOpacity={0.8} onPress={toggleOverspeed}>
            {isOverspeed ? 
            <Image source={require('../../../assets/switch_on.png')} style={{alignSelf:'flex-end', width:80, height:40, resizeMode:'contain'}} />
            :
            <Image source={require('../../../assets/switch_off.png')} style={{right:5, alignSelf:'flex-end', width:80, height:40, resizeMode:'contain'}} />
            }
           </TouchableOpacity>
        </View>
        <View style={styles.v2}>
          <Text style={styles.vTxt}>{t('not_in_route')}</Text>
          <TouchableOpacity activeOpacity={0.8} onPress={toggleNotinRoute}>
            {isNotinRoute ? 
            <Image source={require('../../../assets/switch_on.png')} style={{alignSelf:'flex-end', width:80, height:40, resizeMode:'contain'}} />
            :
            <Image source={require('../../../assets/switch_off.png')} style={{right:5, alignSelf:'flex-end', width:80, height:40, resizeMode:'contain'}} />
            }
           </TouchableOpacity>
        </View>
        <View style={styles.v2}>
          <Text style={styles.vTxt}>{t('engine_on')}</Text>
          <TouchableOpacity activeOpacity={0.8} onPress={toggleEngineON}>
            {isEngineON ? 
            <Image source={require('../../../assets/switch_on.png')} style={{alignSelf:'flex-end', width:80, height:40, resizeMode:'contain'}} />
            :
            <Image source={require('../../../assets/switch_off.png')} style={{right:5, alignSelf:'flex-end', width:80, height:40, resizeMode:'contain'}} />
            }
           </TouchableOpacity>
        </View>
        <View style={styles.v2}>
          <Text style={styles.vTxt}>{t('engine_off')}</Text>
          <TouchableOpacity activeOpacity={0.8} onPress={toggleEngineOFF}>
            {isEngineOFF ? 
            <Image source={require('../../../assets/switch_on.png')} style={{alignSelf:'flex-end', width:80, height:40, resizeMode:'contain'}} />
            :
            <Image source={require('../../../assets/switch_off.png')} style={{right:5, alignSelf:'flex-end', width:80, height:40, resizeMode:'contain'}} />
            }
           </TouchableOpacity>
        </View>
        <View style={styles.v2}>
          <Text style={styles.vTxt}>{t('fuel_tank1_low')}</Text>
          <TouchableOpacity activeOpacity={0.8} onPress={toggleFuelTank1Low}>
            {isFuelTank1Low ? 
            <Image source={require('../../../assets/switch_on.png')} style={{alignSelf:'flex-end', width:80, height:40, resizeMode:'contain'}} />
            :
            <Image source={require('../../../assets/switch_off.png')} style={{right:5, alignSelf:'flex-end', width:80, height:40, resizeMode:'contain'}} />
            }
           </TouchableOpacity>
        </View>
        <View style={styles.v2}>
          <Text style={styles.vTxt}>{t('fuel_tank2_low')}</Text>
          <TouchableOpacity activeOpacity={0.8} onPress={toggleFuelTank2Low}>
            {isFuelTank2Low ? 
            <Image source={require('../../../assets/switch_on.png')} style={{alignSelf:'flex-end', width:80, height:40, resizeMode:'contain'}} />
            :
            <Image source={require('../../../assets/switch_off.png')} style={{right:5, alignSelf:'flex-end', width:80, height:40, resizeMode:'contain'}} />
            }
           </TouchableOpacity>
        </View>
        <View style={styles.v2}>
          <Text style={styles.vTxt}>{t('fuel_tank3_low')}</Text>
          <TouchableOpacity activeOpacity={0.8} onPress={toggleFuelTank3Low}>
            {isFuelTank3Low ? 
            <Image source={require('../../../assets/switch_on.png')} style={{alignSelf:'flex-end', width:80, height:40, resizeMode:'contain'}} />
            :
            <Image source={require('../../../assets/switch_off.png')} style={{right:5, alignSelf:'flex-end', width:80, height:40, resizeMode:'contain'}} />
            }
           </TouchableOpacity>
        </View>
        <View style={styles.v2}>
          <Text style={styles.vTxt}>{t('refueled')}</Text>
          <TouchableOpacity activeOpacity={0.8} onPress={toggleRefueled}>
            {isRefueled ? 
            <Image source={require('../../../assets/switch_on.png')} style={{alignSelf:'flex-end', width:80, height:40, resizeMode:'contain'}} />
            :
            <Image source={require('../../../assets/switch_off.png')} style={{right:5, alignSelf:'flex-end', width:80, height:40, resizeMode:'contain'}} />
            }
           </TouchableOpacity>
        </View>
        <View style={styles.v2}>
          <Text style={styles.vTxt}>{t('temperature_low')}</Text>
          <TouchableOpacity activeOpacity={0.8} onPress={toggleTemperatureLow}>
            {isTemperatureLow ? 
            <Image source={require('../../../assets/switch_on.png')} style={{alignSelf:'flex-end', width:80, height:40, resizeMode:'contain'}} />
            :
            <Image source={require('../../../assets/switch_off.png')} style={{right:5, alignSelf:'flex-end', width:80, height:40, resizeMode:'contain'}} />
            }
           </TouchableOpacity>
        </View>
        <View style={styles.v2}>
          <Text style={styles.vTxt}>{t('device_disconnected')}</Text>
          <TouchableOpacity activeOpacity={0.8} onPress={toggleDeviceDisconnected}>
            {isDeviceDisconnected ? 
            <Image source={require('../../../assets/switch_on.png')} style={{alignSelf:'flex-end', width:80, height:40, resizeMode:'contain'}} />
            :
            <Image source={require('../../../assets/switch_off.png')} style={{right:5, alignSelf:'flex-end', width:80, height:40, resizeMode:'contain'}} />
            }
           </TouchableOpacity>
        </View>
        <View style={styles.v2}>
          <Text style={styles.vTxt}>{t('device_connected')}</Text>
          <TouchableOpacity activeOpacity={0.8} onPress={toggleDeviceconnected}>
            {isDeviceconnected ? 
            <Image source={require('../../../assets/switch_on.png')} style={{alignSelf:'flex-end', width:80, height:40, resizeMode:'contain'}} />
            :
            <Image source={require('../../../assets/switch_off.png')} style={{right:5, alignSelf:'flex-end', width:80, height:40, resizeMode:'contain'}} />
            }
           </TouchableOpacity>
        </View>
        <View style={styles.v2}>
          <Text style={styles.vTxt}>{t('towing_detection')}</Text>
          <TouchableOpacity activeOpacity={0.8} onPress={toggleTowingDetection}>
            {isTowingDetection ? 
            <Image source={require('../../../assets/switch_on.png')} style={{alignSelf:'flex-end', width:80, height:40, resizeMode:'contain'}} />
            :
            <Image source={require('../../../assets/switch_off.png')} style={{right:5, alignSelf:'flex-end', width:80, height:40, resizeMode:'contain'}} />
            }
           </TouchableOpacity>
        </View>
        <View style={styles.v2}>
          <Text style={styles.vTxt}>{t('crash_detected')}</Text>
          <TouchableOpacity activeOpacity={0.8} onPress={toggleCrashDetection}>
            {isCrashDetection ? 
            <Image source={require('../../../assets/switch_on.png')} style={{alignSelf:'flex-end', width:80, height:40, resizeMode:'contain'}} />
            :
            <Image source={require('../../../assets/switch_off.png')} style={{right:5, alignSelf:'flex-end', width:80, height:40, resizeMode:'contain'}} />
            }
           </TouchableOpacity>
        </View>
        <View style={styles.v2}>
          <Text style={styles.vTxt}>{t('fuel_theft')}</Text>
          <TouchableOpacity activeOpacity={0.8} onPress={toggleFuelTheft}>
            {isFuelTheft ? 
            <Image source={require('../../../assets/switch_on.png')} style={{alignSelf:'flex-end', width:80, height:40, resizeMode:'contain'}} />
            :
            <Image source={require('../../../assets/switch_off.png')} style={{right:5, alignSelf:'flex-end', width:80, height:40, resizeMode:'contain'}} />
            }
           </TouchableOpacity>
        </View>
        <View style={styles.v2}>
          <Text style={styles.vTxt}>{t('door_status')}</Text>
          <TouchableOpacity activeOpacity={0.8} onPress={toggleDoorStatus}>
            {isDoorStatus ? 
            <Image source={require('../../../assets/switch_on.png')} style={{alignSelf:'flex-end', width:80, height:40, resizeMode:'contain'}} />
            :
            <Image source={require('../../../assets/switch_off.png')} style={{right:5, alignSelf:'flex-end', width:80, height:40, resizeMode:'contain'}} />
            }
           </TouchableOpacity>
        </View>
        <View style={styles.v2}>
          <Text style={styles.vTxt}>{t('battery_low')}</Text>
          <TouchableOpacity activeOpacity={0.8} onPress={toggleBatteryLow}>
            {isBatteryLow ? 
            <Image source={require('../../../assets/switch_on.png')} style={{alignSelf:'flex-end', width:80, height:40, resizeMode:'contain'}} />
            :
            <Image source={require('../../../assets/switch_off.png')} style={{right:5, alignSelf:'flex-end', width:80, height:40, resizeMode:'contain'}} />
            }
           </TouchableOpacity>
        </View>

      </ScrollView>
        </View>
    

      <TouchableOpacity
        onPress={() => { handleConfirm() }}>
        <View style={{}}>
        <Image source={require('../../../assets/save_btn.png')}
            style={{alignSelf:'center', width:wp('75%'), height:55, marginTop:10,
            resizeMode:'contain'}} />
        <Text style={{bottom:45, fontSize: 19, fontWeight: 'bold', color: 'white', textAlign:'center', }}>{t("save")}</Text>
      </View>
      </TouchableOpacity>
{/* 
      <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'white', backgroundColor:"#364153", width:wp('75%'), textAlign:'center', }}>{t("save")}</Text>

      <TouchableOpacity style={{borderRadius:12, alignSelf:'center', alignItems: 'center', justifyContent:'center', backgroundColor:'#364153', width:wp('75%'), height:50,marginTop:11,marginBottom:23}} 
        onPress={() => { handleConfirm() }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'white', textAlign:'center', }}>{t("save")}</Text>
      </TouchableOpacity> */}

    </View>
  );
}

const styles = StyleSheet.create({
  v1: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  v2: {
    width:wp('97%'),
    height:33,
    marginTop:5,
    alignSelf:'center',
    justifyContent:'center',
    backgroundColor:'#EEF0F5',
    borderRadius:8,
    elevation:10,
    shadowColor:'rgba(0,0,0,0.25)'
  },
  vTxt: {
    fontSize:14, color:'#000000', fontWeight:'500',
    position:'absolute',left:14,    
  },
  vSwitch: {
    position:'absolute',right:5  
  },
  switch: {
    transform: [{ scaleX: 2 }, { scaleY: 1 }]
  },
  switchContainer: {
    marginRight:30,
    width: 26,
    height: 12,
    borderRadius: 10,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    paddingHorizontal: 4,
    alignSelf:'flex-end',
  },
  switchContainerActive: {
    backgroundColor: '#D01400',
  },
  switchHandle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#fff',
  },
});
