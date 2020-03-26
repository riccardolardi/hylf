import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import * as RootNav from './RootNav.js';
import * as Font from 'expo-font';
import * as Animatable from 'react-native-animatable';
import { List, Divider } from 'react-native-paper';
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
    height: '100%'
  },
  menuButton: {

  },
  menuButtonView: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  menuButtonIcon: {
    marginTop: -10,
    marginRight: 10
  },
  menuButtonText: {
    fontFamily: 'JosefinSans',
    fontSize: 32,
  }
}

export default function Menu(props) {

  const [fontLoaded, setFontLoaded] = React.useState(false);

  React.useEffect(async () => {
    await Font.loadAsync({
      'JosefinSans': require('../assets/fonts/JosefinSans-Medium.ttf')
    });
    setFontLoaded(true);
  }, []);

  const navTo = (location) => {
    props.setMenuOpen(false);
    RootNav.navigate(location);
  }

  return (
    <Animatable.View style={[styles.menu, props.menuOpen && styles.menuOpen]} 
      transition={['bottom', 'opacity']} duration={500}>
      <View style={styles.menuButtonList}>
        <TouchableOpacity style={styles.menuButton} uppercase={false} onPress={() => navTo('Map')}>
          <View style={styles.menuButtonView}>
            <Icon style={styles.menuButtonIcon} name='map' size={56} />
            {fontLoaded && <Text style={styles.menuButtonText}> Map</Text>}
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuButton} uppercase={false} onPress={() => navTo('Profile')}>
          <View style={styles.menuButtonView}>
            <Icon style={styles.menuButtonIcon} name='user' size={56} />
            {fontLoaded && <Text style={styles.menuButtonText}> My Profile</Text>}
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuButton} uppercase={false} onPress={() => navTo('Help')}>
          <View style={styles.menuButtonView}>
            <Icon style={styles.menuButtonIcon} name='question' size={56} />
            {fontLoaded && <Text style={styles.menuButtonText}> Help</Text>}
          </View>
        </TouchableOpacity>
      </View>
    </Animatable.View>
  );
}
