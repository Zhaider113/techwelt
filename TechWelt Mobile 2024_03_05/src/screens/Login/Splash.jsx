import React from "react";
import { View, ImageBackground, Image, StyleSheet } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useFocusEffect } from "@react-navigation/native";

export default function Splash({ navigation }) {
  useFocusEffect(
    React.useCallback(() => {
      const interval = setTimeout(() => {
        navigation.navigate("LoginBoard");
      }, 1000);
    }, [])
  );

  return (
    <View style={styles.container}>
      <ImageBackground style={styles.imgBg} source={require("../../../assets/splash.png")}>
        <Image style={styles.imgLogo} source={require("../../../assets/logo_origin.png")} />
        <Image style={styles.imgMap} source={require("../../../assets/map_ico.png")} />
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imgBg: {
    flex: 1,
    resizeMode: 'cover',
    width: wp('100%'),
    height: hp('100%'),
  },
  imgLogo: {
    resizeMode:'center',
    position: 'absolute',
    width: wp('21.4%'),
    height: wp('21.8%'),
    marginTop: hp('6.7%'),
    alignSelf: 'center'
  },
  imgMap: {
    position: 'absolute',
    width: wp('26.6%'),
    height: wp('26.6%'),
    marginTop: hp('36.9%'),
    marginLeft: wp('64.2%'),
  }
});