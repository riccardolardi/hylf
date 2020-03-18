import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { FAB } from 'react-native-paper';

const styles = {
	view: {
		position: 'absolute',
		bottom: 0,
		width: '100%',
		padding: 42,
		alignItems: 'center'
	},
  burger: {

  }
}

export default function MenuToggle(props) {

	const [menuTransitioning, setMenuTransitioning] = useState(false);

  useEffect(() => {
    setMenuTransitioning(true);
    setTimeout(() => setMenuTransitioning(false), 125);
  }, [props.menuOpen]);

  return (
  	<View style={styles.view} pointerEvents='box-none'>
    	<FAB style={styles.burger} icon={props.menuOpen ? 'close' : 'menu'} 
    		onPress={() => props.setMenuOpen(!props.menuOpen)} />
    </View>
  );
}