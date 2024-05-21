import React, { useState , useCallback, useEffect } from 'react'
import { StyleSheet, View, TouchableOpacity, Image, Text } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import {useTranslation} from "react-i18next";


const Header = (params) => {
  const { t } = useTranslation();
  const backpress = () =>{
    params.curNavigation.goBack();
  }

  return (
    <View style={{flexDirection:'row', width:'100%',height: 85,
      backgroundColor:'#364153' }}>
      <TouchableOpacity  onPress={()=>{backpress()}} style={{marginLeft:16, width:20}}>
        {params.back == 'true' ?
        <Image style={styles.backimg} source={require('../../assets/arrow-left.png')}></Image>
        :
        <View></View>
        }
      </TouchableOpacity>
      <Text style={{ flex:1, textAlign:'center', marginTop:20, fontSize:15, fontWeight:'600', color:'white'}}>{params.screenName}</Text>
      <TouchableOpacity  onPress={()=>{backpress()}} style={{marginLeft:16, width:20}}>
        {/* <Image style={styles.backimg} source={require('../../assets/mail.png')}></Image> */}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  backimg: {
    resizeMode: 'contain',
    width: 26,
    height: 30,
    marginTop:30
  },
})

export default Header;