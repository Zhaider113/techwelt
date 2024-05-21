import React, { useState, useEffect, useRef } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { NativeModules , ScrollView, View, Text, TextInput, StatusBar, StyleSheet, TouchableOpacity, Image } from "react-native";
import PhoneInput from "react-native-phone-number-input";
import SelectDropdown from 'react-native-select-dropdown'
import { IconComponentProvider, Icon } from "@react-native-material/core";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Header from "../Header";
import { useSelector, useDispatch } from 'react-redux';
import {useTranslation} from "react-i18next";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { toastr } from '../../services/navRef';
import teltonika from "../../components/Teltonika.json";
import ruptela from "../../components/Ruptela.json";
import { validDeviceImei,validPhoneNumber } from '../utils/util';
import { addVehicles } from "../../actions/vehicles";
import { usernameList } from '../../actions/user';
import { SelectList } from 'react-native-dropdown-select-list'

export default function Vehicle_Add({ navigation }) {

  const {t} = useTranslation();
  const dispatch = useDispatch()

  const authReducer = useSelector(state => state.auth);
  const userReducer = useSelector(state => state.user);
  const phoneInputRef = useRef();

  const vehicleTypeArray = [ {key:'Car', value:'Car'},
                              {key:'Truck', value:'Truck'}]
  const deviceTypeArray = [ {key:'Teltonika', value:'Teltonika'},
                            {key:'Ruptela', value:'Ruptela'}]
  const cameraTeltonikaArray = [ {key:'Dual Cam', value:'Dual Cam'},
                            {key:'ADAS', value:'ADAS'}]
  const cameraRuptelaArray = [ {key:'RS232', value:'RS232'},
                            {key:'ZMID', value:'ZMID'}]
  const [clientArray, setClientArray] = useState([]);

  const [vehicleType, setVehicleType] = useState(vehicleTypeArray[0].value);
  const [vehicleName, setVehicleName] = useState("");
  const [deviceIMEI, setDeviceIMEI] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [fullMobileNo, setFullMobileNo] = useState("");
  const [deviceType, setDeviceType] = useState(deviceTypeArray[0].value);
  const [deviceModel, setDeviceModel] = useState(teltonika[0].value);
  const [camera, setCamera] = useState("");
  const [addClient, setAddClient] = useState("");

  useEffect(() => {
    dispatch(usernameList(authReducer.token));
  }, []);

  useEffect(() => {
    if(userReducer.usernameList?.length > 0) {
      const tmpArray = userReducer.usernameList.map( (item) => {
        return {key:item.lname, value:item.lname};
      })
      setClientArray(tmpArray);
      console.log(tmpArray)
    }
  }, [userReducer.usernameList]);

  const onAdd = () => {
    console.log(addClient);
    if(vehicleName === "") {
      toastr(t("please_enter_vehicle_name"));
      return;
    }
    if(!validDeviceImei(deviceIMEI)) {
      toastr(t('please_enter_valid_IMEI'))
      return;
    }
    if(mobileNo.trim() === "") {
      toastr(t("please_enter_phone"))
      return;
    }
    
    const sendData = {
      token: authReducer.token,
      userId: authReducer.user._id,
      vehicleNo: vehicleName,
      vehicleType: vehicleType,
      deviceImei: deviceIMEI,
      deviceType: deviceType,
      deviceModel: deviceModel,
      mobileNo: "+" + phoneInputRef.current.getCallingCode() + " " + mobileNo ,
      camera: camera,
      addClient: addClient
    };
    console.log("@@MOBILE", sendData)
    // dispatch(addVehicles(sendData, navigation))
  }

  const selectDeviceType = (val) => {
    if(val !== deviceType) {
      if(val === deviceTypeArray[0].value) {
        setDeviceModel(teltonika[0].value)
        setCamera(cameraTeltonikaArray[0]);
      } else {
        setDeviceModel(ruptela[0].value)
        setCamera(cameraRuptelaArray[0]);
      }
    }
    setDeviceType(val);
  }

  const selectDeviceModel = (val) => {
    setDeviceModel(val)
  }

  const selectCamera = (val) => {
    setCamera(val)
  }
  

  return (
    <View style={{flex:1, backgroundColor:'#F1F4FA'}}>
      <StatusBar backgroundColor={"#364153"} barStyle={"light-content"} />
      <Header back='true' screenName={t('add_new_vehicle')} curNavigation={navigation}></Header>
   
    <ScrollView>
      <View style={{flexDirection:'column', justifyContent:'space-between',alignSelf:'center',alignItems:'center'}}>

        <View style={{width:wp('84.8%'), marginTop:10}}>
          <Text style={styles.inputHeader}>{t('vehicle_type')}</Text>
          <SelectList
            defaultOption={vehicleTypeArray[0]}
            arrowicon={<IconComponentProvider IconComponent={MaterialCommunityIcons}>
                        <Icon name="chevron-down" size={20} color="#484747" style={{left:13, marginTop:-3}} />
                       </IconComponentProvider>} 
            boxStyles={{ width:wp('84.8%'), marginTop:5, backgroundColor:'white', height:40, borderRadius:8, borderColor:'#A9A9A9', color:'#1E6B97'}}
            inputStyles={{height:35, color:'#1E6B97', fontSize:14, marginLeft:-5, fontWeight:'500', marginTop:-3}}
            dropdownStyles={{marginTop:0, position:'absolute', top:45, zIndex:100, backgroundColor:'white', width:120, borderColor:'#D7DEDD', borderRadius:8, color:'#1E6B97'}}
            dropdownTextStyles={{color:'#1E6B97', fontSize:14, fontWeight:'500', marginVertical:-7, marginLeft:-10}}
            setSelected={(val) => setVehicleType(val)} 
            data={vehicleTypeArray} 
          />
          {vehicleType === "Car" ?
            <Image 
              source={require("../../../assets/type_car.png")} 
              style={{alignSelf:'center', width: 35, height: 15, right:50, top:35, position:'absolute', resizeMode: 'contain' }}/> 
          :
            <Image 
              source={require("../../../assets/type_truck.png")} 
              style={{alignSelf:'center', width: 30, height: 20, right:50, top:30, position:'absolute', resizeMode: 'contain' }}/> 
          }
        </View>

        <View style={{width:wp('84.8%'), marginTop: 10}}>
          <Text style={styles.inputHeader}>{t('vehicle_name_or_plate_no')}</Text>
          <TextInput style={styles.in1} value={vehicleName} onChangeText={(val) => { setVehicleName(val) }}/>
        </View>

        <View style={{width:wp('84.8%'), marginTop: 10}}>
          <Text style={styles.inputHeader}>{t('device_imei')}</Text>
          <TextInput style={styles.in1} keyboardType='numeric' value={deviceIMEI} onChangeText={(val) => { setDeviceIMEI(val)}}/>
        </View>

        <View style={{width:wp('84.8%'), marginTop:10}}>
          <Text style={styles.inputHeader}>{t('mobile_no')}</Text>
          <PhoneInput
            ref={phoneInputRef}
            containerStyle={{ width: wp('84.8%'), height:40,
            marginTop: 5, 
            borderRadius: 8, borderWidth: 1, borderColor: '#A9A9A9',
            }}
            textInputStyle={{ color:'grey', placeholderColor:'red', fontSize:16, height: 35}}
            codeTextStyle={{textAlign:'center', height: 22, marginLeft:-20 }}
            textInputProps={< TextInput maxLength={10}/>}
            textContainerStyle={{backgroundColor: 'white'}}
            keyboardType="phone-pad"
            defaultCode="US"
            placeholder=" "
            
            onChangeText={(num) => {
              setMobileNo(num);
            }}                            
            value={mobileNo}
          />
        </View>

        <View style={{width:wp('84.8%'), marginTop:10}}>
          <Text style={styles.inputHeader}>{t('device_type')}</Text>
          <SelectList
            defaultOption={deviceTypeArray[0]}
            arrowicon={<IconComponentProvider IconComponent={MaterialCommunityIcons}>
                        <Icon name="chevron-down" size={20} color="#484747" style={{left:13, marginTop:-3}} />
                       </IconComponentProvider>} 
            boxStyles={{ width:wp('84.8%'), marginTop:5, backgroundColor:'white', height:40, borderRadius:8, borderColor:'#A9A9A9', color:'#1E6B97'}}
            inputStyles={{height:35, color:'#1E6B97', fontSize:14, marginLeft:-5, fontWeight:'500', marginTop:-3}}
            dropdownStyles={{marginTop:0, position:'absolute', top:45, zIndex:100, backgroundColor:'white', width:120, borderColor:'#D7DEDD', borderRadius:8, color:'#1E6B97'}}
            dropdownTextStyles={{color:'#1E6B97', fontSize:14, fontWeight:'500', marginVertical:-7, marginLeft:-10}}
            setSelected={(val) => selectDeviceType(val)} 
            data={deviceTypeArray} 
          />
        </View>

        <View style={{width:wp('84.8%'), marginTop:10}}>
          <Text style={styles.inputHeader}>{t('device_model')}</Text>
          <SelectList
            defaultOption={deviceType === deviceTypeArray[0].value ? teltonika[0] : ruptela[0]}
            arrowicon={<IconComponentProvider IconComponent={MaterialCommunityIcons}>
                        <Icon name="chevron-down" size={20} color="#484747" style={{left:13, marginTop:-3}} />
                       </IconComponentProvider>} 
            boxStyles={{ width:wp('84.8%'), marginTop:5, backgroundColor:'white', height:40, borderRadius:8, borderColor:'#A9A9A9', color:'#1E6B97'}}
            inputStyles={{height:35, color:'#1E6B97', fontSize:14, marginLeft:-5, fontWeight:'500', marginTop:-3}}
            dropdownStyles={{marginTop:0, position:'absolute', top:45, zIndex:100, backgroundColor:'white', width:200, borderColor:'#D7DEDD', borderRadius:8, color:'#1E6B97'}}
            dropdownTextStyles={{color:'#1E6B97', fontSize:14, fontWeight:'500', marginVertical:-7, marginLeft:-10}}
            setSelected={(val) => selectDeviceModel(val)} 
            data={deviceType === deviceTypeArray[0].value ?  teltonika : ruptela} 
          />
        </View>

        <View style={{width:wp('84.8%'), marginTop:10}}>
          <Text style={styles.inputHeader}>{t('camera_optional')}</Text>
          <SelectList
            placeholder=" "
            arrowicon={<IconComponentProvider IconComponent={MaterialCommunityIcons}>
                        <Icon name="chevron-down" size={20} color="#484747" style={{left:13, marginTop:-3}} />
                       </IconComponentProvider>} 
            boxStyles={{ width:wp('84.8%'), marginTop:5, backgroundColor:'white', height:40, borderRadius:8, borderColor:'#A9A9A9', color:'#1E6B97'}}
            inputStyles={{height:35, color:'#1E6B97', fontSize:14, marginLeft:-5, fontWeight:'500', marginTop:-3}}
            dropdownStyles={{marginTop:0, position:'absolute', top:45, zIndex:100, backgroundColor:'white', width:120, borderColor:'#D7DEDD', borderRadius:8, color:'#1E6B97'}}
            dropdownTextStyles={{color:'#1E6B97', fontSize:14, fontWeight:'500', marginVertical:-7, marginLeft:-10}}
            setSelected={(val) => selectCamera(val)} 
            data={deviceType === deviceTypeArray[0].value ? cameraTeltonikaArray : cameraRuptelaArray} 
          />
        </View>

        <View style={{width:wp('84.8%'), marginTop:10}}>
          <Text style={styles.inputHeader}>{t('add_to_client')}</Text>
          <SelectList
            placeholder=" "
            arrowicon={<IconComponentProvider IconComponent={MaterialCommunityIcons}>
                        <Icon name="chevron-down" size={20} color="#484747" style={{left:13, marginTop:-3}} />
                       </IconComponentProvider>} 
            boxStyles={{ width:wp('84.8%'), marginTop:5, backgroundColor:'white', height:40, borderRadius:8, borderColor:'#A9A9A9', color:'#1E6B97'}}
            inputStyles={{height:35, color:'#1E6B97', fontSize:14, marginLeft:-5, fontWeight:'500', marginTop:-3}}
            dropdownStyles={{marginTop:0, position:'absolute', top:45, zIndex:100, backgroundColor:'white', width:120, borderColor:'#D7DEDD', borderRadius:8, color:'#1E6B97'}}
            dropdownTextStyles={{color:'#1E6B97', fontSize:14, fontWeight:'500', marginVertical:-7, marginLeft:-10}}
            setSelected={(val) => setAddClient(val)} 
            data={clientArray} 
          />
          {/* <SelectDropdown
            defaultValue=" "
            defaultDropdownIconColor="#007aff"
            data={userReducer.usernameList.map(item => item.lname)}
            onSelect={(selectedItem, index) => {
                setAddClient(selectedItem)
            }}
            buttonTextAfterSelection={(selectedItem, index) => {
                return selectedItem
            }}
            rowTextForSelection={(item, index) => {
                return item
            }}
            renderDropdownIcon={isOpened => {
              return(
                <IconComponentProvider IconComponent={MaterialCommunityIcons} >
                  <Icon name="chevron-down" size={20} color="#484747" />
                </IconComponentProvider>
              );
            }}
            dropdownStyle={{ backgroundColor: '#e6f5ff', width:wp('84.8%'), borderRadius: 15 ,justifyContent:'center'}}
            itemTextStyle={{ textAlign: 'left' }}
            buttonStyle={styles.dropdown}
            buttonTextStyle={{ color:'#1E6B97', fontSize: 14, fontWeight:'500', textAlign: 'left' }}
          /> */}
        </View>

        <TouchableOpacity style={{flexDirection: 'row', borderRadius:10, marginTop: 25, marginBottom: 50, justifyContent:'center',  
            alignSelf:'center', alignItems: 'center', backgroundColor:'#364153', width:wp('84.8%'), 
            height:40,}} onPress={() => { onAdd() }}>
          <Text style={{ fontSize: 15, fontWeight: 'bold', color: 'white',
            textAlign:'center' }}>{t("add_vehicle")}</Text>
        </TouchableOpacity>

      </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  v1: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: 'space-between',
  },
  v4: {
    flexDirection: "row",
    alignItems: 'center',
    alignSelf: 'center',
    borderWidth: 1,
    marginTop: 5,
    borderColor: '#A9A9A9',
    backgroundColor: 'white',
    borderRadius: 8,
    width: wp('84.8%'),
  },
  eyeIcon: {
    width: 20,
    height: 20,
    // position:'absolute',
    right:0,
    marginHorizontal: 10,
  },
  passInput:{
    backgroundColor:'white',
    padding: 4,
    borderRadius: 8,
    width: wp('75%'),
    height: hp('4.9%'),
    paddingLeft: wp('5%'),
    marginRight: wp('37%'),
    color:'#1E6B97', fontSize:13,
    paddingLeft:15,paddingRight:15
  },
  in1: {
    height: 40,
    marginTop: 5,
    color:'#1E6B97', fontSize:14, fontWeight:'500',
    backgroundColor: 'white',
    borderRadius: 8, borderWidth: 1, borderColor: '#A9A9A9',
    paddingLeft: 15, paddingRight: 15
  },
  inputHeader: {
    fontSize: 11, 
    color: '#333',
    fontWeight:'500'
  },
  dropdown: {
    marginTop:5,
    height: 40,
    width:wp('85%'),
    color:'#1E6B97',
    backgroundColor: 'white',
    borderRadius: 8, borderWidth:1, borderColor:'#A9A9A9'
},
});
