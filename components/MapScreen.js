import React from 'react';
import { StyleSheet, View, Keyboard, Alert } from 'react-native';
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
    if (!props.localUserData) {
      Alert.alert(
        'Who are you?', 
        'To add services you need to identify yourself. Please login or register first.',
        [
          {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
          {text: 'OK', onPress: () => props.setCurrentScreenIndex(props.authState ? 2 : 1)},
        ], {cancelable: true}
      );
      return;
    }
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
      coordinate: event.nativeEvent.coordinate
    });
  }

  const addService = async (data) => {
    setMarkerArray(markerArray.concat({
      latlng: data.coordinate,
      title: data.title,
      description: data.description
    }));
    const user = props.firebase.auth().currentUser;
    const serviceId = user.uid + '-' + Date.now(); // sloppy
    await props.firebase.database().ref('/services/' + serviceId).set({
      coordinate: data.coordinate,
      title: data.title,
      description: data.description,
      address: data.address,
      zip: data.zip,
      city: data.city,
      email: data.email,
      phone: data.phone,
      userData: props.localUserData,
      userId: user.uid,
      serviceId: serviceId,
      creationDate: Date.now()
    }).catch(error => {
      Promise.reject(error);
      return;
    });
    setTimeout(() => 
      mapViewRef.current.animateToRegion(data.coordinate, 125), 1000);
    Promise.resolve();
  }

  const loadServices = async () => {
    await props.firebase.database().ref('/services').once('value').then(snapshot => {
      const newMarkerArray = [];
      snapshot.val() && snapshot.forEach(item => {
        item.val() && newMarkerArray.push({
          latlng: item.val().coordinate,
          title: item.val().title,
          description: item.val().description,
          data: item.val()
        });
      });
      setMarkerArray(newMarkerArray);
    });
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
    if (isOpen) {
      getCurrentPosition();
      loadServices();
    }
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
      <ServiceModal 
        localUserData={props.localUserData} 
        setShowLoadOL={props.setShowLoadOL} 
        addService={addService} 
        data={showServiceModal} 
        setData={setShowServiceModal} />
  		<SearchMap show={props.showMapSearchBar} />
	  </Animatable.View>
	);
}