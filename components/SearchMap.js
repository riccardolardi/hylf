import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { Searchbar } from 'react-native-paper';

export default function SearchMap(props) {

	const [searchString, setSearchString] = React.useState('');

	const styles = {
		container: {
			position: 'absolute',
			top: 32,
			width: '100%',
			padding: 16
		}
	}

	React.useEffect(() => {
		props.setSearchString(searchString);
	}, [searchString]);

  return (
    <Animatable.View style={styles.container} 
      animation={props.show ? 'fadeInDown' : 'fadeOutUp'} duration={125} useNativeDriver>
			<Searchbar 
        placeholder={'Groceries, dog sitting, chat, ...'} 
        onChangeText={query => setSearchString(query)} 
        value={searchString} blurOnSubmit={true} 
        enablesReturnKeyAutomatically={true} 
      />
    </Animatable.View>
  );
}
