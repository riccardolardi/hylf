import React from 'react';
import { StyleSheet, View, Keyboard } from 'react-native';
import * as Location from 'expo-location';
import MapView from 'react-native-maps';
import SearchMap from './SearchMap.js';

export default function MapScreen(props) {

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

  const dismiss = () => {
    Keyboard.dismiss;
  }

  React.useEffect(() => {
    getCurrentPosition()
  }, []);

  const styles = StyleSheet.create({
    container: {
      ...StyleSheet.absoluteFill
    },
    map: {
      ...StyleSheet.absoluteFill
    }
  });
	
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