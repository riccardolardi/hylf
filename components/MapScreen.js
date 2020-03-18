import React from 'react';
import { StyleSheet, View, Keyboard } from 'react-native';
import * as Location from 'expo-location';
import MapView from 'react-native-maps';
import SearchMap from './SearchMap.js';

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
	      onPress={Keyboard.dismiss} 
	      onRegionChange={Keyboard.dismiss} 
	      rotateEnabled={false} 
	      initialRegion={currentPosition ? currentPosition : null} 
	    />
  		<SearchMap />
	  </View>
	);
}

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: '100%'
  }
});