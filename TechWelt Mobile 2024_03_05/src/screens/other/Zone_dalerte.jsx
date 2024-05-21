import React, { useEffect, useState } from 'react'
import {
  SafeAreaView, Text, View, Image,Alert,
  TouchableOpacity, StatusBar, StyleSheet, ScrollView
} from 'react-native'
import { IconComponentProvider, Icon } from "@react-native-material/core";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Entypo } from '@expo/vector-icons';

import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { showVehicles, deletePolygonData } from '../actions/vehicles';
import { useSelector, useDispatch } from 'react-redux'
import { t } from 'i18next';


function Zone_dalerte({ navigation, route }) {

  const dispatch = useDispatch()

  const userReducer = useSelector(state => state.auth);
  const vehicleReducer = useSelector(state => state.realtimeVehicles);

  const selectedVehicleID = vehicleReducer.seletedvehicleID;

  
  const info = route.params.infos;
  //console.log("selectedVehicle:::::::", selectedVehicleID)

  const polygonData = vehicleReducer.vehicles[selectedVehicleID].vehicle.polygonData;
  //console.log("@@@@@polygonData ",vehicleReducer.vehicles[selectedVehicleID].vehicle);
  const deviceImei = vehicleReducer.vehicles[selectedVehicleID].vehicle.teltonikas.deviceImei;
  const getPolygonList = () => {
    //console.log("Zone Dalerte showVehicles")
    dispatch(getRealtimeVehicles(userReducer.token, userReducer.user._id));

  }
  const deletePolygonItem = (index) => {
    //console.log("token", userReducer.token)
    //console.log("deviceImei", deviceImei)
    //console.log("index", index)
    Alert.alert(
      t('warning'),
      t('are_you_going_to_delete_this_vehicle'),
      [
        {
          text: t('yes'),
          onPress: () => deletePolygon(index),
        },
        {
          text: t('no'),
          onPress: () => {}
        },
      ],
    );
  }
  
  const deletePolygon = (index) =>{
    dispatch(deletePolygonData(userReducer.token, deviceImei, index, userReducer.user._id));
  }


  const editPolygonItem = (index) => {
    navigation.navigate("EditGeoData", { "index": index })
  }

  useFocusEffect(
    useCallback(() => {
      getPolygonList()

    }, [])
  )

  return (
    <SafeAreaView style={{ paddingTop: 20, backgroundColor: '#F9F9F9', flex: 1, overflow: 'scroll' }}>
      <StatusBar backgroundColor={'white'} barStyle={'dark-content'} />
      <Entypo
        name="circle-with-plus"
        size={28}
        color="#18567F"
        style={{ marginLeft: wp('85%') }}
        onPress={() => { navigation.navigate('Barriere', { "infos": info }) }}
      />
      <ScrollView style={{ overflow: 'scroll', height: hp('80%') }}>
        {
          polygonData.map((polygonItem, index) => {
            return (
              <View
                key={index}
                style={styles.alertBlock}>

                <View style={{
                  backgroundColor: '#FFFF', paddingBottom: 12,
                  borderTopLeftRadius: 10, borderTopRightRadius: 10, elevation: 0.5
                }}>
                  <View style={{ flexDirection: "row", justifyContent: 'space-between', width: wp('75%'), marginTop: 8, alignItems: 'center', alignSelf: 'center' }} >
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: wp('75%') }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{
                          backgroundColor: '#18567F', alignItems: 'center',
                          justifyContent: 'center', width: 35, height: 35, borderRadius: 40,

                        }}>
                          <Image source={require('../../assets/hash.png')} style={{ width: 15, height: 15 }} />
                        </View>
                        <Text style={styles.t2}>{polygonItem.title}</Text>
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity
                          onPress={() => editPolygonItem(index)}
                        >
                          <IconComponentProvider IconComponent={MaterialCommunityIcons} >
                            <Icon name="pencil" size={20} color="#5D5C59" style={{ alignSelf: 'center', marginTop: -2 }} />
                          </IconComponentProvider>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => deletePolygonItem(index)}
                        >
                          <IconComponentProvider IconComponent={MaterialCommunityIcons} >
                            <Icon name="delete" size={20} color="#5D5C59" style={{ alignSelf: 'center', marginTop: -2 }} />
                          </IconComponentProvider>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>

                  <Text style={{ fontSize: 12, fontWeight: '400', marginLeft: 20, marginTop: 10 }}>{polygonItem.content}</Text>
                </View>
                <View style={{ backgroundColor: "#18567F1F", borderBottomLeftRadius: 10, borderBottomRightRadius: 10, borderWidth: 1, borderTopWidth: 0, borderColor: "#18567F40" }}>
                  <View style={{ width: wp('80%'), alignSelf: 'center', height: 40, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 12, fontWeight: '600', color: '#18567F' }}>{t('setting_alert')}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                    <View style={{ flexDirection: 'row' }}>
                      <View style={{
                        width: 20, height: 20, borderWidth: 1, borderRadius: 2, flexDirection: 'row',
                        alignItems: 'center', borderColor: 'rgba(0, 0, 0, 0.28)', marginBottom: 10
                      }} >
                        {polygonItem.enter ? (<IconComponentProvider IconComponent={MaterialCommunityIcons} >
                          <Icon name="check" size={20} color="#5D5C59" style={{ alignSelf: 'center', marginTop: -2 }} />
                        </IconComponentProvider>) : null}
                      </View>
                      <Text style={{ fontSize: 12, fontWeight: '500', marginLeft: 10,marginTop:2 }}>{t('enter')}</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                      <View style={{
                        width: 20, height: 20, borderWidth: 1, borderRadius: 2,
                        alignItems: 'center', borderColor: 'rgba(0, 0, 0, 0.28)'
                      }} >
                        {polygonItem.sortie ? (<IconComponentProvider IconComponent={MaterialCommunityIcons}>
                          <Icon name="check" size={20} color="#5D5C59" style={{ alignSelf: 'center', marginTop: -2 }} />
                        </IconComponentProvider>) : null}
                      </View>
                      <Text style={{ fontSize: 12, fontWeight: '500', marginLeft: 10 ,marginTop:2}}>{t('out')}</Text>
                    </View>
                  </View>
                </View>
              </View>
            )
          })
        }
      </ScrollView>
    </SafeAreaView>
  )
}

export default Zone_dalerte
const styles = StyleSheet.create({
  v1: {
    flex: 1,
    backgroundColor: 'white'
  },
  t1: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: wp('20%'),
    marginTop: hp('4%')
  },
  view1:
  {
    backgroundColor: '#18567F',
    width: 30.83, height: 30.83,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginLeft: 70
  },
  t2: {
    fontSize: 14,
    fontWeight: '600',
    color: '#18567F',
    marginLeft: 5
  },
  alertBlock: {
    backgroundColor: '#FFF',
    marginTop: hp('1%'),
    width: wp('85%'),
    alignSelf: 'center',
    borderRadius: 10,
    marginBottom: 10,
    elevation: 1
  }
});