import React from 'react';
import { StyleSheet, View, Image, Keyboard } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { Modal, Portal, Text, Button, Provider, Surface } from 'react-native-paper';

const markerImg = require('../assets/marker.png');

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
  }
}

export default function ServiceModal(props) {

  const cancelModal = () => {
    Keyboard.dismiss();
    props.setData(null);
  }

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
                <Text>hello</Text>
              </Surface>
          </Animatable.View>
        </Modal>
      </Portal>
    </Provider>
  );
}
