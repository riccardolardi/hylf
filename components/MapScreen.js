import React from 'react';
import { StyleSheet, View, Keyboard } from 'react-native';
import * as Location from 'expo-location';
import * as Animatable from 'react-native-animatable';
import MapView from 'react-native-maps';
import SearchMap from './SearchMap.js';

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill
  },
  map: {
    ...StyleSheet.absoluteFill
  }
});

export default function MapScreen(props) {

  const [currentPosition, setCurrentPosition] = React.useState(null);
  const [isOpen, setIsOpen] = React.useState(false);

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
    props.navigation.addListener('focus', () => {
      setIsOpen(true);
    });
    props.navigation.addListener('blur', () => {
      setIsOpen(false);
    });
    return () => {
      props.navigation.removeListener('focus');
      props.navigation.removeListener('blur');
    };
  }, []);
	
  return (isOpen && 
    <Animatable.View style={[styles.container]} 
      animation='fadeInDown' duration={125} useNativeDriver>
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