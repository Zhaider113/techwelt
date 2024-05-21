import React, { useState, useRef, useEffect } from "react";
import { SafeAreaView, View, Text, TextInput, StatusBar, StyleSheet, CheckBox, 
  TouchableOpacity, Image, FlatList } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useFocusEffect } from "@react-navigation/native";
import {useTranslation} from "react-i18next";
import { useSelector, useDispatch } from 'react-redux';

import { IconComponentProvider, Icon } from "@react-native-material/core";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MapView from "react-native-map-clustering";
import { Circle, Marker, Polygon } from 'react-native-maps';
import MapDirection from "./MapDirection";
import MapViewDirections from 'react-native-maps-directions';
import { toastr } from '../../services/navRef';
import axios from 'axios';
import { saveGeofensePos, updateGeofensePos } from "../../actions/vehicles";
import Header from "../Header";

export default function Geofence({ navigation, route }) {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const userReducer = useSelector(state => state.auth);

  const { infos } = route.params;
  const vehicleReducer = useSelector(state => state.vehicles);

  const [mapType, setMapType] = useState('standard');
  const mapRef = useRef(null);
    
  const [polygonList, setPolygonList] = useState(infos?.vehicle?.polygonData);
  const [vehiclesList, setVehiclesList] = useState();
  
  const [selectedPolygon, setSelectedPolygon] = useState(infos?.vehicle?.polygonData[0]);
  const [selectedVehicle, setSelectedVehicle] = useState(infos?.vehicle);
  
  const [isShowPolygonList, setIsShowPolygonList] = useState(false);
  const [isShowVehicle, setIsShowVehicle] = useState(false);
  
  const [checkVehicleList, setCheckVehicleList] = useState([]);

  const [region, setRegion] = useState({
    latitude: 25.9219133,
    longitude: 56.0663866,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  });

  const [newCreate, setNewCreate] = useState(false); // only one point
  
  const [zone1State, setZone1State] = useState(false);
  const [center, setCenter] = useState();
  const [radius, setRadius] = useState(0);
  
  const [zone2State, setZone2State] = useState(false);
  const [rectangleCoordinates, setRectangleCoordinates] = useState([]);
  const [rectangle, setRectangle] = useState([]);

  const [zone3State, setZone3State] = useState(false);
  const [squareData, setSquareData] = useState([]); // only two point
  const [triangleData, setTriangleData] = useState([]); // triangle points from two point

  const [polygonData, setPolygonData] = useState([])  // point List of touch event
  const [roadPointList, setRoadPoinList] = useState([]) // Point List of real Road from polygon data

  const [show3, setShow3] = useState(false)
  const [show4, setShow4] = useState(false)
  const [showStyle, setShowStyle] = useState(true)
  const [title, setTitle] = useState("GeoZone11")
  const [content, setContent] = useState("1")
  const [btnDisabledComp, setBtnDisabledComp] = useState(false)
  const [btnDisabledSave, setBtnDisabledsave] = useState(true)

  useEffect(() => {
    initialVehicle();
  },[])


  useFocusEffect(React.useCallback(() => {
  }, [vehicleReducer?.vehiclesList]));

  const initialVehicle = () => {
    if(vehicleReducer && vehicleReducer.vehiclesList.length > 0){
      setVehiclesList(vehicleReducer?.vehiclesList)      

      let tempCheckVehicleList = [];
      for(var i=0;i<vehicleReducer?.vehiclesList?.length;i++){
        if( i === vehicleReducer?.vehiclesList?.findIndex( (item) => item.vehicle.vehicleName === selectedVehicle?.vehicleName) )
          tempCheckVehicleList.push(true);
        else
          tempCheckVehicleList.push(false);
      }

      setCheckVehicleList(tempCheckVehicleList);

      setSelectedVehicle(selectedVehicle);
      setPolygonList(selectedVehicle?.polygonData)
    }

  }

  const handleMapPress = async (coordinate) => {
    if(isShowPolygonList) setIsShowPolygonList(false);
    if(isShowVehicle) setIsShowVehicle(false);
    setRadius(null);

    if (zone1State) {
      setCenter(coordinate)
    }
    else if (zone2State) {
      setRectangleCoordinates((prevCoordinates) => [...prevCoordinates, coordinate]);

      // square geofence
      
      // console.log("@@@@@@@Geofence onmapress square data",squareData,coordinate)
      // if(squareData.length == 2){
      //   let tempSqureData = [];
      //   tempSqureData.push(squareData[1]);
      //   tempSqureData.push(coordinate);
        
      //   setSquareData(tempSqureData);
      //   getSquareData(tempSqureData);
      // }else if(squareData.length == 1){
      //   let tempSqureData = [];
      //   tempSqureData.push(squareData[0]);
      //   tempSqureData.push(coordinate);
      //   setSquareData(tempSqureData);
      //   getSquareData(tempSqureData);        
      // }else if(squareData.length == 0){
      //   let tempSqureData = [];
      //   tempSqureData.push(coordinate)
      //   setSquareData(tempSqureData)        
      // }
      // setSquareData((squareData) => [...squareData, coordinate])
      // setTriangleData((triangleData) => [...triangleData, coordinate])
      
    }else if (zone3State) {
      var temppolygonData = [...polygonData, coordinate];
      var lenPolygonData = temppolygonData.length;
      var cntPoint = (25 - (25 % lenPolygonData)) / lenPolygonData;
      for(var index=0;index < lenPolygonData;index++){
        var firstPonit,nextPoint;
        firstPonit = temppolygonData[index];
        if(index == (lenPolygonData-1))
          nextPoint = temppolygonData[0];
        else
          nextPoint = temppolygonData[index+1];
        const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${firstPonit.latitude},${firstPonit.longitude}&destination=${nextPoint.latitude},${nextPoint.longitude}&mode=driving&sensor=false&units=metric&key=AIzaSyBCCB4SR4Quw831qlj_IQapiKPnjyEW2Bg`
  
        await axios.get(url)
          .then( async (response) => {
            try {
              if (response.data && response.data.routes && response.data.routes.length > 0) {
                var steps = response.data.routes[0].legs[0].steps;
                var incVal = cntPoint >= steps.length ? 1 : (steps.length - steps.length % cntPoint) / cntPoint + 1;
                for (let index = 0; index < steps.length; index = index + incVal) {
                  const start_location = steps[index].start_location;
                  const PtItem = { latitude: start_location.lat, longitude: start_location.lng }
                  if(roadPointList.length > 25) break;
                  setRoadPoinList((roadPointList) => [...roadPointList, PtItem])
                }
              }else{
                // console.log("@@@@@get road points",response.data.error_message)
                // toastr(response.data.error_message)
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
  
      setPolygonData((polygonData) => [...polygonData, coordinate])
    }
  }

  const getSquareData = (twoPoints) => {
    // get coordinate for drawing triangle from two point
  }

  const renderPolygonItem = (item,index) => {
    if(item) {
      return (
        <View style={{flexDirection:'column',alignItems:'center',width:'100%', }}>
          <View style={{flexDirection:'row',justifyContent:'space-between',width:'100%'}}>
            <View style={{marginLeft:9,}}>
              <TouchableOpacity onPress={()=>{setSelectedPolygon(item);setIsShowPolygonList(false);}}>
                <Text style={{fontSize:16,fontWeight:'bold',color:'#7A7D8B',height:27,}}>{item?.title}</Text>
              </TouchableOpacity>
            </View>
            <View style={{marginRight:2,}}>
              <TouchableOpacity 
                // onPress={(item)=>{setDataGeoZone(dataGeoZone.filter((i) => item !== i))}}
                >
                <Image style={{width:15,height:15,marginTop:3,marginRight:5}} source={require('../../../assets/fi-sr-trash-black.png')}></Image>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ width:115, height:2,backgroundColor:'#898A8D'}}></View>
        </View>
      )
    }
   
  }
  
  const renderVehicleItem = (item,index) => {
    return (
      <TouchableOpacity
        onPress={() => { 
          for (let i = 0; i < checkVehicleList?.length; i++) {
            if(i === index){
              checkVehicleList[i] = !checkVehicleList[i];
            } else {
              checkVehicleList[i] = false;
            }
          }
          if(!checkVehicleList[index]) {
            setSelectedVehicle(null);
          } else {
            setSelectedVehicle(vehicleReducer?.vehiclesList[vehicleReducer?.vehiclesList?.findIndex( (a) => a.vehicle.vehicleName === item.vehicle.vehicleName)]);
            setPolygonList(vehicleReducer?.vehiclesList[vehicleReducer?.vehiclesList?.findIndex( (a) => a.vehicle.vehicleName === item.vehicle.vehicleName)]?.vehicle.polygonData)
          }
          setCheckVehicleList(checkVehicleList);
          setIsShowVehicle(false);
          setTimeout(() => {
            setIsShowVehicle(true);
          }, 10);
        }}>
        <View style={{alignItems:'center',width:'100%', height:33, flexDirection:'row',justifyContent:'flex-start'}}>
          <View style={{marginLeft:12}}>
              <View style={{width:15,height:15,alignItems:'center', justifyContent:'center', borderColor:'#7A7D8B',borderRadius:4,borderWidth:2}}>
                {checkVehicleList[index] ? (<IconComponentProvider IconComponent={MaterialCommunityIcons}>
                  <Icon name="check-bold" size={11} color="#FF0000" />
                </IconComponentProvider>) : null }
              </View>
          </View>
          <View style={{marginLeft:12}}>
            <Text style={{ fontSize:16,fontWeight:'bold',color:'#7A7D8B'}}>{item.vehicle.vehicleName}</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  const handleZone = (val) => {
    setNewCreate(true);
    setCenter(null); setRadius(null);

    setSquareData([]);
    setTriangleData([]);
    setPolygonData([]);
    setRoadPoinList([]);

    if (val == "zonetypeCircle") {
      setZone1State(true);
      setZone2State(false);
      setZone3State(false);
    } else if (val == "zonetypeSquare") {
      setZone1State(false);
      setZone2State(true);
      setZone3State(false);
    } else if (val == "zonetypeManual"){
      setZone1State(false);
      setZone2State(false);
      setZone3State(true);
    }
  };

  const handleFocus = (val) =>{
    setShowStyle(val);
  }

  const handleTitleChange = (title) => {
    setTitle(title)
  }
  
  const handleRadiusChange = (radius) => {
    setRadiusCircle(radius)
  }

  const handleContentChange = (content) => {
    setContent(content)
  }

  const clearPointList = () => {
    // if(zone1State || zone2State || zone3State){
      setCenter();
      setSquareData([]);
      setTriangleData([]);
      setPolygonData([]);
      setRoadPoinList([]);
    // }
  }

  const handleDrawShape = async () =>{
    if(zone1State){
      handleCompleteCircleData();
    }else if (zone2State){
      handleCompleteSquareData();
    }else if(zone3State){
      handleDrawPolygon();
    }
  }

  const handleCompleteCircleData = async () =>{

  }

  const handleCompleteSquareData = async () =>{
  }

  const handleDrawPolygon = async () =>{
    console.log("!!!!", polygonData)
    if (polygonData.length < 3){
      toastr(t('please_set_3_points'))
      return;
    }
    const sendData = {
      token: userReducer.token,
      userId: userReducer.user._id,
      deviceImei: selectedVehicle.vehicle.deviceImei,
      polygonData: polygonData,
      enter: true,
      sortie: true,
      title: "Geozone-" + (parseInt(polygonList[polygonList?.length - 1].title?.slice(polygonList[polygonList?.length - 1].title?.lastIndexOf("-") + 1)) + 1).toString(),
      content: "Geozone-" + (parseInt(polygonList[polygonList?.length - 1].title?.slice(polygonList[polygonList?.length - 1].title?.lastIndexOf("-") + 1)) + 1).toString(),
    };
    console.log(">>>>>>>>>>",selectedVehicle)
    dispatch(saveGeofensePos(sendData));
  }

  const handleUpdateGeo = () => {
    
    if(zone1State){
      console.log("Handle Update Circle Data", selectedVehicle.deviceImei)
      if(circleCenter.length < 0){
        toastr(t('please_set_3_points'))
        return;
      }
    }else if(zone2State){
      console.log("Handle Update Square Data", selectedVehicle.deviceImei)
      if(squareData.length < 3){
        toastr(t('please_set_3_points'))
        return;
      }
    }else if(zone3State){
      console.log("Handle Update Poly data", selectedVehicle.deviceImei)
      if (roadPointList.length < 3){
        toastr(t('please_set_3_points'))
        return;
      } 
    }
    
    console.log("@@@@@@handlegeoupdategeo",zone1State,title,content);
    if(title == ""){
        toastr(t('please_enter_title'))
        return;
    }

    if(content == ""){
        toastr(t('please_enter_content'))
        return;
    }

    handleDrawShape();
    
    //save
    //deviceImei, polygonData, enter, sortie, title, content
    //update
    //deviceImei, polygonData, enter, sortie, index, title, content

    console.log("@@@@@geofence dispatch",userReducer.token,newCreate, selectedVehicle.deviceImei, circleCenter,show3,show4, title, content)
    // if(newCreate){
    //   // save new geofence data
    //   dispatch(saveGeofensePos(userReducer.token, selVehicle.deviceImei, circleCenter, show3, show4, title, content,null));
    // }else{
    //   //update geofence data
    //   dispatch(updateGeofensePos(token, selVehicle.deviceImei, roadPointList, show3, show4, index, title, content, polygonData));
    // }
    //navigation.goBack()
  }
 
  const handleMapLongPress = (event) => {
    const { coordinate } = event.nativeEvent;
    const { latitude, longitude } = coordinate;
    if (center) {
      const radiusInMeters = getDistanceFromLatLonInKm(
        center.latitude,
        center.longitude,
        coordinate.latitude,
        coordinate.longitude
      ) * 1000;
      setRadius(radiusInMeters);
    }
  };

  const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1); // deg2rad below
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
  };

  const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
  };

  const saveGeofence = () => {

  }

  return (
    <View style={styles.v1}>
      <Header screenName={t('Geofence')} back="true" curNavigation={navigation}></Header>

      <MapView
        ref={mapRef}
        mapType={mapType} // Set the initial map type
        region={region}
        style={styles.map}
        onPress={(e) => {
          handleMapPress(e.nativeEvent.coordinate)
        }}
        onLongPress={handleMapLongPress}
      >
        
        {zone1State && center && (
          <Marker coordinate={center}>
            <View style={{backgroundColor:'red', width:8, height:8, borderRadius:4}}></View>
          </Marker>
        )}

        {zone1State && center && radius > 0 && (
          <Circle
            center={center}
            radius={radius}
            strokeWidth={3}
            strokeColor="#3A30A6"
            fillColor="rgba(83, 97, 226, 0.50)">
              <Text style={{color:'#364153', fontSize:16, fontWeight:'700', alignSelf:'center'}}>Geozone-1</Text>
          </Circle>
        )}

        {zone2State && squareData && squareData.length > 0 && <View>
          { squareData.map((coordinate, index) => (
            <Marker
              key={index}
              coordinate={coordinate}
            />
          ))}
          { triangleData && triangleData.length > 2 && <Polygon
              coordinates={triangleData}
              strokeWidth={4}
              strokeColor="#18567F"
              fillColor="#bbb"
            ></Polygon>}

        </View>}

        {zone3State && polygonData && polygonData.length > 0 && <View>

          { polygonData.map((coordinate, index) => (
              <Marker
                key={index}
                coordinate={coordinate}
              >
                <View style={{backgroundColor:'red', width:8, height:8, borderRadius:4}}></View>
              </Marker>
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
        </View>}
      </MapView>   

      <View style={{position:'absolute',left:5,top:92}}>
        <TouchableOpacity onPress={()=>{handleZone('zonetypeCircle')}}>
          {zone1State ?
          <Image style={{width:60,height:60}} source={require('../../../assets/Circle-Geofence_2.png')}></Image>
          :
          <Image style={{width:60,height:60}} source={require('../../../assets/Circle-Geofence_1.png')}></Image>
          }
        </TouchableOpacity>
      </View>

      <View style={{position:'absolute',left:5,top:162}}>
        <TouchableOpacity onPress={()=>{handleZone('zonetypeSquare')}}>
          {zone2State ? 
          <Image style={{width:60,height:60}} source={require('../../../assets/Square-Geofence_2.png')}></Image>
          :
          <Image style={{width:60,height:60}} source={require('../../../assets/Square-Geofence_1.png')}></Image>
          }
        </TouchableOpacity>
      </View>

      <View style={{position:'absolute',left:5,top:232}}>
        <TouchableOpacity onPress={()=>{handleZone('zonetypeManual')}}>
          {zone3State ?
          <Image style={{width:60,height:60}} source={require('../../../assets/Manual-Geofence_2.png')}></Image>
          :
          <Image style={{width:60,height:60}} source={require('../../../assets/Manual-Geofence_1.png')}></Image>
          }
        </TouchableOpacity>
      </View>

      <View style={styles.vGeoZone}>
        <TouchableOpacity onPress={()=>{setIsShowPolygonList(!isShowPolygonList)}}>
          <View style={{flexDirection:'row',justifyContent:'space-between',borderRadius:10,borderColor:'#EBECF0', height:27, backgroundColor:'white'}}>
            <Text style={{fontSize:16,fontWeight:'bold',color:'#364153',marginLeft:9}}>{selectedPolygon?.title}</Text>
            <View style={{marginRight:5,marginTop:2}}>
              <IconComponentProvider IconComponent={MaterialCommunityIcons}>
                <Icon name="chevron-down" size={20} color="#364153" />
              </IconComponentProvider>
            </View>
          </View>
        </TouchableOpacity>
        {isShowPolygonList && 
        <View style={{borderRadius:10, width:124,backgroundColor:'white',borderColor:'#EBECF0', borderWidth:1}}>
          <FlatList
            data={polygonList}
            renderItem={({ item,index }) => renderPolygonItem(item,index)}
          />
          <View style={{height:30,justifyContent:'center'}}>
            <TouchableOpacity onPress={()=>{
              saveGeofence();
            }}>
              <Text style={{marginLeft:9, fontSize:16,fontWeight:'bold',color:'#7A7D8B'}}>Create New</Text>
            </TouchableOpacity>
          </View>
        </View>
        }
      </View>        

      <View style={styles.vVehicle}>
        <TouchableOpacity onPress={()=>{setIsShowVehicle(!isShowVehicle)}}>
          <View style={{flexDirection:'row',justifyContent:'space-between',borderRadius:10,borderColor:'#EBECF0', height:27, backgroundColor:'white'}}>
            <Text style={{fontSize:16,fontWeight:'bold',color:'#364153',marginLeft:40}}>{t('vehicle')}</Text>
            <View style={{marginRight:23,marginTop:2}}>
              <IconComponentProvider IconComponent={MaterialCommunityIcons}>
                <Icon name="chevron-down" size={20} color="rgba(24, 86, 127, 1)" />
              </IconComponentProvider>
            </View>
          </View>
        </TouchableOpacity>
        {isShowVehicle && <View style={{borderRadius:10, backgroundColor:'white',borderColor:'#EBECF0'}}>
          <FlatList
            data={vehiclesList}
            renderItem={({ item,index }) => renderVehicleItem(item,index)}
          />
        </View>}
      </View>

      <TouchableOpacity
        style={styles.syncButton}
        onPress={() => clearPointList()}
      >
        <Image source={require('../../../assets/sync.png')} />
      </TouchableOpacity>
      <View style={showStyle ? styles.view2 : styles.view21}>
        {/* <View style={styles.view3}>
          {zone1State && <View style={{flexDirection:'row'}}>
            <Text>Radius </Text>
            <TextInput
              keyboardType="number-pad"
              placeholder={t('Radius')}
              onChangeText={handleRadiusChange}
              onFocus={() =>handleFocus(false)}
              onEndEditing={() =>handleFocus(true)}
              value={radiusCircle}
              style={styles.TxtInput}
            ></TextInput><Text> m</Text>
          </View>}
        </View>
        <View style={[styles.view3, { marginTop: hp('3%'),}]}>
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
        </View> */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom:10}}>
          {zone3State && <TouchableOpacity disabled={btnDisabledComp}
            onPress={handleDrawShape}            
            style={styles.bigButton}>
            <Text style={{ color: '#FFFF', fontSize: 14, fontWeight: '500',textAlign:'center' }}>{t('complete')}</Text>
          </TouchableOpacity>}
          
          {/* <TouchableOpacity 
            // disabled={btnDisabledSave}
            onPress={handleUpdateGeo}
            style={styles.bigButton}>
            <Text style={{ color: '#FFFF', fontSize: 14, fontWeight: '500',textAlign:'center' }}>{ t('complete') }</Text>
          </TouchableOpacity> */}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  v1: {
    flex: 1,
    backgroundColor: "white",
  },
  map: {
    width: wp('100%'), height: hp('100%')-90,
  },
  vGeoZone: {
    width: 124,
    position:'absolute',left:80,top:92,
  },
  vVehicle: {
    width: 149, height: 153,
    position:'absolute',right:9,top:92,
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
  view2: {
    width: wp('93%'),
    position: 'absolute',
    alignSelf: 'center',
    borderRadius: 10,
    bottom: 0
  },
  view21: {
    width: wp('93%'),
    position: 'absolute',
    backgroundColor: 'white',
    alignSelf: 'center',
    borderRadius: 10,
    top: hp('47%')
  },
  view3: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: hp('2.5%'),
  },
  checkBox: {
    width: wp('5%'),
    height: wp('5%'),
    borderWidth: 0.3,
    alignItems: 'center',
    borderRadius: 2
  },
  bigButton: {
    backgroundColor:'#364153',
    width:wp('30%'),
    padding: 5,marginLeft:50,marginRight:50,marginTop:10,
    borderRadius:6,
  },
  TxtInput: {
    fontSize: 13, fontWeight: '500', 
    width: '30%', height: 35, 
    borderWidth: 1, borderColor: "#555", borderRadius: 6 ,
    textAlign: 'center', 
  },
});
