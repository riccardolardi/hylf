import React from 'react';
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { FAB } from 'react-native-paper';

const styles = {
	container: {
		position: 'absolute',
		bottom: 16 * 3,
    width: '100%'
	},
  button: {
    backgroundColor: 'transparent'
  },
  buttonWrap: {
    alignSelf: 'center',
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
  active: {
    backgroundColor: 'black'
  }
}

export default function MenuToggle(props) {

  const buttonRef = React.createRef(null);

  React.useEffect(() => {

  }, []);

  return (
  	<Animatable.View style={styles.container} pointerEvents='box-none' 
      animation={props.show ? 'fadeInUp' : 'fadeOutDown'} duration={125} 
        useNativeDriver>
      <Animatable.View transition='backgroundColor' ref={buttonRef} 
        style={[styles.buttonWrap, props.menuOpen && styles.active]}>
      	<FAB style={styles.button} icon={props.menuOpen ? 'close' : 'menu'} 
      		color={props.menuOpen ? 'white' : 'black'} 
            onPress={() => props.setMenuOpen(!props.menuOpen)} />
      </Animatable.View>
    </Animatable.View>
  );
}