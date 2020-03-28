import React, { useState, useEffect, useRef } from 'react';
import * as Animatable from 'react-native-animatable';
import LottieView from 'lottie-react-native';
import { StyleSheet, Text, View, Image } from 'react-native';

const checkSrc = require('../assets/lottie/check.json');
const failSrc = require('../assets/lottie/fail.json');
const srcArray = [
	require('../assets/lottie/hands.json'),
	require('../assets/lottie/sanitizer.json'),
	require('../assets/lottie/thermo.json')
];

let animIndex = 0;

export default function LoadOL(props) {

	const [shouldRender, setShouldRender] = React.useState(props.show);

	const containerRef = useRef(null);
	const loadingRef = useRef(null);
	const checkRef = useRef(null);
	const checkRefLottie = useRef(null);
	const failRef = useRef(null);
	const failRefLottie = useRef(null);

	const updateAnimIndex = () => {
		animIndex = animIndex + 1 >= srcArray.length ? 0 : animIndex + 1;
	}

	const styles = {
		container: {
			backgroundColor: 'rgba(255, 255, 255, 0.8)'
		},
		loadingLottie: {
		},
		checkLottie: {
			opacity: 0
		},
		centerFill: {
			justifyContent: 'center',
			alignItems: 'center',
			...StyleSheet.absoluteFill
		},
		lottie: {
			width: '50%'
		}
	}

	React.useEffect(() => {
		if (shouldRender) containerRef.current?.animate({0: {opacity: 0}, 1: {opacity: 1}});
	}, [shouldRender]);

  React.useEffect(() => {
		if (props.show === true && shouldRender === false) {
			updateAnimIndex();
			setShouldRender(true);
		}
  	if (props.show === false && shouldRender === true) {
  		containerRef.current?.animate({0: {opacity: 1}, 1: {opacity: 0}}).then(
  			() => setShouldRender(false));
  	}
  	if (props.show === 'success' || props.show === 'fail') {
  		const wrapRef = props.show === 'success' ? checkRef : failRef;
  		const lottieRef = props.show === 'success' ? checkRefLottie : failRefLottie;
  		loadingRef.current?.animate({0: {opacity: 1}, 1: {opacity: 0}});
  		wrapRef.current?.animate({0: {opacity: 0}, 1: {opacity: 1}}).then(() => {
		  	containerRef.current?.animate({0: {opacity: 1}, 1: {opacity: 0}}).then(
		  		() => setShouldRender(false));
  		});
  		lottieRef.current?.play();
  	}
  }, [props.show]);

  return (shouldRender && 
    <Animatable.View style={[styles.container, styles.centerFill]} 
    	ref={containerRef} duration={250} useNativeDriver>
    	<Animatable.View style={[styles.loadingLottie, styles.centerFill]} ref={loadingRef} 
    		duration={250} useNativeDriver>
      	<LottieView style={styles.lottie} source={srcArray[animIndex]} autoPlay loop />
      </Animatable.View>
      <Animatable.View style={[styles.checkLottie, styles.centerFill]} ref={checkRef} 
      	duration={1250} useNativeDriver>
      	<LottieView style={styles.lottie} source={checkSrc} ref={checkRefLottie} />
      </Animatable.View>
      <Animatable.View style={[styles.checkLottie, styles.centerFill]} ref={failRef} 
      	duration={1250} useNativeDriver>
      	<LottieView style={styles.lottie} source={failSrc} ref={failRefLottie} />
      </Animatable.View>
    </Animatable.View>
  );
}
