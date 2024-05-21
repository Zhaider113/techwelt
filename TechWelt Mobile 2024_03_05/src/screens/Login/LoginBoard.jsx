import React, { useEffect, useState } from "react";
import { Switch, StatusBar,Text, Image, StyleSheet, ScrollView, BackHandler,
   TouchableOpacity, View, ActivityIndicator, TextInput, Modal, ImageBackground, Animated, Easing} from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { IconComponentProvider, Icon } from "@react-native-material/core";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useSelector, useDispatch } from 'react-redux'
import { useFocusEffect } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { login } from "../../actions/auth";
import { validEmail} from '../utils/util';
import { toastr } from "../../services/navRef";
import { getAuthAsyncStorage, getLoginInfoStorage } from '../../services/getLocalAsyncStorage';
import PropTypes from 'prop-types';

export default function LoginBoard({ navigation }) {
  const {i18n} = useTranslation()
  const { t } = useTranslation();
  const loggingIn = useSelector(state => state.auth.loggingIn)
  const dispatch = useDispatch()

  const [lang, setLang] = React.useState('EN');

  const [username, setUsername] = React.useState('');
  const [pass, setPass] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
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

  const fetchUserData = async () => {
    try {
      let loginInfo =  await getLoginInfoStorage();
      if(loginInfo?.saveFlag) {
        dispatch(login(true, loginInfo.username, loginInfo.password, 'email', navigation))
        setUsername(loginInfo?.username);
        setPass(loginInfo?.password);  
      } else {
        setUsername("");
        setPass("");  
      }
    } catch (error) {
    }
  };

  useFocusEffect(React.useCallback(() => {
    const onBackPress = () => {
      return true;
    };

    fetchUserData();

    BackHandler.addEventListener(
      'hardwareBackPress', onBackPress
    );

    return () =>
      BackHandler.removeEventListener(
        'hardwareBackPress', onBackPress
      );
  }, []));

  function onLogin() {
    if (username === "" || pass === "") {
      toastr(t('please_enter_username_and_password'));
    } else {
      var isEmail = validEmail(username);
      if (isEmail) {
          dispatch(login(isKeepLoggedIn, username, pass, 'email', navigation))
      } else {
        dispatch(login(isKeepLoggedIn, username, pass, 'id', navigation))
      }
    };
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

  return (
    <View style={styles.view1}>
      <StatusBar backgroundColor={"#EBECF0"} barStyle={"dark-content"} />
      <Modal visible={loggingIn} transparent={true}>
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

      <Image source={require('../../../assets/logo_origin.png')} style={styles.imgLogo} />

      <TouchableOpacity style={{marginTop: 25, marginBottom: 30, alignItems: 'center'}} onPress={() => { navigation.navigate('SignupBoard') }} >
        <Text style={{ fontSize: 32, fontWeight: '700', fontWeight: 'bold', color: '#364153', textDecorationLine:'underline' }}>{t("sign_up")}</Text>
      </TouchableOpacity>

      <ScrollView>
      <View style={styles.v4}>
        <Image source={require("../../../assets/input_bg.png")} style={{ position:'absolute', width: '100%', height: 50, resizeMode: 'stretch' }}/> 
        <Image source={require('../../../assets/username_ico.png')} style={styles.img} />
        <TextInput type='text' style={styles.in1} disableFullscreenUI={true} placeholder={t("email_or_username")} value={username} onChangeText={(val) => { setUsername(val) }} />
      </View>

      <View style={[styles.v4, {marginTop:30}]}>
        <Image source={require("../../../assets/input_bg.png")} style={{ position:'absolute', width: '100%', height: 50, resizeMode: 'stretch' }}/> 
        <Image source={require('../../../assets/password_ico.png')} style={styles.img} />
        <TextInput type='text' secureTextEntry={!showPassword} style={[styles.in1]} disableFullscreenUI={true} value={pass} placeholder={t("password")} onChangeText={(val) => { setPass(val) }} />
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

      <View style={styles.v5}>
        <TouchableOpacity activeOpacity={0.8} onPress={handleToggle}>
          <View style={[styles.switchContainer, isKeepLoggedIn && styles.switchContainerActive]}>
            <Animated.View
              style={[styles.switchHandle, { transform: [{ translateX: switchTranslateX }] }]}
            />
          </View>
        </TouchableOpacity>
        <Text style={{marginLeft:5}}>{t("keep_me_logged_in")}</Text>
      </View>

      <TouchableOpacity style={{flexDirection: 'row', borderRadius:25, marginTop: 25, marginBottom: 30, alignSelf:'center', alignItems: 'center', backgroundColor:'#364153', width:wp('87%'), height:50,}} onPress={() => { onLogin() }}>
          <Text style={{ fontSize: 16, fontWeight: '700', color: 'white', width:wp('87%'), textAlign:'center' }}>{t("login_upper")}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={{ alignSelf: 'center', marginHorizontal: wp('8%') }}>
        <Text style={{textDecorationLine:'underline', fontSize:11, fontWeight:'500'}} >{t('forgot_password')}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={{ alignSelf: 'center', marginHorizontal: wp('8%') }}>
        <Image source={require('../../../assets/fingerprint.png')} style={styles.imgFingerPrint} />
      </TouchableOpacity>

      <View style={styles.v5}>
        <TouchableOpacity style={{borderRadius:5, marginTop:20,  flexDirection: 'row', alignSelf: 'center', backgroundColor:'white', paddingRight:25, paddingLeft:25, paddingTop:10, paddingBottom:10 }}>
          <Image source={require('../../../assets/google_ico.png')} style={styles.imgGoogle} />
          <Text style={{fontSize:12, marginLeft:7, marginTop:3, fontWeight:'500'}}>{t("google")}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ borderRadius:5, marginLeft:20, marginTop:20, flexDirection: 'row', alignSelf: 'center', backgroundColor:'white', paddingRight:25, paddingLeft:25, paddingTop:10, paddingBottom:10 }}>
          <Image source={require('../../../assets/facebook_ico.png')} style={styles.imgGoogle} />
          <Text style={{fontSize:12, marginLeft:7, marginTop:3, fontWeight:'500'}}>{t("facebook")}</Text>
        </TouchableOpacity>
      </View>
      </ScrollView>
    </View>
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
    marginTop:45,
    width: 85,
    height: 85,
    alignSelf: 'center',
  },
  v4: {
    flexDirection: "row",
    alignItems:'center',
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 10,
    width: wp('87%'),
  },
  v5: {
    marginTop:20,
    flexDirection: "row",
    alignItems: 'center',
    alignSelf: 'center',
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
    autoCompleteType: "off",
    selectionColor: 'transparent',
    backgroundColor: 'transparent',
    marginLeft:15,
    marginRight:30,
    flex:1,
    fontSize:16,
  },
  img: {
    width:30,
    height:30,
    resizeMode:'contain',
    marginLeft:20
  },
  imgFingerPrint: {
    marginTop: 30,
    width: 60,
    height: 60,
    alignSelf: 'center',
    resizeMode:'contain'
  },
  imgGoogle: {
    width: 25,
    height: 25,
  },
  switchContainer: {
    width: 44,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    paddingHorizontal: 4,
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