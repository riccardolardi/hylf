import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import * as Font from 'expo-font';
import * as firebase from 'firebase';
import * as Network from 'expo-network';
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

const styles = {
  mainView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  }
}

const settings = {
  screenInDelay: 500
}

export default function App() {

  const [authState, setAuthState] = React.useState(null);
  const [localUserData, setLocalUserData] = React.useState(null);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [showLoadOL, setShowLoadOL] = React.useState(false);
  const [fontLoaded, setFontLoaded] = React.useState(false);
  const [noNetwork, setNoNetwork] = React.useState(false);
  const [showMapSearchBar, setShowMapSearchBar] = React.useState(true);
  const [showMenuToggle, setShowMenuToggle] = React.useState(true);
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
      <View style={styles.mainView}>
        <MapScreen 
          authState={authState} 
          setMenuOpen={setMenuOpen} 
          localUserData={localUserData} 
          firebase={firebase} 
          setShowLoadOL={setShowLoadOL} 
          currentScreenIndex={currentScreenIndex} 
          setCurrentScreenIndex={setCurrentScreenIndex} 
          showMapSearchBar={showMapSearchBar} 
          setShowMapSearchBar={setShowMapSearchBar} 
          setShowMenuToggle={setShowMenuToggle} 
          screenIndex={0} 
          screenInDelay={settings.screenInDelay} />
        <LoginScreen 
          authState={authState} 
          setMenuOpen={setMenuOpen} 
          localUserData={localUserData} 
          setLocalUserData={setLocalUserData} 
          firebase={firebase} 
          setShowLoadOL={setShowLoadOL} 
          currentScreenIndex={currentScreenIndex} 
          setCurrentScreenIndex={setCurrentScreenIndex} 
          screenIndex={1} 
          screenInDelay={settings.screenInDelay} />
        <ProfileScreen 
          authState={authState} 
          setMenuOpen={setMenuOpen} 
          localUserData={localUserData} 
          setLocalUserData={setLocalUserData} 
          firebase={firebase} 
          setShowLoadOL={setShowLoadOL} 
          currentScreenIndex={currentScreenIndex} 
          setCurrentScreenIndex={setCurrentScreenIndex} 
          screenIndex={2} 
          screenInDelay={settings.screenInDelay} />
        <HelpScreen 
          authState={authState} 
          setMenuOpen={setMenuOpen} 
          localUserData={localUserData} 
          currentScreenIndex={currentScreenIndex} 
          setCurrentScreenIndex={setCurrentScreenIndex} 
          screenIndex={3} 
          screenInDelay={settings.screenInDelay} />
      </View>
      <Menu 
        authState={authState} 
        menuOpen={menuOpen} 
        setMenuOpen={setMenuOpen} 
        currentScreenIndex={currentScreenIndex} 
        setCurrentScreenIndex={setCurrentScreenIndex} />
      <MenuToggle 
        show={showMenuToggle} 
        menuOpen={menuOpen} 
        setMenuOpen={setMenuOpen} />
      <LoadOL show={showLoadOL} />
      <SysMessages noNetwork={noNetwork} />
    </PaperProvider>
  );
}