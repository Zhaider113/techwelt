import React, { useState , useCallback, useEffect } from 'react'
import { StyleSheet, View, TouchableOpacity, Image, Text } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Bottle } from 'react-flaticons';


const BottomTab = (params) => {
  return (
    <View style={{flexDirection:'row', width:wp('100%'), height:45, backgroundColor:'#333', alignItems:'center'}}>
      <Image style={{flex:1, width:33, height:33, resizeMode:'contain'}} source={require('./../../assets/tab_list_sel.png')} />
      <Image style={{flex:1, width:33, height:33, resizeMode:'contain'}} source={require('./../../assets/tab_dashboard_desel.png')} />
      <Image style={{flex:1, width:33, height:33, resizeMode:'contain'}} source={require('./../../assets/tab_map_desel.png')} />
      <View style={{flex:1}}>
        <Image style={{width:40, height:40, resizeMode:'contain'}} source={require('./../../assets/tab_alert_sel.png')}></Image>
        <View style={{position:'absolute', right:0, top:0, width:18, height:18, borderRadius:9, backgroundColor:'#D01400'}}>
          <Text style={{ color:'white', alignSelf:'center', fontSize:10, marginTop:1}}>32</Text>
        </View>
      </View>
      <Image style={{flex:1, width:33, height:33, resizeMode:'contain'}} source={require('./../../assets/tab_list_sel.png')} />
    </View>
  );
}

const styles = StyleSheet.create({
})

export default BottomTab;