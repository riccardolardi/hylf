import React, { useState, useEffect, useRef } from 'react';
import * as Animatable from 'react-native-animatable';
import LottieView from "lottie-react-native";
import { StyleSheet, Text, View, Image } from 'react-native';

const lottieSrc = require('../assets/lottie/washhands.json');

export default function LoadOL(props) {

	const [shouldRender, setShouldRender] = React.useState(props.show);

	const animRef = useRef(null);
	const lottieRef = useRef(null);

	const styles = {
		container: {
			flex: 1,
	    alignItems: 'center',
	    justifyContent: 'center',
			backgroundColor: 'rgba(52, 52, 52, 0.8)',
			...StyleSheet.absoluteFill
		},
		lottie: {
			width: '65%'
		}
	}

	React.useEffect(() => {
		if (shouldRender) animRef.current?.animate({0: {opacity: 0}, 1: {opacity: 1}});
	}, [shouldRender]);

  React.useEffect(() => {
		if (props.show) setShouldRender(true);
  	if (!props.show) animRef.current?.animate({0: {opacity: 1}, 1: {opacity: 0}}).then(
  		() => setShouldRender(false));
  }, [props.show]);

  return (shouldRender && 
    <Animatable.View style={[styles.container]} ref={animRef} duration={125} useNativeDriver>
      <LottieView style={styles.lottie} ref={lottieRef} source={lottieSrc} autoPlay loop />
    </Animatable.View>
  );
}
