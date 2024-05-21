import React, { useEffect, useState } from "react";
import { ImageBackground, SafeAreaView,Text, Image, StyleSheet, StatusBar,FlatList,
   TouchableOpacity, View, ActivityIndicator, TextInput, Modal, ScrollView} from "react-native";
import { TouchableNativeFeedback } from 'react-native-gesture-handler';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { IconComponentProvider, Icon } from "@react-native-material/core";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from "react-i18next";
import { signup, signupInitial } from "../../actions/auth";
import { validEmail} from '../utils/util';
import { toastr } from "../../services/navRef";
import { usernameList } from '../../actions/user';
import CountryPicker, {
  CountryModalProvider,
} from "react-native-country-picker-modal";
import Papa from 'papaparse';
import { logger } from "react-native-logs";
import { TextDecoder } from 'text-decoding'
export default function SignupBoard({ navigation }) {
  const {i18n} = useTranslation()
  const { t } = useTranslation();
  const signingUp = useSelector(state => state.auth.signingUp);
  const dispatch = useDispatch()

  const [lang, setLang] = React.useState('EN');

  const [fname, setFname] = useState("");
  const [email, setEmail] = useState('');
  const [lname, setLname] = useState("");
  const [lnameStyle, setLnameStyle] = useState(styles.in1)

  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [countryCode, setCountryCode] = useState("US");
  const [code, setCode] = useState("971");
  const [phone, setPhone] = useState("");

  const [isFocusedInput, setIsFocusedInput] = useState(false);
  const [city, setCity] = useState("");
  const [allcountries, setAllCountries] = useState([]);

  const [country, setCountry] = useState("");

  const [password, setPassword] = useState('');
  const [cpassword, setCpassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showVerified, setShowVerified] = useState(false);
  
  const authReducer = useSelector(state => state.auth);
  const userReducer = useSelector(state => state.user);
   var log = logger.createLogger();
  //  log.debug("This is a Debug log");
  // log.info("This is an Info log");
  // log.warn("This is a Warning log");
  // log.error("This is an Error log");

async function GetData() {
    const data = Papa.parse(await fetchCsv());
    log.info(data.data.length);
    // log.info(data.data[0]);
    // log.info(data.data[0][0]);
    // log.info(data.data[0][1]);
    return data.data;
}

async function fetchCsv() {
    const response = await fetch('https://vehtechs.com/cities.csv');
    const result = await response.text();
    //let decoder = new TextDecoder('utf-8');
    //const csv = decoder.decode(result);
    return result;
}

  useEffect(() => {
    dispatch(usernameList());
    const fetchCountryData = async () => {
      try {
        const response1 = await GetData();
        setAllCountries(response1)
      } catch (error) {
        
      }
    };
    fetchCountryData();
  }, []);

  useEffect(() => {
    // navigation.navigate('SignupVerify', { "email": "111."})
    
    dispatch(usernameList());
  
    
  }, [city]);


  useEffect( ()=> {
    if(authReducer.signedUp) {
      dispatch(signupInitial());
      navigation.navigate('SignupVerify', { "email": email})
    }
  },[authReducer?.signedUp])

  function onSignUp() {
    if(fname === "") {
      toastr(t('please_enter_full_name'))
      return;
    }
    if(!validEmail(email)){
      toastr(t('invalid_email_enter'))
      return;
    }
    if (lname === "") {
      toastr(t("please_enter_username"));
      return;
    }
    if (!showVerified) {
      handleShowToast();
      return;
    }
    
    if (phone === "") {
      toastr(t("please_enter_phone"));
      return;
    } 
    if (city === "") {
      toastr(t("please_enter_city"));
      return;
    }
    if (password === "") {
      toastr(t("please_enter_password"));
      return;
    } 
    if (cpassword === "") {
      toastr(t("please_enter_cpassword"));
      return;
    } 
    if (password !== cpassword) {
      toastr(t("not_match_password"));
      return;
    }

    const sendData = {
      lname: lname,
      email: email,
      fname: fname,
      phone: "+" + code + " " + phone,
      city: city,
      country: city.slice(city.lastIndexOf(",") + 1),
      password: password,
    };
    console.log("@@MOBILE", sendData)

    dispatch(signup(sendData, navigation));
  }

  const handleChgUsername = (val) => {
    if(val.length === 0) {
      setShowVerified(false);
      setLnameStyle(styles.in2)
    } else {
      if(val.length > 0 && userReducer.usernameList.filter(item => item.lname.toLowerCase() === val.toLowerCase()).length === 0) {
        setLnameStyle(styles.in1)
        setShowVerified(true);
      } else {
        setLnameStyle(styles.in2)
        setShowVerified(false);
        handleShowToast();
      }  
    }
    setLname(val);
  }

  const setLanguage = () => {
    if(lang == "EN") {
      i18n.changeLanguage("fr");
      setLang("FR");
    } else if(lang == "FR") {
      i18n.changeLanguage("en");
      setLang("EN");
    }
  };

  const onSelect = (country) => {
    // setCountry(country.name)
    setCountryCode(country.cca2)
    setCode(country.callingCode[0])
  }

  function filterData(data, searchText) {
    return data.filter(
      function (item) {
        if (item.cities.toLowerCase().includes(searchText.toLowerCase())) {
          return item;
        }
      }
    );
  }

  const renderCityList = (query) => {
    const listData = [];
    if(query.length > 0 && allcountries.length >0 ) {
      for (const data of allcountries) {
        if(data.length < 2) continue;
        if (data[0].toLowerCase().includes(query.toLowerCase())) {
          listData.push(`${data[0]}, ${data[1]}`);
        }
      }
      if(listData.length < 1){
        for (const data of allcountries) {
          if(data.length < 2) continue;
          if (data[1].toLowerCase().includes(query.toLowerCase())) {
            listData.push(`${data[0]}, ${data[1]}`);
          }
        }
      }
    }
    if (listData.length === 0) {
      return (
        <View style={{position:'absolute', zIndex:100, bottom:40, width:250,  backgroundColor:'white', borderWidth:1, borderColor:'#A9A9A9', 
        borderRadius:8, paddingLeft:15, paddingTop:5, paddingBottom:5, }}>
          <Text style={{ alignItems: 'center', color:'#888', fontWeight:'500' }}>No Result</Text>
        </View>
      )
    } else {
      return (
        <View
        style={{position:'absolute', zIndex:100, bottom:40, width:250, maxHeight:150, backgroundColor:'white', borderWidth:1, borderColor:'#A9A9A9', 
                  borderRadius:8, paddingLeft:15, paddingTop:5, paddingBottom:5, }}>
          <FlatList
            data={listData} 
            renderItem={({ item }) => (
              <TouchableNativeFeedback
                onPress={ 
                () => {
                  setCity(item);
                }}
              >
                <Text style={{color:'#18567F', fontsize:15, fontWeight:'500', marginVertical:1}}> {item}</Text>
              </TouchableNativeFeedback>
            )} />
        </View>
      );
    }
  }

  const [showToast, setShowToast] = useState(false);
  const Toast = ({ message, onHide }) => {
    return (
      <TouchableOpacity style={styles.toastContainer} onPress={onHide}>
        <View style={styles.toast}>
          <Text style={styles.toastText}>{message}</Text>
        </View>
      </TouchableOpacity>
    );
  };
  const handleShowToast = () => {
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 2000); // Hide the toast after 2 seconds
  };

  return (
    <SafeAreaView style={styles.view1}>
      <StatusBar backgroundColor={"#EBECF0"} barStyle={"dark-content"} />
      <Modal visible={signingUp} transparent={true}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.1)' }}>
          <ActivityIndicator size="large" color="rgba(54, 52, 53, 1)" />
        </View>
      </Modal>

      <TouchableOpacity style={{alignItems: 'flex-end' }} onPress={setLanguage}>
        <ImageBackground style={{marginRight:20, flex:1, width: 70, height: 70}} source={require("../../../assets/lang_bg.png")}>
          <View style={{flexDirection:'row', height:70, justifyContent:'center', alignItems:'center'}}>
            <Text style={styles.txtChgLang}>{lang}</Text>
          </View>
        </ImageBackground>
      </TouchableOpacity>

      {showToast && <Toast message={t('username_already_exist')} onHide={() => setShowToast(false)} />}

      <Image source={require('../../../assets/logo_origin.png')} style={styles.imgLogo} />

      <ScrollView>
      <View style={[styles.v4, {marginTop:20}]}>
        <Image source={require("../../../assets/input_bg.png")} style={{ position:'absolute', width: '100%', height: 50, resizeMode: 'stretch' }}/> 
        <Image source={require('../../../assets/fullname_ico.png')} style={styles.img} />
        <TextInput type='text' style={styles.in1} placeholder={t("full_name")} onChangeText={(val) => { setFname(val) }} />
      </View>

      <View style={styles.v4}>
        <Image source={require("../../../assets/input_bg.png")} style={{ position:'absolute', width: '100%', height: 50, resizeMode: 'stretch' }}/> 
        <Image source={require('../../../assets/email_outline_ico.png')} style={styles.img} />
        <TextInput type='text' style={styles.in1} placeholder={t("email")} onChangeText={(val) => { setEmail(val) }} />
      </View>

      <View style={styles.v4}>
        <Image source={require("../../../assets/input_bg.png")} style={{ position:'absolute', width: '100%', height: 50, resizeMode: 'stretch' }}/> 
        <Image source={require('../../../assets/username_ico.png')} style={styles.img} />
        <TextInput type='text' style={lnameStyle} placeholder={t("username")} value={lname} onChangeText={(val) => { handleChgUsername(val) }} />
        {showVerified  &&
        <Image source={require("../../../assets/verified.png")} style={{ position:'absolute', right:30, top:10, width: 16, height: 16, resizeMode: 'contain' }}/> }
      </View>

      <View style={styles.v4}>
        <Image source={require("../../../assets/input_bg.png")} style={{ position:'absolute', width: '100%', height: 50, resizeMode: 'stretch' }}/> 
        <Image source={require('../../../assets/phone_ico.png')} style={styles.img} />
        <TouchableOpacity onPress={() => {setShowCountryPicker(true) }}>
          <View style={{flexDirection:'row', alignItems:'center'}}>
            <CountryModalProvider>
              <CountryPicker
                  visible={showCountryPicker}
                  onSelect={onSelect}
                  withEmoji
                  withFilter
                  withFlag
                  withFlagButton={false}
                  countryCode={countryCode}
                  withCallingCode
                  onClose={() => setShowCountryPicker(false)}/>
              <Text style={{color:'#18567F', marginLeft:15, fontsize:16, fontWeight:'500'}}>+{code}</Text>
              < Image source={require('../../../assets/dropdown_ico.png')} style={{height:25, width:25}} />
            </CountryModalProvider>
          </View>
        </TouchableOpacity>
        <View style={{marginLeft:1, backgroundColor:'rgba(0,0,0,0.24)', width:1, height:hp('4%')}}></View>
        <TextInput style={{fontsize:16, backgroundColor:'white', color:'#1E6B97', width:120, marginLeft:10}}
          placeholder={t("phone_no")}keyboardType="number-pad" onChangeText={(text)=>setPhone(text)}></TextInput>
      </View>

      <View style={styles.v4}>
        <Image source={require("../../../assets/input_bg.png")} style={{ position:'absolute', width: '100%', height: 50, resizeMode: 'stretch' }}/> 
        <Image source={require('../../../assets/earth_ico.png')} style={styles.img} />
        <TextInput type='text' style={styles.in1} placeholder={t("city")} value={city} onChangeText={(val) => { setCity(val) }}
        onFocus={() => setIsFocusedInput(true)} onBlur={() => setIsFocusedInput(false)} />
        {isFocusedInput && renderCityList(city)}
      </View>

      <View style={styles.v4}>
        <Image source={require("../../../assets/input_bg.png")} style={{ position:'absolute', width: '100%', height: 50, resizeMode: 'stretch' }}/> 
        <Image source={require('../../../assets/password_ico.png')} style={styles.img} />
        <TextInput type='text' secureTextEntry={!showPassword} style={[styles.in1]} placeholder={t("password")} onChangeText={(val) => { setPassword(val) }} />
        <View style={{alignSelf:'center'}}>
          <IconComponentProvider IconComponent={MaterialCommunityIcons} >
            <TouchableOpacity onPressIn={() => { setShowPassword(!showPassword) }} >
            {showPassword === true ? 
                <Icon name="eye-outline"  size={25} style={{marginRight:25}} color="rgba(24, 86, 127, 0.81)" />
            : 
                <Icon name="eye-off-outline" style={{marginRight:25,transform: [{scaleX:-1}]}} size={25} color="rgba(24, 86, 127, 0.81)" />
              }
            </TouchableOpacity>
          </IconComponentProvider>
        </View>
      </View>

      <View style={styles.v4}>
        <Image source={require("../../../assets/input_bg.png")} style={{ position:'absolute', width: '100%', height: 50, resizeMode: 'stretch' }}/> 
        <Image source={require('../../../assets/password_ico.png')} style={styles.img} />
        <TextInput type='text' secureTextEntry={!showPassword} style={[styles.in1]} placeholder={t("confirm_password")} onChangeText={(val) => { setCpassword(val) }} />
      </View>

      <TouchableOpacity style={{flexDirection: 'row', borderRadius:25, marginTop: 20, alignSelf:'center', alignItems: 'center', backgroundColor:'#364153', width:wp('87%'), height:50,}} onPress={() => { onSignUp() }}>
          <Text style={{ fontSize: 16, fontWeight: '700', fontWeight: 'bold', color: 'white', width:wp('87%'), textAlign:'center' }}>{t("sign_up")}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={{marginTop: 20, marginBottom: 20, alignItems: 'center'}} onPress={() => { navigation.navigate('LoginBoard') }} >
          <Text style={{ fontSize: 32, fontWeight: '700', fontWeight: 'bold', color: '#364153', textDecorationLine:'underline' }}>{t("login")}</Text>
      </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  view1: {
    flex: 1,
    backgroundColor: '#EBECF0',
  },
  txtChgLang: {
    textAlign:'center',
    cololr: '#364153',
    fontSize: 20,
  },
  imgLogo: {
    marginTop: 45,
    marginBottom:20,
    width: 85,
    height: 85,
    alignSelf: 'center',
  },
  v4: {
    flexDirection: "row",
    alignItems:'center',
    alignSelf: 'center',
    marginTop: 25,
    marginBottom: 10,
    width: wp('87%'),
  },
  v5: {
    flexDirection: "row",
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 10,
  },
  iconArea: {
    marginLeft:20,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(24, 86, 127, 0.16)',
    marginHorizontal: 10,
  },
  in1: {
    backgroundColor: 'transparent',
    marginLeft:15,
    marginRight:30,
    flex:1,
    fontSize:16,
    color:'#18567F'
  },
  in2: {
    backgroundColor: 'transparent',
    marginLeft:15,
    marginRight:30,
    flex:1,
    fontSize:16,
    color:'pink'
  },
  img: {
    width:30,
    height:30,
    resizeMode:'contain',
    marginLeft:20
  },
  toastContainer: {
    zIndex:100,
    position: 'absolute',
    top: hp('50%'),
    left: wp('50%') - 50,
    transform: [{ translateX: -50 }, { translateY: -50 }],
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  toastText: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
  },
});