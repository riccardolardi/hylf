import React from 'react';
import { StyleSheet, View, Keyboard } from 'react-native';
import * as Location from 'expo-location';
import * as Animatable from 'react-native-animatable';
import MapView, { Marker } from 'react-native-maps';
import ServiceModal from './ServiceModal';
import SearchMap from './SearchMap.js';

const markerImg = require('../assets/marker.png');

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

  const mapViewRef = React.useRef(null);

  const [currentUserPosition, setCurrentUserPosition] = React.useState(null);
  const [currentRegion, setCurrentRegion] = React.useState(null);
  const [lastRegion, setLastRegion] = React.useState(null);
  const [isOpen, setIsOpen] = React.useState(null);
  const [showServiceModal, setShowServiceModal] = React.useState(null);
  const [markerArray, setMarkerArray] = React.useState([]);

  const getCurrentPosition = async () => {
    const permissionResult = await Location.requestPermissionsAsync();
    if (!permissionResult.granted) {
      alert('Permission to location is required!');
      return;
    }
    const locationResult = await Location.getCurrentPositionAsync();
    if (!locationResult) return;
    setCurrentUserPosition({
      ...locationResult.coords,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05
    });
  }

  const onLongPress = (event) => {
    Keyboard.dismiss();
    const newLocation = {
      latitude: event.nativeEvent.coordinate.latitude 
        - 0.45 * currentRegion.latitudeDelta,
      longitude: event.nativeEvent.coordinate.longitude,
      latitudeDelta: currentRegion.latitudeDelta,
      longitudeDelta: currentRegion.longitudeDelta
    }
    mapViewRef.current.animateToRegion(newLocation, 125);
    setShowServiceModal({
      show: true,
      mode: 'add',
      data: newLocation
    });
  }

  const addService = (data) => {
    setMarkerArray(markerArray.concat({
      latlng: data.coordinate,
      title: data.title,
      description: data.description
    }));
  }

  const onRegionChangeComplete = (event) => {
    setLastRegion(currentRegion);
    setCurrentRegion(event);
  }

  React.useEffect(() => {
    if (!showServiceModal) {
      const newMarkerArray = markerArray.filter(x => x.title !== 'tmp');
      setMarkerArray(newMarkerArray);
      lastRegion && mapViewRef.current.animateToRegion(lastRegion, 125);
    }
    props.setShowMenuToggle(!showServiceModal);
    props.setShowMapSearchBar(!showServiceModal);
  }, [showServiceModal]);

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
        ref={mapViewRef} 
	      onPress={Keyboard.dismiss} 
	      onRegionChange={Keyboard.dismiss} 
        onRegionChangeComplete={onRegionChangeComplete} 
        onLongPress={onLongPress} 
        pitchEnabled={false} 
	      rotateEnabled={false} 
	      initialRegion={currentUserPosition ? currentUserPosition : null}>
        {markerArray.length !== 0 && markerArray.map((marker, i) => <Marker 
          key={i} coordinate={marker.latlng} title={marker.title}
          image={markerImg} description={marker.description} />
        )}
      </MapView>
      <ServiceModal addService={addService} data={showServiceModal} 
        setData={setShowServiceModal} />
  		<SearchMap show={props.showMapSearchBar} />
	  </Animatable.View>
	);
}