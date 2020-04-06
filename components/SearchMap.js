import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { Searchbar } from 'react-native-paper';

export default function SearchMap(props) {

	const [searchQuery, setSearchQuery] = React.useState('');

	const styles = {
		container: {
			position: 'absolute',
			top: 32,
			width: '100%',
			padding: 16
		}
	}

  return (
    <Animatable.View style={styles.container} 
      animation={props.show ? 'fadeInDown' : 'fadeOutUp'} duration={125} useNativeDriver>
			<Searchbar 
        placeholder={'Groceries, dog sitting, chat, ...'} 
        onChangeText={query => setSearchQuery(query)} 
        value={searchQuery} blurOnSubmit={true} 
        enablesReturnKeyAutomatically={true} 
      />
    </Animatable.View>
  );
}
