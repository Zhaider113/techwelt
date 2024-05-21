import React from "react";
import { ScrollView, View, Text, StyleSheet, StatusBar } from "react-native";
import Header from "../Header";
import {useTranslation} from "react-i18next";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function User_Detail({ navigation, route }) {

  const {t} = useTranslation();
  let { infos, index } = route.params;

  return (
    <View style={{flex:1, backgroundColor:'#F1F4FA'}}>
      <StatusBar backgroundColor={"#364153"} barStyle={"light-content"} />
      <Header back='true' screenName={t('user_detail')} curNavigation={navigation}></Header>
   
      <ScrollView>
      <View style={{flexDirection:'column', justifyContent:'space-between',alignSelf:'center',alignItems:'center'}}>

        <View style={{width:wp('84.8%'), marginTop:10}}>
          <Text style={styles.inputHeader}>{t('first_name')}</Text>
          <Text style={styles.in1}>{infos.lname}</Text>
        </View>

        <View style={{width:wp('84.8%'), marginTop: 20}}>
          <Text style={styles.inputHeader}>{t('username')}</Text>
          <Text style={styles.in1}>{infos.fname}</Text>
        </View>

        <View style={{width:wp('84.8%'), marginTop:20}}>
          <Text style={styles.inputHeader}>{t('mobile_no')}</Text>
          <Text style={styles.in1}>{infos.phone}</Text>
        </View>

        <View style={{width:wp('84.8%'), marginTop: 15}}>
          <Text style={styles.inputHeader}>{t('email')}</Text>
          <Text style={styles.in1}>{infos.email}</Text>
        </View>

        <View style={{width:wp('84.8%'), marginTop:20}}>
          <Text style={styles.inputHeader}>{t('country')}</Text>
          <Text style={styles.in1}>{infos.country}</Text>
        </View>

        <View style={{width:wp('84.8%'), marginTop:20}}>
          <Text style={styles.inputHeader}>{t('address')}</Text>
          <Text style={styles.in1}>{infos.address}</Text>
        </View>

        <View style={{width:wp('84.8%'), marginTop:10}}>
          <Text style={styles.inputHeader}>{t('user_role')}</Text>
          <Text style={styles.in1}>{infos.role}</Text>
        </View>

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
    paddingTop:10,
    height: 40,
    marginTop: 5,
    color:'#1E6B97', fontSize:14, fontWeight:'bold',
    borderRadius: 8, borderWidth: 1, borderColor: '#A9A9A9',
    paddingLeft: 15, paddingRight: 15
  },
  inputHeader: {
    fontSize: 11, 
    color: '#333',
    fontWeight:'500'
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
