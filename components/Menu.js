import React from 'react';
import {View, StyleSheet, TouchableWithoutFeedback } from 'react-native';
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
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  menuButtonWrap: {
    backgroundColor: 'white',
    width: 56,
    height: 56,
    borderRadius: 56,
    marginHorizontal: 8,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.84
  },
  menuButton: {
    backgroundColor: 'transparent'
  },
  active: {
    backgroundColor: 'black'
  },
  spacer: {
    flex: 4
  }
}

export default function Menu(props) {

  const mapButtonRef = React.useRef(null);
  const loginButtonRef = React.useRef(null);
  const helpButtonRef = React.useRef(null);

  const navTo = async (index, ref) => {
    if (props.authState && index === 1) index = 2;
    props.setCurrentScreenIndex(index);
    setTimeout(() => props.setMenuOpen(false), 125);
  }

  return (
    <Animatable.View style={[styles.container, props.menuOpen && styles.menuOpen]} 
      transition={['bottom', 'opacity']} duration={500}>
      <TouchableWithoutFeedback style={styles.touchable} 
        onPress={() => props.setMenuOpen(false)}>
        <View style={styles.inner}>
          <View style={styles.spacer} />
          <View style={styles.menuButtonList}>
            <Animatable.View transition='backgroundColor' duration={125} ref={mapButtonRef} 
              style={[styles.menuButtonWrap, props.currentScreenIndex === 0 && styles.active]}>
              <FAB style={styles.menuButton} icon='map' 
                color={props.currentScreenIndex === 0 ? 'white' : 'black'} 
                  onPress={() => navTo(0, mapButtonRef)} />
            </Animatable.View>
            <Animatable.View transition='backgroundColor' ref={loginButtonRef} 
              style={[styles.menuButtonWrap, (props.currentScreenIndex === 1 || 
                props.currentScreenIndex === 2) && styles.active]}>
              <FAB style={styles.menuButton} icon='account' 
                color={props.currentScreenIndex === 1 || 
                  props.currentScreenIndex === 2 ? 'white' : 'black'} 
                    onPress={() => navTo(1, loginButtonRef)} />
            </Animatable.View>
            <Animatable.View transition='backgroundColor' ref={helpButtonRef} 
              style={[styles.menuButtonWrap, props.currentScreenIndex === 3 && styles.active]}>
              <FAB style={styles.menuButton} icon='help' 
                color={props.currentScreenIndex === 3 ? 'white' : 'black'} 
                  onPress={() => navTo(3, helpButtonRef)} />
            </Animatable.View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Animatable.View>
  );
}
