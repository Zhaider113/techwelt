import React, { useState, useEffect, useRef } from "react";
import { ScrollView, View, Text, TextInput, StyleSheet, TouchableOpacity, StatusBar, Image } from "react-native";
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
import { addUser, usernameList } from "../../actions/user";
import axios from 'axios';
import BottomTab from "../BottomTab";

export default function User_Add({ navigation }) {

  const {t} = useTranslation();
  const dispatch = useDispatch()

  const authReducer = useSelector(state => state.auth);
  const userReducer = useSelector(state => state.user);
  const phoneInputRef = useRef(null);

  const userRoleArray = ["Admin", "Manager","User"];

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [email, setEmail] = useState("");
  
  const [country, setCountry] = useState("");
  const [countryData, setCountryData] = useState([]);
  const [city, setCity] = useState("");
  const [cityData, setCityData] = useState([]);

  const [address, setAddress] = useState("");
  const [userRole, setUserRole] = useState("Admin");
  
  const [nationInfo, setNationInfo] = useState([]);

  const [showVerified, setShowVerified] = useState(false);

  function sortNames(data) {
    data.sort((a, b) => a.localeCompare(b));
    return data;
  }

  useEffect(() => {
    dispatch(usernameList());
    const fetchCountryData = async () => {
      try {
        const response1 = await axios.get('https://countriesnow.space/api/v0.1/countries');
        setNationInfo(response1.data.data);

        const countryNames = sortNames(response1.data.data.map(data => data.country));
        setCountryData(countryNames);
        setCountry(countryNames[0])

        const selectedCities = response1.data.data.find((country) => country.country === countryNames[0]);
        setCityData(sortNames(selectedCities.cities.map(data => data)));
        setCity(sortNames(selectedCities.cities.map(data => data))[0]);
    
    
      } catch (error) {
        console.error(error);
      }
    };
    fetchCountryData();
  }, []);

  const handleChgUsername = (val) => {
    console.log(userReducer.usernameList)
    if(val.length > 0 && userReducer.usernameList.filter(item => item.lname === val).length === 0) {
      setShowVerified(true);
    } else {
      toastr(t('username_already_exist'));
      setShowVerified(false);
    }
    setUsername(val);
  }

  const selectedCountry = (selectedData) => {
    setCountry(selectedData);
    const selectedCities = nationInfo.find((country) => country.country === selectedData);
    setCityData(sortNames(selectedCities.cities.map(data => data)));
    setCity(sortNames(selectedCities.cities.map(data => data))[0]);
  }

  const onAdd = () => {
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
      phone: "+" + phoneInputRef.current.getCallingCode() + " " + mobileNo,
      country: country,
      // address: city,
      address: address,
      role: userRole,
      company: ""
    };
    dispatch(addUser(sendData, navigation))
  }

  return (
    <View style={{flex:1, backgroundColor:'#F1F4FA'}}>
      <StatusBar backgroundColor={"#364153"} barStyle={"light-content"} />
      <Header back='true' screenName={t('add_user')} curNavigation={navigation}></Header>
   
      <ScrollView>
      <View style={{flexDirection:'column', justifyContent:'space-between',alignSelf:'center',alignItems:'center'}}>

        <View style={{width:wp('84.8%'), marginTop:10}}>
          <Text style={styles.inputHeader}>{t('name')}</Text>
          <TextInput style={styles.in1} value={name} onChangeText={(val) => { setName(val) }}/>
        </View>

        <View style={{width:wp('84.8%'), marginTop: 20}}>
          <Text style={styles.inputHeader}>{t('username')}</Text>
          <TextInput style={styles.in1} value={username} onChangeText={(val) => { handleChgUsername(val) }}/>
          {showVerified === true ?
          <Image source={require("../../../assets/verified.png")} style={{ position:'absolute', right:20, top:32, width: 16, height: 16, resizeMode: 'contain' }}/> 
          : null}

        </View>

        <View style={{width:wp('84.8%'), marginTop:20}}>
          <Text style={styles.inputHeader}>{t('mobile_no')}</Text>
          <PhoneInput
            ref={phoneInputRef}
            containerStyle={{ width: wp('84.8%'), height:40,
            marginTop: 5,
            borderRadius: 8, borderWidth: 1, borderColor: '#A9A9A9',
            }}
            textInputStyle={{ color:'black', fontSize:16, height: 35}}
            codeTextStyle={{textAlign:'center', height: 22, marginLeft:-20 }}
            textInputProps={< TextInput maxLength={10}/>}
            textContainerStyle={{backgroundColor: 'white'}}
            keyboardType="phone-pad"
            defaultCode="US"
            placeholder=" "
            onChangeText={(text) => {
                setMobileNo(text);
            }}                            
            value={mobileNo}
          />
        </View>

        <View style={{width:wp('84.8%'), marginTop: 15}}>
          <Text style={styles.inputHeader}>{t('email')}</Text>
          <TextInput style={styles.in1} value={email} onChangeText={(val) => { setEmail(val)}}/>
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

        <View style={{display:'none', width:wp('84.8%'), marginTop:20}}>
          <Text style={styles.inputHeader}>{t('city')}</Text>
          <View style={styles.v4}>
            <SelectDropdown
              defaultValue={city}
              defaultDropdownIconColor="#007aff"
              data={cityData}
              onSelect={(selectedItem, index) => {
                setCity(selectedItem)
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
            <View style={[styles.eyeIcon,{marginLeft: 10}]}>
              <IconComponentProvider IconComponent={MaterialCommunityIcons} >
                <Icon name="chevron-down" size={20} color="rgba(24, 86, 127, 1)" />
              </IconComponentProvider>
            </View>
          </View>
        </View>


        <TouchableOpacity style={{flexDirection: 'row', borderRadius:10, marginTop: 25, marginBottom: 50, justifyContent:'center',  
            alignSelf:'center', alignItems: 'center', backgroundColor:'#364153', width:wp('84.8%'), 
            height:40,}} onPress={() => { onAdd() }}>
          <Text style={{ fontSize: 15, fontWeight: 'bold', color: 'white',
            textAlign:'center' }}>{t("add_user")}</Text>
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
    height: hp('4.9%'),
    width:wp('75%'),
    color:'#1E6B97', fontSize:13,
    backgroundColor: 'white',
    borderRadius: 8,
},
});
