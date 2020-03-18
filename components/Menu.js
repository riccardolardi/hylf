import React from 'react';
import { StyleSheet, Text, View, Image, TouchableHighlight, Dimensions } from 'react-native';
import * as RootNav from './RootNav.js';
import * as Font from 'expo-font';
import * as Animatable from 'react-native-animatable';
import { Button } from 'react-native-paper';

const styles = {
	menu: {
		position: 'absolute',
		width: '100%',
		height: '100%',
		backgroundColor: 'white',
		opacity: 0,
		left: '-100%'
	},
	menuOpen: {
		opacity: 1,
		left: '0%'
	},
	menuButton: {

	}
}

export default function Menu(props) {

  React.useEffect(() => {
		Font.loadAsync({
      'JosefinSans': require('../assets/fonts/JosefinSans-Medium.ttf')
    });
  }, []);

  return (
    <Animatable.View style={[styles.menu, props.menuOpen && styles.menuOpen]} 
    	transition={['left', 'opacity']} duration={250}>
    </Animatable.View>
  );
}
