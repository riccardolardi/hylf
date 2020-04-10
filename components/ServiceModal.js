import React from 'react';
import { StyleSheet, View, Image, Keyboard, 
  Alert, TouchableWithoutFeedback } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Modal, Text, Button, Surface, 
  Title, Paragraph, TextInput } from 'react-native-paper';

const markerImg = require('../assets/marker.png');
const serviceImg = require('../assets/service.png');

const styles = {
  wrap: {
    display: 'none',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    ...StyleSheet.absoluteFill
  },
  show: {
    display: 'flex'
  },
  container: {
    ...StyleSheet.absoluteFill,
    top: 128
  },
  surface: {
    ...StyleSheet.absoluteFill,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    top: 0,
    right: 16,
    bottom: 24,
    left: 16
  },
  marker: {
    position: 'absolute',
    top: -68 - 12,
    resizeMode: 'contain',
    width: 42,
    height: 42
  },
  triangle: {
    position: 'absolute',
    top: -10,
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'white'
  },
  title: {
    fontFamily: 'Itim',
    fontSize: 32,
    lineHeight: 36,
    textAlign: 'center'
  },
  intro: {
    paddingLeft: 16,
    paddingRight: 16,
    textAlign: 'center'
  },
  field: {
    marginBottom: 16
  },
  scrollview: {
    padding: 16,
  },
  serviceImg: {
    width: 92,
    height: 92,
    resizeMode: 'contain',
    alignSelf: 'center'
  },
  buttonsView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  button: {
    width: '47.5%'
  }
}

export default function ServiceModal(props) {

  const scrollViewRef = React.useRef(null);

  const [serviceTitle, setServiceTitle] = React.useState(null);
  const [serviceDescription, setServiceDescription] = React.useState(null);
  const [serviceUserName, setServiceUserName] = React.useState(props.localUserData?.userName);
  const [serviceAddress, setServiceAddress] = React.useState(props.localUserData?.userAddress);
  const [serviceZIP, setServiceZIP] = React.useState(props.localUserData?.userZIP);
  const [serviceCity, setServiceCity] = React.useState(props.localUserData?.userCity);
  const [serviceEmail, setServiceEmail] = React.useState(props.localUserData?.userEmail);
  const [servicePhone, setServicePhone] = React.useState(props.localUserData?.userPhone);
  const [isLoading, setIsLoading] = React.useState(false);

  const save = async () => {
    if (!serviceTitle || serviceTitle.length < 6) {
      Alert.alert('Missing title info', 'Service title must be min. 6 characters long.');
      return;
    }
    if (!serviceDescription || serviceDescription.length < 6) {
      Alert.alert('Missing description info', 'Service description must be min. 6 characters long.');
      return;
    }
    if (!serviceUserName) {
      Alert.alert('Missing contact name', 'Please enter a contact name.');
      return;
    }
    if (!serviceEmail && !servicePhone) {
      Alert.alert('Missing contact info', 'You need to provide either an email address or a phone number.');
      return;
    }
    setIsLoading(true);
    const data = {
      coordinate: {
        ...props.currentRegion,
        latitude: props.currentRegion.latitude 
        + 0.45 * props.currentRegion.latitudeDelta
      },
      title: serviceTitle,
      description: serviceDescription,
      username: serviceUserName,
      address: serviceAddress,
      zip: serviceZIP,
      city: serviceCity,
      email: serviceEmail,
      phone: servicePhone
    }
    props.addService(data).then(() => {
      Promise.resolve();
      props.closeServiceModal(true);
    }).catch(error => Promise.reject(error));
  }

  const actionSuccess = () => {
    setIsLoading(false);
    scrollViewRef.current.scrollToPosition(0, 0);
    props.setShowLoadOL('success');
  }

  const actionFail = (error) => {
    setIsLoading(false);
    scrollViewRef.current.scrollToPosition(0, 0);
    props.setShowLoadOL('fail');
  }

  React.useEffect(() => {
    if (isLoading) {
      props.setShowLoadOL(true);
    }
  }, [isLoading]);

  React.useEffect(() => {
    if (props.data?.show) {
      scrollViewRef.current.scrollToPosition(0, 0, false);
      setServiceTitle(null);
      setServiceDescription(null);
      setServiceUserName(props.localUserData?.userName || null);
      setServiceAddress(props.localUserData?.userAddress || null);
      setServiceZIP(props.localUserData?.userZIP || null);
      setServiceCity(props.localUserData?.userCity || null);
      setServiceEmail(props.localUserData?.userEmail || null);
      setServicePhone(props.localUserData?.userPhone || null);
    }
  }, [props.data?.show]);

  return (
    <Animatable.View style={[styles.wrap, props.data?.show && styles.show]} 
      pointerEvents='box-none' animation={props.data?.show ? 'fadeIn' : 'fadeOut'} 
        duration={250} useNativeDriver>
      <View style={styles.container}>
        <Surface style={styles.surface}>
          <Image style={styles.marker} source={markerImg} />
          <View style={styles.triangle} />
          <KeyboardAwareScrollView ref={scrollViewRef} keyboardOpeningTime={0} 
            contentContainerStyle={styles.scrollview} extraHeight={136}>
            <View style={{flex: 1}}>
              <Title style={[styles.title, styles.field]}>Offer some hylf!</Title>
              <Image source={serviceImg} style={[styles.serviceImg, styles.field]} />
              <Paragraph style={[styles.intro, styles.field]}>To add a new service please fill in the following form. The more info you enter, the better your service will be found.</Paragraph>
              <TextInput mode='outlined' style={styles.field} value={serviceTitle} 
                label='Service title' keyboardType='default' blurOnSubmit={true} 
                onChangeText={title => setServiceTitle(title)} enablesReturnKeyAutomatically 
                disabled={isLoading} placeholder='e.g. "Dog sitting"' />
              <TextInput mode='outlined' style={styles.field} value={serviceDescription} 
                label='Service description' keyboardType='default' blurOnSubmit={true} multiline 
                onChangeText={description => setServiceDescription(description)} enablesReturnKeyAutomatically 
                disabled={isLoading} placeholder='e.g. "I can offer to sit your dog on Sundays and Tuesdays from 9am to 11am, ..."' />
              <TextInput mode='outlined' style={styles.field} value={serviceUserName} 
                label='Contact person name' keyboardType='default' blurOnSubmit={true} 
                onChangeText={name => setServiceUserName(name)} enablesReturnKeyAutomatically 
                disabled={isLoading} placeholder='e.g. "Roger Federer"' />
              <TextInput mode='outlined' style={styles.field} value={serviceAddress} 
                label='Location/Address' keyboardType='default' blurOnSubmit={true} 
                onChangeText={address => setServiceAddress(address)} enablesReturnKeyAutomatically 
                disabled={isLoading} placeholder='e.g. "Gotthelf-Quartier"' />
              <TextInput mode='outlined' style={styles.field} value={serviceZIP} 
                label='ZIP' keyboardType='numeric' blurOnSubmit={true}
                onChangeText={zip => setServiceZIP(zip)} enablesReturnKeyAutomatically 
                disabled={isLoading} placeholder='e.g. "4054"' />
              <TextInput mode='outlined' style={styles.field} value={serviceCity} 
                label='City' keyboardType='default' blurOnSubmit={true} 
                onChangeText={city => setServiceCity(city)} enablesReturnKeyAutomatically 
                disabled={isLoading} placeholder='e.g. "Basel"' />
              <TextInput mode='outlined' style={styles.field} value={serviceEmail} blurOnSubmit={true}
                label='Email' keyboardType='email-address' textContentType='emailAddress' autoCompleteType='email' 
                onChangeText={email => setServiceEmail(email)} disabled={true} enablesReturnKeyAutomatically />
              <TextInput mode='outlined' style={styles.field} value={servicePhone} blurOnSubmit={true} 
                label='Phone' keyboardType='numeric' textContentType='telephoneNumber' 
                onChangeText={phone => setServicePhone(phone)} enablesReturnKeyAutomatically 
                disabled={true} autoCompleteType='tel' />
              <View style={styles.buttonsView}>
                <Button icon='close' style={[styles.field, styles.button]} color='#ed5247' mode='contained' 
                  disabled={isLoading} onPress={() => props.closeServiceModal(false)}>Cancel</Button>
                <Button icon='check' style={[styles.field, styles.button]} color='#2da84a' mode='contained' 
                  disabled={isLoading} onPress={
                    () => save().then(() => actionSuccess()).catch(error => actionFail(error.message))
                  }>Save</Button>
                </View>
            </View>
          </KeyboardAwareScrollView>
        </Surface>
      </View>
    </Animatable.View>
  );
}
