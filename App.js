import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import * as firebase from 'firebase';
import { navRef } from './components/RootNav.js';
import Menu from './components/Menu.js';
import MenuToggle from './components/MenuToggle.js';
import MapScreen from './components/MapScreen.js';
import ProfileScreen from './components/ProfileScreen.js';
import LoginScreen from './components/LoginScreen.js';

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

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#000',
    accent: '#fff',
    text: '#000',
    background: '#fff',
    surface: '#fff',
    error: '#ff0000',
    onBackground: '#000000',
    onSurface: '#000000',
  }
}

const screenOptions = {
  animationEnabled: false,
  gestureEnabled: false
}

export default function App() {

  const [authState, setAuthState] = React.useState(null);
  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer ref={navRef}>
        <Stack.Navigator initialRouteName='Map' headerMode='none'>
          <Stack.Screen name='Map' component={MapScreen} options={screenOptions} />
          <Stack.Screen name='Login' options={screenOptions}>
            {props => <LoginScreen {...props} authState={authState} 
              setAuthState={setAuthState} firebase={firebase} />}
          </Stack.Screen>
          <Stack.Screen name='Profile' options={{...screenOptions}}>
            {props => <ProfileScreen {...props} authState={authState} 
              setAuthState={setAuthState} firebase={firebase} />}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
      <Menu authState={authState} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <MenuToggle menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
    </PaperProvider>
  );
}