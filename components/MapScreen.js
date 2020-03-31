import React from 'react';
import { StyleSheet, View, Keyboard } from 'react-native';
import * as Location from 'expo-location';
import * as Animatable from 'react-native-animatable';
import MapView from 'react-native-maps';
import SearchMap from './SearchMap.js';

const styles = StyleSheet.create({
  container: {
    display: 'none',
    opacity: 0,
    ...StyleSheet.absoluteFill
  },
  open: {
    display: 'flex'
  },
  map: {
    ...StyleSheet.absoluteFill
  }
});

export default function MapScreen(props) {

  const [currentPosition, setCurrentPosition] = React.useState(null);
  const [isOpen, setIsOpen] = React.useState(null);

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
    getCurrentPosition();
  }, [isOpen]);

  React.useEffect(() => {
    const open = props.currentScreenIndex === props.screenIndex;
    setTimeout(() => setIsOpen(open), 375);
  }, [props.currentScreenIndex]);
	
  return (
    <Animatable.View style={[styles.container, isOpen && styles.open]} 
      animation={isOpen ? 'fadeInDown' : null} duration={125} useNativeDriver>
	    <MapView 
	      style={styles.map} 
	      onPress={Keyboard.dismiss} 
	      onRegionChange={Keyboard.dismiss} 
	      rotateEnabled={false} 
	      initialRegion={currentPosition ? currentPosition : null} 
	    />
  		<SearchMap />
	  </Animatable.View>
	);
}