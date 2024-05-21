import React, { useState, useEffect, useRef } from "react";
import { View, Image, Text, ScrollView, StatusBar, StyleSheet, TouchableOpacity, Modal, Alert } from "react-native";
import Header from "../Header";
import { IconComponentProvider, Icon } from "@react-native-material/core";
import { useSelector, useDispatch } from 'react-redux';
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useFocusEffect } from "@react-navigation/native";
import moment from 'moment';
import {useTranslation} from "react-i18next";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { TextInput } from "react-native-gesture-handler";
import { toastr } from '../../services/navRef';
import { sendCommand, deleteVehicle, setTrackingMode, setLimitSpeed, setLimitFuel, setLimitTemp } from "../../actions/vehicles";
import axios from 'axios';

export default function Vehicle_Setting({ navigation, route }) {
  const {t} = useTranslation();
  const userReducer = useSelector(state => state.auth);

  const [showTrackModal, setShowTrackModal] = useState(false);
  const [onStopVal, setOnStopVal] = useState(0);
  const [onMoveVal, setOnMoveVal] = useState(1);

  const [showSendCommandModal, setShowSendCommandModal] = useState(false);
  const [sendCmd, setSendCmd] = useState("cpurest");
  const [sendCmdDate, setSendCmdDate] = useState();
  const [responseCmdDate, setResponseCmdDate] = useState();
  

  const [showFuelModal, setShowFuelModal] = useState(false);
  const [fuelLowVal, setFuelLowVal] = useState(10);

  const [showTempModal, setShowTempdModal] = useState(false);
  const [highTempVal, setHighTempVal] = useState(20);
  const [lowTempVal, setLowTempVal] = useState(20);

  const [showSpeedModal, setShowSpeedModal] = useState(false);
  const [speedVal, setSpeedVal] = useState(100);

  const dispatch = useDispatch()

  let { infos, index } = route.params;

  useEffect(() => {
    setOnStopVal(infos?.vehicle?.onStop);
    setOnMoveVal(infos?.vehicle?.onMove);
    setSpeedVal(infos?.vehicle?.limitSpeed);
    setFuelLowVal(infos?.vehicle?.limitFuel);
    setHighTempVal(infos?.vehicle?.limitHighTemp)
    setLowTempVal(infos?.vehicle?.limitLowTemp)

    let sendDate = "";
    if(infos?.vehicle?.sendCommandDate?.length>15) {
      let transTime = infos?.vehicle?.sendCommandDate.substring(11,13) +
       + ":" + infos?.vehicle?.sendCommandDate.substring(14,16);
      let formattedTime = moment(transTime, "HH:mm").format("hh:mm A");
      sendDate = formattedTime +  "   " + infos?.vehicle?.sendCommandDate.substring(8,10) + 
        "-" + infos?.vehicle?.sendCommandDate.substring(5,7) +
        "-" + infos?.vehicle?.sendCommandDate.substring(0,4);
      setSendCmdDate(sendDate);
    }

    let responseDate = "";
    if(infos?.vehicle?.responseCommandDate?.length>15) {
      let transTime = infos?.vehicle?.responseCommandDate.substring(11,13) +
       + ":" + infos?.vehicle?.responseCommandDate.substring(14,16);
      let formattedTime = moment(transTime, "HH:mm").format("hh:mm A");
      responseDate = formattedTime +  "   " + infos?.vehicle?.responseCommandDate.substring(8,10) + 
        "-" + infos?.vehicle?.responseCommandDate.substring(5,7) +
        "-" + infos?.vehicle?.responseCommandDate.substring(0,4);
      setResponseCmdDate(responseDate);
    }

    console.log(">>>", infos?.vehicle)
  }, []);


  const handleTrackMode = () => {

  }

  const handleTrackModeModal = async () => {
    if(onStopVal.toString() === "") {
      toastr(t("please_enter_stop_value"));
      return;
    } 
    if(onMoveVal.toString() === "") {
      toastr(t("please_enter_move_value"));
      return;
    }
    setShowTrackModal(false)
    dispatch(setTrackingMode(userReducer.token, infos.vehicle.deviceImei, onStopVal, onMoveVal));

  }

  const handleSendModal = () => {
    if(sendCmd.trim() === "") {
      toastr("Please Enter Command");
      return;
    } 
    setShowSendCommandModal(false)
  }

  const handleSpeedModal = async() => {
    if(speedVal <= 0) {
      toastr("Pleaes Enter Speed Value");
      return;
    }
    setShowSpeedModal(false);
    dispatch(setLimitSpeed(userReducer.token, infos.vehicle.deviceImei, speedVal));
  }

  const handleFuelModal = async() => {
    if(fuelLowVal === "") {
      toastr(t("please_enter_fuel_low_value"));
      return;
    }
    setShowFuelModal(false);
    dispatch(setLimitFuel(userReducer.token, infos.vehicle.deviceImei, fuelLowVal));
  }

  const handleTempModal = async() => {
    if(highTempVal === "") {
      toastr(t("please_enter_high_temp_value"));
      return;
    }
    if(lowTempVal === "") {
      toastr(t("please_enter_low_temp_value"));
      return;
    }
    if(highTempVal <= lowTempVal) {
      toastr(t("high_temp_value_must_higher_than_low_temp_value"));
      return;
    }
    setShowTempdModal(false);
    dispatch(setLimitTemp(userReducer.token, infos.vehicle.deviceImei, highTempVal, lowTempVal));
  }
  const handleResetDevice = () => {
    const sendCommandData =
    {
      token: userReducer?.token,
      type: "Restart the device",
      params: "",
      devImei: infos.vehicle?.deviceImei
    }
    dispatch(sendCommand(sendCommandData));
  }

  const handleDelete = () => {
    Alert.alert(
      t('warning'),
      t('are_you_going_to_delete_this_vehicle'),
      [
        {
          text: t('yes'),
          onPress: () => handleDeleteVehicle(infos.vehicle.deviceImei),
        },
        {
          text: t('no'),
          onPress: () => console.log("cancel"),
        },
      ],
    );
  }
  const handleDeleteVehicle = (imei) => {
    // console.log(">>>>>>>>Delete", userReducer.token, userReducer.user._id, imei)
    axios.post(`https://vehtechs.com/backend/api/vehicles/remove`, {
      token: userReducer.token,
      deviceImei: imei
    })
    .then(async (response) => {
      try {
        console.log("deleteVehicle:::: then", response.data)
        navigation.goBack()
      } catch (e) { 
        console.log("deleteVehicle:::: then err", e)
      }
    }).catch((err) => {
      console.log("deleteVehicle:::: catch", err)
    });
    // dispatch(deleteVehicle(userReducer.token, userReducer.user._id, imei, navigation));
  };

  return (
    <View style={{flex:1, backgroundColor:'#F1F4FA'}}>
      <StatusBar backgroundColor={"#364153"} barStyle={"light-content"} />
      <Header back='true' screenName={t('settings')} curNavigation={navigation}></Header>
      <Text style={{alignSelf:'center', marginTop:10, fontSize:20, fontWeight:'bold', color:'#364153'}}>{infos.vehicle.vehicleName}</Text>
        
      <Modal visible={showTrackModal} animationType="slide" transparent>
        <TouchableOpacity onPress={() => setShowTrackModal(false)}>
          <View style={styles.overlay} />
        </TouchableOpacity>
        <View style={{flexDirection:'column',borderRadius:10, alignSelf:'center', marginTop:hp('50%')-100,
          padding:10, paddingBottom:10, backgroundColor:'white'}}>
          <View style={{flexDirection:'row', alignItems:'center'}}>
            <Text style={{width:70, fontSize:15, color:'#000'}}>On Stop</Text>
            <TextInput keyboardType="numeric" value={onStopVal.toString()} onChangeText={(val) => { setOnStopVal(val) }} style={{textAlign:'center', width:120, height:30, borderWidth:1, borderRadius:8, color:'black',
                fontSize:18, fontWeight:'500', borderColor:'#18567F'}}></TextInput>
            <Text style={{width:30, fontSize:15, color:'#000', marginLeft:10}}>Sec</Text>
          </View>
          <Text style={{alignSelf:'center', fontSize:10, fontWeight:'500', marginLeft:30, marginTop:5, marginBottom:5}}>0 - 2592000</Text>
          <View style={{flexDirection:'row', alignItems:'center'}}>
            <Text style={{width:70, fontSize:15, color:'#000'}}>On Move</Text>
            <TextInput keyboardType="numeric" value={onMoveVal.toString()} onChangeText={(val) => { setOnMoveVal(val) }} style={{textAlign:'center', width:120, height:30, borderWidth:1, borderRadius:8, color:'black',
                fontSize:18, fontWeight:'500', borderColor:'#18567F'}}></TextInput>
            <Text style={{width:30, fontSize:15, color:'#000', marginLeft:10}}>Sec</Text>
          </View>
          <TouchableOpacity onPress={() => handleTrackModeModal()}>
            <Text style={{width:170, height:40, alignSelf:'center', backgroundColor:'#364153', fontSize:18, fontWeight:'500',
                        borderRadius:8, color:'white', paddingTop:7, textAlign:'center', marginTop:10}}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal visible={showSendCommandModal} animationType="slide" transparent>
        <TouchableOpacity onPress={() => setShowSendCommandModal(false)}>
          <View style={styles.overlay} />
        </TouchableOpacity>
        <View style={{flexDirection:'column',borderRadius:10, alignSelf:'center', marginTop:hp('50%')-100,
          padding:10, paddingBottom:10, backgroundColor:'white'}}>
          <TextInput value={sendCmd} onChangeText={(val)=>setSendCmd(val)} style={{textAlign:'center', width:200, height:40, 
          fontSize:14, fontWeight:'500', color:'black', borderColor:'#18567F', borderRadius:8, borderWidth:1}}></TextInput>
          <TouchableOpacity onPress={handleSendModal}>
            <Text style={{width:170, height:40, alignSelf:'center', backgroundColor:'#364153', fontSize:18, fontWeight:'500',
                        borderRadius:8, color:'white', paddingTop:7, paddingRight:40, textAlign:'center', marginTop:10}}>Send</Text>
            <Image 
              source={require("../../../assets/sendcmd_ico.png")} 
              style={{position:'absolute', width:20, height:20, resizeMode:'contain', left:120, top:20}}/> 
          </TouchableOpacity>
        </View>
      </Modal>


      <Modal visible={showSpeedModal} animationType="slide" transparent>
        <TouchableOpacity onPress={() => setShowSpeedModal(false)}>
          <View style={styles.overlay} />
        </TouchableOpacity>
        <View style={{flexDirection:'column',borderRadius:10, alignSelf:'center', marginTop:hp('50%')-100,
          padding:10, paddingBottom:10, backgroundColor:'white'}}>
          <Text style={{width:120, fontSize:14, fontWeight:'500', color:'#000'}}>Speed Alert</Text>
          <View style={{flexDirection:'row', alignItems:'center', marginTop:10}}>
            <TextInput keyboardType="numeric" value={speedVal.toString()} onChangeText={(val) => { setSpeedVal(val) }}
              style={{textAlign:'center', width:70, marginLeft:60, height:25, borderWidth:1, borderRadius:8, color:'black',
                fontSize:15, fontWeight:'500', borderColor:'#18567F'}}></TextInput>
            <Text style={{width:50, fontSize:14, fontWeight:'500', color:'#000', marginLeft:10}}>Km/h</Text>
          </View>
          <TouchableOpacity onPress={() => handleSpeedModal()}>
            <Text style={{width:170, height:40, alignSelf:'center', backgroundColor:'#364153', fontSize:18, fontWeight:'500',
                        borderRadius:8, color:'white', paddingTop:7, textAlign:'center', marginTop:10}}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal visible={showFuelModal} animationType="slide" transparent>
        <TouchableOpacity onPress={() => setShowFuelModal(false)}>
          <View style={styles.overlay} />
        </TouchableOpacity>
        <View style={{flexDirection:'column',borderRadius:10, alignSelf:'center', marginTop:hp('50%')-100,
          padding:10, paddingBottom:10, backgroundColor:'white'}}>
          <Text style={{width:120, fontSize:14, fontWeight:'500', color:'#000'}}>Fuel Level Alert</Text>
          <View style={{flexDirection:'row', alignItems:'center', marginTop:10}}>
            <TextInput keyboardType="numeric" value={fuelLowVal.toString()} onChangeText={(val) => { setFuelLowVal(val) }}
              style={{textAlign:'center', width:70, marginLeft:60, height:25, borderWidth:1, borderRadius:8, color:'black',
                fontSize:15, fontWeight:'500', borderColor:'#18567F'}}></TextInput>
            <Text style={{width:50, fontSize:14, fontWeight:'500', color:'#000', marginLeft:10}}>Litres</Text>
          </View>
          <TouchableOpacity onPress={handleFuelModal}>
            <Text style={{width:170, height:40, alignSelf:'center', backgroundColor:'#364153', fontSize:18, fontWeight:'500',
                        borderRadius:8, color:'white', paddingTop:7, textAlign:'center', marginTop:10}}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal visible={showTempModal} animationType="slide" transparent>
        <TouchableOpacity onPress={() => setShowTempdModal(false)}>
          <View style={styles.overlay} />
        </TouchableOpacity>
        <View style={{flexDirection:'column',borderRadius:10, alignSelf:'center', marginTop:hp('50%')-100,
          padding:10, paddingBottom:10, backgroundColor:'white'}}>
          <View style={{flexDirection:'row', alignItems:'center'}}>
            <Text style={{width:80, fontSize:15, color:'#000'}}>High Temp</Text>
            <TextInput keyboardType="numeric" value={highTempVal.toString()} onChangeText={(val) => { setHighTempVal(val) }} style={{textAlign:'center', width:120, height:30, borderWidth:1, borderRadius:8, color:'black',
                fontSize:18, fontWeight:'500', borderColor:'#18567F'}}></TextInput>
            <Text style={{width:30, fontSize:15, color:'#000', marginLeft:10}}>C</Text>
          </View>
          <View style={{flexDirection:'row', alignItems:'center', marginTop:10}}>
            <Text style={{width:80, fontSize:15, color:'#000'}}>Low Temp</Text>
            <TextInput keyboardType="numeric" value={lowTempVal.toString()} onChangeText={(val) => { setLowTempVal(val) }} style={{textAlign:'center', width:120, height:30, borderWidth:1, borderRadius:8, color:'black',
                fontSize:18, fontWeight:'500', borderColor:'#18567F'}}></TextInput>
            <Text style={{width:30, fontSize:15, color:'#000', marginLeft:10}}>C</Text>
          </View>
          <TouchableOpacity onPress={handleTempModal}>
            <Text style={{width:170, height:40, alignSelf:'center', backgroundColor:'#364153', fontSize:18, fontWeight:'500',
                        borderRadius:8, color:'white', paddingTop:7, textAlign:'center', marginTop:10}}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <ScrollView>
        <View style={{ flex: 1, flexDirection: 'column', marginTop: 20 }}>
          <TouchableOpacity style={styles.v3} onPress={() => setShowTrackModal(true)}>
            <View style={styles.v5}>
              <Image 
                source={require("../../../assets/tracking_mode.png")} 
                style={styles.img}/> 
              <Text style={styles.v6}>{t('tracking_mode')}</Text>
            </View>
            <View style={{marginRight:10,justifyContent:'center', flexDirection:'column'}}>
              <Text style={{fontSize:13, fontWeight:'500', color:'#18567F'}}>Stop: {onStopVal}sec</Text>
              <Text style={{fontSize:13, fontWeight:'500', color:'#18567F'}}>Move: {onMoveVal}sec</Text>
            </View>
            <View style={{justifyContent:'center'}}>
              <IconComponentProvider IconComponent={MaterialCommunityIcons}>
                <Icon name="chevron-right" size={25} color="#000000"/>
              </IconComponentProvider>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.v3}>
            <View style={styles.v5}>
              <Image 
                source={require("../../../assets/notify_setting.png")} 
                style={styles.img}/> 
              <Text style={styles.v6}>{t('notifications_settings')}</Text>
            </View>
            <View style={{justifyContent:'center'}}>
              <IconComponentProvider IconComponent={MaterialCommunityIcons}>
                <Icon name="chevron-right" size={25} color="#000000"/>
              </IconComponentProvider>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.v3}>
            <View style={styles.v5}>
              <Image 
                source={require("../../../assets/bluetooth_device.png")} 
                style={styles.img}/> 
              <Text style={styles.v6}>{t('bluetooth_devices')}</Text>
            </View>
            <View style={{justifyContent:'center'}}>
              <IconComponentProvider IconComponent={MaterialCommunityIcons}>
                <Icon name="chevron-right" size={25} color="#000000"/>
              </IconComponentProvider>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.v3}>
            <View style={styles.v5}>
              <Image 
                source={require("../../../assets/trips.png")} 
                style={styles.img}/> 
              <Text style={styles.v6}>{t('trips')}</Text>
            </View>
            <View style={{justifyContent:'center'}}>
              <IconComponentProvider IconComponent={MaterialCommunityIcons}>
                <Icon name="chevron-right" size={25} color="#000000"/>
              </IconComponentProvider>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.v3} onPress={() => setShowSendCommandModal(true)}>
            <View style={styles.v5}>
              <Image 
                source={require("../../../assets/send_command.png")} 
                style={styles.img}/> 
              <View style={{flexDirection:'column', width:200}}>
                <Text style={{fontSize:14, fontWeight:'500', marginLeft:15}}>{t('redemarer')}</Text>
                <Text style={{fontSize:14, fontWeight:'500', color:'#898A8D', marginLeft:15}}>{sendCmdDate}</Text>
              </View>
            </View>
            <View style={{position:'absolute', right:0}}>
              <IconComponentProvider IconComponent={MaterialCommunityIcons}>
                <Icon name="chevron-right" size={25} color="#000000"/>
              </IconComponentProvider>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.v3}>
            <View style={styles.v5}>
              <Image 
                source={require("../../../assets/send_command.png")} 
                style={styles.img}/> 
              <View style={{flexDirection:'column', width:200}}>
                <Text style={{fontSize:14, fontWeight:'500', marginLeft:15}}>Last Response</Text>
                <Text style={{fontSize:14, fontWeight:'500', color:'#898A8D', marginLeft:15}}>{responseCmdDate}</Text>
              </View>
            </View>
            {/* <View style={{position:'absolute', right:0}}>
              <IconComponentProvider IconComponent={MaterialCommunityIcons}>
                <Icon name="chevron-right" size={25} color="#000000"/>
              </IconComponentProvider>
            </View> */}
          </TouchableOpacity>

          <TouchableOpacity style={styles.v3} onPress={()=> setShowSpeedModal(true)}>
            <View style={styles.v5}>
              <Image 
                source={require("../../../assets/speed_alert.png")} 
                style={styles.img}/>
              <Text style={styles.v6}>{t('speed_alert')}</Text>
              <View style={{marginRight:10,justifyContent:'center', position:'absolute', right:0, flexDirection:'column'}}>
                <Text style={{fontSize:13, fontWeight:'500', color:'#18567F'}}>{speedVal}Km/h</Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.v3} onPress={()=> setShowFuelModal(true)}>
            <View style={styles.v5}>
              <Image 
                source={require("../../../assets/fuel_level.png")} 
                style={styles.img}/> 
              <Text style={styles.v6}>{t('fuel_low_level')}</Text>
              <View style={{marginRight:10,justifyContent:'center', position:'absolute', right:0, flexDirection:'column'}}>
                <Text style={{fontSize:13, fontWeight:'500', color:'#18567F'}}>{fuelLowVal} Litres</Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.v3} onPress={() => setShowTempdModal(true)}>
            <View style={styles.v5}>
              <Image 
                source={require("../../../assets/temp_ico.png")} 
                style={styles.img}/> 
              <Text style={styles.v6}>{t('temp_levels')}</Text>
            </View>
            <View style={{marginRight:10,justifyContent:'center', position:'absolute', right:0, flexDirection:'row'}}>
              <Image 
                source={require("../../../assets/arrow_up_red.png")} 
                style={{width:20, height:20, resizeMode:'contain', marginTop:7}}/> 
              <Text style={{fontSize:13, fontWeight:'500', color:'#18567F', marginLeft:5, marginTop:8}}>{lowTempVal} C</Text>
              <Image 
                source={require("../../../assets/arrow_down_green.png")} 
                style={{width:20, height:20, resizeMode:'contain', marginTop:7, marginLeft:5}}/> 
              <Text style={{fontSize:13, fontWeight:'500', color:'#18567F', marginLeft:5, marginTop:8}}>{highTempVal} C</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.v3} onPress={() => {handleResetDevice()}}>
            <View style={styles.v5}>
              <Image 
                source={require("../../../assets/reset.png")} 
                style={styles.img}/> 
              <Text style={styles.v6}>{t('reset_device')}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.v3} onPress={ () => {handleDelete()}} >
            <View style={styles.v5}>
              <Image 
                source={require("../../../assets/group_delete.png")} 
                style={styles.img}/> 
              <Text style={styles.v6}>{t('delete')}</Text>
            </View>
          </TouchableOpacity>
        </View>
        </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  v2: {
    width: 30,
    height: 30,
    borderRadius: 15,
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
    marginBottom: 15
  },
  v5: {
    flex: 1,
    flexDirection: 'row',
  },
  v6: {
    fontSize: 14, fontWeight:'500',
    marginLeft: 15,
    alignSelf:'center'
  },
  img: {
    width: 35, height: 35, resizeMode: 'contain'
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width:wp('100%'), height:hp('100%')
  },
});
