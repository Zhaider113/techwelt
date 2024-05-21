import React, { useState, useEffect, useRef } from "react";
import { View, Text, TextInput, Image, StyleSheet, TouchableOpacity, StatusBar,Alert,
  ToastAndroid, Modal, SafeAreaView } from "react-native";
import SelectDropdown from 'react-native-select-dropdown'
import { IconComponentProvider, Icon } from "@react-native-material/core";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Header from "../Header";

import { useSelector, useDispatch } from 'react-redux';
import {useTranslation} from "react-i18next";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { validEmail, validPhoneNumber } from "../utils/util";
import { toastr } from '../../services/navRef';
import axios from 'axios';
import { updateUser, changeEmail, updateAvatar, updateMobileNo, updateInitialMobileNo,
  updatePwd, updateInitialPwd } from "../../actions/user"; 
import { reset } from "../../actions/auth"; 
// import {launchImageLibrary} from 'react-native-image-picker';
// import ImagePicker from 'react-native-image-crop-picker';
import * as ImagePicker from 'expo-image-picker';
import { logout } from '../../actions/auth';

import CountryPicker, {
  CountryModalProvider,
  Flag,
} from "react-native-country-picker-modal";
import { ScrollView } from "react-native-gesture-handler";
import { getLoginInfoStorage } from "../../services/getLocalAsyncStorage";

const userRoleArray = ["Admin", "Manager","User"];

export default function Profile({ navigation }) {
  const {t} = useTranslation()
  const dispatch = useDispatch();
  const authReducer = useSelector(state => state.auth);
  const userReducer = useSelector(state => state.user);

  const [username, setUsername] = useState(authReducer?.user?.lname);
  const [useremail, setUseremail] = useState(authReducer?.user?.email);
  const [newEmail, setNewEmail] = useState("");

  const [countryCode, setCountryCode] = useState("US");
  const [code, setCode] = useState(authReducer?.user?.phone?.substring(1, authReducer?.user?.phone?.indexOf(' ')));
  const [country, setCountry] = useState(authReducer?.user?.country);

  const [userphonenumber, setUserphonenumber] = useState(authReducer?.user?.phone?.substring(authReducer?.user?.phone?.indexOf(' ') + 1));

  const [fullMobileNo, setFullMobileNo] = useState(authReducer?.user?.phone);

  const [showPassword, setShowPassword] = React.useState(false);
  const [curPwd, setCurPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");

  const [userRole, setUserRole] = useState(authReducer?.user?.role ? authReducer?.user?.role : "Admin");

  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [showMedia, setShowMedia] = useState(false);
  const [image, setImage] = useState(authReducer?.user?.image);

  const [isNotify, setIsNotify] = useState(true);

  useEffect(() => {
    const fetchCountryData = async () => {
      try {
        const response1 = await axios.get('https://countriesnow.space/api/v0.1/countries');
        const tmpCountry = response1.data.data.find((data) => data.country === authReducer?.user?.country);
        if(tmpCountry) {
          setCountryCode(tmpCountry.iso2)
        }
    
      } catch (error) {
        console.error(error);
      }
    };
    fetchCountryData();

    setCurPwd(global.userPwd);
  }, []);

  useEffect( ()=> {
    if(userReducer.isPhoneUpdate) {
      setFullMobileNo("+" + code + " " + userphonenumber);
      setShowModalPhone(false);
      dispatch(updateInitialMobileNo());
    }
  },[userReducer?.isPhoneUpdate])

  useEffect( ()=> {
    console.log("789")
    if(userReducer.isPwdUpdate) {
      setShowModalPwd(false);
      dispatch(updateInitialPwd());
    }
  },[userReducer?.isPwdUpdate])

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

  const onUpdate = () => {
    if (userRole === "") {
      ToastAndroid.show(
        t('please_enter_user_information'),
        ToastAndroid.SHORT,
      );
      return;
    }
    
    if(!validPhoneNumber(userphonenumber)){
      toastr(t('please_enter_valid_phone'))
      return;
    }
    if (!validEmail(useremail)) {
      toastr(t('invalid_email_enter'))
      return;
    }

    const sendData = {
      token: authReducer.token,
      userId: authReducer.user._id,
      fname: authReducer.user.fname,
      lname: authReducer.user.lname,
      email: useremail,
      phone: "+" + code + " " + userphonenumber,
      country: country,
      // address: city,
      address: "",
      role: userRole,
      company: ""
    };

    console.log("@@@Edit Profile data:", sendData)
    dispatch(updateUser(sendData, navigation));
  }

  const [showModalEmail, setShowModalEmail] = useState(false);
  const [showModalPhone, setShowModalPhone] = useState(false);
  const [showModalPwd, setShowModalPwd] = useState(false);

  const [selectedImage, setSelectedImage] = useState(null);

  const launchGellery = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.1,
      base64: true
    });
    
    if (!result.canceled) {
      const sendData = {
        token: authReducer.token,
        userId: authReducer.user._id,
        image: result.base64,
        email: authReducer.user.email,
      };
      dispatch(updateAvatar(sendData, navigation));
      setImage(result.assets[0].uri);
      setShowMedia(false)
    }
  }

  const updateEmail = () => {
    if(!validEmail(newEmail)){
      toastr(t('invalid_email_enter'))
      return;
    }

    const sendData = {
      token: authReducer.token,
      userId: authReducer.user._id,
      oldEmail: authReducer.user.email,
      newEmail: newEmail,
    };

    dispatch(changeEmail(sendData, navigation));
  }

  const handleUpdatePassword = () => {
    if(newPwd === ""){
      toastr(t('please_enter_new_password'))
      return;
    }
    if(confirmPwd === ""){
      toastr(t('please_enter_confirm_password'))
      return;
    }
    if(newPwd !== confirmPwd){
      toastr(t('not_match_password'))
      return;
    }

    const sendData = {
      token: authReducer.token,
      userId: authReducer.user._id,
      email: authReducer.user.email,
      newPwd: newPwd
    };

    console.log("@@@Change Password data:", sendData)
    dispatch(updatePwd(sendData, navigation));
  }

  const handleUpdatePhone = () => {
    if(userphonenumber === "") {
      toastr('Please Enter Mobile No.');
      return;
    }

    const sendData = {
      token: authReducer.token,
      userId: authReducer.user._id,
      email: authReducer.user.email,
      phone: "+" + code + " " + userphonenumber,
    };
    console.log("@@@Update Phone data:", sendData)
    dispatch(updateMobileNo(sendData, navigation));
  }


  return (
    <View style={{flex:1, backgroundColor:'#F1F4FA'}}>
      <StatusBar backgroundColor={"#364153"} barStyle={"light-content"} />
      <Header screenName={t('profile')} curNavigation={navigation}></Header>
      <Modal
        animationType="slide"
        transparent={true}
        visible={showMedia}
        onRequestClose={() => {
          setShowMedia(false);
        }}
      >
        <SafeAreaView style={{flex:1, backgroundColor:'#00000040'}}>
          <View style={{ flex: 1, backgroundColor: '#00000030', alignItems:'center'}}>
            <View style={{ position: 'absolute', bottom:10, width:wp('100%'),backgroundColor:'white'}}>
              <View style={{ alignSelf: 'center',width:'100%',}}>
                <TouchableOpacity style={{width:'100%',alignSelf:'center',marginTop:10,justifyContent: 'center', alignItems: 'center'}} onPress={()=>{launchGellery()}}>
                  <View style={{ width:'94%',backgroundColor:'#FFFFFF',borderRadius:30,paddingVertical:wp('100%')*3.5/100 }}>
                      <Text style={{textAlign:'center', fontSize: wp('100%')*4/100, color:'black' }}>Choose from Library</Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View style={{ marginTop: 15, alignSelf: 'center', borderRadius: 15, backgroundColor: '#364143', width: '100%', justifyContent: 'center',marginBottom:5, alignItems: 'center',  }}>
                <TouchableOpacity onPress={() => {setShowMedia(false) }} style={{ alignSelf: 'center',  width: '100%',  alignItems: 'center', justifyContent: 'center',paddingVertical:wp('100%')*3.5/100}}>
                  <Text style={{fontSize: wp('100%')*4/100, color:'white'}}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
      <View style={{alignSelf:'center', marginTop:20}}>
        <TouchableOpacity onPress={() => {setShowMedia(true) }}>
          {image ? 
          <Image source={{ uri: image}}
            style={{resizeMode:'contain', height:90, width:90, borderRadius:45, borderWidth:1, borderColor:'#A9A9A9'}} />
          :
          <Image source={require('../../../assets/profile_avatar.png')} style={{height:90, width:90}} />
          }        
        </TouchableOpacity>
      </View>

      <ScrollView>
        <View style={{flexDirection:'column', justifyContent:'space-between',alignSelf:'center',alignItems:'center', marginBottom:30
        }}>
          <View style={styles.v1}>
            <Image source={require('../../../assets/profile_username.png')} style={{height:35, width:35, resizeMode:'contain'}} />
            <View style={{flexDirection:'column', marginLeft:20}}>
              <Text style={styles.inputHeader}>{t('username')}</Text>
              <Text style={{color:'#898A8D', fontSize:13, fontWeight:'500', marginTop:2}}>{username}</Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => {
              setShowModalEmail(!showModalEmail);
              setShowModalPhone(false);
              setShowModalPwd(false);
          }}>
          <View style={styles.v1}>
            <Image source={require('../../../assets/email_ico.png')} style={{height:35, width:35, resizeMode:'contain'}} />
            <View style={{flexDirection:'column', marginLeft:20}}>
              <Text style={styles.inputHeader}>{t('email')}</Text>
              <Text style={{color:'#898A8D', fontSize:13, fontWeight:'500', marginTop:2}}>{useremail}</Text>
            </View>
            <IconComponentProvider IconComponent={MaterialCommunityIcons} >
            {showModalEmail ?
              <Icon name="chevron-up" size={25} color="black" style={{position:'absolute', right:0}} />
            :
              <Icon name="chevron-down" size={25} color="black" style={{position:'absolute', right:0}} />
            }
            </IconComponentProvider>
          </View>
          </TouchableOpacity>

          {showModalEmail &&
          <View style={{flexDirection:'column', marginTop:15, width:wp('90%'), borderRadius:10, borderColor:'#A9A9A9', borderWidth:1, paddingLeft:20, paddingRight:20, paddingTop:10, paddingBottom:10}}>
            <Text style={{fontSize:13, fontWeight:'500', color:'#1E6B97',}}>Current Email</Text>
            <TextInput editable={false} style={{color:'#1E6B97', fontSize:13, fontWeight:'500', width:wp('80%'), height:40, paddingLeft:15, marginTop:5,
                backgroundColor:'#E6E7ED', borderWidth:1, borderRadius:10, borderColor:'#A9A9A9'}} value={useremail}></TextInput>
            <Text style={{fontSize:13, fontWeight:'500', color:'#1E6B97', marginTop:10}}>New Email Address</Text>
            <TextInput style={{color:'#1E6B97', fontSize:13, fontWeight:'500', width:wp('80%'), height:40, paddingLeft:15, marginTop:5,
                backgroundColor:'white', borderWidth:1, borderRadius:10, borderColor:'#A9A9A9'}} value={newEmail} onChangeText={(text)=>setNewEmail(text)} />
            <TouchableOpacity
              onPress={ () => {
                updateEmail();
              }}
            >
              <Text style={{width:wp('40%'), height:35, alignSelf:'center', marginTop:10,  color:'white', fontSize:13, fontWeight:'500',
                backgroundColor:'#364153', borderRadius:10, paddingTop:8, textAlign:'center'}}>Update Email</Text>
            </TouchableOpacity>
          </View>}

          <TouchableOpacity
            onPress={ () => {
              setIsNotify(!isNotify);
            }}>
          <View style={styles.v1}>
            <Image source={require('../../../assets/profile_notify.png')} style={{height:35, width:35, resizeMode:'contain'}} />
            <Text style={[styles.inputHeader, {marginLeft:20, marginTop:7}]}>{t('notifications')}</Text>
            {isNotify ?
            <Image source={require('../../../assets/slider_on_green.png')} style={{position:'absolute', right:-10, height:35, width:35, resizeMode:'contain'}} />
            :
            <Image source={require('../../../assets/slider_off.png')} style={{position:'absolute', right:0, height:35, width:35, resizeMode:'contain'}} />
            }
          </View>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => {
              setShowModalEmail(false);
              setShowModalPhone(!showModalPhone);
              setShowModalPwd(false);

          }}>
          <View style={styles.v1}>
            <Image source={require('../../../assets/profile_phone.png')} style={{height:35, width:35, resizeMode:'contain'}} />
            <View style={{flexDirection:'column', marginLeft:20}}>
              <Text style={styles.inputHeader}>{t('mobile_no')}</Text>
              <Text style={{color:'#898A8D', fontSize:13, fontWeight:'500', marginTop:2}}>{fullMobileNo}</Text>
            </View>
            <IconComponentProvider IconComponent={MaterialCommunityIcons} >
            {showModalPhone ?
              <Icon name="chevron-up" size={25} color="black" style={{position:'absolute', right:0}} />
            :
              <Icon name="chevron-down" size={25} color="black" style={{position:'absolute', right:0}} />
            }
            </IconComponentProvider>
          </View>
          </TouchableOpacity>

          {showModalPhone &&
          <View style={{flexDirection:'column', marginTop:15, width:wp('90%'), borderRadius:10, borderColor:'#A9A9A9', borderWidth:1, paddingLeft:20, paddingRight:20, paddingTop:10, paddingBottom:10}}>
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
                <Text style={{color:'rgba(0,0,0,0.5)'}}>+{code}</Text>
                <TouchableOpacity onPress={() => {setShowCountryPicker(true) }}>
                  < Image source={require('../../../assets/dropdown_ico.png')} style={{height:25, width:25}} />
                </TouchableOpacity>
              </CountryModalProvider>
              <View style={{marginLeft:1, backgroundColor:'rgba(0,0,0,0.5)', width:1, height:hp('4%')}}></View>
              <TextInput style={{backgroundColor:'white', color:'#1E6B97', flex:1, marginLeft:10}} value={userphonenumber}
                placeholder="566485124" keyboardType="number-pad" onChangeText={(text)=>setUserphonenumber(text)}></TextInput>
            </View>
            <TouchableOpacity onPress={() => {handleUpdatePhone()}}>
              <Text style={{width:wp('40%'), height:35, alignSelf:'center', marginTop:10,  color:'white', fontSize:13, fontWeight:'500',
                backgroundColor:'#364153', borderRadius:10, paddingTop:8, textAlign:'center'}}>Update Phone</Text>
            </TouchableOpacity>
          </View>}

          <View style={styles.v1}>
            <Image source={require('../../../assets/profile_speed.png')} style={{height:35, width:35, resizeMode:'contain'}} />
            <Text style={[styles.inputHeader, {marginLeft:20, marginTop:7}]}>{t('speed_alert')}</Text>
          </View>

          <View style={styles.v1}>
            <Image source={require('../../../assets/earth_ico.png')} style={{height:35, width:35, resizeMode:'contain'}} />
            <View style={{flexDirection:'column', marginLeft:20}}>
              <Text style={styles.inputHeader}>{t('address')}</Text>
              <Text style={{color:'#898A8D', fontSize:13, fontWeight:'500', marginTop:2}}>{authReducer?.user?.address}</Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => {
              setShowModalEmail(false);
              setShowModalPhone(false);
              setShowModalPwd(!showModalPwd);
          }}>
          <View style={styles.v1}>
            <Image source={require('../../../assets/profile_chg_pwd.png')} style={{height:35, width:35, resizeMode:'contain'}} />
            <Text style={[styles.inputHeader, {marginLeft:20, marginTop:7}]}>Change Password</Text>
            <IconComponentProvider IconComponent={MaterialCommunityIcons} >
            {showModalPwd ?
              <Icon name="chevron-up" size={25} color="black" style={{position:'absolute', right:0}} />
            :
              <Icon name="chevron-down" size={25} color="black" style={{position:'absolute', right:0}} />
            }
            </IconComponentProvider>
          </View>
          </TouchableOpacity>

          {showModalPwd &&
          <View style={{flexDirection:'column', marginTop:15, width:wp('90%'), borderRadius:10, borderColor:'#A9A9A9', borderWidth:1, paddingLeft:20, paddingRight:20, paddingTop:10, paddingBottom:10}}>
            <Text style={{fontSize:13, fontWeight:'500', color:'#1E6B97',}}>Current Password</Text>
            <TextInput secureTextEntry={!showPassword} editable={false} style={{color:'#1E6B97', fontSize:13, fontWeight:'500', width:wp('80%'), height:40, paddingLeft:15, marginTop:5,
                backgroundColor:'white', borderWidth:1, borderRadius:10, borderColor:'#A9A9A9'}} value={curPwd}
                onChangeText={(val) => { setCurPwd(val) }} />
            <Text style={{fontSize:13, fontWeight:'500', color:'#1E6B97', marginTop:10}}>New Password</Text>
            <TextInput secureTextEntry={!showPassword} style={{color:'#1E6B97', fontSize:13, fontWeight:'500', width:wp('80%'), height:40, paddingLeft:15, marginTop:5,
              backgroundColor:'white', borderWidth:1, borderRadius:10, borderColor:'#A9A9A9'}} value={newPwd}
              onChangeText={(val) => { setNewPwd(val) }}/>
              <View style={styles.eyeIcon}>
                <IconComponentProvider IconComponent={MaterialCommunityIcons} >
                  <TouchableOpacity onPressOut={() => {setShowPassword(!showPassword) }}>
                    {showPassword === true ? (
                      <Icon name="eye-outline" size={20} color="#B8B8B8" />
                    ) : (
                      <Icon name="eye-off-outline" size={20} style={{transform: [{scaleX:-1}]}} color="#B8B8B8" />
                    )}
                    </TouchableOpacity>
                </IconComponentProvider>
              </View>

            <Text style={{fontSize:13, fontWeight:'500', color:'#1E6B97', marginTop:10}}>Confirm New Password</Text>
            <TextInput style={{color:'#1E6B97', fontSize:13, fontWeight:'500', width:wp('80%'), height:40, paddingLeft:15, marginTop:5,
                backgroundColor:'white', borderWidth:1, borderRadius:10, borderColor:'#A9A9A9'}} value={confirmPwd}
                onChangeText={(val) => { setConfirmPwd(val) }}/>
            <TouchableOpacity
              onPress={() => {
                handleUpdatePassword();
            }}>
              <Text style={{width:wp('40%'), height:35, alignSelf:'center', marginTop:10,  color:'white', fontSize:13, fontWeight:'500',
                backgroundColor:'#364153', borderRadius:10, paddingTop:8, textAlign:'center'}}>Set New Password</Text>
            </TouchableOpacity>
          </View>}

          <View style={styles.v1}>
            <Image source={require('../../../assets/profile_usertype.png')} style={{height:35, width:35, resizeMode:'contain'}} />
            <View style={{flexDirection:'column', marginLeft:20}}>
              <Text style={styles.inputHeader}>User Type</Text>
              <Text style={{color:'#898A8D', fontSize:13, fontWeight:'500', marginTop:2}}>{authReducer?.user?.role}</Text>
            </View>
            {/* <IconComponentProvider IconComponent={MaterialCommunityIcons} >
              <Icon name="chevron-down" size={25} color="black" style={{position:'absolute', right:0}} />
            </IconComponentProvider> */}
          </View>

        <TouchableOpacity style={{flex:1 }} 
          onPress={() => {
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
        }} >
          <View style={styles.v1}>
            <Image source={require('../../../assets/profile_logout.png')} style={{height:35, width:35, resizeMode:'contain'}} />
            <Text style={[styles.inputHeader, {marginLeft:20, marginTop:7}]}>Logout</Text>
          </View>
        </TouchableOpacity>

          {/* <View style={{width:wp('84.8%'), marginTop:10}}>
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
          </View> */}

          {/* <TouchableOpacity style={{flexDirection: 'row', borderRadius:10, marginTop: 25, marginBottom: 20, justifyContent:'center',  
              alignSelf:'center', alignItems: 'center', backgroundColor:'#364153', width:wp('75.4%'), 
              height:40,}} 
            onPress={() => { onUpdate() }}>
            <Text style={{ fontSize: 15, fontWeight: 'bold', color: 'white',
              textAlign:'center' }}>{t("update")}</Text>
          </TouchableOpacity> */}
        
        </View>
      </ScrollView>
    
    </View>
  );
}

const styles = StyleSheet.create({
  v1: {
    flexDirection:'row',
    marginTop:15,
    width:wp('90%')
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
    color:'#1E6B97', fontSize:13,
    backgroundColor: 'white',
    borderRadius: 8, borderWidth: 1, borderColor: '#A9A9A9',
    paddingLeft: 15, paddingRight: 15
  },
  inputHeader: {
    fontSize: 12, fontWeight: '500',
    color: 'black',
  },
  phoneInput: {
    //width: '80%',
    height: 120,
    borderWidth: 5,
    padding: 10,
    marginBottom: 20,
    backgroundColor:'red'
  },
  dropdown: {
    height: hp('4.9%'),
    width:wp('75%'),
    color:'#1E6B97', fontSize:13,
    backgroundColor: 'white',
    borderRadius: 8,
},
});
