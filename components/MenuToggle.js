import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { FAB } from 'react-native-paper';

const styles = {
  burgerWrap: {
    position: 'absolute',
    top: 56,
    left: 16
  }
}

export default function MenuToggle(props) {

	const [menuTransitioning, setMenuTransitioning] = useState(false);

  useEffect(() => {
    setMenuTransitioning(true);
    setTimeout(() => setMenuTransitioning(false), 125);
  }, [props.menuOpen]);

  return (
    <FAB style={styles.burgerWrap} icon={props.menuOpen ? 'close' : 'menu'} 
    	onPress={() => props.setMenuOpen(!props.menuOpen)} />
  );
}