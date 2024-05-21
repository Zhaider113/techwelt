import React, {useState, useEffect} from "react";
import { TouchableOpacity, View, Text, ScrollView, StatusBar, StyleSheet, Image } from "react-native";
import Header from "../Header";
import moment from 'moment';
import {useTranslation} from "react-i18next";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useSelector, useDispatch } from 'react-redux';

export default function Vehicle_Detail({ navigation, route }) {
  const {t} = useTranslation();
  let { infos, index } = route.params;
  const authReducer = useSelector(state => state.auth);
  const [teltonika, setTeltonika] = useState([]);
  const [transDate, setTransDate] = useState();
  const [stopTime, setStopTime] = useState();
  const [iccid, setIccid] = useState();
  useEffect(() => {
    setTeltonika(infos.vehicle?.teltonikas[infos?.vehicle?.teltonikas?.length - 1]);

    if(infos.vehicle.teltonikas[infos.vehicle.teltonikas.length - 1]?.transferDate.length>15) {
      setTransDate(moment(infos.vehicle.teltonikas[infos.vehicle.teltonikas.length - 1]?.transferDate.substring(11,13) +
      + ":" + infos.vehicle.teltonikas[infos.vehicle.teltonikas.length - 1]?.transferDate.substring(14,16), "HH:mm").format("hh:mm A") +  "   " + infos.vehicle.teltonikas[infos.vehicle.teltonikas.length - 1]?.transferDate.substring(8,10) + 
      "-" + infos.vehicle.teltonikas[infos.vehicle.teltonikas.length - 1]?.transferDate.substring(5,7) +
      "-" + infos.vehicle.teltonikas[infos.vehicle.teltonikas.length - 1]?.transferDate.substring(0,4));
    }
    if(infos.vehicle.stopTime) {
      setStopTime(moment(infos.vehicle.stopTime.substring(11,13) +
      + ":" + infos.vehicle.stopTime.substring(14,16), "HH:mm").format("hh:mm A") +  "   " + infos.vehicle.stopTime.substring(8,10) + 
      "-" + infos.vehicle.stopTime.substring(5,7) +
      "-" + infos.vehicle.stopTime.substring(0,4));
    }

    if(infos.vehicle.deviceType === "Ruptela") {
      setIccid("IMSI" + " : " + infos.vehicle.teltonikas[infos.vehicle.teltonikas.length - 1]?.imsi);
    } else {
      setIccid("ICCID" + " : " + infos.vehicle.teltonikas[infos.vehicle.teltonikas.length - 1]?.IOvalue?.
        filter(obj => obj.dataId === 11)[0]?.dataValue + infos.vehicle.teltonikas[infos.vehicle.teltonikas.length - 1]?.
          IOvalue?.filter(obj => obj.dataId === 14)[0]?.dataValue);
    }

    console.log(">>>>>>>>", infos.vehicle.stopTime)

  }, [route.params]);

  return (
    <View style={{flex:1, backgroundColor:'white'}}>
      <StatusBar backgroundColor={"#364153"} barStyle={"light-content"} />
      <Header back='true' screenName={t('vehicles_details')} curNavigation={navigation}></Header>
      <View style={{backgroundColor:'#EFF3F6', width:wp('95%'), alignSelf:'center', marginTop:10, borderRadius:8, flexDirection:'row'}}>
        <View style={{ flex: 1, flexDirection: 'column', marginLeft:10, marginRight:10}}>
          <View style={[styles.v1]}>
            <View style={styles.v3}>
              { infos.vehicle.title == "Car" ?
                <Image 
                source={require("../../../assets/type_car.png")} 
                style={{alignSelf:'center', width: 23, height: 10, resizeMode: 'contain' }}/> 
            :
              <Image 
                source={require("../../../assets/type_truck.png")} 
                style={{alignSelf:'center', width: 20, height: 12, resizeMode: 'contain' }}/> 
        }
            </View>
            <Text style={styles.title}>{t("vehicle_plate_no")} </Text>
            <View style={styles.v2}>
              <Text selectable={true} style={styles.value}>{infos.vehicle.vehicleName}</Text>
            </View>
          </View>
          <View style={styles.v1}>
            <View style={styles.v3}>
              <Image 
                source={require("../../../assets/owner_ico.png")} 
                style={{alignSelf:'center', width: 20, height: 20, resizeMode: 'contain' }}/> 
            </View>
            <Text style={styles.title}>{t("owner")} </Text>
            <View style={styles.v2}>
              <Text selectable={true} style={styles.value}>{authReducer?.user?.lname}</Text>
            </View>
          </View>
          <View style={styles.v1}>
            <View style={styles.v3}>
              <Image 
                source={require("../../../assets/device_model_ico.png")} 
                style={{alignSelf:'center', width: 20, height: 20, resizeMode: 'contain' }}/> 
            </View>
            <Text style={styles.title}>{t("device_type")} </Text>
            <View style={styles.v2}>
              <Text selectable={true} style={styles.value}>{infos.vehicle.deviceType}</Text>
            </View>
          </View>
          <View style={styles.v1}>
            <View style={styles.v3}>
              <Image 
                source={require("../../../assets/device_model_ico.png")} 
                style={{alignSelf:'center', width: 20, height: 20, resizeMode: 'contain' }}/> 
            </View>
            <Text style={styles.title}>{t("device_model")} </Text>
            <View style={styles.v2}>
              <Text selectable={true} style={styles.value}>{infos.vehicle.deviceModel}</Text>
            </View>
          </View>
          <View style={styles.v1}>
            <View style={styles.v3}>
              <Image 
                source={require("../../../assets/imei_ico.png")} 
                style={{alignSelf:'center', width: 20, height: 20, resizeMode: 'contain' }}/> 
            </View>
            <Text style={styles.title}>{t("imei")} </Text>
            <View style={styles.v2}>
              <Text selectable={true} style={styles.value}>{infos.vehicle.deviceImei}</Text>
            </View>
          </View>

          <View style={[styles.v1]}>
            <View style={styles.v3}>
              <Image 
                source={require("../../../assets/sim_ico.png")} 
                style={{alignSelf:'center', width: 20, height: 20, resizeMode: 'contain' }}/> 
            </View>
            <Text style={styles.title}>{t("sim")} </Text>
            <View style={{ flex: 1, flexDirection: 'column',alignItems: 'flex-end', justifyContent:'flex-end'}}>
              <Text selectable={true} style={styles.value}>{t("sim_no")} {infos.vehicle.mobileNo}</Text>
              <Text selectable={true} style={styles.value}>{iccid}</Text>
            </View>
          </View>

        </View>
      </View>

      <View style={{ backgroundColor:'#EFF3F6', width:wp('95%'), alignSelf:'center', marginTop:5, borderRadius:8, flexDirection:'row'}}>
        <View style={{ flex: 1, flexDirection: 'column', marginLeft:10, marginRight:10}}>
          <View style={[styles.v1]}>
            <View style={styles.v3}>
              <Image 
                source={require("../../../assets/engine_gray.png")} 
                style={{alignSelf:'center', width: 25, height: 25, resizeMode: 'contain' }}/> 
            </View>
            <Text style={styles.title}>{t("ignition_status")} </Text>
            <View style={styles.v2}>
              {infos.vehicle.teltonikas[infos.vehicle.teltonikas.length - 1]?.ignition == "1" ?
              <Text selectable={true} style={styles.value}>{t("on")}</Text>
              :
              <Text selectable={true} style={styles.value}>{t("off")}</Text>
              }
            </View>
          </View>
          <View style={styles.v1}>
            <View style={styles.v3}>
              <Image 
                source={require("../../../assets/camera_ico.png")} 
                style={{alignSelf:'center', width: 20, height: 20, resizeMode: 'contain' }}/> 
            </View>
            <Text style={styles.title} selectable={true}>{t("camera_type")} </Text>
            <View style={styles.v2}>
              <Text style={styles.value}></Text>
            </View>
          </View>
          <View style={styles.v1}>
            <View style={styles.v3}>
              <Image 
                source={require("../../../assets/store_ico.png")} 
                style={{alignSelf:'center', width: 18, height: 18, resizeMode: 'contain' }}/> 
            </View>
            <Text style={styles.title}>Stored Images </Text>
            <View style={styles.v2}>
              <Text style={{width:70, height:26, borderRadius:8, backgroundColor:'#364153', color:'white', justifyContent:'center', textAlign:'center', fontSize:16, fontWeight:'500'}}>View</Text>
            </View>
          </View>
          <View style={styles.v1}>
            <View style={styles.v3}>
              <Image 
                source={require("../../../assets/stop_ico.png")} 
                style={{alignSelf:'center', width: 18, height: 18, resizeMode: 'contain' }}/> 
            </View>
            <Text style={styles.title}>{t("stopped_time")} </Text>
            <View style={styles.v2}>
              <Text selectable={true} style={styles.value}>{stopTime}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={()=>{
                  console.log("@@@@Vehicle Location",infos)
                  navigation.navigate("Map",{"infos" : infos})
                }}
                  >
          <View style={[styles.v1]}>
            <Image 
                source={require("../../../assets/earth_ico.png")} 
                style={{alignSelf:'center', width: 36, height: 36, resizeMode: 'contain' }}/> 
            <Text style={styles.title}>{t("address")} </Text>
            <View style={styles.v2}>
              <Text selectable={true} numberOfLines={2} style={[styles.value, {width:wp('40%'), textAlign:'right'}]}>{infos.vehicle?.address}</Text>
            </View>
          </View>
          </TouchableOpacity>
          <View style={[styles.v1]}>
            <View style={styles.v3}>
              <Image 
                source={require("../../../assets/address_ico.png")} 
                style={{alignSelf:'center', width: 20, height: 20, resizeMode: 'contain' }}/> 
            </View>
            <View>
              <Text style={styles.title}>Location</Text>
              <Text style={[styles.title,{color:'#898A8D', fontSize:10}]}>Last Updated</Text>
            </View>
            <View style={{ flex: 1, flexDirection: 'column',alignItems: 'flex-end', justifyContent:'flex-end'}}>
              <Text selectable={true} style={styles.value}>{infos.vehicle.lat}{", "}{infos.vehicle.lng}</Text>
              <Text selectable={true} style={[styles.value, {color:'#898A8D', fontSize:10}]}>
                {transDate}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  v1: {
    flexDirection: 'row',
    alignItems: 'center',
    height:(hp('100%') - 185) / 12
  },
  v2: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent:'flex-end'
  },
  v3: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#18567F21',
    justifyContent: 'center',
    alignItems: 'center'
  },
  icon: {
    marginRight: 15,
    width: 31,
    height: 31,
    resizeMode: 'contain'
  },
  title: {
    marginLeft:15,
    fontSize: 15, fontWeight:'400', color: 'black'
  },
  value: {
    fontSize: 12, fontWeight:'500', color: '#18567F',
  },
});
