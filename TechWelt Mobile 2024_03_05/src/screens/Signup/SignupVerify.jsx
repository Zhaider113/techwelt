import React, { useEffect, useState } from "react";
import { ImageBackground, SafeAreaView,Text, Image, StyleSheet, StatusBar, TouchableOpacity, View} from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch} from 'react-redux'
import { resendEmail } from "../../actions/auth";

export default function SignupVerify({ navigation, route }) {
  const {i18n} = useTranslation()
  const { t } = useTranslation();
  const dispatch = useDispatch()
  let { email } = route.params;
  const [lang, setLang] = React.useState('EN');

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
    <SafeAreaView style={styles.view1}>
      <StatusBar backgroundColor={"#EBECF0"} barStyle={"dark-content"} />
   
      <TouchableOpacity style={{alignItems: 'flex-end' }} onPress={setLanguage}>
        <ImageBackground style={{marginRight:20, flex:1, width: 70, height: 70}} source={require("../../../assets/lang_bg.png")}>
          <View style={{flexDirection:'row', height:70, justifyContent:'center', alignItems:'center'}}>
            <Text style={styles.txtChgLang}>{lang}</Text>
          </View>
        </ImageBackground>
      </TouchableOpacity>

      <Image source={require('../../../assets/logo_origin.png')} style={styles.imgLogo} />

      <View style={{width:wp('80%'), height:250, backgroundColor:'#CED2D9', borderRadius:10, alignSelf:'center', marginTop:100 }}>
        <Text style={{color:'#28A745', fontSize:14, fontWeight:'500', marginTop:30, alignSelf:'center', width:250}}>
          {t("verify_email_sent")}
        </Text>
        <Text style={{color:'#005EEC', fontSize:14, fontWeight:'500', marginTop:30, alignSelf:'center'}}>
          {email}
        </Text>
        <Text style={{color:'#18567F', fontSize:14, fontWeight:'500', marginTop:50, alignSelf:'center', textDecorationLine:'underline'}}>
          {t("not_received_email")}
        </Text>
        <TouchableOpacity onPress={()=> {
          const sendData = {
            email: email,
          };
          console.log(">>", sendData)
          dispatch(resendEmail(sendData, navigation));
        }}>
          <Text style={{color:'white', textAlignVertical:'center', textAlign:'center', backgroundColor:'#364153', width:150, borderRadius:10, height:35, fontSize:14, fontWeight:'500', marginTop:20, alignSelf:'center'}}>
            {t("resend_email")}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={{marginTop: 30, alignItems: 'center'}} onPress={() => { navigation.navigate('LoginBoard') }} >
          <Text style={{ fontSize: 32, fontWeight: '700', fontWeight: 'bold', color: '#364153', textDecorationLine:'underline' }}>{t("login")}</Text>
      </TouchableOpacity>
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
});