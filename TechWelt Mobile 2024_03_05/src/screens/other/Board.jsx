
import * as React from 'react';
import { useEffect } from 'react';
import { Button, View, Text, SliderComponent, BackHandler } from 'react-native';
import { StyleSheet } from 'react-native';
import { Image, StatusBar } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import {useTranslation} from "react-i18next";

export default function Board({ navigation }) {
  const {t} = useTranslation();

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    }
  })

  const handleBackPress = () =>{
    //console.log("@@@ Board Back press")
    //navigation.goBack();
    //return true;
  }

  return (
    <View style={styles.container}>
      <View style={{
        width: wp('32%'), height: hp('20%'), backgroundColor: '#18567F0A', borderRadius: 100
        , position: 'absolute', left: wp('92%'), top: -28
      }}></View>

      <View style={{
        width: wp('32%'), height: hp('20%'), backgroundColor: '#18567F0A', borderRadius: 100
        , position: 'absolute', left: -63, top: 156
      }}></View>
      <TouchableOpacity style={{
        position: 'absolute', left: wp('80%'), top: 37, backgroundColor: '#18567F',
        padding: 5, borderRadius: 6
      }}>
        <Text style={{ color: '#FFFF', fontSize: 15, fontWeight: '400' }}>FR</Text>
      </TouchableOpacity>
      <Image source={require('../../assets/signuplogo.png')} style={styles.image} />
      <TouchableOpacity style={styles.buttonLogin} onPress={() => {navigation.navigate('LoginBoard'); }}>
        <Text style={styles.buttonText}>{t('login')}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonSignup} onPress={() => { navigation.navigate('SignupBoard') }}>
        <Text style={[styles.buttonText, { color: '#18567F' }]}>{t('signup')}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={{
        width: 124, height: 5, borderRadius: 5, alignSelf: 'center',
        backgroundColor: 'rgba(54, 52, 53, 1)', position: 'absolute', top: hp('102%')
      }}>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    position: 'absolute',
    alignSelf: 'center',
    top: hp('35%'),
    width: wp('25%'),
    height: wp('20%'),
    marginTop: hp('4%')
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonSignup: {
    position: 'absolute',
    top: hp('82%'),
    width: wp('80%'),
    height: hp('7%'),
    borderWidth: wp('0.6%'),
    backgroundColor: '#ffffff',
    borderColor: '#18567F',
    borderRadius: wp('3%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonLogin: {
    position: 'absolute',
    top: hp('72%'),
    width: wp('80%'),
    height: hp('7%'),
    backgroundColor: '#18567F',
    borderRadius: wp('3%'),
    alignItems: 'center',
    justifyContent: "center",
  },
  buttonText: {
    color: '#ffffff',
    fontSize: wp('4%'),
    fontWeight: '600'
  },
});