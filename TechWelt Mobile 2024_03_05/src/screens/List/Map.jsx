import React, {useState, useEffect} from "react";
import { TouchableOpacity, View, Text, ScrollView, StatusBar, StyleSheet, Image } from "react-native";
import Header from "../Header";
import MapView from "react-native-map-clustering";
import { Marker } from 'react-native-maps';

import {useTranslation} from "react-i18next";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useSelector, useDispatch } from 'react-redux';

export default function Map({ navigation, route }) {
  const {t} = useTranslation();
  let { infos } = route.params;
  const authReducer = useSelector(state => state.auth);
  const [region, setRegion] = useState({
    latitude: infos.vehicle?.lat ? infos.vehicle.lat :25.9219133,
    longitude: infos.vehicle?.lng ? infos.vehicle.lng :56.0663866,
    latitudeDelta: 0.005 * 15.5,
    longitudeDelta: 0.005 * 15.5,
  });

  useEffect(() => {
    console.log(infos.vehicle.teltonikas ? infos.vehicle.teltonikas[0].lng :56.0663866)
  },[])

  return (
    <View style={{flex:1, backgroundColor:'white'}}>
      <StatusBar backgroundColor={"#364153"} barStyle={"light-content"} />
      <Header back='true' screenName={t('locations')} curNavigation={navigation}></Header>
      <MapView
        mapType="standard"
        initialRegion={region}
        style={{width:wp('100%'), height:hp('100%') - 105}}
      > 
       <Marker coordinate={{ latitude: infos.vehicle?.lat ? infos.vehicle?.lat :25.9219133
        , longitude: infos.vehicle?.lng ? infos.vehicle?.lng :56.0663866 }} />
      </MapView>
      </View>
  );
}

const styles = StyleSheet.create({
  v1: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop:10,
    marginBottom: 10
  },
  v2: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent:'flex-end'
  },
  v3: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#18567F21',
    justifyContent: 'center',
    alignItems: 'center'
  },
  icon: {
    marginRight: 15,
    width: 31,
    height: 31,
    resizeMode: 'contain'
  },
  title: {
    marginLeft:15,
    fontSize: 15,
    color: 'black'
  },
  value: {
    fontSize: 12,
    color: '#18567F',
  },
});
