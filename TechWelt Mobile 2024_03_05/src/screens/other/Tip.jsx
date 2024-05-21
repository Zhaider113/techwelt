
import * as React from 'react';
import { Button, View, Text, SliderComponent, StatusBar } from 'react-native';
import { StyleSheet, BackHandler, Alert} from 'react-native';
import { useEffect } from 'react';
import { Image } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useFocusEffect } from '@react-navigation/native';
import {useTranslation} from "react-i18next";

const BACKGROUND_FETCH_TASK = 'background-fetch-techwelt-name';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';

export default function Tip({ navigation }) {
  const {t} = useTranslation()
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fffF',
    },
    buttonText: {
      color: '#ffffff',
      fontSize: wp('4%'),
      fontWeight: '600'
    },
    buttonNext: {
      width: wp('70%'),
      height: hp('7%'),
      backgroundColor: '#18567F',
      borderRadius: wp('2%'),
      padding: hp('1.5%'),
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
      marginTop: hp('6%')
    },
    imageGroup: {
      width: wp('70%'),
      height: hp('35%'),
      marginTop: hp('10%'),
      marginBottom: hp('4%'),
      alignSelf: 'center'
    },
  });

  useFocusEffect(
    React.useCallback(() => {
      global.ExitScreen = 0;
      //console.log("@@@@@Tip",global.ExitScreen)
    },[])
  )

  useEffect(() => {
    
    BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    }
    // const unsubscribe = navigation.addListener('blur', () => {
    //   // Perform actions when the screen loses focus
    //   // Stop any ongoing processes or clear intervals
    //   console.log("@@@@@@@@@@@@backhandler")
    //   Alert.alert(
    //     t('warning'),
    //     t('are_you_going_to_delete_this_vehicle'),
    //     [
    //       {
    //         text: t('yes'),
    //         onPress: () => {
    //           console.log("exit app")
    //           BackHandler.exitApp()
    //         }
    //       },
    //       {
    //         text: t('no'),
    //         onPress: () => {}
    //       },
    //     ],
    //   );      
    // });
  })

  const handleBackPress = () =>{
    //console.log("exit app",global.ExitScreen)
    //navigation.navigate('')
    if(global.ExitScreen == 0){
      Alert.alert(
        t('warning'),
        t('are_you_going_to_exit_app'),
        [
          {
            text: t('yes'),
            onPress: async () => {
              console.log("exit app");
              const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_FETCH_TASK);
              //console.log("@@@@@Tip unregisterbackFecth",isRegistered)
              if(isRegistered){
                //console.log("@@@@@@tip unreg call")
                BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
              }
        
              BackHandler.exitApp();
            }
          },
          {
            text: t('no'),
            onPress: () => {}
          },
        ],
      );      
      return true;
    }

    return false;
  }

  return (
    <View style={styles.container}>

      <StatusBar barStyle="dark-content" hidden={false} backgroundColor="#FFFF" translucent={true} />
      <Image
        source={require('../../assets/group1.png')}
        style={styles.imageGroup}
      />
      <View style={{ flexDirection: 'row', alignSelf: 'center', marginTop: hp('5%') }}>
        <Image source={require('../../assets/box.png')} style={{ marginRight: hp('1.5%') }} />
        <View style={{ width: 10, height: 10, backgroundColor: '#263238', opacity: 0.3, borderRadius: 30 }}>
        </View>
      </View>
      <Text style={{
        fontSize: 20, fontWeight: 'bold', textAlign: 'center',
        marginTop: hp('3%'), marginHorizontal: wp('5%')
      }}>
        {t('search_your_vehicle_using_gps_tracker')}
      </Text>

      <Text style={{ fontSize: wp('3.5%'), textAlign: 'center', alignSelf: 'center', marginTop: hp('4%'), fontWeight: '400', opacity: 0.7 }}>
        {t('search_vehicle_and_track_it')}
      </Text>
      <TouchableOpacity style={styles.buttonNext} onPress={() => {
        global.ExitScreen = 1;
        navigation.navigate('Board');
      }}>
        <Text style={styles.buttonText}>{t('next')}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={{
        width: wp('40%'), height: hp('1%'), borderRadius: hp('2%'), alignSelf: 'center', backgroundColor: 'rgba(54, 52, 53, 1)',
        position: 'absolute', top: hp('103%')
      }}>
      </TouchableOpacity>
    </View>
  );
}