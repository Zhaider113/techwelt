import React, { useReducer, useState, useCallback } from 'react'
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity,
     Image, Switch, ScrollView, BackHandler  } from 'react-native'

import { IconComponentProvider, Icon } from "@react-native-material/core";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import { useSelector, useDispatch } from 'react-redux';
import { confirmNotificationSettings } from '../actions/vehicles';
import {useTranslation} from "react-i18next";
import { useFocusEffect } from '@react-navigation/native';


export default function Notification_Settings({ navigation, route }) {
    const {t} = useTranslation()
    const dispatch = useDispatch();
    const userReducer = useSelector(state => state.auth);
    const vehicleReducer = useSelector(state => state.vehicles);

    const { infos } = route.params;
    const [dropdownState, setDropdowState] = React.useState(false)

    const VehicleSettingState = vehicleReducer.VehicleSettingState
    //console.log("@@@@@@@@@VehicleSettingState",infos.vehicle)

    // const [isVibration, setIsVibration] = useState(VehicleSettingState[0]);
    // const [isMovement, setIsMovement] = useState(VehicleSettingState[1]);
    // const [isStop, setIsStop] = useState(VehicleSettingState[2]);
    // const [isEnterZone, setIsEnterZone] = useState(VehicleSettingState[3]);
    // const [isSortZone, setIsSortZone] = useState(VehicleSettingState[4]);
    // const [isOverspeed, setIsOverspeed] = useState(VehicleSettingState[5]);
    // const [isDetachment, setIsDetachment] = useState(VehicleSettingState[6]);

    const [isVibration, setIsVibration] = useState(infos.vehicle.isVibration);
    const [isMovement, setIsMovement] = useState(infos.vehicle.isMovement);
    const [isStop, setIsStop] = useState(infos.vehicle.isStop);
    const [isEnterZone, setIsEnterZone] = useState(infos.vehicle.isEnterZone);
    const [isSortZone, setIsSortZone] = useState(infos.vehicle.isSortZone);
    const [isOverspeed, setIsOverspeed] = useState(infos.vehicle.isOverspeed);
    const [isDetachment, setIsDetachment] = useState(infos.vehicle.isDetachment);

    const toggleVibration = () => setIsVibration(previousState => !previousState);
    const toggleMovement = () => setIsMovement(previousState => !previousState);
    const toggleStop = () => setIsStop(previousState => !previousState);
    const toggleEnterZone = () => setIsEnterZone(previousState => !previousState);
    const toggleSortZone = () => setIsSortZone(previousState => !previousState);
    const toggleOverspeed = () => setIsOverspeed(previousState => !previousState);
    const toggleDetachment = () => setIsDetachment(previousState => !previousState);

    useFocusEffect(useCallback(() => {
    
        const handleBackPress = () =>{
            navigation.navigate('Regiage',{"infos":global.pageNav.param}) 
            return true;
        }
    
        BackHandler.addEventListener('hardwareBackPress', handleBackPress);

        setIsVibration(infos.vehicle.isVibration);
        setIsMovement(infos.vehicle.isMovement);
        setIsStop(infos.vehicle.isStop);
        setIsEnterZone(infos.vehicle.isEnterZone);
        setIsSortZone(infos.vehicle.isSortZone);
        setIsOverspeed(infos.vehicle.isOverspeed);
        setIsDetachment(infos.vehicle.isDetachment);

        return () => {
          BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
        }
    
    }, []))


    const handleConfirm = () => {

        //console.log("@@@@@@@@@handleConfirm ",infos.vehicle)
        dispatch(confirmNotificationSettings(userReducer.token, infos.vehicle.teltonikas.deviceImei,
            isVibration, isMovement, isStop, isEnterZone, isSortZone, isOverspeed, isDetachment, navigation));
        // Alert.dismiss();
        //navigation.navigate("MapScreen");
        navigation.navigate("Regiage", { "infos": infos });
    };
    return (
        <SafeAreaView style={styles.v1}>
            <View
                style={{
                    backgroundColor: '#18567F',
                    width: wp('90%'),
                    height: hp('13%'),
                    borderRadius: 20,
                    alignSelf: 'center',
                    marginTop: hp('1%'),
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                <Image
                    source={require('../../assets/1back.png')}
                    style={{
                        width: 120,
                        height: 120,
                        position: 'absolute',
                        top: hp('-3%'),
                        right: wp('0%'),
                    }} />
                <Image
                    source={require('../../assets/2back.png')}
                    style={{
                        width: 120,
                        height: 120,
                        position: 'absolute',
                        top: hp('-1%'),
                        right: wp('0%'),
                    }} />
                <Image
                    source={require('../../assets/3.png')}
                    style={{
                        width: 120,
                        height: 120,
                        position: 'absolute',
                        top: hp('6%'),
                        left: wp('0%'),
                    }} />
                <Text
                    style={{
                        color: '#FFFF',
                        fontSize: 12,
                        fontWeight: '300',
                        margin: wp('5%')
                    }}>
                    {t('your_car')}
                </Text>
                <View
                    style={{
                        flexDirection: 'row',
                        marginLeft: 15,
                        marginTop: hp('-1.5%'),
                    }}>

                    <Text bold style={{ fontSize: 20, color: '#FFFF' }}>{infos.vehicle.vehicleName}</Text>
                    {/* <TouchableOpacity
                        style={styles.dropdown}
                        onPress={() => setDropdowState(!dropdownState)}>
                        <IconComponentProvider
                            IconComponent={MaterialCommunityIcons}
                            style={{
                                alignSelf: 'center'
                            }}>
                            {dropdownState ? (
                                <Icon name="arrow-up" size={wp('4%')} color="black" />
                            ) : (
                                <Icon name="arrow-down" size={wp('4%')} color="black" />
                            )}
                        </IconComponentProvider>
                    </TouchableOpacity> */}

                </View>
            </View>
            {dropdownState ? (
                <View
                    style={{
                        width: wp('26%'), height: hp('17%'), backgroundColor: 'white', position: 'absolute', borderRadius: 10,
                        top: hp('11%'), left: wp('26%'), opacity: 1, elevation: 10
                    }}>
                    <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                        <TouchableOpacity style={styles.to2} onPress={() => { setVehicle("BMW"), setDropdowState(false) }}>
                            <Text >BMW</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.to2} onPress={() => { setVehicle("AUDI"), setDropdowState(false) }}>
                            <Text >AUDI</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.to2} onPress={() => { setVehicle("SONATA"), setDropdowState(false) }}>
                            <Text >SONATA</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            ) : null}

            <View style={styles.settingPanel}>
                <View style={styles.setting}>
                    <Text style={styles.settingLabel}>
                        {t('vibration')}
                    </Text>
                    <Switch
                        style={styles.switch}
                        thumbColor={isVibration ? '#18567F' : '#37474FC7'}
                        trackColor={{ false: "#ddd", true: "#aaa" }}
                        onValueChange={toggleVibration}
                        value={isVibration} />
                </View>
                <View style={styles.setting}>
                    <Text style={styles.settingLabel}>
                        {t('movement')}
                    </Text>
                    <Switch
                        style={styles.switch}
                        thumbColor={isMovement ? '#18567F' : '#37474FC7'}
                        trackColor={{ false: "#ddd", true: "#aaa" }}
                        onValueChange={toggleMovement}
                        value={isMovement} />
                </View>
                <View style={styles.setting}>
                    <Text style={styles.settingLabel}>
                        {t('stop')}
                    </Text>
                    <Switch
                        style={styles.switch}
                        thumbColor={isStop ? '#18567F' : '#37474FC7'}
                        trackColor={{ false: "#ddd", true: "#aaa" }}
                        onValueChange={toggleStop}
                        value={isStop} />
                </View>
                <View style={styles.setting}>
                    <Text style={styles.settingLabel}>
                        {t('enter_zone')}
                    </Text>
                    <Switch
                        style={styles.switch}
                        thumbColor={isEnterZone ? '#18567F' : '#37474FC7'}
                        trackColor={{ false: "#ddd", true: "#aaa" }}
                        onValueChange={toggleEnterZone}
                        value={isEnterZone} />
                </View>
                <View style={styles.setting}>
                    <Text style={styles.settingLabel}>
                        {t('out_of_zone')}
                    </Text>
                    <Switch
                        style={styles.switch}
                        thumbColor={isSortZone ? '#18567F' : '#37474FC7'}
                        trackColor={{ false: "#ddd", true: "#aaa" }}
                        onValueChange={toggleSortZone}
                        value={isSortZone} />
                </View>
                <View style={styles.setting}>
                    <Text style={styles.settingLabel}>
                        {t('overspeed')}
                    </Text>
                    <Switch
                        style={styles.switch}
                        thumbColor={isOverspeed ? '#18567F' : '#37474FC7'}
                        trackColor={{ false: "#ddd", true: "#aaa" }}
                        onValueChange={toggleOverspeed}
                        value={isOverspeed} />
                </View>
                <View style={styles.setting}>
                    <Text style={styles.settingLabel}>
                        {t('detachment')}
                    </Text>
                    <Switch
                        style={styles.switch}
                        thumbColor={isDetachment ? '#18567F' : '#37474FC7'}
                        trackColor={{ false: "#ddd", true: "#aaa" }}
                        onValueChange={toggleDetachment}
                        value={isDetachment} />
                </View>
            </View>

            <TouchableOpacity style={styles.buttonView} onPress={handleConfirm}>
                <View
                    style={styles.confirmButton}>
                    <Text style={{ color: 'white', fontSize: 14, fontWeight: '700' }}>
                        {t('confirm')}
                    </Text>
                </View>
            </TouchableOpacity>
        </SafeAreaView >
    )
}

const styles = StyleSheet.create({
    v1: {
        flex: 1,
        backgroundColor: 'white',
        paddingBottom: hp('5%')
    },
    detailHeader: {
        flexDirection: 'row',
        position: 'relative',
        marginTop: hp('6%'),
        marginBottom: hp('3.5%'),
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    to2: {
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        width: wp('20%'),
        height: hp('5%'),
        // bottom: 0,
    },
    setting: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginVertical: 7,
        alignSelf: 'center',
        flex: 0.143
    },
    settingLabel: {
        fontSize: 14,
        fontWeight: '600',
        opacity: 0.8
    },
    settingPanel: {
        marginTop: hp('1%'),
        width: wp('85%'),
        alignSelf: 'center',
        flex: 1
    },
    dropdown: {
        width: wp('5%'),
        height: wp('5%'),
        borderRadius: 44,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFF',
        marginLeft: wp('4%'),
        marginTop: 5,
        position: 'relative',
        flexDirection: 'row',
    },
    buttonView: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginVertical: 7,
        alignSelf: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
    },
    confirmButton: {
        width: wp('70%'),
        backgroundColor: '#18567F',
        height: hp('8%'),
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        borderRadius: 10,
        // marginTop: -hp('10%')
    },
    switch: {
        color: 'black',
        transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
        padding: 1,
        margin: 1,
        height: 30,
    }
});