import React, {useState, useEffect} from "react";
import { TouchableOpacity, View, Text, ImageBackground, StatusBar, StyleSheet, Image } from "react-native";
import Header from "../Header";
import MapView from "react-native-map-clustering";
import { Marker } from 'react-native-maps';

// import * as Location from "expo-location"

import {useTranslation} from "react-i18next";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useSelector, useDispatch } from 'react-redux';

export default function CurrentMap({ navigation, route }) {
  const {t} = useTranslation();
  let { infos } = route.params;
  const authReducer = useSelector(state => state.auth);

  const [currentLocation, setCurrentLocation] = useState(null);
  const [initialRegion, setInitialRegion] = useState(null);

  useEffect(() => {
    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setCurrentLocation(location.coords);

      setInitialRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });
    };

    getLocation();    
  },[])

  return (
    <View style={{flex:1, backgroundColor:'white'}}>
      <StatusBar backgroundColor={"#364153"} barStyle={"light-content"} />
      <Header back='true' screenName={t('locations')} curNavigation={navigation}></Header>
      {initialRegion && (
      <MapView
        mapType="standard"
        initialRegion={initialRegion}
        style={{width:wp('100%'), height:hp('100%') - 105}}
      > 
        { currentLocation && (
         <Marker coordinate={{ latitude: currentLocation.latitude
          , longitude: currentLocation.longitude }}>
        {/* <View style={styles.callout}>
          <ImageBackground style={{width:80, height:55, resizeMode:'stretch'}} source={require("../../../assets/car_info_bg.png")}>

          <Text style={{ width:80, textAlign:'center', fontSize: 10, fontWeight: '800', color: 'white', marginTop: 4 }}>{infos.vehicle.vehicleName}</Text>
          <View style={{ flexDirection: 'row', alignSelf:'center', alignItems: 'center', }}>
            <Image style={{ width: 13, height: 13, resizeMode:'contain'}} source={require('../../../assets/speed_white.png')} />
            <Text style={{ marginLeft: 4, fontSize: 12, color:'white' }}>{infos.vehicle.teltonikas[0].speed}{" "}Km/h</Text>
          </View>
          </ImageBackground>
        </View>
        <View
          style={{width:100, marginTop:-15, alignItems:'center'}}>
          <Image style={{ width: 70, height: 40, resizeMode:'contain' }} source={require('../../../assets/car.png')} />
        </View> */}
          <Image style={{ width: 40, height: 40, resizeMode:'contain' }} source={require('../../../assets/man_stand.png')} />


            </Marker>)}


      </MapView>)}

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
