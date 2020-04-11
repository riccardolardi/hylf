import React from 'react';
import { StyleSheet, View, Keyboard, 
  Alert, Image, Linking } from 'react-native';
import * as Location from 'expo-location';
import * as Animatable from 'react-native-animatable';
import * as MailComposer from 'expo-mail-composer';
import MapView, { Marker } from 'react-native-maps';
import { Modal, Text, Button, Surface, 
  Title, Paragraph, TextInput, Divider } from 'react-native-paper';
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
  },
  marker: {
    width: 42,
    height: 42
  },
  callout: {
    width: 212
  },
  title: {
    fontFamily: 'Itim',
    fontSize: 24,
    lineHeight: 32,
    paddingLeft: 8,
    paddingRight: 8
  },
  text: {
    paddingLeft: 8,
    paddingRight: 8
  },
  field: {
    marginBottom: 8
  },
  link: {
    textDecorationLine: 'underline'
  },
  button: {
    marginTop: 8,
  },
  address: {
    marginTop: 8
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

  const getUserPosition = async () => {
    const permissionResult = await Location.requestPermissionsAsync();
    if (!permissionResult.granted) {
      alert('Permission to location is required!');
      return;
    }
    const locationResult = await Location.getCurrentPositionAsync();
    if (!locationResult) return;
    setCurrentUserPosition({
      ...locationResult.coords,
      latitudeDelta: 0.03,
      longitudeDelta: 0.03
    });
  }

  const onPress = (event) => {
    Keyboard.dismiss();
    if (showServiceModal) closeServiceModal();
  }

  const onLongPress = (event) => {
    if (showServiceModal) return;
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
      mode: 'add'
    });
  }

  const addService = async (data) => {
    const user = props.firebase.auth().currentUser;
    const serviceId = user.uid + '-' + Date.now(); // sloppy
    const markerData = {
      coordinate: data.coordinate,
      title: data.title,
      description: data.description,
      username: data.username,
      address: data.address,
      zip: data.zip,
      city: data.city,
      email: data.email,
      phone: data.phone,
      userData: props.localUserData,
      userId: user.uid,
      serviceId: serviceId,
      creationDate: Date.now()
    }
    setMarkerArray(markerArray.concat(markerData));
    await props.firebase.database().ref('/services/' + serviceId)
      .set(markerData).catch(error => {
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
        item.val() && newMarkerArray.push({...item.val()});
      });
      setMarkerArray(newMarkerArray);
      Promise.resolve();
    });
  }

  const closeServiceModal = (force) => {
    Keyboard.dismiss();
    if (force) {
      setShowServiceModal(null);
      return;
    }
    Alert.alert(
      'Cancel?', 
      'Sure you want to cancel? All entered information will be lost.',
      [
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: 'OK', onPress: () => setShowServiceModal(null)},
      ], {cancelable: true}
    );
  }

  const onRegionChangeComplete = (event) => {
    setCurrentRegion(event);
  }

  const setSearchString = (searchString) => {
    if (searchString.length <= 2) {

    } else {
      
    }

  }

  const sendMail = (recipient) => {
    MailComposer.composeAsync({saveOptions: {
      recipients: [recipient]
    }}).then(result => {
      // ...
    }).catch(error => Alert.alert('Oh no!', error.message));
  }

  const startCall = (number) => {
    Linking.openURL(`tel:${number}`);
  }

  React.useEffect(() => {
    getUserPosition();
  }, []);

  React.useEffect(() => {
    props.setShowMenuToggle(!showServiceModal);
    props.setShowMapSearchBar(!showServiceModal);
    setLastRegion(showServiceModal ? currentRegion : null);
    lastRegion && mapViewRef.current.animateToRegion(lastRegion, 125);
  }, [showServiceModal]);

  React.useEffect(() => {
    if (isOpen) {
      loadServices().then(() => {
        // const markerIds = markerArray.map(marker => marker.serviceId);
        // mapViewRef.current.fitToSuppliedMarkers(markerIds);
      });
    }
  }, [isOpen]);

  React.useEffect(() => {
    const open = props.currentScreenIndex === props.screenIndex;
    setTimeout(() => setIsOpen(open), props.screenInDelay);
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
        onPress={onPress} 
        onLongPress={onLongPress} 
        pitchEnabled={false} 
	      rotateEnabled={false} 
        mapPadding={{top: 100}} 
        zoomEnabled={showServiceModal ? false : true} 
        zoomTapEnabled={showServiceModal ? false : true} 
	      initialRegion={currentUserPosition ? currentUserPosition : null}>
        {markerArray.length !== 0 && markerArray.map((marker, i) => <Marker 
          key={i} coordinate={marker.coordinate} title={marker.title}
            description={marker.description} tracksViewChanges={false}
              identifier={marker.serviceId} centerOffset={{x: 0, y: 0}} 
                style={{display: showServiceModal ? 'none' : 'flex', 
                  opacity: marker.filtered ? 0.25 : 1.0}} stopPropagation>
            <Image source={markerImg} style={styles.marker} />
            <MapView.Callout>
              <View style={styles.callout}>
                <Title style={[styles.field, styles.title]}>{marker.title}</Title>
                {marker.username ? <Text style={[styles.field, styles.text]}>{marker.username}</Text> : null}
                <Text style={[styles.field, styles.text]}>{marker.description}</Text>
                <Divider />
                <View style={styles.address}>
                  {marker.address ? <Text style={[styles.field, styles.text]}>{marker.address}</Text> : null}
                  {(marker.zip || marker.city) ? <Text style={[styles.field, styles.text]}>
                    {`${marker.zip ? marker.zip : ''}${(marker.zip && marker.city) ? ', ' : ''}${marker.city ? marker.city : ''}`}
                  </Text> : null}
                  {marker.email ? <Text style={[styles.field, styles.text, styles.link]} 
                    onPress={() => sendMail(marker.email)}>{marker.email}</Text> : null}
                  {marker.phone ? <Button icon='phone' mode='contained' style={[styles.field, styles.button]} 
                    uppercase={false} onPress={() => startCall(marker.phone)}>{marker.phone}</Button> : null}
                </View>
              </View>
            </MapView.Callout>
          </Marker>
        )}
      </MapView>
      <ServiceModal 
        localUserData={props.localUserData} 
        setShowLoadOL={props.setShowLoadOL} 
        addService={addService} 
        data={showServiceModal} 
        setData={setShowServiceModal} 
        closeServiceModal={closeServiceModal} 
        currentRegion={currentRegion} />
  		<SearchMap show={props.showMapSearchBar} 
        setSearchString={setSearchString} />
	  </Animatable.View>
	);
}