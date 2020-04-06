import React from 'react';
import { StyleSheet, View, Image, Keyboard } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Modal, Portal, Text, Button, Provider, Surface, 
  Title, Paragraph, TextInput } from 'react-native-paper';

const markerImg = require('../assets/marker.png');
const serviceImg = require('../assets/service.png');

const styles = {
  modal: {
    ...StyleSheet.absoluteFill,
    top: 128
  },
  container: {
    ...StyleSheet.absoluteFill,
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
    top: -68,
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
  }
}

export default function ServiceModal(props) {

  const scrollViewRef = React.useRef(null);
  const txtFieldRefs = [
    React.useRef(null),
    React.useRef(null),
    React.useRef(null),
    React.useRef(null),
    React.useRef(null),
    React.useRef(null)
  ];

  const [serviceTitle, setServiceTitle] = React.useState(null);
  const [serviceDescription, setServiceDescription] = React.useState(null);
  const [serviceAddress, setServiceAddress] = React.useState(props.localUserData?.userAddress);
  const [serviceZIP, setServiceZIP] = React.useState(props.localUserData?.userZIP);
  const [serviceCity, setServiceCity] = React.useState(props.localUserData?.userCity);
  const [servicePhone, setServicePhone] = React.useState(props.localUserData?.userPhone);
  const [isLoading, setIsLoading] = React.useState(false);

  const tabTo = (index) => {
    txtFieldRefs[index].current.focus();
  }

  const cancelModal = () => {
    Keyboard.dismiss();
    props.setData(null);
  }

  React.useEffect(() => {
    if (props.data?.show) {
      setServiceAddress(props.localUserData?.userAddress || null);
      setServiceZIP(props.localUserData?.userZIP || null);
      setServiceCity(props.localUserData?.userCity || null);
      setServicePhone(props.localUserData?.userPhone || null);
    }
  }, [props.data?.show]);

  return (
    <Provider>
      <Portal>
        <Modal visible={props.data?.show} onDismiss={cancelModal} 
          contentContainerStyle={styles.modal}>
          <Animatable.View style={styles.container} 
            animation={props.data?.show ? 'fadeIn' : 'fadeOut'} 
              duration={250} useNativeDriver>
            <Surface style={styles.surface}>
              <Image style={styles.marker} source={markerImg} />
              <View style={styles.triangle} />
              <KeyboardAwareScrollView ref={scrollViewRef} keyboardOpeningTime={0} 
                contentContainerStyle={styles.scrollview} extraScrollHeight={112} 
                extraHeight={112}>
                <View>
                  <Title style={[styles.title, styles.field]}>Offer some hylf!</Title>
                  <Image source={serviceImg} style={[styles.serviceImg, styles.field]} />
                  <Paragraph style={[styles.intro, styles.field]}>To add a new service please fill in the following form. The more info you enter, the better your service will be found.</Paragraph>
                  <TextInput mode='outlined' style={styles.field} value={serviceTitle} 
                    label='Service title' keyboardType='default' ref={txtFieldRefs[0]} 
                    onChangeText={title => setServiceTitle(title)} enablesReturnKeyAutomatically 
                    disabled={isLoading} placeholder='e.g. "Dog sitting"' onSubmitEditing={() => tabTo(1)} blurOnSubmit={false} />
                  <TextInput mode='outlined' style={styles.field} value={serviceDescription} 
                    label='Service description' keyboardType='default' ref={txtFieldRefs[1]} 
                    onChangeText={description => setServiceDescription(description)} enablesReturnKeyAutomatically 
                    disabled={isLoading} placeholder='e.g. "I can offer to sit your dog on Sundays and Tuesdays from 9am to 11am, ..."' 
                    onSubmitEditing={() => tabTo(2)} blurOnSubmit={false} />
                  <TextInput mode='outlined' style={styles.field} value={serviceAddress} 
                    label='Location/Address' keyboardType='default' ref={txtFieldRefs[2]} 
                    onChangeText={address => setServiceAddress(address)} enablesReturnKeyAutomatically 
                    disabled={isLoading} placeholder='e.g. "Gotthelf-Quartier"' 
                    onSubmitEditing={() => tabTo(3)} blurOnSubmit={false} />
                  <TextInput mode='outlined' style={styles.field} value={serviceZIP} 
                    label='ZIP' keyboardType='numeric' ref={txtFieldRefs[3]} 
                    onChangeText={zip => setServiceZIP(zip)} enablesReturnKeyAutomatically 
                    disabled={isLoading} placeholder='e.g. "4054"' 
                    onSubmitEditing={() => tabTo(4)} blurOnSubmit={false} />
                  <TextInput mode='outlined' style={styles.field} value={serviceCity} 
                    label='City' keyboardType='default' ref={txtFieldRefs[4]} 
                    onChangeText={city => setServiceCity(city)} enablesReturnKeyAutomatically 
                    disabled={isLoading} placeholder='e.g. "Basel"' 
                    onSubmitEditing={() => tabTo(5)} blurOnSubmit={false} />
                  <TextInput mode='outlined' style={styles.field} value={servicePhone} 
                    label='Phone' keyboardType='numeric' textContentType='telephoneNumber' 
                    onChangeText={phone => setServicePhone(phone)} enablesReturnKeyAutomatically 
                    disabled={isLoading} autoCompleteType='tel' ref={txtFieldRefs[5]} />
                </View>
              </KeyboardAwareScrollView>
            </Surface>
          </Animatable.View>
        </Modal>
      </Portal>
    </Provider>
  );
}
