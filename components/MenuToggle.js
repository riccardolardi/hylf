import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { FAB } from 'react-native-paper';

const styles = {
	container: {
		position: 'absolute',
		bottom: 16 * 3,
    width: '100%'
	},
  button: {
    alignSelf: 'center'
  }
}

export default function MenuToggle(props) {

	const [menuTransitioning, setMenuTransitioning] = useState(false);

  useEffect(() => {
    setMenuTransitioning(true);
    setTimeout(() => setMenuTransitioning(false), 125);
  }, [props.menuOpen]);

  return (
  	<View style={styles.container} pointerEvents='box-none'>
    	<FAB style={styles.button} icon={props.menuOpen ? 'close' : 'menu'} 
    		onPress={() => props.setMenuOpen(!props.menuOpen)} />
    </View>
  );
}