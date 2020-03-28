import React from 'react';
import { Text, View, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import * as RootNav from './RootNav.js';
import * as Font from 'expo-font';
import * as Animatable from 'react-native-animatable';
import { List, Divider, FAB } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';

const styles = {
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
    opacity: 0,
    bottom: '-100%'
  },
  menuOpen: {
    opacity: 1,
    bottom: '0%'
  },
  inner: {
    flex: 1
  },
  menuButtonList: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  menuButton: {
    margin: 16
  },
  spacer: {
    flex: 1
  }
}

export default function Menu(props) {

  const [fontLoaded, setFontLoaded] = React.useState(false);

  React.useEffect(() => {
    Font.loadAsync({
      'JosefinSans': require('../assets/fonts/JosefinSans-Medium.ttf')
    }).then(() => setFontLoaded(true));
  }, []);

  const navTo = (location) => {
    props.setMenuOpen(false);
    if (props.authState && location === 'Login') location = 'Profile';
    RootNav.navigate(location);
  }

  return (
    <Animatable.View style={[styles.container, props.menuOpen && styles.menuOpen]} 
      transition={['bottom', 'opacity']} duration={500}>
      <TouchableWithoutFeedback style={styles.touchable} 
        onPress={() => props.setMenuOpen(false)}>
        <View style={styles.inner}>
          <View style={styles.spacer} />
          <View style={styles.menuButtonList}>
            <FAB style={styles.menuButton} icon='map' onPress={() => navTo('Map')} />
            <FAB style={styles.menuButton} icon='account' onPress={() => navTo('Login')} />
            <FAB style={styles.menuButton} icon='help' onPress={() => navTo('Help')} />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Animatable.View>
  );
}
