import React from 'react';
import { View, StyleSheet } from 'react-native';
import * as RootNav from './RootNav.js';
import * as Animatable from 'react-native-animatable';
import { Text, Snackbar } from 'react-native-paper';

const styles = {
  container: {
  },
  msgBox: {
  	backgroundColor: '#ed5247'
  },
  msgText: {
  	textAlign: 'center'
  },
  msgTextError: {
  	color: 'white'
  }
}

export default function SysMessages(props) {

  React.useEffect(() => {

  }, []);

  return (
    <Animatable.View style={styles.container} 
      transition={['bottom', 'opacity']} duration={250}>
      <Snackbar visible={props.noNetwork} style={styles.msgBox}>
        <Text style={[styles.msgText, styles.msgTextError]}>
        	No network! App cannot work without internet access!
        </Text>
      </Snackbar>
    </Animatable.View>
  );
}
