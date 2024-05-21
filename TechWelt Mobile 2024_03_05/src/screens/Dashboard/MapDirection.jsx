import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapViewDirections from 'react-native-maps-directions';


const MapDirection = (coordinate) => {

  
  const colat = parseFloat( coordinate.coordinate1.latitude ) + 1.2
  const colng = parseFloat( coordinate.coordinate1.longitude ) + 1.2

  //console.log("@@@@@ mapdirectionindex",coordinate.index)
  
  //console.log("@@@@marker coord",colat,colng)
    return (
        <MapViewDirections
            // origin={{
            //   latitude:  34.0352633, // Replace with your start latitude
            //   longitude:  72.6057699, // Replace with your start longitude
            // }}
            // destination={{
            //   latitude:  36.0352633, // Replace with your end latitude
            //   longitude:  74.6057699, // Replace with your end longitude
            // }}
            key={coordinate.index}
            origin={{
                latitude:  coordinate.coordinate1.latitude, // Replace with your start latitude
                longitude:  coordinate.coordinate1.longitude, // Replace with your start longitude
              }}
            destination={{
              latitude: coordinate.coordinate2.latitude, // Replace with your end latitude
              longitude: coordinate.coordinate2.longitude, // Replace with your end longitude
            }}
            //waypoints={roadPointList.slice(1, roadPointList.length - 1)}          
            apikey={global.GOOGLE_MAPS_API_KEY} // Replace with your Google Maps API key
            strokeWidth={4}
            strokeColor="#18567F"
            fillColor="#bbb"
          />
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginBottom:-20
    },
    webView: {
      flex: 1,
    },
  });
  
  export default MapDirection;
  