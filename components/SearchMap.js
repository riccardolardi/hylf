import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { Searchbar } from 'react-native-paper';

export default function SearchMap() {

	const [searchQuery, setSearchQuery] = React.useState('');

	const styles = {
		view: {
			position: 'absolute',
			top: 32,
			width: '100%',
			padding: 16
		}
	}

  return (
    <View style={styles.view}>
			<Searchbar 
        placeholder='Search' 
        onChangeText={query => setSearchQuery(query)} 
        value={searchQuery} blurOnSubmit={true} 
        enablesReturnKeyAutomatically={true} 
      />
    </View>
  );
}
