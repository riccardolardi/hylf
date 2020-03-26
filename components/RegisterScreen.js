import React from 'react';
import { StyleSheet, Keyboard, TouchableWithoutFeedback, 
  Text, View, Image } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
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
  registerError: {
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

export default function RegisterScreen(props) {

	const [authState, setAuthState] = React.useState(null);
	const [userEmail, setUserEmail] = React.useState(null);
	const [userPassword, setUserPassword] = React.useState(null);
	const [registerError, setRegisterError] = React.useState(null);

  React.useEffect(() => {

  }, []);

  const register = () => {
    if (!userEmail || !userPassword) {
      setRegisterError('Please fill in both email and password');
      return;
    }
  	props.firebase.auth().createUserWithEmailAndPassword(userEmail, userPassword)
  	.then(result => console.log(result))
  	.catch(error => {
  		setRegisterError(error.message);
  	});
  }

  return (
    <View style={styles.container}>
    	<TouchableWithoutFeedback style={styles.touchable} 
    		onPress={Keyboard.dismiss} accessible={false}>
    		<View>
		    	<Text style={[styles.registerError, styles.field]}>{registerError || ' '}</Text>
		    	<TextInput style={styles.field} value={userEmail} placeholder='Email' 
		    		keyboardType='email-address' autoCompleteType='email' 
		    		onChangeText={email => setUserEmail(email)} enablesReturnKeyAutomatically 
            onSubmitEditing={() => register()} />
		    	<TextInput style={styles.field} value={userPassword} placeholder='Password' 
		    		onChangeText={password => setUserPassword(password)} enablesReturnKeyAutomatically
		    		autoCompleteType='password' textContentType='password' secureTextEntry 
            onSubmitEditing={() => register()} />
		      <Button onPress={() => register()}>Register</Button>
      	</View>
      </TouchableWithoutFeedback>
    </View>
  );
}
