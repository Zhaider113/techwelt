import React, { useState, useEffect, useRef } from "react";
import { ScrollView, View, Text, StatusBar , TextInput, Image, StyleSheet, TouchableOpacity } from "react-native";
import PhoneInput from "react-native-phone-number-input";
import SelectDropdown from 'react-native-select-dropdown'
import { IconComponentProvider, Icon } from "@react-native-material/core";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Header from "../Header";
import { useSelector, useDispatch } from 'react-redux';
import {useTranslation} from "react-i18next";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { toastr } from '../../services/navRef';
import { validEmail,validPhoneNumber } from '../utils/util';
import { updateUser, usernameList } from "../../actions/user";
import CountryPicker, {
  getCallingCode,
  DARK_THEME,
  DEFAULT_THEME,
  CountryModalProvider,
  Flag,
  getAllCountries
} from "react-native-country-picker-modal";

import axios from 'axios';

export default function User_Edit({ navigation, route }) {

  const {t} = useTranslation();
  const dispatch = useDispatch()
  let { infos, index } = route.params;

  const authReducer = useSelector(state => state.auth);
  const phoneInputRef = useRef(null);

  const userRoleArray = ["Admin", "Manager","User"];

  const [name, setName] = useState(infos.fname);
  const [username, setUsername] = useState(infos.lname);
  const [mobileNo, setMobileNo] = useState(infos.phone.substring(infos.phone.indexOf(' ') + 1));
  const [email, setEmail] = useState(infos.email);
  
  const [countryData, setCountryData] = useState([]);

  const [address, setAddress] = useState(infos.address);
  const [userRole, setUserRole] = useState(infos.role);
  
  const [nationInfo, setNationInfo] = useState([]);

  const [showCountryPicker, setShowCountryPicker] = useState(false);

  const [countryCode, setCountryCode] = useState("US");
  const [code, setCode] = useState(infos.phone.substring(1, infos.phone.indexOf(' ')));
  const [country, setCountry] = useState();

  function sortNames(data) {
    data.sort((a, b) => a.localeCompare(b));
    return data;
  }

  useEffect(() => {
    dispatch(usernameList(authReducer.token));
    getCountrycodeFromCallCode(code);
  }, []);

  const getCountrycodeFromCallCode = async (code) => {
    const countryList = await getAllCountries();
    for (const country of countryList) {
      if (country.callingCode.includes(code)) {
        setCountryCode(country.cca2)
      }
    }
  }

  const selectedCountry = (selectedData) => {
    setCountry(selectedData);
    const selectedCities = nationInfo.find((country) => country.country === selectedData);
    // setCityData(sortNames(selectedCities.cities.map(data => data)));
    // setCity(sortNames(selectedCities.cities.map(data => data))[0]);
  }

  const onUpdate = () => {
    if(name === "") {
      toastr("Please Enter Name");
      return;
    }
    if(username === "") {
      toastr("Please Enter Username");
      return;
    }
    if(mobileNo.trim() === "") {
      toastr(t("please_enter_phone"))
      return;
    }
    if(!validEmail(email)) {
      toastr(t('invalid_email_enter'))
      return;
    }
    if(address === "") {
      toastr("Please Enter Address");
      return;
    }

    const sendData = {
      token: authReducer.token,
      userId: authReducer.user._id,
      fname: name,
      lname: username,
      email: email,
      phone: "+" + code + " " + mobileNo,
      country: country,
      // address: city,
      address: address,
      role: userRole,
      company: ""
    };
    dispatch(updateUser(sendData, navigation))
  }

  const onSelect = (country) => {
    setCountry(country.name)
    setCountryCode(country.cca2)
    setCode(country.callingCode[0])
  }

  const renderFlagButton = (props) => {
    return (
      <Flag
        countryCode={countryCode}
        flagSize={25}
      />
    );
  };

  return (
    <View style={{flex:1, backgroundColor:'#F1F4FA'}}>
      <StatusBar backgroundColor={"#364153"} barStyle={"light-content"} />
      <Header back='true' screenName={t('edit_user')} curNavigation={navigation}></Header>
   
      <ScrollView>
      <View style={{flexDirection:'column', justifyContent:'space-between',alignSelf:'center',alignItems:'center'}}>

        <View style={{width:wp('84.8%'), marginTop:10}}>
          <Text style={styles.inputHeader}>{t('name')}</Text>
          <TextInput style={styles.in1} value={name} onChangeText={(val) => { setName(val) }}/>
        </View>

        <View style={{width:wp('84.8%'), marginTop: 20}}>
          <Text style={styles.inputHeader}>{t('username')}</Text>
          <TextInput editable={false} style={styles.in1} value={username} onChangeText={(val) => { setUsername(val) }}/>
        </View>

        <View style={{width:wp('84.8%'), marginTop:20}}>
          <Text style={styles.inputHeader}>{t('mobile_no')}</Text>
          <View style={[styles.in1, {flexDirection:'row', alignItems:'center'}]}>
            <CountryModalProvider>
              <CountryPicker
                  visible={showCountryPicker}
                  onSelect={onSelect}
                  withEmoji
                  withFilter
                  withFlag
                  countryCode={countryCode}
                  renderFlagButton={renderFlagButton}
                  withCallingCode
                  onClose={() => setShowCountryPicker(false)}/>
              <Text style={{color:'#1E6B97', fontSize:16, fontWeight:'500'}}>+{code}</Text>
              <TouchableOpacity onPress={() => {setShowCountryPicker(true) }}>
                < Image source={require('../../../assets/dropdown_ico.png')} style={{height:25, width:25}} />
              </TouchableOpacity>
            </CountryModalProvider>
            <View style={{marginLeft:1, backgroundColor:'rgba(0,0,0,0.5)', width:1, height:hp('4%')}}></View>
            <TextInput style={{backgroundColor:'white', flex:1, color:'#1E6B97', fontSize:16, fontWeight:'500', marginLeft:10}} value={mobileNo}
              keyboardType="number-pad" onChangeText={(text)=>setMobileNo(text)}></TextInput>
          </View>
          {/* <PhoneInput
            ref={phoneInputRef}
            containerStyle={{ width: wp('84.8%'),
            height: hp('4.9%'),
            marginTop: 5,
            borderRadius: 8, borderWidth: 1, borderColor: '#A9A9A9',
            paddingLeft: -5, padding:5
            }}
            textInputStyle={{ color:'black', fontSize:16, height: hp('5%')}}
            codeTextStyle={{textAlign:'center', height: hp('3.3%'), marginLeft:-20 }}
            textInputProps={< TextInput maxLength={10}/>}
            textContainerStyle={{backgroundColor: 'white'}}
            placeholder="566485124"
            keyboardType="phone-pad"
            defaultCode="US"
            onChangeText={(text) => {
                setMobileNo(text);
            }}                            
            value={mobileNo}
          /> */}
        </View>

        <View style={{width:wp('84.8%'), marginTop: 15}}>
          <Text style={styles.inputHeader}>{t('email')}</Text>
          <TextInput editable={false} style={styles.in1} value={email} onChangeText={(val) => { setEmail(val)}}/>
        </View>

        <View style={{width:wp('84.8%'), marginTop:20}}>
          <Text style={styles.inputHeader}>{t('country')}</Text>
          <View style={styles.v4}>
            <SelectDropdown
              defaultValue={country}
              defaultDropdownIconColor="#007aff"
              data={countryData}
              onSelect={(selectedItem, index) => {
                  selectedCountry(selectedItem)
              }}
              buttonTextAfterSelection={(selectedItem, index) => {
                  return selectedItem
              }}
              rowTextForSelection={(item, index) => {
                  return item
              }}
              dropdownStyle={{ backgroundColor: '#e6f5ff', width:wp('84.8%'), borderRadius: 15 ,justifyContent:'center'}}
              itemTextStyle={{ textAlign: 'left' }}
              buttonStyle={styles.dropdown}
              buttonTextStyle={{ color:'#1E6B97', fontSize: 14, textAlign: 'left' }}
            />
            <View style={[styles.eyeIcon,{marginLeft: 10}]}>
              <IconComponentProvider IconComponent={MaterialCommunityIcons} >
                <Icon name="chevron-down" size={20} color="rgba(24, 86, 127, 1)" />
              </IconComponentProvider>
            </View>
          </View>
        </View>

        <View style={{width:wp('84.8%'), marginTop: 15}}>
          <Text style={styles.inputHeader}>{t('address')}</Text>
          <TextInput style={styles.in1} value={address} onChangeText={(val) => { setAddress(val)}}/>
        </View>


        <View style={{width:wp('84.8%'), marginTop:10}}>
          <Text style={styles.inputHeader}>{t('user_role')}</Text>
          <View style={styles.v4}>
            { (authReducer.user.role === "Admin" || authReducer.user.role === "Manager") ?
            <SelectDropdown
            defaultValue={userRole ? userRole : userRoleArray[0]}
            defaultDropdownIconColor="#007aff"
            data={userRoleArray}
            onSelect={(selectedItem, index) => {
                setUserRole(selectedItem)
            }}
            buttonTextAfterSelection={(selectedItem, index) => {
                // text represented after item is selected
                // if data array is an array of objects then return selectedItem.property to render after item is selected
                return selectedItem
            }}
            rowTextForSelection={(item, index) => {
                // text represented for each item in dropdown
                // if data array is an array of objects then return item.property to represent item in dropdown
                return item
            }}
            dropdownStyle={{ backgroundColor: '#e6f5ff', width:wp('84.8%'), borderRadius: 15 ,justifyContent:'center'}}
            itemTextStyle={{ textAlign: 'left' }}
            buttonStyle={styles.dropdown}
             buttonTextStyle={{ color:'#1E6B97', fontSize: 14, textAlign: 'left' }}
            />
            :
            <SelectDropdown
              disabled
             defaultValue={userRole ? userRole : userRoleArray[0]}
            defaultDropdownIconColor="#007aff"
            data={userRoleArray}
            onSelect={(selectedItem, index) => {
                setUserRole(selectedItem)
            }}
            buttonTextAfterSelection={(selectedItem, index) => {
                // text represented after item is selected
                // if data array is an array of objects then return selectedItem.property to render after item is selected
                return selectedItem
            }}
            rowTextForSelection={(item, index) => {
                // text represented for each item in dropdown
                // if data array is an array of objects then return item.property to represent item in dropdown
                return item
            }}
            dropdownStyle={{ backgroundColor: '#e6f5ff', width:wp('84.8%'), borderRadius: 15 ,justifyContent:'center'}}
            itemTextStyle={{ textAlign: 'left' }}
            buttonStyle={styles.dropdown}
             buttonTextStyle={{ color:'#1E6B97', fontSize: 14, textAlign: 'left' }}
            />
            }
            <View style={[styles.eyeIcon,{marginLeft: 10}]}>
              <IconComponentProvider IconComponent={MaterialCommunityIcons} >
                <Icon name="chevron-down" size={20} color="rgba(24, 86, 127, 1)" />
              </IconComponentProvider>
            </View>
          </View>
        </View>


        <TouchableOpacity style={{flexDirection: 'row', borderRadius:10, marginTop: 25, marginBottom: 50, justifyContent:'center',  
            alignSelf:'center', alignItems: 'center', backgroundColor:'#364153', width:wp('84.8%'), 
            height:40,}} onPress={() => { onUpdate() }}>
          <Text style={{ fontSize: 15, fontWeight: 'bold', color: 'white',
            textAlign:'center' }}>{t("update")}</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    marginLeft: -wp('35%')
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
    color:'#1E6B97', fontSize:13, fontWeight:'bold',
    backgroundColor: 'white',
    borderRadius: 8, borderWidth: 1, borderColor: '#A9A9A9',
    paddingLeft: 15, paddingRight: 15
  },
  inputHeader: {
    fontSize: 11, 
    color: '#333',
    fontWeight: '500'
  },
  dropdown: {
    height: hp('4.9%'),
    width:wp('75%'),
    color:'#1E6B97', fontSize:13,
    backgroundColor: 'white',
    borderRadius: 8,
},
});
