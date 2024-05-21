import React from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';


const StreetViewComponent = (data) => {
    let {lat, lng} = data.coordinate
    let url = `https://maps.googleapis.com/maps/api/streetview?size=400x400&location=${lat},${lng}&heading=151.78&pitch=-0.76&key=${global.GOOGLE_MAPS_API_KEY}`
    // https://maps.googleapis.com/maps/api/streetview?size=400x400&location=48.85783227207914,3.295226175151347&heading=151.78&pitch=-0.76&key=AIzaSyCkzRChTNNK4Zeffq5m9H0nX-Hia8im_UI
    // console.log(">>>>>>>>",url)
    
    return (
      <View style={styles.container}>
        <WebView 
          style={styles.webView}
          source={{ uri: url }}
        />
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginBottom:-20
    },
    webView: {
      position: 'absolute',
      flex: 1,
      height:50,
      backgroundColor:'white'
    },
  });
  
  export default StreetViewComponent;
  