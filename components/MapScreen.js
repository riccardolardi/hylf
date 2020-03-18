import React from 'react';
import { StyleSheet, Text, View, Image, Dimensions } from 'react-native';
import { Button } from 'react-native-paper';
import * as Location from 'expo-location';
import MapView from 'react-native-maps';

export default function MapScreen() {

  const [currentPosition, setCurrentPosition] = React.useState(null);

  const getCurrentPosition = async () => {
    const permissionResult = await Location.requestPermissionsAsync();

    if (!permissionResult.granted) {
      alert('Permission to location is required!');
      return;
    }

    const locationResult = await Location.getCurrentPositionAsync();

    if (!locationResult) return;

    setCurrentPosition({
      ...locationResult.coords,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05
    });
  }

  React.useEffect(() => {
    getCurrentPosition()
  }, []);
	
  return (
  	<View style={styles.container}>
	    <MapView 
	      style={styles.map} 
	      initialRegion={currentPosition ? currentPosition : null} 
	    />
	  </View>
	);
}

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: '100%'
  }
});