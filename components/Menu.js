import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import * as RootNav from './RootNav.js';
import * as Font from 'expo-font';
import * as Animatable from 'react-native-animatable';
import { List, Button, Divider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';

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
    fontFamily: 'JosefinSans',
    fontSize: 32,
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
        <Button uppercase={false} onPress={() => navTo('Map')}>
          <Icon name='map' size={32}></Icon>
          <Text style={styles.menuButtonText}> Map</Text>
        </Button>
        <Button uppercase={false} onPress={() => navTo('Profile')}>
          <Icon name='user' size={32}></Icon>
          <Text style={styles.menuButtonText}> My Profile</Text>
        </Button>
        <Button uppercase={false} onPress={() => navTo('Help')}>
          <Icon name='question' size={32}></Icon>
          <Text style={styles.menuButtonText}> Help</Text>
        </Button>
      </View>
    </Animatable.View>
  );
}
