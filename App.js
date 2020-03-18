import React from 'react';
import { StyleSheet, Text, View, Image, Dimensions } from 'react-native';
import { Button } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as firebase from 'firebase';
import * as ImagePicker from 'expo-image-picker';
import * as Sharing from 'expo-sharing';
import MapScreen from './components/MapScreen.js';
import ProfileScreen from './components/ProfileScreen.js';

if (!firebase.apps.length) firebase.initializeApp({
  apiKey: 'AIzaSyDGcbINBMQ8tF-rL1bVVhzyONH_u7W9M24',
  authDomain: 'hylf-firebase.firebaseapp.com',
  databaseURL: 'https://hylf-firebase.firebaseio.com',
  projectId: 'hylf-firebase',
  storageBucket: 'hylf-firebase.appspot.com',
  messagingSenderId: '801865186127',
  appId: '1:801865186127:web:985ee9ef53d8a286bca33a',
  measurementId: 'G-C0YXBMEK07'
});

const db = firebase.database();
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Map'>
        <Stack.Screen name='Map' component={MapScreen} />
        <Stack.Screen name='Profile' component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
