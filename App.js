import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import * as Font from 'expo-font';
import * as firebase from 'firebase';
import * as Network from 'expo-network';
import { navRef } from './components/RootNav.js';
import Menu from './components/Menu.js';
import MenuToggle from './components/MenuToggle.js';
import MapScreen from './components/MapScreen.js';
import ProfileScreen from './components/ProfileScreen.js';
import LoginScreen from './components/LoginScreen.js';
import HelpScreen from './components/HelpScreen.js';
import LoadOL from './components/LoadOL.js';
import SysMessages from './components/SysMessages.js';

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
    onBackground: '#000',
    onSurface: '#000',
  }
}

const screenOptions = {
  animationEnabled: false,
  gestureEnabled: false
}

export default function App() {

  const [authState, setAuthState] = React.useState(null);
  const [localUserData, setLocalUserData] = React.useState(null);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [showLoadOL, setShowLoadOL] = React.useState(false);
  const [fontLoaded, setFontLoaded] = React.useState(false);
  const [noNetwork, setNoNetwork] = React.useState(false);
  const [currentScreenIndex, setCurrentScreenIndex] = React.useState(0);

  firebase.auth().onAuthStateChanged(user => {
    setAuthState(user ? true : false);
  });

  React.useEffect(() => {
    Font.loadAsync({
      'Itim': require('./assets/fonts/Itim-Regular.ttf')
    }).then(() => setFontLoaded(true));
    setInterval(() => {
      Network.getNetworkStateAsync().then(result => {
        setNoNetwork(!result.isInternetReachable);
      }).catch(error => console.error(error));
    }, 5000);
  }, []);

  return (fontLoaded && 
    <PaperProvider theme={theme}>
      <NavigationContainer ref={navRef}>
        <Stack.Navigator initialRouteName='Map' headerMode='none'>
          <Stack.Screen name='Map' options={screenOptions}>
            {props => <MapScreen {...props} authState={authState} setMenuOpen={setMenuOpen} 
              localUserData={localUserData} firebase={firebase} setShowLoadOL={setShowLoadOL} 
              currentScreenIndex={currentScreenIndex} screenIndex={0} />}
          </Stack.Screen>
          <Stack.Screen name='Login' options={screenOptions}>
            {props => <LoginScreen {...props} authState={authState} setLocalUserData={setLocalUserData} 
              localUserData={localUserData} firebase={firebase} setShowLoadOL={setShowLoadOL} 
              setMenuOpen={setMenuOpen} currentScreenIndex={currentScreenIndex} screenIndex={1} />}
          </Stack.Screen>
          <Stack.Screen name='Profile' options={screenOptions}>
            {props => <ProfileScreen {...props} authState={authState} setLocalUserData={setLocalUserData} 
              localUserData={localUserData} firebase={firebase} setShowLoadOL={setShowLoadOL} 
              setMenuOpen={setMenuOpen} currentScreenIndex={currentScreenIndex} screenIndex={1} />}
          </Stack.Screen>
          <Stack.Screen name='Help' options={screenOptions}>
            {props => <HelpScreen {...props} authState={authState} localUserData={localUserData} 
              firebase={firebase} setShowLoadOL={setShowLoadOL} setMenuOpen={setMenuOpen} 
              currentScreenIndex={currentScreenIndex} screenIndex={2} />}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
      <Menu authState={authState} menuOpen={menuOpen} setMenuOpen={setMenuOpen} 
        currentScreenIndex={currentScreenIndex} setCurrentScreenIndex={setCurrentScreenIndex} />
      <MenuToggle menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <LoadOL show={showLoadOL} />
      <SysMessages noNetwork={noNetwork} />
    </PaperProvider>
  );
}