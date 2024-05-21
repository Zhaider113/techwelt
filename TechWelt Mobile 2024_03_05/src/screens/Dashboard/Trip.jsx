import React, { useState, useRef } from "react";
import { SafeAreaView, View, Text, TextInput, StatusBar, StyleSheet, CheckBox, 
  TouchableOpacity, Image, FlatList } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useFocusEffect } from "@react-navigation/native";
import {useTranslation} from "react-i18next";
import { useSelector, useDispatch } from 'react-redux';

import { IconComponentProvider, Icon } from "@react-native-material/core";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MapView from "react-native-map-clustering";
import { Marker } from 'react-native-maps';


import Header from "../Header";

const tempTripData = ["Trip-1","Trip 3","My Trip 3","Trip 4"]
const tempVehicleData = ["AUDI","BMW","Toyota"]

export default function Trip({ navigation }) {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const userReducer = useSelector(state => state.auth);

  const [mapType, setMapType] = useState('standard');
  const mapRef = useRef(null);
  
  
  const [dataTrip, setDataTrip] = useState(tempTripData);
  const [dataVehicle, setDataVehicle] = useState();
  
  const [selTrip, setSelTrip] = useState(dataTrip[0]);
  const [selVehicle, setSelVehicle] = useState();
  
  const [isShowTrip, setIsShowTrip] = useState(false);
  const [isShowVehicle, setIsShowVehicle] = useState(false);
  
  const [editableTripList, setEditableTripList] = useState([]);
  const [checkVehicleList, setCheckVehicleList] = useState([]);

  const [region, setRegion] = useState({
    latitude: 25.9219133,
    longitude: 56.0663866,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  });


  useFocusEffect(React.useCallback(() => {
    
    initialVehicle();
    initialTrip();
    
  }, []));

  const initialVehicle = () =>{
    let tempVehicleList = [t('allVehicles'),...tempVehicleData];
    setDataVehicle(tempVehicleList);
    setSelVehicle(tempVehicleList[0]);
    
    let tempCheckVehicleList = [];
    for(var i=0;i<tempVehicleList.length;i++){
      tempCheckVehicleList.push(false);
    }
    setCheckVehicleList(tempCheckVehicleList);
  }

  const initialTrip =() => {
    let tempEditableTripList = [];
    for(var i=0;i<tempTripData.length;i++){
      tempEditableTripList.push(false);
    }
    setEditableTripList(tempEditableTripList);    
  }
  
  const onMapPress = () => {
    setIsShowGeoZone(false);
    setIsShowVehicle(false);
  }

  const renderTripItem = (item,index) => {
    return (
      <View style={{flexDirection:'column',alignItems:'center',width:'100%', }}>
        <View style={{flexDirection:'row'}}>
          <TouchableOpacity onPress={()=>{setSelTrip(item);setIsShowTrip(false)}}>
            <TextInput editable={editableTripList[index]} focusable={editableTripList[index]} style={{marginLeft:2, fontSize:16,fontWeight:'bold',color:'#7A7D8B',width:70,height:27,}}>{item}</TextInput>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>{
            let tempeditableTripList = editableTripList;
            
            tempeditableTripList[index] = true; 
            
            setEditableTripList(tempeditableTripList);
            setIsShowTrip(false);
            setTimeout(() => {
              setIsShowTrip(true);
            }, 10);
          }}>
            <Image style={{width:15,height:15,marginTop:6,marginLeft:7}} source={require('../../../assets/fi-sr-edit.png')}></Image>
          </TouchableOpacity>
          <TouchableOpacity>
            <Image style={{width:15,height:15,marginTop:6,marginLeft:7,marginRight:0}} source={require('../../../assets/fi-sr-trash.png')}></Image>
          </TouchableOpacity>
        </View>
        <View style={{ width:115, height:2,backgroundColor:'#898A8D'}}></View>
      </View>
    )
  }
  
  const renderVehicleItem = (item,index) => {
    return (
      <TouchableOpacity
        onPress={() => { 
          let tempCheckList = checkVehicleList;
          //console.log(tempCheckList);
          if(index == 0){
            //console.log("@@@select 0")
            let tempCheckVal = tempCheckList[0];
            for(var i =0;i<tempCheckList.length;i++){
              tempCheckList[i] = tempCheckVal ? false : true; 
            }
            console.log(tempCheckList);

          }else{
            tempCheckList[index] = !tempCheckList[index]; 
          }
          setCheckVehicleList(tempCheckList);
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
            {index == 0 ? <Text style={{ fontSize:16,fontWeight:'bold',color:'#7A7D8B',textDecorationLine:'underline'}}>{item}</Text> :
            <Text style={{ fontSize:16,fontWeight:'bold',color:'#7A7D8B'}}>{item}</Text>}
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles.v1}>
      <Header screenName={t('createTrip')} back="true" curNavigation={navigation}></Header>

      <MapView
        ref={mapRef}
        mapType={mapType} // Set the initial map type
        region={region}
        style={styles.map}
        onPress={onMapPress}
      >
      </MapView>   
      <View style={styles.vTrip}>
        <TouchableOpacity onPress={()=>{setIsShowTrip(!isShowTrip)}}>
          <View style={{flexDirection:'row',justifyContent:'space-between',borderRadius:10,borderColor:'#EBECF0', height:27, backgroundColor:'white'}}>
            <Text style={{fontSize:16,fontWeight:'bold',color:'#1E6B97',marginLeft:27}}>{selTrip}</Text>
            <View style={{marginRight:8,marginTop:2}}>
              <IconComponentProvider IconComponent={MaterialCommunityIcons}>
                <Icon name="chevron-down" size={20} color="rgba(24, 86, 127, 1)" />
              </IconComponentProvider>
            </View>
          </View>
        </TouchableOpacity>
        {isShowTrip && <View style={{borderRadius:10, width:124,backgroundColor:'white',borderColor:'#EBECF0'}}>
          <FlatList
            data={dataTrip}
            renderItem={({ item,index }) => renderTripItem(item,index)}
          />
          <View style={{height:30,justifyContent:'center'}}>
            <TouchableOpacity onPress={()=>{
              let temp = dataTrip;
              temp.push("");
              setDataTrip(temp);

              setIsShowTrip(false);
              setTimeout(() => {
                setIsShowTrip(true);
              }, 10);
            }}>
              <Text style={{marginLeft:5, fontSize:16,fontWeight:'bold',color:'#7A7D8B'}}>{t('createNew')}</Text>
            </TouchableOpacity>
          </View>
        </View>}
      </View>        

      <View style={styles.vVehicle}>
        <TouchableOpacity onPress={()=>{setIsShowVehicle(!isShowVehicle)}}>
          <View style={{flexDirection:'row',justifyContent:'space-between',borderRadius:10,borderColor:'#EBECF0', height:27, backgroundColor:'white'}}>
            <Text style={{fontSize:16,fontWeight:'bold',color:'#1E6B97',marginLeft:40}}>{t('vehicle')}</Text>
            <View style={{marginRight:23,marginTop:2}}>
              <IconComponentProvider IconComponent={MaterialCommunityIcons}>
                <Icon name="chevron-down" size={20} color="rgba(24, 86, 127, 1)" />
              </IconComponentProvider>
            </View>
          </View>
        </TouchableOpacity>
        {isShowVehicle && <View style={{borderRadius:10, backgroundColor:'white',borderColor:'#EBECF0'}}>
          <FlatList
            data={dataVehicle}
            renderItem={({ item,index }) => renderVehicleItem(item,index)}
          />
        </View>}
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
  vTrip: {
    width: 124,
    position:'absolute',left:68,top:92,
  },
  vVehicle: {
    width: 149, height: 153,
    position:'absolute',right:9,top:92,
  },
});
