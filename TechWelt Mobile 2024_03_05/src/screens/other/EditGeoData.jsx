import React, { useState } from 'react'
import { SafeAreaView, Text, TouchableOpacity, Image, View, Modal, ActivityIndicator, 
     StatusBar, StyleSheet, Slider, TextInput } from 'react-native'
import MapView, { Marker, Polygon, Polyline } from 'react-native-maps';
import { IconComponentProvider, Icon } from "@react-native-material/core";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useDispatch, useSelector } from 'react-redux';
import { updateGeofensePos } from "../actions/vehicles";
//import GeoFencing from 'react-native-geo-fencing';
import MapViewDirections from 'react-native-maps-directions';
import axios from 'axios';
import { toastr } from '../services/navRef';
import { useEffect } from 'react';
import {useTranslation} from "react-i18next";

const GOOGLE_API_KEY = "AIzaSyB_X2kKYs1hiQB2N4lCrhqQzLx9Te_0GG8"

function EditGeoData({ navigation, route }) {
    const {t} = useTranslation()
    const [show3, setShow3] = useState(false)
    const [show4, setShow4] = useState(false)
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [val, setVal] = useState(0.3)
    const [polygonData, setPolygonData] = useState([])  // point List of touch event
    const [roadPointList, setRoadPoinList] = useState([]) // Point List of real Road
    const [btnDisabledComp, setBtnDisabledComp] = useState(false)
    const [btnDisabledSave, setBtnDisabledsave] = useState(true)
    const [showStyle, setShowStyle] = useState(true)
    
    const dispatch = useDispatch()

    const userReducer = useSelector(state => state.auth);
    const token = userReducer.token;

    const vehicleReducer = useSelector(state => state.realtimeVehicles);

    const selectedVehicleID = vehicleReducer.seletedvehicleID;
    const dbPolygonData = vehicleReducer.vehicles[selectedVehicleID].vehicle.polygonData;
    const deviceImei = vehicleReducer.vehicles[selectedVehicleID].vehicle.teltonikas.deviceImei;
    const index = route.params.index;
    const [region, setRegion] = useState({})
    
    useEffect(() => {
        setRoadPoinList(dbPolygonData[index].polygonData)
        setShow3(dbPolygonData[index].enter)
        setShow4(dbPolygonData[index].sortie)
        setTitle(dbPolygonData[index].title)
        setContent(dbPolygonData[index].content)
        setPolygonData(dbPolygonData[index].selPointData)
        setRegion({
            latitude : dbPolygonData[index].polygonData.length > 0 ? dbPolygonData[index].polygonData[0].latitude : vehicleReducer.vehicles[selectedVehicleID].vehicle.teltonikas.lat,
            longitude : dbPolygonData[index].polygonData.length > 0 ? dbPolygonData[index].polygonData[0].longitude : vehicleReducer.vehicles[selectedVehicleID].vehicle.teltonikas.lng,
            latitudeDelta: 2,
            longitudeDelta: 1
        })
    }, [])


    const onValueChange = (newValue) => {
        setVal(newValue);
    };

    const handlePressMap = async (coordinate) => {
        //console.log("coordinate::::::", coordinate);
        
        setPolygonData((polygonData) => [...polygonData, coordinate])
    }

    const handleCompleteGeo = async () =>{
        //console.log("@@@@@@@@@@@@@@",polygonData.length)
    if (polygonData.length < 3){
        toastr(t('please_set_3_points'))
        return;
      } 
  
      setRoadPoinList([]);
      setBtnDisabledComp(true);
      setBtnDisabledsave(true);
  
      var temppolygonData;
      //temppolygonData = rearrangePointsForConvex(polygonData);
      //temppolygonData = rearrangePointsForConcave(polygonData);
      //console.log("@@@isConvexPolygon",isConvexPolygon(polygonData));
      //console.log("@@@before",polygonData);
      
      // if(isConvexPolygon(polygonData)){
      //   temppolygonData = rearrangePointsForConvex(polygonData);
      // }else{
      //   temppolygonData = rearrangePointsForConcave(polygonData);      
      // }
  
      temppolygonData = polygonData;
      
      //console.log("@@@@polygonData.length",polygonData)
      var lenPolygonData = temppolygonData.length;
      var cntPoint = (25 - (25 % lenPolygonData)) / lenPolygonData;
      for(var index=0;index < lenPolygonData;index++){
        var firstPonit,nextPoint;
        //console.log("@@@@index",index)
        firstPonit = temppolygonData[index];
        if(index == (lenPolygonData-1))
          nextPoint = temppolygonData[0];
        else
          nextPoint = temppolygonData[index+1];
  
        const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${firstPonit.latitude},${firstPonit.longitude}&destination=${nextPoint.latitude},${nextPoint.longitude}&mode=driving&sensor=false&units=metric&key=${global.GOOGLE_MAPS_API_KEY}`
  
        //console.log("@@@@firstPonit",firstPonit)
        //console.log("@@@@nextPoint",nextPoint)
  
        //console.log(url)
  
        await axios.get(url)
          .then( async (response) => {
            try {
              if (response.data && response.data.routes && response.data.routes.length > 0) {
                //console.log(response.data.routes)
                var steps = response.data.routes[0].legs[0].steps;
                //console.log("handlePressMap ",steps)
                //setRoadPoinList([])
                var incVal = cntPoint >= steps.length ? 1 : (steps.length - steps.length % cntPoint) / cntPoint + 1;
                //console.log("handlePressMap ",cntPoint,steps.length,incVal);
  
                for (let index = 0; index < steps.length; index = index + incVal) {
                  //console.log("Start_Address:::::", response.data.routes[index].legs[0].start_location)
                  //console.log("start_location:::::", steps[index].start_location)
                  //console.log("@@@@@@",steps.length)
                  const start_location = steps[index].start_location;
                  const PtItem = { latitude: start_location.lat, longitude: start_location.lng }
                  if(roadPointList.length > 25) break;
                  setRoadPoinList((roadPointList) => [...roadPointList, PtItem])
                }
              }else{
                toastr(t('please_reselect_coordinates'))
              }
            } catch (e) {
              console.log("error occured catch:::", e)
              toastr(t('please_reselect_coordinates'))
            }
          }).catch((err) => {
            console.log("error occured:::", err)
            toastr(t('please_reselect_coordinates'))
          });
      }
  
      //console.log(roadPointList.length)
  
      setBtnDisabledsave(false);
      setBtnDisabledComp(false);
    
    }

    const handleUpdateGeo = () => {
        console.log("Handle Update Geofense", deviceImei)
        if (roadPointList.length < 3){
            toastr(t('please_set_3_points'))
            return;
        } 
        if(title == ""){
            toastr(t('please_enter_title'))
            return;
        }
    
        if(content == ""){
            toastr(t('please_enter_content'))
            return;
        }

        dispatch(updateGeofensePos(token, deviceImei, roadPointList, show3, show4, index, title, content, polygonData));
        navigation.goBack()
    }

    const handleFocus = (val) =>{
        setShowStyle(val);
      }

    const handleTitleChange = (title) => {
        setTitle(title)
    }

    const handleContentChange = (content) => {
        setContent(content)
    }

    const clearPointList = () => {
        setPolygonData([])
        setRoadPoinList([])
    }
    

    return (
         <SafeAreaView style={{ marginTop: 20 }}>
            <Modal visible={btnDisabledComp} transparent={true}
                onRequestClose={() => {
                    setBtnDisabledComp(false);
                }}
            >
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.1)' }}>
                    <ActivityIndicator size="large" color="rgba(54, 52, 53, 1)" />
                </View>
            </Modal>
            <MapView
                region={region}
                onPress={(e) => {
                    handlePressMap(e.nativeEvent.coordinate)
                }}
                style={{ width: wp('97%'), height: hp('81%'), borderRadius: 10, alignSelf: 'center' }}>                
                { polygonData && polygonData.map((coordinate, index) => (
                    <Marker
                        key={index}
                        coordinate={coordinate}
                    />
                ))}
                {roadPointList.length > 2 && <MapViewDirections
                    origin={{
                        latitude: roadPointList[0].latitude, // Replace with your start latitude
                        longitude: roadPointList[0].longitude, // Replace with your start longitude
                    }}
                    destination={{
                        latitude: roadPointList[roadPointList.length - 1].latitude, // Replace with your end latitude
                        longitude: roadPointList[roadPointList.length - 1].longitude, // Replace with your end longitude
                    }}
                    waypoints={roadPointList.slice(1, roadPointList.length - 1)}          
                    apikey={global.GOOGLE_MAPS_API_KEY} // Replace with your Google Maps API key
                    strokeWidth={4}
                    strokeColor="#18567F"
                    fillColor="#bbb"
                    />}
                    {roadPointList.length > 2 && <MapViewDirections
                    origin={{
                        latitude: roadPointList[roadPointList.length - 1].latitude, // Replace with your start latitude
                        longitude: roadPointList[roadPointList.length - 1].longitude, // Replace with your start longitude
                    }}
                    destination={{
                        latitude: roadPointList[0].latitude, // Replace with your end latitude
                        longitude: roadPointList[0].longitude, // Replace with your end longitude
                    }}
                    apikey={global.GOOGLE_MAPS_API_KEY} // Replace with your Google Maps API key
                    strokeWidth={4}
                    strokeColor="#18567F"
                    fillColor="#bbb"
                    />}
            </MapView>
            <View style={styles.view4}>
                <TouchableOpacity
                    style={[styles.view5, {}]}
                    onPress={() => {
                        {
                            if (val <= 0) { setVal(0) } else { setVal(val - 0.1) }
                        }
                    }}>
                    <Text style={{ fontSize: 15, fontWeight: 'bold' }}>-</Text>
                </TouchableOpacity>
                <Text style={{}}>100m</Text>
                <Slider
                    styleAttr="Horizontal"
                    minimumValue={0}
                    maximumValue={1}
                    step={0.1}
                    value={val}
                    onValueChange={onValueChange}
                    thumbTintColor="#18567F"
                    minimumTrackTintColor="#18567F"
                    style={{ color: '#18567F', width: 144, }} />
                <Text style={{}}>5000m</Text>
                <TouchableOpacity
                    style={[styles.view5,]}
                    onPress={() => {
                        if (val >= 1) { setVal(1) } else { setVal(val + 0.1) }
                    }}>
                    <Text style={{ fontSize: 15, fontWeight: 'bold' }}>+</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity
                style={styles.syncButton}
                onPress={() => clearPointList()}
            >
                <Image source={require('../../assets/sync.png')} />
            </TouchableOpacity>
            <View style={showStyle ? styles.view2 : styles.view21}>
                <View style={styles.view3}>
                    <TextInput
                        placeholder={t('title')}
                        onChangeText={handleTitleChange}
                        onFocus={() =>handleFocus(false)}
                        onEndEditing={() =>handleFocus(true)}
                        value={title}
                        style={{ fontSize: 13, textAlign: 'center', fontWeight: '500', width: '30%', height: 35, borderWidth: 1, borderColor: "#555", borderRadius: 6 }}
                    />
                    <TextInput
                        placeholder={t('content')}
                        onChangeText={handleContentChange}
                        onFocus={() =>handleFocus(false)}
                        onEndEditing={() =>handleFocus(true)}
                        value={content}
                        style={{ fontSize: 13, textAlign: 'center', fontWeight: '500', width: '60%', height: 35, borderWidth: 1, borderColor: "#555", borderRadius: 6 }}
                    />
                </View>
                <View style={[styles.view3, { marginTop: hp('3%') }]}>
                    <Text style={{ fontSize: 11, fontWeight: '600', color: '#18567F' }}>{t('setting_alert')}</Text>
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity style={styles.checkBox}
                            onPress={() => { setShow3(!show3) }}>
                            {show3 ? (<IconComponentProvider IconComponent={MaterialCommunityIcons}>
                                <Icon name="check" size={20} color="#5D5C59" />
                            </IconComponentProvider>) : null}
                        </TouchableOpacity>
                        <Text style={{ fontSize: 10, fontWeight: '500', marginLeft: 10 ,marginTop:3}}>{t('enter')}</Text>
                    </View>

                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity style={styles.checkBox}
                            onPress={() => { setShow4(!show4) }}>
                            {show4 ? (<IconComponentProvider IconComponent={MaterialCommunityIcons}>
                                <Icon name="check" size={20} color="#5D5C59" />
                            </IconComponentProvider>) : null}
                        </TouchableOpacity>
                        <Text style={{ fontSize: 10, fontWeight: '500', marginLeft: 10 ,marginTop:3}}>{t('out')}</Text>
                    </View>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                    <TouchableOpacity disabled={btnDisabledComp}
                        onPress={handleCompleteGeo}            
                        style={styles.bigButton}>
                        <Text style={{ color: '#FFFF', fontSize: 14, fontWeight: '500' }}>{t('complete')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity disabled={btnDisabledSave}
                        onPress={handleUpdateGeo}
                        style={styles.bigButton}>
                        <Text style={{ color: '#FFFF', fontSize: 14, fontWeight: '500' }}>{t('update')}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default EditGeoData

const styles = StyleSheet.create({
    v1: {
        flex: 1,
        backgroundColor: 'white'
    },
    t1: {
        fontSize: 14,
        fontWeight: '400',
        color: '#FFFF',
        alignSelf: 'center',
        textAlign: 'center',
        marginTop: hp('5%')
    },
    to1: {
        position: 'absolute',
        width: 30,
        height: 30,
        left: 30,
        top: hp('4%'),
        borderRadius: 40,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFF',
        borderColor: '#FFFF'
    },
    view1: {
        width: 20,
        height: 20,
        borderRadius: 20,
        backgroundColor: '#18567F',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
    },
    view2: {
        width: wp('93%'),
        position: 'absolute',
        backgroundColor: 'white',
        alignSelf: 'center',
        borderRadius: 10,
        top: hp('75%')
    },
    view21: {
        width: wp('93%'),
        position: 'absolute',
        backgroundColor: 'white',
        alignSelf: 'center',
        borderRadius: 10,
        top: hp('55%')
    },
    view3: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginTop: hp('2.5%'),
    },
    view4: {
        position: 'absolute',
        width: wp('85%'),
        height: hp('7%'),
        backgroundColor: '#FFFF',
        borderRadius: 10,
        top: hp('14%'),
        flexDirection: 'row',
        alignSelf: 'center',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center'
    },
    view5: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 25,
        height: 25,
        borderWidth: 0.7,
        borderRadius: 20
    },
    syncButton: {
        position: 'absolute',
        top: hp('60%'),
        left: wp('6%'),
        width: 35,
        height: 35,
        backgroundColor: '#FFFF',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5
    },
    checkBox: {
        width: wp('5%'),
        height: wp('5%'),
        borderWidth: 0.3,
        alignItems: 'center',
        borderRadius: 2
    },
    bigButton: {
        width: 150,
        height: 50,
        backgroundColor: '#18567F',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        marginBottom: hp('2.5%'),
        marginHorizontal: 20,
        marginVertical: hp('2.5%'),

    }
})