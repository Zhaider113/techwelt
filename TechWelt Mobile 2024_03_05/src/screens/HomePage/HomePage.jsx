import React, { useState, useEffect, useRef, useCallback } from "react";
import { SafeAreaView, StatusBar } from "react-native";
import { StyleSheet } from "react-native";

import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useFocusEffect } from "@react-navigation/native";

export default function HomePage({ navigation, route }) {
  useFocusEffect(useCallback(() => {}, []));

  useEffect(() => {}, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFF", marginTop: 25 }}>
      <StatusBar backgroundColor={"white"} barStyle={"dark-content"} />
      <Text>This is Homepage Screen</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  map: {
    //position: 'relative',
    width: "100%",
    height: hp("100%"),
    marginTop: 15,
    //marginBottom:15,
    flex: 1,
  },
});
