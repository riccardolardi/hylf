import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import * as RootNav from './RootNav.js';
import * as Font from 'expo-font';
import * as Animatable from 'react-native-animatable';
import { List, Button } from 'react-native-paper';

const styles = {
  menu: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    opacity: 0,
    bottom: '-100%'
  },
  menuOpen: {
    opacity: 1,
    bottom: '0%'
  },
  menuButtonList: {
    left: '10%',
    alignItems: 'flex-start',
    justifyContent: 'space-evenly',
    height: '90%'
  },
  menuButton: {

  },
  menuButtonText: {
    fontSize: 32
  }
}

export default function Menu(props) {

  React.useEffect(() => {
    Font.loadAsync({
      'JosefinSans': require('../assets/fonts/JosefinSans-Medium.ttf')
    });
  }, []);

  const navTo = (location) => {
    props.setMenuOpen(false);
    RootNav.navigate(location);
  }

  return (
    <Animatable.View style={[styles.menu, props.menuOpen && styles.menuOpen]} 
      transition={['bottom', 'opacity']} duration={500}>
      <View style={styles.menuButtonList}>
        <Button icon='map' mode='outlined' onPress={() => navTo('Map')}>Map</Button>
        <Button icon='account' mode='outlined' onPress={() => navTo('Profile')}>My Profile</Button>
        <Button icon='help' mode='outlined' onPress={() => navTo('Help')}>Help</Button>
        <Button icon='information' mode='outlined' onPress={() => navTo('What?')}>What?</Button>
      </View>
    </Animatable.View>
  );
}
