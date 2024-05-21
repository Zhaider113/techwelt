import React, { useState, useCallback } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StyleSheet, Text, TouchableOpacity, View, Image, StatusBar, BackHandler } from 'react-native';
import { TextInput } from "react-native";
import { IconComponentProvider, Icon } from "@react-native-material/core";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import {useTranslation} from "react-i18next";
import { useFocusEffect } from '@react-navigation/native';

function Membership({ navigation, route }) {
    const {t} = useTranslation()
    const { infos } = route.params;
    const [price, setPrice] = useState(15);
    const [month_cnt, setMonth] = React.useState(1);

    useFocusEffect(useCallback(() => {
    
        const handleBackPress = () =>{
        
            //console.log("@@@@@@@Member back handler",global.pageNav)
            navigation.navigate('Regiage',{"infos":global.pageNav.param}) 
            return true;
        }
    
        BackHandler.addEventListener('hardwareBackPress', handleBackPress);
        
        return () => {
          BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
        }
    
    }, []))

    const setMonthValue = (month) => {
        setMonth(month);
        setPrice(15 * month);
    }


    return (
        <SafeAreaView style={{ backgroundColor: '#FFFF', flex: 1 }}>
            <StatusBar backgroundColor={'white'} barStyle={'dark-content'} />
            <View style={{
                width: wp('80%'), backgroundColor: '#FFFF', alignSelf: 'center',
                marginTop: hp('5%'), borderRadius: 10, elevation: 20, borderWidth: 0.5, borderColor: 'rgba(24, 86, 127, 0.08)'
            }}>
                <View style={{
                    // flex: 1, , width: wp('80%'),
                    backgroundColor: '#18567F', height: hp('8%'), marginHorizontal: 5, marginVertical: 5,
                    justifyContent: 'space-between', borderRadius: 6, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10
                }}>
                    <TouchableOpacity
                        style={styles.iconArea}
                        onPress={() => {
                            if (month_cnt != 1) {
                                let new_val = month_cnt - 1;
                                setMonthValue(new_val);
                            }
                        }}>
                        <IconComponentProvider IconComponent={MaterialCommunityIcons}>
                            <Icon name="minus" size={20} color="rgba(24, 86, 127, 1)" />
                        </IconComponentProvider>
                    </TouchableOpacity>
                    <Text style={{ color: '#FFFF', fontSize: 22, fontWeight: '500' }}>
                        {month_cnt} MOIS
                    </Text>
                    <TouchableOpacity
                        style={styles.iconArea}
                        onPress={() => {
                            let new_val = month_cnt + 1;
                            setMonthValue(new_val);
                        }}>
                        <IconComponentProvider IconComponent={MaterialCommunityIcons}>
                            <Icon name="plus" size={20} color="rgba(24, 86, 127, 1)" />
                        </IconComponentProvider>
                    </TouchableOpacity>
                </View>
                <View style={{ justifyContent: 'center', alignItems: 'center', paddingVertical: hp('7%') }}>
                    <Text style={{ fontSize: 35, fontWeight: '500' }}>${price}</Text>
                </View>

            </View>
            <TouchableOpacity style={styles.to2} onPress={() => { 
                // global.pageNav = {
                //     "pageName":"Membership",
                //     "param":infos
                //   }
                navigation.navigate('Membership2', { "infos": infos, "mobis": month_cnt }) 
                }}>
                <Text style={{ color: 'white', fontSize: 16, fontWeight: '400' }}>
                    {t('next')}
                </Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    v1: {
        flex: 1,
        backgroundColor: 'white'
    },
    t1: {
        fontSize: 14,
        fontWeight: '500',
        alignSelf: "center",
        textAlign: 'center',
        justifyContent: 'center'
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
    v2: {
        backgroundColor: '#e6f5ff',
        margin: 8,
        borderRadius: 12,
    },
    in1: {
        marginLeft: 15,
        marginRight: 15,
        marginTop: 20,
        borderRadius: 5,
        borderWidth: 0.2,
        height: 52,
        padding: 8,
        paddingLeft: 20,
        borderColor: '#18567F8C'
    },
    to2: {
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        width: wp('70%'),
        height: hp('7.5%'),
        marginTop: hp('26%'),
        backgroundColor: '#18567F',
        borderRadius: 10,
    },
    img: {
        width: 36,
        height: 24,
        position: 'absolute',
        top: 35,
        left: 25
    },
    iconArea: {
        width: 30,
        height: 30,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
});
export default Membership