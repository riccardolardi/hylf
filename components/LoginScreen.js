import React from 'react';
import { StyleSheet, Keyboard, TouchableWithoutFeedback, 
  Text, View, Image } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import * as RootNav from './RootNav.js';
import logoSrc from './../assets/logo.png';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#fff',
    ...StyleSheet.absoluteFill
  },
  touchable: {
    ...StyleSheet.absoluteFill
  },
  field: {
  	marginBottom: 16
  },
  loginError: {
  	color: 'red',
  	textAlign: 'center'
  },
  registerView: {
    marginTop: 16
  },
  registerText: {
    marginTop: 16,
    textAlign: 'center'
  },
  logo: {
    width: '100%',
    height: '40%',
    resizeMode: 'contain'
  }
})

export default function LoginScreen(props) {

	const [authState, setAuthState] = React.useState(null);
	const [userEmail, setUserEmail] = React.useState(null);
	const [userPassword, setUserPassword] = React.useState(null);
	const [loginError, setLoginError] = React.useState(null);

  React.useEffect(() => {

  }, []);

  const register = () => {
  	if (!userEmail || !userPassword) return;
  	props.firebase.auth().createUserWithEmailAndPassword(userEmail, userPassword)
  	.then(result => console.log(result))
  	.catch(error => {
  		setLoginError(error.message);
  	});
  }

  const login = () => {
  	if (!userEmail || !userPassword) {
      setLoginError('Please fill in both email and password');
      return;
    }
  	props.firebase.auth().signInWithEmailAndPassword(userEmail, userPassword)
  	.then(result => console.log(result))
  	.catch(error => {
  		setLoginError(error.message);
  	});
  }

  return (
    <View style={styles.container}>
    	<TouchableWithoutFeedback style={styles.touchable} 
    		onPress={Keyboard.dismiss} accessible={false}>
    		<View>
          <Image source={logoSrc} style={styles.logo} />
		    	<Text style={[styles.loginError, styles.field]}>{loginError || ' '}</Text>
		    	<TextInput style={styles.field} value={userEmail} placeholder='Email' 
		    		keyboardType='email-address' autoCompleteType='email' 
		    		onChangeText={email => setUserEmail(email)} enablesReturnKeyAutomatically 
            onSubmitEditing={() => login()} />
		    	<TextInput style={styles.field} value={userPassword} placeholder='Password' 
		    		onChangeText={password => setUserPassword(password)} enablesReturnKeyAutomatically
		    		autoCompleteType='password' textContentType='password' secureTextEntry 
            onSubmitEditing={() => login()} />
		      <Button onPress={() => login()}>Sign in</Button>
          <View style={styles.registerView}>
            <Text style={styles.registerText}>Not a member yet?</Text>
            <Button onPress={() => RootNav.navigate('Register')}>Register</Button>
          </View>
      	</View>
      </TouchableWithoutFeedback>
    </View>
  );
}
