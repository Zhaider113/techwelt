import { useFocusEffect } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { useCallback } from 'react';
import { TouchableWithoutFeedback } from 'react-native';
import { View, Text, StyleSheet, ActivityIndicator, StatusBar } from 'react-native';
import { Image } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


export default function HomeScreen({ navigation }) {

  let isLoading = true;


  useFocusEffect(
    useCallback(() => {
      const interval = setInterval(() => {
        if(global.savedToken){
          navigation.navigate('LoginBoard');
        }else{
          navigation.navigate('Tip');          
        }
      }, 2500);

      return () => clearInterval(interval);
    }, [])
  )

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    imageLogo: {
      width: 150,
      height: 150,
      marginBottom: hp('25%'),
      marginTop: hp('20%')
    },
  });

  return (
    <TouchableWithoutFeedback>
      <View style={styles.container}>
        <View style={{
          width: 136, height: 136, backgroundColor: '#01B4E60A', borderRadius: 100
          , position: 'absolute', left: 327, top: -44
        }}>

        </View>

        <View style={{
          width: 136, height: 136, backgroundColor: '#18567F0A', borderRadius: 100
          , position: 'absolute', left: -89, top: 113
        }}>

        </View>

        <View style={{
          width: 136, height: 136, backgroundColor: '#18567F0A', borderRadius: 100
          , position: 'absolute', left: 319, top: 576
        }}>

        </View>
        <StatusBar hidden={true} />
        <Image source={require("../../assets/logo.png")} style={styles.imageLogo} />
        <ActivityIndicator color='rgba(54, 52, 53, 1)' size={30} />
      </View>
    </TouchableWithoutFeedback>
  );
}


