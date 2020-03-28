import React from 'react';
import { StyleSheet, Keyboard, TouchableWithoutFeedback, 
  Text, View, Image, KeyboardAvoidingView } from 'react-native';
import * as Font from 'expo-font';
import { Button, TextInput } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import logoSrc from './../assets/logo.png';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    padding: 32,
    backgroundColor: '#fff',
    ...StyleSheet.absoluteFill
  },
  touchable: {
    ...StyleSheet.absoluteFill
  },
  logo: {
    width: '100%',
    height: '30%',
    resizeMode: 'contain'
  },
  intro: {
    paddingLeft: 16,
    paddingRight: 16,
    textAlign: 'center'
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
  title: {
    fontFamily: 'JosefinSans',
    fontSize: 32,
    lineHeight: 36,
    textAlign: 'center'
  }
})

export default function LoginScreen(props) {

	const [userEmail, setUserEmail] = React.useState(null);
	const [userPassword, setUserPassword] = React.useState(null);
	const [loginError, setLoginError] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [fontLoaded, setFontLoaded] = React.useState(false);

  const navigation = useNavigation();

  const register = () => {
  	props.firebase.auth().createUserWithEmailAndPassword(userEmail, userPassword)
  	.then(result => handleRegisterSuccess(result))
  	.catch(error => {
      const errorCode = error.code;
      const errorMessage = error.message;
  		setLoginError(errorMessage);
      setIsLoading(false);
  	});
  }

  const login = () => {
  	if (!userEmail || !userPassword) {
      setLoginError('Please fill in both email and password');
      return;
    }
    setLoginError(null);
    setIsLoading(true);
  	props.firebase.auth().signInWithEmailAndPassword(userEmail, userPassword)
  	.then(result => handleLoginSuccess(result))
  	.catch(error => {
      const errorCode = error.code;
      const errorMessage = error.message;
      if (errorCode === 'auth/user-not-found') {
        register();
        return;
      }
  		setLoginError(errorMessage);
      setIsLoading(false);
  	});
  }

  const handleLoginSuccess = (data) => {
    navigation.navigate('Profile');
  }

  const handleRegisterSuccess = (data) => {
    navigation.navigate('Profile');
  }

  React.useEffect(() => {
    props.setShowLoadOL(isLoading);
  }, [isLoading]);

  React.useEffect(() => {
    Font.loadAsync({
      'JosefinSans': require('../assets/fonts/JosefinSans-Medium.ttf')
    }).then(() => setFontLoaded(true));
  }, []);

  return (
    <KeyboardAvoidingView style={styles.container} behavior='padding' enabled>
    	<TouchableWithoutFeedback style={styles.touchable} 
    		onPress={Keyboard.dismiss} accessible={false}>
    		<View>
          {fontLoaded && <Text style={[styles.title, styles.field]}>Login to hylf</Text>}
          <Text style={[styles.intro, styles.field]}>Welcome!{'\n\n'}Please login or register to access or setup your profile and offer new services.</Text>
		    	{loginError && <Text style={[styles.loginError, styles.field]}>{loginError}</Text>}
		    	<TextInput mode='outlined' style={styles.field} value={userEmail} placeholder='Email' 
		    		keyboardType='email-address' autoCompleteType='email' textContentType='emailAddress' 
            onChangeText={email => setUserEmail(email)} enablesReturnKeyAutomatically 
            onSubmitEditing={() => login()} blurOnSubmit={true} autoCapitalize='none' disabled={isLoading} />
		    	<TextInput mode='outlined' style={styles.field} value={userPassword} placeholder='Password' 
		    		onChangeText={password => setUserPassword(password)} enablesReturnKeyAutomatically
		    		autoCompleteType='password' textContentType='password' secureTextEntry 
            onSubmitEditing={() => login()} blurOnSubmit={true} disabled={isLoading} />
		      <Button icon='login' mode='contained' disabled={isLoading} loading={isLoading} 
            onPress={() => login()}>Sign in / Register</Button>
      	</View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
