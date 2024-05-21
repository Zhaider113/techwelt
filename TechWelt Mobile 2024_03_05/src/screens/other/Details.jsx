import React, { useEffect, useCallback, useState } from 'react'
import {
    SafeAreaView, Text, TouchableOpacity, Image, TextInput, BackHandler, 
    View, StyleSheet, ScrollView, StatusBar, Modal
} from 'react-native'
import { IconComponentProvider, Icon } from "@react-native-material/core";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import Geocoder from 'react-native-geocoding';
import { updateDriverInfo, updateDeviceName } from '../actions/vehicles';
import { useSelector,useDispatch } from 'react-redux';
//import { pageNav } from '../../App';

import { toastr } from '../services/navRef';
import {useTranslation} from "react-i18next";

import { getIOValue,ID_IOBATTERY,ONLINE_LIMIT} from '../utils/util';
import { useFocusEffect } from '@react-navigation/native';
import { showVehicles } from '../actions/vehicles';

Geocoder.init(global.GOOGLE_MAPS_API_KEY);

var addressComponent = ''; 


function Details({ navigation, route }) {   
    const {t} = useTranslation()
    let { infos, index } = route.params;
    //console.log("qqqqqqqqqqqqqqqqqqqqqqqqqqqqqq",infos)
    const { pagename } = route.params;
    const dispatch = useDispatch();
    const userReducer = useSelector(state => state.auth);
    let vehicleReducer = useSelector(state => state.realtimeVehicles);
    const [expiryDate, setExpiryDate] = useState('');
    
    const [showSimNumber, setShowSimNumber] = useState(false);
    const [showDriverInfo, setShowDriverInfo] = useState(false);
    const [showDeviceName, setShowDeviceName] = useState(false);
    const [address, setAddress] = useState('');
    const [connecStatus,setConnecStatus] = useState(false);
    const [batteryVal,setBatteryVal] = useState(0);
    const [newVehicleName,setNewVehicleName] = useState(infos.vehicle.vehicleName);
    
    const [updateTime,setUpdateTime] = useState(new Date());
    
    //const [realtimeVehicleData,setrealtimeVehicleData] = useState(infos);
    let realtimeVehicleData = vehicleReducer.vehicles[index];
    
    
    //console.log("qqqqqqqqqqqqqqqqqqqqqqqqqqqqqq",newVehicleName)
    

    //console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@",realtimeVehicleData.vehicle.teltonikas.createdAt)

    useFocusEffect(useCallback(() => {
        const handleBackPress = () =>{
            if(global.pageNav.pageName == "List"){
                navigation.navigate('List') 
                return true;
            }
            else{
                global.pageNav = {};
                navigation.navigate('MapScreen') 
                return true;
            }
        }
    
        BackHandler.addEventListener('hardwareBackPress', handleBackPress);

        const interval = setInterval(() => {
            dispatch(getRealtimeVehicles(userReducer.token, userReducer.user._id));
            setUpdateTime(new Date()); // Update the state with current time
                                  
            //console.log("@@@@@@@detailinterval", realtimeVehicleData !=null ? realtimeVehicleData.vehicle.vehicleName : 'asdasd')
            // if(global.realtimeVehicles && global.realtimeVehicles.length > 0){
            //     for(var i=0;i<global.realtimeVehicles.length;i++){
            //         if(global.realtimeVehicles[i].vehicle.vehicleName == infos.vehicle.vehicleName){
            //             realtimeVehicleData = global.realtimeVehicles[i];
            //             console.log("@@@@",realtimeVehicleData.vehicle.teltonikas.createdAt)
            //             //setBatteryVal(getIOValue(global.realtimeVehicles[i].vehicle.teltonikas.IOvalue,ID_IOBATTERY));
            //             //setConnecStatus(getConnecStatus(global.realtimeVehicles[i].vehicle.teltonikas));
            //         }

            //         //realtimeVehicleData = global.realtimeVehicles[i]          
            //     }
            // }
            //console.log("@@@@@@@@@@Detail realtimeVehicleData",realtimeVehicleData)
    

        }, vehicleReducer.receivePeriod); // Set the interval time here

        
        
        return () => {
          BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
          clearInterval(interval);
        }
    
      }, [realtimeVehicleData]))

    useEffect(() => {
        //console.log("@@@@@@@@@@Detail",vehicleReducer.vehicles[0].vehicle.teltonikas)
        const expiry = new Date(infos.vehicle.expirateDate);
        setExpiryDate(expiry.toISOString().slice(0, 19).replace('T', ' '));      

        setBatteryVal(getIOValue(realtimeVehicleData.vehicle.teltonikas.IOvalue,ID_IOBATTERY));
        setConnecStatus(getConnecStatus(realtimeVehicleData.vehicle.teltonikas));

        

        //console.log("@@@@@Detail",infos.vehicle.teltonikas)
        //getAddressFrompoint(infos.vehicle.teltonikas.lat,infos.vehicle.teltonikas.lng);

        //console.log("@@@@@@ infos" , infos.vehicle.teltonikas.isChange);    

    }, [infos])    
    
    
    const getAddressFrompoint = (lat,lng) => {
        if(lat == undefined || lng == undefined) {
            setAddress('');
            return;
        }
        if(lat == 0 || lng == 0){
            setAddress('');
            return;
        } 
        //console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@",lat,lng)
        Geocoder.from(lat, lng)
        .then(json => {
            //console.log("@@@@@@@@ json", json);
            
            addressComponent = json.results[0].formatted_address;
            addressComponent = addressComponent.trimEnd();
            setAddress(addressComponent)

            //console.log("@@@@@@@@@@@ address" , addressComponent,"@@@");
            return addressComponent;
            })
            .catch(error => console.warn(error));

        return;
        
    }

    const getConnecStatus = (teltonika) =>{
        let onlineStatus = false;
        let diffMin = 0;
        //const teltonika = infos.vehicle.teltonikas;
        //const teltonika = realtimeVehicleData != null ? realtimeVehicleData.vehicle.teltonikas : infos.vehicle.teltonikas;
        if (teltonika) {
            const date1 = new Date(teltonika.createdAt);
            const date2 = new Date();
            diffMin = Math.abs((date2.getTime() - date1.getTime())) / 60000;
            //console.log("@@@@connect status",date1,date2);
            if (diffMin < ONLINE_LIMIT) {
                onlineStatus = true;
            }
        }
        return onlineStatus;
    }

    const handleDriverInfo = () => {
        
        setShowDriverInfo(false);
        //console.log("@@@@@@@@@@@handleDriverInfo ",userReducer.token,infos.vehicle.deviceImei,newVehicleName)
        
        if(infos.vehicle.vehicleName != newVehicleName)
        {
            var tempReducer = [];
            for(var i=0;i<vehicleReducer.vehicles.length;i++){
                if(vehicleReducer.vehicles[i].vehicle.deviceImei == infos.vehicle.deviceImei){
                    var tempOneItem = {}
                    tempOneItem = {...vehicleReducer.vehicles[i].vehicle,vehicleName : newVehicleName}
                    tempOneItem = {vehicle : tempOneItem}
                    tempReducer.push(tempOneItem)
                }else{
                    tempReducer.push(vehicleReducer.vehicles[i])
                }
            }
            console.log("@@@@@driverinfo update updatethen",tempReducer);
            
            var tempInfos = {...infos.vehicle,vehicleName:newVehicleName}; 
            tempInfos = {vehicle : tempInfos}
            //console.log("@@@@@@@@driverinfo update tempinfos",tempInfos)
            
            dispatch(updateDriverInfo(userReducer.token,infos.vehicle.deviceImei,newVehicleName,tempReducer,tempInfos));
            //console.log("@@@",infos)
            navigation.navigate("Details",{ "infos": tempInfos });    
        }
        
    }
    
    const handleDeviceName = () => {
        
        setShowDeviceName(false);
        //console.log("@@@@@@@@@@@handleDriverInfo ",userReducer.token,infos.vehicle.deviceImei,newVehicleName)
        if(infos.vehicle.vehicleName != newVehicleName)
        {
            var tempReducer = [];
            for(var i=0;i<vehicleReducer.vehicles.length;i++){
                if(vehicleReducer.vehicles[i].vehicle.deviceImei == infos.vehicle.deviceImei){
                    var tempOneItem = {}
                    tempOneItem = {...vehicleReducer.vehicles[i].vehicle,vehicleName : newVehicleName}
                    tempOneItem = {vehicle : tempOneItem}
                    tempReducer.push(tempOneItem)
                }else{
                    tempReducer.push(vehicleReducer.vehicles[i])
                }
            }
            console.log("@@@@@devicename update updatethen",tempReducer);

            var tempInfos = {...infos.vehicle,vehicleName:newVehicleName}; 
            tempInfos = {vehicle : tempInfos}
            //console.log("@@@@@@@@devicename update tempinfos",tempInfos)
                
            dispatch(updateDeviceName(userReducer.token,infos.vehicle.deviceImei,newVehicleName,tempReducer,tempInfos));
            //console.log("@@@update device name")
            
            navigation.navigate("Details",{ "infos": tempInfos });    
        }
    }
    //console.log("@@@@@@@@@@@@@@@@@ info",infos.vehicle.teltonikas.transferDate);
    const renderLastUpdatedTime = () =>{

        let lastUpdatedTime = "00-00-00";
        const teltonika = realtimeVehicleData != null ? realtimeVehicleData.vehicle.teltonikas : infos.vehicle.teltonikas;
        //console.log("@@@@rendreupdate",realtimeVehicleData != null ? realtimeVehicleData.vehicle.teltonikas.createdAt : "qweqweqwe")
        //console.log("@@@@rendreupdate",realtimeVehicleData)
        if(teltonika.createdAt){
            console.log(teltonika)
            const dateTransfer = new Date(teltonika.createdAt);
            const dateServerOffset = new Date(infos.vehicle.updatedAt);
            const dateCurrentOffset = new Date().getTimezoneOffset();
    
            const timeMil = dateTransfer.getTime() + (dateServerOffset - dateCurrentOffset) * 60*1000;
    
            lastUpdatedTime = new Date(timeMil).toISOString().slice(0,19).replace('T',' ');
    
            //console.log("@@@@@@@renderLastUpdatedTime",dateTransfer,dateServerOffset,dateCurrentOffset)
            //console.log("@@@@@@@renderLastUpdatedTime",infos.vehicle.vehicleName)
        }
        
        return lastUpdatedTime;
    }
   

    return (
        <SafeAreaView style={{ backgroundColor: '#ffff' }}>
            <StatusBar backgroundColor={'white'} barStyle={'dark-content'} />
            <View style={styles.centeredView}>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={showSimNumber}
                    onRequestClose={() => {
                        setShowSimNumber(false);
                    }}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={{ padding: 5 }}>
                                    {t('sim_number')}
                                </Text>
                                <Text style={{ padding: 5 }}>
                                    {infos ? infos.vehicle.simNumber : ''}
                                </Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={{ padding: 5, }}>
                                    {t('iccid')}
                                </Text>
                                <Text style={{ padding: 5 }}>
                                    {infos.vehicle.teltonikas && infos.vehicle.teltonikas.iccid ? infos.vehicle.teltonikas.iccid : 'NO ICCID'}
                                </Text>
                            </View>
                            <TouchableOpacity onPress={() => {
                                setShowSimNumber(false)
                            }}
                                style={{ padding: 6, backgroundColor: "#18567F21", borderRadius: 3, borderWidth: 0, marginTop: 15, paddingHorizontal: 24 }}
                            >
                                <Text>{t('close')}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={showDriverInfo}
                    onRequestClose={() => {
                        setShowDriverInfo(false);
                    }}>
            
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={{ padding: 5 }}>
                                    {t('vehicle_name')} :
                                </Text>
                                <TextInput style={styles.in1} placeholder='Toyota Corolla X' onChangeText={(val) => { setNewVehicleName(val) }}>
                                    {infos ? infos.vehicle.vehicleName : ''}
                                    {/* {newVehicleName ? newVehicleName : ''} */}
                                </TextInput>
                            </View>
                           
                            <TouchableOpacity onPress={() => {
                                handleDriverInfo()
                            }}
                                style={{ padding: 6, backgroundColor: "#18567F21", borderRadius: 3, borderWidth: 0, marginTop: 15, paddingHorizontal: 24 }}
                            >
                                <Text>{t('update')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {
                                setShowDriverInfo(false)
                            }}
                                style={{ padding: 6, backgroundColor: "#18567F21", borderRadius: 3, borderWidth: 0, marginTop: 15, paddingHorizontal: 24 }}
                            >
                                <Text>{t('cancel')}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={showDeviceName}
                    onRequestClose={() => {
                        setShowDeviceName(false);
                    }}>
            
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={{ padding: 5 }}>
                                    {t('device_name')} :
                                </Text>
                                <TextInput style={styles.in1} placeholder='Toyota Corolla X' onChangeText={(val) => { setNewVehicleName(val) }}>
                                    {infos ? infos.vehicle.vehicleName : ''}
                                </TextInput>
                            </View>
                           
                            <TouchableOpacity onPress={() => {
                                handleDeviceName()
                            }}
                                style={{ padding: 6, backgroundColor: "#18567F21", borderRadius: 3, borderWidth: 0, marginTop: 15, paddingHorizontal: 24 }}
                            >
                                <Text>{t('update')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {
                                setShowDeviceName(false)
                            }}
                                style={{ padding: 6, backgroundColor: "#18567F21", borderRadius: 3, borderWidth: 0, marginTop: 15, paddingHorizontal: 24 }}
                            >
                                <Text>{t('cancel')}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
            <ScrollView>
                <View style={styles.v2}>
                    <TouchableOpacity style={[styles.v3, { paddingBottom: 0, }]} onPress={() => setShowDeviceName(true)}>
                        {/* <View style={styles.v3}> */}
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <View style={styles.v1}>
                                    <IconComponentProvider IconComponent={MaterialCommunityIcons}>
                                        <Icon name="access-point" size={15} color="#18567F" />
                                    </IconComponentProvider>
                                </View>
                                <Text style={styles.listLabel}>{t('device_name')}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={styles.rightLabel}>{infos.vehicle.vehicleName}</Text>
                                {/* < IconComponentProvider IconComponent={MaterialCommunityIcons}>
                                    <Icon name="chevron-right" size={20} style={{}} />
                                </IconComponentProvider> */}
                            </View>
                        {/* </View> */}
                    </TouchableOpacity>
                    <View style={styles.v3}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={styles.v1}>
                                <IconComponentProvider IconComponent={MaterialCommunityIcons}>
                                    <Icon name="tag-outline" size={15} color="#18567F" />
                                </IconComponentProvider>
                            </View>
                            <Text style={styles.listLabel}>
                                {t('type_of_equipment')}
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.rightLabel}>{infos.vehicle.deviceType}</Text>
                        </View>
                    </View>

                    <View style={styles.v3}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={styles.v1}>
                                <Image source={require('../../assets/imei.png')} />
                            </View>
                            <Text style={styles.listLabel}>{t('imei')}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.rightLabel}>{infos.vehicle.deviceImei}</Text>
                        </View>
                    </View>

                    <View style={styles.v3}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={styles.v1}>
                                <IconComponentProvider IconComponent={MaterialCommunityIcons}>
                                    <Icon name="clock-outline" size={15} color="#18567F" />
                                </IconComponentProvider>
                            </View>
                            <Text style={styles.listLabel}>{t('expiration')}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.rightLabel}>{expiryDate}</Text>
                        </View>
                    </View>

                    <TouchableOpacity style={styles.v3} onPress={() => setShowSimNumber(true)}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={styles.v1}>
                                <IconComponentProvider IconComponent={MaterialCommunityIcons}>
                                    <Icon name="sim" size={15} color="#18567F" style={{ transform: [{ rotate: '90deg' }] }} />
                                </IconComponentProvider>
                            </View>
                            <Text style={styles.listLabel}>{t('sim')}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            < IconComponentProvider IconComponent={MaterialCommunityIcons}>
                                <Icon name="chevron-right" size={20} />
                            </IconComponentProvider>
                        </View>
                    </TouchableOpacity>

                    <View style={styles.v3}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={styles.v1}>
                                <Image source={require('../../assets/chatgpt.png')} />
                            </View>
                            <Text style={styles.listLabel}>{t('device_icon')}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            < IconComponentProvider IconComponent={MaterialCommunityIcons}>
                                <Icon name="chevron-right" size={20} />
                            </IconComponentProvider>
                        </View>
                    </View>
                </View>

                <View style={[styles.v2, { paddingBottom: 5 }]}>
                    <View style={styles.v3}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={styles.v1}>
                                <IconComponentProvider IconComponent={MaterialCommunityIcons}>
                                    <Icon name="battery-20" size={15} color="#18567F" style={{ transform: [{ rotate: '90deg' }] }} />
                                </IconComponentProvider>
                            </View>
                            <Text style={styles.listLabel}>
                                {t('battery')}
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.rightLabel}>{batteryVal}%</Text>
                        </View>
                    </View>

                    <View style={styles.v3}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={styles.v1}>
                                <IconComponentProvider IconComponent={MaterialCommunityIcons}>
                                    <Icon name="information-outline" size={15} color="#18567F" />
                                </IconComponentProvider>
                            </View>
                            <Text style={styles.listLabel}>
                                {t('status')}
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.rightLabel}>{ connecStatus == true ? t('online') : t('offline')}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.v2}>
                    <View style={styles.v3}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={styles.v1}>
                                <IconComponentProvider IconComponent={MaterialCommunityIcons}>
                                    <Icon name="calendar" size={15} color="#18567F" />
                                </IconComponentProvider>
                            </View>
                            <Text style={styles.listLabel}>
                                {t('Last updated')}</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            {/* <Text style={styles.rightLabel}>{infos.vehicle.teltonikas ? infos.vehicle.teltonikas.transferDate : "2023 05:20 03:12"}</Text> */}
                            <Text style={styles.rightLabel}>{renderLastUpdatedTime()}</Text>
                        </View>
                    </View>
                    <View style={styles.v3}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={styles.v1}>
                                <IconComponentProvider IconComponent={MaterialCommunityIcons}>
                                    <Icon name="speedometer" size={15} color="#18567F" />
                                </IconComponentProvider>
                            </View>
                            <Text style={styles.listLabel}>
                                {t('Speed')}
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.rightLabel}>
                                {realtimeVehicleData != null && realtimeVehicleData.vehicle.teltonikas.speed ? realtimeVehicleData.vehicle.teltonikas.speed : (infos.vehicle.teltonikas && infos.vehicle.teltonikas.speed ? infos.vehicle.teltonikas.speed : 0)}Km/h
                                {/* {infos.vehicle.teltonikas ? infos.vehicle.teltonikas.speed : 0}Km/h */}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.v3}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={styles.v1}>
                                <IconComponentProvider IconComponent={MaterialCommunityIcons}>
                                    <Icon name="longitude" size={15} color="#18567F" />
                                </IconComponentProvider>
                            </View>
                            <Text style={styles.listLabel}>
                                {t('longitude')}
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.rightLabel}>
                                {/* {infos.vehicle.teltonikas ? infos.vehicle.teltonikas.lng : 0} */}
                                {realtimeVehicleData != null ? realtimeVehicleData.vehicle.teltonikas.lng : (infos.vehicle.teltonikas ? infos.vehicle.teltonikas.lng : 0)}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.v3}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={styles.v1}>
                                <IconComponentProvider IconComponent={MaterialCommunityIcons}>
                                    <Icon name="latitude" size={15} color="#18567F" />
                                </IconComponentProvider>
                            </View>
                            <Text style={styles.listLabel}>
                                {t('latitude')}
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.rightLabel}>
                                {/* {infos.vehicle.teltonikas ? infos.vehicle.teltonikas.lat : 0} */}
                                {realtimeVehicleData != null ? realtimeVehicleData.vehicle.teltonikas.lat : (infos.vehicle.teltonikas ? infos.vehicle.teltonikas.lat : 0)}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.v3}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={styles.v1}>
                                <IconComponentProvider IconComponent={MaterialCommunityIcons}>
                                    <Icon name="map-marker" size={15} color="#18567F" />
                                </IconComponentProvider>
                            </View>
                            <Text style={styles.listLabel}>
                                {t('address')}
                            </Text>                            
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={[styles.rightLabel,{width:wp('70%')}]}>
                                {/* {address ? address : ''} */}
                                {/* {infos.vehicle.teltonikas ? infos.vehicle.teltonikas.address : t('no_address_information')} */}
                                {realtimeVehicleData != null ? realtimeVehicleData.vehicle.teltonikas.address : (infos.vehicle.teltonikas ? infos.vehicle.teltonikas.address : t('no_address_information'))}
                            </Text>
                        </View>
                    </View>
                    <TouchableOpacity style={[styles.v3, { paddingBottom: 20, }]} onPress={() => setShowDriverInfo(true)}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={styles.v1}>
                                <IconComponentProvider IconComponent={MaterialCommunityIcons}>
                                    <Icon name="account-outline" size={15} color="#18567F" />
                                </IconComponentProvider>
                            </View>
                            <Text style={styles.listLabel}>
                                {t('driver_information')}
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity>
                                <IconComponentProvider IconComponent={MaterialCommunityIcons}>
                                    <Icon name="chevron-right" size={20} />
                                </IconComponentProvider>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            <View style={{ width: '100%', backgroundColor: '#FFFF', position: 'absolute', height: '5%', top: hp('98%') }}>
                <TouchableOpacity style={{
                    width: 124, height: 5, borderRadius: 5, alignSelf: 'center',
                    backgroundColor: 'rgba(54, 52, 53, 1)', marginTop: 15
                }}>
                </TouchableOpacity>
            </View>
        </SafeAreaView >
    )
}

export default Details
const styles = StyleSheet.create({
    t1: {
        fontSize: 14,
        fontWeight: '500',
        alignSelf: "center",
        textAlign: 'center',
        justifyContent: 'center'
    },
    detailHeader: {
        flexDirection: 'row',
        position: 'relative',
        marginVertical: hp('4%'),
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    to1: {
        position: 'absolute',
        width: 30,
        height: 30,
        left: 5,
        borderRadius: wp('10%'),
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 20
    },
    v1:
    {
        backgroundColor: '#18567F21',
        width: 25,
        height: 25,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center'
    },
    cardview:
    {
        width: 330,
        height: 175,
        borderRadius: 10,
        backgroundColor: '#FFFF',
        marginHorizontal: 15,
        marginTop: 15
    },
    text1: {
        fontSize: 11,
        fontWeight: '400',
        marginLeft: 10,
        marginTop: 4

    },
    to2: {
        marginTop: 13,
        flexDirection: 'row'
    },
    bottomtab: {
        width: wp('100%'),
        backgroundColor: 'white',
        height: 60,
        position: 'absolute',
        top: hp('94%')
    },
    newCar: {
        width: 60,
        height: 60,
        alignItems: 'center',
        backgroundColor: '#18567F',
        justifyContent: 'center',
        marginTop: -30,
        borderRadius: 20,
        marginLeft: 155
    },
    v2: {
        width: wp('95%'),
        alignSelf: 'center',
        backgroundColor: '#18567F12',
        borderRadius: 10,
        padding: 15,
        marginTop: 10,
        marginBottom: 15
    },
    v3: {
        flexDirection: 'row',
        width: wp('90%'),
        justifyContent: 'space-between',
        alignSelf: 'center',
        alignItems: 'center',
        marginBottom: 10
    },
    listLabel: {
        fontSize: 11,
        fontWeight: '500',
        marginLeft: 10
    },
    rightLabel: {
        fontSize: 10,
        fontWeight: '500',
        color: '#18567F',
        textAlign : 'right'
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        textAlign: "center",
        alignItems: "center"
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    }
})