import React from 'react'
import { SafeAreaView, View, Text, Image, TouchableOpacity, StatusBar, StyleSheet } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { IconComponentProvider, Icon } from "@react-native-material/core";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { t } from 'i18next';
function Driver_detail({ navigation }) {
  return (
    <SafeAreaView style={{ marginTop: 20, backgroundColor: '#FFFF', flex: 1 }}>
      <View style={{ flexDirection: 'row', backgroundColor: '#18567F' }}>
        <TouchableOpacity style={styles.to1}>
          <Image source={require('../../assets/back.png')} />
        </TouchableOpacity>
        <Text style={styles.t1}>{t('profile')}</Text>
      </View>
      <View style={{ margin: 30 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={styles.text1}>Username</Text>
          <Text style={styles.text2}>William34</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={styles.text1}>Email</Text>
          <Text style={styles.text2}>william34@gmail.com</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={styles.text1}>{t('phone_number')}</Text>
          <Text style={styles.text2}>+1 2343 02382</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={styles.text1}>Password</Text>
          <TouchableOpacity style={{ position: 'absolute', left: 285 }}>
            <IconComponentProvider IconComponent={MaterialCommunityIcons}>
              <Icon name="chevron-right" size={25} color="#5D5C59" />
            </IconComponentProvider></TouchableOpacity>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={styles.text1}>{t('language')}</Text>
          <TouchableOpacity style={{ position: 'absolute', left: 285 }}>
            <IconComponentProvider IconComponent={MaterialCommunityIcons}>
              <Icon name="chevron-right" size={25} color="#5D5C59" />
            </IconComponentProvider></TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={styles.text1}>{t('maps')}</Text>
          <TouchableOpacity style={{ position: 'absolute', left: 285 }}>
            <IconComponentProvider IconComponent={MaterialCommunityIcons}>
              <Icon name="chevron-right" size={25} color="#5D5C59" />
            </IconComponentProvider></TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={styles.text1}>{t('help')}</Text>
          <TouchableOpacity style={{ position: 'absolute', left: 285 }}>
            <IconComponentProvider IconComponent={MaterialCommunityIcons}>
              <Icon name="chevron-right" size={25} color="#5D5C59" />
            </IconComponentProvider></TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={styles.text1}>{t('about_us')}</Text>
          <TouchableOpacity style={{ position: 'absolute', left: 285 }} onPress={() => { navigation.navigate('Membership') }}>
            <IconComponentProvider IconComponent={MaterialCommunityIcons}>
              <Icon name="chevron-right" size={25} color="#5D5C59" />
            </IconComponentProvider></TouchableOpacity>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={styles.text1}>{t('term_and_condition')}</Text>
          <TouchableOpacity style={{ position: 'absolute', left: 285 }}>
            <IconComponentProvider IconComponent={MaterialCommunityIcons}>
              <Icon name="chevron-right" size={25} color="#5D5C59" />
            </IconComponentProvider></TouchableOpacity>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={styles.text1}>{t('note_the_app')}</Text>
          <TouchableOpacity style={{ position: 'absolute', left: 285 }}>
            <IconComponentProvider IconComponent={MaterialCommunityIcons}>
              <Icon name="chevron-right" size={25} color="#5D5C59" />
            </IconComponentProvider></TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={styles.text1}>{t('disconnect')}</Text>
          <TouchableOpacity style={{ position: 'absolute', left: 285 }}>
            <IconComponentProvider IconComponent={MaterialCommunityIcons}>
              <Icon name="chevron-right" size={25} color="#5D5C59" />
            </IconComponentProvider></TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  )
}

export default Driver_detail
const styles = StyleSheet.create({
  v1: {
    flex: 1,
    backgroundColor: 'white'
  },
  t1: {
    fontSize: 18,
    fontWeight: '500',
    marginLeft: 95,
    marginTop: 22,
    color: '#FFFF'
  },
  to1: {
    width: 30,
    height: 30,
    borderRadius: 40,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
    backgroundColor: '#FFFF',
    borderColor: '#FFFF'
  },
  view1: {
    width: 20, height: 20, borderRadius: 20,
    backgroundColor: '#18567F', justifyContent: 'center', alignItems: 'center', position: 'absolute',
  },
  view2: {
    width: 336,
    height: 170, position: 'absolute',
    left: 12,
    backgroundColor: 'white',
    borderRadius: 10,
    top: 480
  },
  text1: {
    fontSize: 19,
    fontWeight: '500',
    marginBottom: 20
  },
  text2: {
    fontSize: 16,
    fontWeight: '400'
  },
  bottomtab: {
    width: wp('100%'),
    backgroundColor: 'white',
    height: hp('8%'),
    position: 'absolute',
    top: hp('95%'),
    elevation: 10
  },
  newCar: {
    width: 60,
    height: 60,
    alignItems: 'center',
    backgroundColor: '#18567F',
    justifyContent: 'center',
    marginTop: -30,
    borderRadius: 20,
    alignSelf: 'center',
  },
});