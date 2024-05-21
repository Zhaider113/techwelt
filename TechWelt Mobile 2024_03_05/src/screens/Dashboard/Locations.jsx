import React, { useState, useEffect, useRef } from "react";
import { SafeAreaView, View, Text, StatusBar, StyleSheet, TextInput, Linking , Alert,
  TouchableOpacity, Image, ImageBackground } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import MapView from "react-native-map-clustering";
import { Marker } from 'react-native-maps';
import Swiper from 'react-native-swiper'
import StreetViewComponent from './StreetViewComp';
import Geocoder from 'react-native-geocoding';
import { useFocusEffect } from "@react-navigation/native";
import {useTranslation} from "react-i18next";
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedVehicleID, vehicleList } from '../../actions/vehicles';
import { toastr } from "../../services/navRef";
import moment from 'moment';


Geocoder.init(global.GOOGLE_MAPS_API_KEY);

export default function Locations({ navigation, route }) {
  const {t} = useTranslation();

  const [receiveData, setReceiveData] = useState();
  const dispatch = useDispatch();

  const userReducer = useSelector(state => state.auth);
  const vehicleReducer = useSelector(state => {
    return state.vehicles;
  });

  const [resultData, setResultData] = useState();
  const markerRef = useRef(null);
  const calloutRef = useRef(null);  
  const mapRef = useRef(null);

  const [searchText, setSearchText] = useState("");

  const [zoomLevel, setZoomLevel] = useState(5);

  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [selectedMarkerId, setSelectedMarkerId] = useState(null);
  const [selectedVehicleIndex, setSelectedVehicleIndex] = useState(0);
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [showPanel, setPanelShow] = useState(false);// show bottom page panel

  const [mapType, setMapType] = useState('standard');
  const [map3DView, set3DView] = useState(false);
  const [streetViewUrl, setStreetViewUrl] = useState('');
 
  const [region, setRegion] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.005 * 1,
    longitudeDelta: 0.005 * 1,
  });

  const timerIdRef = useRef(null);
  const [isTimerId, setIsTimerId] = useState(null)
  const startTimer = () => {
    const timerId = setInterval(() => {
      console.log(">>>>>>>>>Location Timer", timerId);
      dispatch(vehicleList(userReducer?.token, userReducer?.user?._id));
    }, 5000);
    timerIdRef.current = timerId;
    setIsTimerId(timerId);
  }


  useFocusEffect(React.useCallback(() => {
    startTimer();
    return ()=>{
      console.log(">>>>>>>>>Location End", timerIdRef.current)
      clearInterval(timerIdRef.current);
    }
  }, []));

  useEffect(() => {
    
  },[route.params])

  useEffect(() => {
    dispatch(vehicleList(userReducer?.token, userReducer?.user?._id));

    const getReverseGeocode = async () => {
      try {
        const response = await Geocoder.from(37.7749, -122.4194);
        const address = response.results[0].formatted_address;
        Alert.alert(
          "test",
          address,
          [
            {
              text: t('yes'),
            },
            {
              text: t('no'),
            },
          ],
        );
      } catch (error) {
       
      }
    };

    getReverseGeocode();
  },[])

  useEffect(() => {
    
    setResultData({
      ...vehicleReducer,
      vehiclesList: filterData(vehicleReducer?.vehiclesList?.filter(item => item?.vehicle?.teltonikas?.length !== 0))
    })
    
    if(route?.params?.infos) {
      console.log("$$$2", filterData(vehicleReducer?.vehiclesList?.filter(item => item.vehicle?.teltonikas?.length > 0)).findIndex(item => item.vehicle.deviceImei === route.params.infos.vehicle.deviceImei));
      setSelectedVehicle(route.params.infos)
      setSelectedVehicleIndex(filterData(vehicleReducer?.vehiclesList?.filter(item => item.vehicle?.teltonikas?.length > 0)).findIndex(item => item.vehicle.deviceImei === route.params.infos.vehicle.deviceImei));
      setRegion({
        latitude: route.params.infos.vehicle?.lat,
        longitude: route.params.infos.vehicle?.lng,
        // latitude: filterVehicles[0]?.vehicle?.teltonikas[filterVehicles[0]?.vehicle?.teltonikas?.length - 1]?.lat,
        // longitude: filterVehicles[0]?.vehicle?.teltonikas[filterVehicles[0]?.vehicle?.teltonikas?.length - 1]?.lng,
        latitudeDelta: 0.005 * 1,
        longitudeDelta: 0.005 * 1,});

    } else {
      if(filterData(vehicleReducer?.vehiclesList && vehicleReducer?.vehiclesList)?.length > 0) {
        let vehicles = vehicleReducer?.vehiclesList;
        let filterVehicles =  filterData(vehicles?.filter(item => item?.vehicle?.teltonikas.length !== 0));
        // console.log(">>>>",filterVehicles)
        // console.log("!!!!!",vehicles)
        
        if(filterVehicles?.length > 0){
          setRegion({
            latitude: filterVehicles[0]?.vehicle?.lat,
            longitude: filterVehicles[0]?.vehicle?.lng,
            // latitude: filterVehicles[0]?.vehicle?.teltonikas[filterVehicles[0]?.vehicle?.teltonikas?.length - 1]?.lat,
            // longitude: filterVehicles[0]?.vehicle?.teltonikas[filterVehicles[0]?.vehicle?.teltonikas?.length - 1]?.lng,
            latitudeDelta: 0.005 * 1,
            longitudeDelta: 0.005 * 1,});
        } 
      }
    }
  },[vehicleReducer.vehiclesList, route.params])

  const toggleMapType = () => {
    const newMapType = (mapType === 'standard') ? 'satellite' : 'standard';
    setMapType(newMapType);
  }

  const toggleLocation = () => {
  }

  const toggle3DView = () => {
    console.log(">>>>>>>>>>", streetViewUrl)
    if (streetViewUrl === '') {
      toastr(t('plz_select_vehicle'));
      return;
    }
    set3DView(!map3DView);
  }

  const handleMapRegionChange = (region) => {
    const currentZoomLevel = Math.round(Math.log(360 / region.longitudeDelta) / Math.LN2);
    setZoomLevel(currentZoomLevel);
  };

  const toggleCallOut = () => {
    if (markerRef.current && calloutRef.current) {
      if (!showPanel) {
        setTimeout(() => { // Use setTimeout to ensure map has adjusted to marker position before animating the callout open.
          markerRef.current.showCallout();
        }, 0);
      } else {
        markerRef.current.hideCallout();
      }
    }
  }

  const closePanel = () => {
    setPanelShow(false);
  }

  const onMapPress = () => {
    setPanelShow(false);
    setSelectedMarkerId(null);
    // setSelectedVehicleIndex(0);
  }

  // press vehicle
  const onMarkPress = async (coordinate, vehicle, index) => {
    setSelectedVehicle(vehicle);
    setSelectedVehicleIndex(filterData(vehicleReducer?.vehiclesList?.filter(item => item.vehicle?.teltonikas?.length > 0)).findIndex(item => item.vehicle.deviceImei === vehicle.vehicle.deviceImei));
    // setSelectedVehicleIndex(0);
    
    let { latitude, longitude } = coordinate;
    setStreetViewUrl(`https://www.google.com/maps/@?api=2&map_action=pano&viewpoint=${latitude},${longitude}&heading=235&pitch=10&size=600x300&fov=90`);

    setPanelShow(true);
    setSelectedMarkerId(vehicle.vehicle._id);
    toggleCallOut();
  }

  const calculateHeading = (cord1, cord2) => {
    if (cord2) {
      const {lat: lat1, lng: lng1} = cord1;
      const {lat: lat2, lng: lng2} = cord2;
      const y = Math.sin(lng2 - lng1) * Math.cos(lat2);
      const x =
        Math.cos(lat1) * Math.sin(lat2) -
        Math.sin(lat1) * Math.cos(lat2) * Math.cos(lng2 - lng1);
      const θ = Math.atan2(y, x);
      const brng = ((θ * 180) / Math.PI + 360) % 360;
      return brng;
    }
    return 0;
  };

  const handleSearchChange = (searchText) => {
    if(searchText.length > 0) {
      setPanelShow(false);
    }
    setSearchText(searchText)
  }



  //display vehicles
  const renderMarkers = (vehicles) => {
    //  console.log("@@@Current Region", region)
    try{
      for (let index = 0; index < vehicles.length; index++) {
        const vehicle = vehicles[index].vehicle;
        if(vehicle?.teltonikas?.length === 2) {
          var curCoordinate = {lat : vehicle?.teltonikas[0]?.lat,lng : vehicle?.teltonikas[0]?.lng };
          var prevCoordinate = {lat : vehicle?.teltonikas[1]?.lat,lng : vehicle?.teltonikas[1]?.lng };
          // const response = Geocoder.from(vehicle?.teltonikas[1]?.lat, vehicle?.teltonikas[1]?.lng);
          // const address = response.results[0].formatted_address;
          // console.log(">>>>>>>>", address)
          global.vehicleangle[index] = calculateHeading(prevCoordinate,curCoordinate);
          // console.log(">>>>>>>", curCoordinate, prevCoordinate)
        }
      }
      if (vehicles.length > 0) {
        return vehicles.map((vehicle, index) => (
          (vehicle.vehicle.teltonikas[0]) ? (
            
            <Marker
              key={index}
              ref={markerRef}
              flat={true}
              coordinate={{ latitude: vehicle?.vehicle?.lat,
                longitude: vehicle?.vehicle?.lng }}
              onPress={(event) => {
                onMarkPress(event.nativeEvent.coordinate, vehicle, index);
              }}
            >
              <View style={{marginTop:5, height:100 }}>
              <View style={styles.callout}>
                <ImageBackground style={{width:80, height:55, resizeMode:'stretch'}} source={require("../../../assets/car_info_bg.png")}>
  
                <Text style={{ width:80, textAlign:'center', fontSize: 10, fontWeight: '800', color: 'white', marginTop: 4 }}>{vehicle.vehicle.vehicleName}</Text>
                <View style={{ flexDirection: 'row', alignSelf:'center', alignItems: 'center', }}>
                  <Image style={{ width: 13, height: 13, resizeMode:'contain'}} source={require('../../../assets/speed_white.png')} />
                  <Text style={{ marginLeft: 4, fontSize: 12, color:'white' }}>
                    {(vehicle.vehicle.teltonikas[0].speed >= 0 && vehicle.vehicle.teltonikas[0].speed < 500) ? vehicle.vehicle.teltonikas[0].speed : 0 }
                    {" "}Km/h
                  </Text>
                </View>
                </ImageBackground>
              </View>
              {/* <View rotation={global.vehicleangle[index] ? global.vehicleangle[index] : 0} */}
               {/* style={{width:70, height:40, marginTop:-50, alignItems:'center'}}> */}
                <Image style={{ width: 70, height: 40, position:'absolute', top:50, resizeMode:'contain' }} rotation={global.vehicleangle[index] ? global.vehicleangle[index] : 0} source={require('../../../assets/car.png')} />
              {/* </View> */}
              </View>
            </Marker>
          ) : null
        ));
      }
    } catch(e) {
      console.log("@@@ Catch : ", e)
    }
    
  }
  
  // const getAddressFrompoint = async (lat,lng) => {
  //   if(lat == undefined || lng == undefined) return;
  //   if(lat == 0 || lng == 0) return;
  //   //console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@",lat,lng)
  //   return new Promise((resolve, reject) => {
  //     Geocoder.from(lat, lng)
  //     .then(json => {
  
  //         var addressComponent = json.results[0].formatted_address;
  //         addressComponent = addressComponent.trimEnd();
       
  //         //vehicle.push
  //         //setAddress(addressComponent)
  
  //         console.log("@@@@@@@@@@@ address" , lat,lng,addressComponent);
  //         //console.log(addressComponent);
  //         resolve(addressComponent);
  //         })
  //     .catch((error) => {
  //       console.log("@@get address func error",error);
  //       reject(err);
  //     }); 
  //   });
  // }

  // @@@@@panelpager vehicle data {"_id": "6500d85b42aa1d932e68208b", "createdAt": "2023-09-12T21:30:03.518Z", "deviceModel": "FMB202", "deviceType": "Teltonika", "teltonikas": {"FW_Version": "0", "IOvalue": [[Object]], "__v": 0, "_id": "6535807ed7bfa7706933a584", "createdAt": "2023-10-22T20:05:18.271Z", "deviceImei": "863719061186400", "deviceType": "Teltonika", "fuel": "0", "ignition": "0", "isChange": 0, "lat": 24.9883883, "lng": 55.1910366, "movement": "0", "output1": 0, "output2": 0, "output3": 0, "speed": 0, "transferDate": "2023-10-23T00:05:12.011Z", "updatedAt": "2023-10-22T20:05:18.271Z"}, "title": "Teltonika", "updatedAt": "2023-11-02T17:45:01.103Z", "userId": "6575cbdfdb3c76971e4f405d"}
  // LOG  @@@@@panelpager teltonika data {"FW_Version": "0", "IOvalue": [{"_id": "6535807ed7bfa7706933a585", "dataId": 385, "dataName": "Beacon", "dataValue": 17}], "__v": 0, "_id": "6535807ed7bfa7706933a584", "createdAt": "2023-10-22T20:05:18.271Z", "deviceImei": "863719061186400", "deviceType": "Teltonika", "fuel": "0", "ignition": "0", "isChange": 0, "lat": 24.9883883, "lng": 55.1910366, "movement": "0", "output1": 0, "output2": 0, "output3": 0, "speed": 0, "transferDate": "2023-10-23T00:05:12.011Z", "updatedAt": "2023-10-22T20:05:18.271Z"}

  function filterData(data) {
    // return data.filter(
    //     function (item) {
    //         if (item.vehicle.vehicleName.toLowerCase().includes(searchText.toLowerCase())) {
    //             return item;
    //         }
    //         if (item.vehicle.vehicleName.toLowerCase().includes(searchText.toLowerCase())) {
    //             return item;
    //         }
    //     }
    // );
    let tmpData = data.filter(
      function (item) {
        if (item.vehicle.vehicleName.toLowerCase().includes(searchText.toLowerCase())) {
          return item;
        }
        if (item.vehicle.deviceImei.toLowerCase().includes(searchText.toLowerCase())) {
          return item;
        }
      }
    );

    tmpData.sort((a, b) => {
      const nameA = a.vehicle.vehicleName.toUpperCase(); // ignore upper and lowercase
      const nameB = b.vehicle.vehicleName.toUpperCase(); // ignore upper and lowercase
    
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0; // names must be equal
    });
  
    return tmpData;
  }
  const openGoogleMap = (selectedVehicle) => {
    console.log(selectedVehicle?.vehicle?.teltonikas[0]?.lat);
    const url = `https://www.google.com/maps/search/?api=1&query=${selectedVehicle?.vehicle?.teltonikas[0]?.lat},${selectedVehicle?.vehicle?.teltonikas[0]?.lng}`;

    Linking.canOpenURL(url)
      .then(supported => {
        if (supported) {
          return Linking.openURL(url);
        } else {
          console.log(`Cannot open Google Maps with URL: ${url}`);
        }
      })
      .catch(error => {
        console.log(`An error occurred while opening Google Maps: ${error}`);
      });
  }

  const PanelPager = () => {
    if(!showPanel) return;
    if(selectedVehicleIndex < 0 && vehicleReducer.vehiclesList.length < 0 ) return;

    const vehicledata = filterData(vehicleReducer?.vehiclesList?.filter(item => item.vehicle?.teltonikas?.length > 0))[selectedVehicleIndex].vehicle;
    const teltonika = vehicledata?.teltonikas[vehicledata?.teltonikas?.length - 1];
    
    const vehicleName = vehicledata.vehicleName ? vehicledata.vehicleName : "XXX";   
    const speedVal = teltonika?.speed ? teltonika.speed : 0;
    const fuelVal = teltonika?.fuel ? teltonika.fuel : 0;

    let curBattery = null;
    if(vehicledata?.deviceType === "Ruptela") {
      curBattery = teltonika?.IOvalue.find(item => item.dataId === 30)?.dataValue * 100 / 4.2;
    } else if(vehicledata?.deviceType === "Teltonika") {
      curBattery = teltonika?.IOvalue.find(item => item.dataId === 113)?.dataValue;
    }
    const batteryVal = curBattery ? Math.round(curBattery) : 0;

    const linkStatus = teltonika?.ignition === "1" ?  "1" : "0";

    let prevTrans = vehicledata?.teltonikas[vehicledata?.teltonikas?.length - 1]?.transferDate;
    let onlineStatus = false;
    let diffMin = 0;

    if(prevTrans !== undefined) {
      prevTrans = prevTrans?.substring(0, 10) + " " + prevTrans?.substring(11, 19)
      const curDate = moment().utcOffset(240).format('YYYY-MM-DD HH:mm:ss');
      const prevDate = moment(prevTrans);
      const timeDiff = prevDate.diff(curDate, 'minutes');
      diffMin = timeDiff;
      // console.log("----------", diffMin)
      if(diffMin >= 0 && diffMin < 5){
        onlineStatus = true;
      }
    }


    if (teltonika != undefined) {
      // console.log("%%%", teltonika)
      return (
        <View style={styles.viewPagerContainer}>
          <Text style={{fontSize:16,fontWeight:'bold',color:'#D01400', width:100, height:30, backgroundColor:'white',
            position:'absolute',left:0,top:-25, textAlign:'center', paddingTop:5, borderTopRightRadius:10, borderTopLeftRadius:10}}>{vehicleName}</Text>
          <View style={{flexDirection:'row'}}>
            <View style={{flexDirection:'row', position:'absolute',left:120,top:15}}>
              <View style={{flexDirection:'row'}}>
                <Image source={require("../../../assets/speed_black.png")} style={{alignSelf:'center', width: 22, height: 17, resizeMode: 'contain' }}/>
                <Text style={[styles.subPanTxt, {marginTop:3, marginLeft:5}]}>{speedVal}Km/h</Text>
              </View>
              <View style={{flexDirection:'row'}}>
                <Image source={require("../../../assets/tank_black.png")} style={{alignSelf:'center', marginLeft:5, width: 20, height: 15, resizeMode: 'contain' }}/> 
                <Text style={[styles.subPanTxt, {marginTop:2}]}>{fuelVal}L</Text>
              </View>
              <View style={{flexDirection:'row'}}>
                <Text style={[styles.subPanTxt,{fontSize:10, marginTop:3, marginRight:1}]}>{batteryVal}%</Text>
                <View style={{alignSelf:'center'}}>
                  {batteryVal ?
                  <View style={{position:'absolute', top:2, left:4.8, width:batteryVal / 100 * 20, height:8, backgroundColor:'#D01400'}}></View>
                  :
                  <View style={{position:'absolute', top:2, left:4.8, width:20, height:8, backgroundColor:'none'}}></View>
                  }
                  <Image source={require("../../../assets/battery_bg.png")} style={{alignSelf:'center', width: 33, height: 13, resizeMode: 'contain' }}/> 
                </View>
              </View>
            </View>
            <View style={{position:'absolute',right:60,top:15}}>
              <Image style={{width:20,height:20, resizeMode:'contain'}} source={ onlineStatus === true ? require('../../../assets/link_green.png') : require('../../../assets/link_red.png') } />
            </View>
            {/* <TouchableOpacity style={{position:'absolute',right:5,top:5}} onPress={()=>{closePanel()}}>
              <Image style={{width:25,height:25}} source={require('../../../assets/closeinfo.png')}/>
            </TouchableOpacity> */}
            <TouchableOpacity style={{position:'absolute', right:15, top:5 }}
              onPress={()=>{
                openGoogleMap(selectedVehicle)
                }}
            >
              <Image style={{ width:38, height:38, resizeMode:'contain'}} source={require('../../../assets/navibtn.png')}></Image>
            </TouchableOpacity>

          </View>
          <Text style={{fontSize:11, fontWeight:'500', marginTop:50, marginLeft:25, width:wp('80%')}}>{teltonika.address}</Text>
          <View style={[styles.subPanBottom,{justifyContent:'space-between', marginTop:7}]}>
            <TouchableOpacity onPress={()=>{
              navigation.navigate("History",{"infos" : selectedVehicle})
              }}
            >
              <Image style={{width:35, height:35, marginTop:7,resizeMode:'contain'}} source={require('../../../assets/history_clock.png')}></Image>
              <Text style={{color:'#364153', fontSize:10, marginTop:2, fontWeight:'500'}}>History</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{navigation.navigate("Geofence",{"infos" : selectedVehicle})}}>
              <Image style={{width:35, height:35, marginTop:5, resizeMode:'contain'}} source={require('../../../assets/flat_map.png')}></Image>
              <Text style={{color:'#364153', fontSize:10, marginTop:4, fontWeight:'500'}}>Geofence</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{navigation.navigate("Notification",{"infos" : selectedVehicle})}}>
              <Image source={require('../../../assets/bell_black.png')} style={{width:30, height:30, resizeMode:'contain', marginTop:8}}></Image>
              <Text style={{color:'#364153', fontSize:10, marginTop:6, fontWeight:'500'}}>Alerts</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{navigation.navigate("NotificationSetting",{"infos" : selectedVehicle})}}>
              <Image source={require('../../../assets/setting_black.png')} style={{width:35, height:35, resizeMode:'contain', marginTop:5}}></Image>
              <Text style={{color:'#364153', fontSize:10, marginTop:2, fontWeight:'500'}}>Settings</Text>
            </TouchableOpacity>
          </View>
        </View>
      )
    }
  }

  const subTopPanel = (vehicleName,speed,fuel,battery,linkstatus) => {
    return (
      <View style={{flexDirection:'row'}}>
        <Text style={{fontSize:24,fontWeight:'bold',color:'#364153',
          position:'absolute',left:28,top:11
        }}>{vehicleName}</Text>
        <View style={{flexDirection:'row', position:'absolute',left:130,top:24}}>
          <View style={{flexDirection:'row'}}>
            <Image 
              source={require("../../../assets/speed_black.png")} 
              style={{alignSelf:'center', width: 22, height: 17, resizeMode: 'contain' }}/> 
            <Text style={[styles.subPanTxt, {marginTop:3, marginLeft:5}]}>{speed}Km/h</Text>
          </View>
          <View style={{flexDirection:'row'}}>
            <Image 
              source={require("../../../assets/tank_black.png")} 
              style={{alignSelf:'center', marginLeft:10, width: 20, height: 15, resizeMode: 'contain' }}/> 
            {/* <Image style={{marginRight:10, widh:20, height:20, resizeMode:'contain'}} source={require('../../../assets/tank_black.png')}/> */}
            <Text style={[styles.subPanTxt, {marginTop:2}]}>{fuel}L</Text>
          </View>
          <View style={{flexDirection:'row'}}>
            <Text style={[styles.subPanTxt,{fontSize:10, marginTop:3, marginRight:1}]}>{battery}%</Text>
            <View style={{alignSelf:'center'}}>
              {battery ?
              <View style={{position:'absolute', top:2, left:4.8, width:battery / 100 * 20, height:8, backgroundColor:'#D01400'}}></View>
              :
              <View style={{position:'absolute', top:2, left:4.8, width:20, height:8, backgroundColor:'none'}}></View>
              }
              <Image 
                source={require("../../../assets/battery_bg.png")} 
                style={{alignSelf:'center', width: 33, height: 13, resizeMode: 'contain' }}/> 
            </View>
          </View>
        </View>
        <View style={{position:'absolute',right:35,top:25}}>
          <Image style={{width:18,height:18, resizeMode:'contain'}} 
            source={ linkstatus === "1" ? require('../../../assets/link_green.png') : require('../../../assets/link_red.png') } 
          ></Image>
        </View>
        <TouchableOpacity style={{position:'absolute',right:5,top:5}} onPress={()=>{closePanel()}}>
          <Image style={{width:25,height:25}} source={require('../../../assets/closeinfo.png')}/>
        </TouchableOpacity>
      </View>
    )
  }



  return (
    <SafeAreaView style={{ flex: 1, marginTop: 0, backgroundColor:'#ECECEC' }}>
      <StatusBar backgroundColor={"#FFF"} barStyle={"dark-content"} />
      <MapView
        ref={mapRef}
        mapType={mapType} // Set the initial map type
        region={region}
        style={styles.map}
        onRegionChangeComplete={handleMapRegionChange}
        onPress={onMapPress}
        // rotateEnabled={true}  
      > 
        { vehicleReducer && vehicleReducer.vehiclesList && 
        renderMarkers(filterData(vehicleReducer?.vehiclesList?.filter(item => item.vehicle?.teltonikas?.length > 0))) }   
      </MapView>
      <TextInput placeholder={t('search_vehicle')} style={{ height:40, width: '80%', backgroundColor:'white', alignSelf:'center',
      borderWidth:1, borderColor:'#A9A9A9', borderRadius:10, marginTop:10, paddingLeft:15 }} onChangeText={handleSearchChange} />

      {map3DView && streetViewUrl &&        
      <View style={{width:wp('100%'), height:260, backgroundColor:'white', position:'absolute', paddingBottom:5}}>
        <StreetViewComponent
          coordinate = {{lat : vehicleReducer?.vehiclesList[selectedVehicleIndex]?.vehicle?.teltonikas[0]?.lat, 
            lng : vehicleReducer?.vehiclesList[selectedVehicleIndex]?.vehicle?.teltonikas[0]?.lng}}
        />
        {/* <WebView 
          source={{ uri: streetViewUrl}} //'https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=48.85783227207914,2.295226175151347&heading=100&pitch=0&size=600x300' }}
        /> */}
      </View>
      }
      <View style={styles.optionContainer}>
        <TouchableOpacity onPress={toggleMapType}>
          <Image style={{ width: 40, height: 40}} source={require('../../../assets/satellite.png')} />
        </TouchableOpacity>
        <TouchableOpacity onPress={toggle3DView}>
          <Image style={{ width: 40, height: 40, marginTop:40}} source={require('../../../assets/google_view.png')} />
        </TouchableOpacity>
      </View>
      {PanelPager()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  map: {
    position:'absolute',
    top:0,
    width: wp('100%'),
    height: hp('100%')-70,
  },
  optionContainer: {
    justifyContent:'center',
    alignItems:'center',
    position: 'absolute',
    flexDirection: 'column',
    right: 25,
    top: 90
  },
  viewPagerContainer: {
    position: 'absolute',
    bottom: 0,
    width: wp('100%'),
    height: 145,
    backgroundColor:'white',
    borderTopLeftRadius:0,
    borderTopRightRadius:20,
    marginBottom:0
  },
  subPanTxt: {
    fontSize:12,fontWeight:'bold',color:'#364153',
    marginRight:10
  },
  subPanBottom: {
    width:wp('84%'),position:'absolute',left:wp('8%'),top:65,
    flexDirection:'row',
  },
  v2: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'rgba(15,172,245,0.96)',
    marginBottom : 24,
    borderRadius:20,
  },
  callout: {
    flex: 1,
    alignItems: 'center',
    // height:120
  },
});
