import React from 'react';
import { StyleSheet, Keyboard, TouchableWithoutFeedback, 
  View, Image } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import LottieView from 'lottie-react-native';
import * as Animatable from 'react-native-animatable';
import { Button, TextInput, Title, Text, 
  Paragraph, Subheading } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const scapeSrc = require('../assets/lottie/scape.json');

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
  inner: {
    
  },
  intro: {
    paddingLeft: 16,
    paddingRight: 16,
    textAlign: 'center'
  },
  field: {
  	marginBottom: 8
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
    fontFamily: 'Itim',
    fontSize: 32,
    lineHeight: 36,
    textAlign: 'center'
  },
  lottie: {
    width: '80%',
    alignSelf: 'center'
  },
  spacer: {
    flex: 1
  }
})

export default function LoginScreen(props) {

	const [userEmail, setUserEmail] = React.useState(null);
	const [userPassword, setUserPassword] = React.useState(null);
	const [loginError, setLoginError] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);

  const scrollView = React.useRef(null);

  const navigation = useNavigation();

  const register = () => {
  	props.firebase.auth().createUserWithEmailAndPassword(userEmail, userPassword)
  	.then(result => handleRegisterSuccess(result))
  	.catch(error => actionFail(error.message));
  }

  const login = () => {
    Keyboard.dismiss();
  	if (!userEmail || !userPassword) {
      setLoginError('Please fill in both email and password');
      return;
    }
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
  		actionFail(errorMessage);
  	});
  }

  const actionSuccess = () => {
    setLoginError(null);
    setIsLoading(false);
    props.setShowLoadOL('success');
  }

  const actionFail = (error) => {
    setLoginError(error);
    setIsLoading(false);
    props.setShowLoadOL('fail');
  }

  const handleLoginSuccess = (data) => {
    navigation.navigate('Profile');
  }

  const handleRegisterSuccess = (data) => {
    navigation.navigate('Profile');
  }

  React.useEffect(() => {
    if (isLoading) {
      props.setShowLoadOL(true);
      setLoginError(null);
    }
  }, [isLoading]);

  React.useEffect(() => {
    props.navigation.addListener('focus', () => {
      setIsOpen(true);
    });
    props.navigation.addListener('blur', () => {
      setIsOpen(false);
    });
    return () => {
      props.navigation.removeListener('focus');
      props.navigation.removeListener('blur');
    };
  }, []);

  return (isOpen && 
    <Animatable.View style={{flex: 1}} 
      animation='fadeInDown' duration={125} useNativeDriver>
      <TouchableWithoutFeedback style={{flex: 1}} onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAwareScrollView ref={scrollView} keyboardOpeningTime={50} 
          contentContainerStyle={styles.container}>
      		<View style={styles.inner}>
            <View>
            <LottieView style={styles.lottie} source={scapeSrc} autoPlay loop />
            <Title style={[styles.title]}>Login to hylf</Title>
            <Paragraph style={[styles.intro, styles.field]}>Welcome! Please login or register to access or setup your profile and offer new services.</Paragraph>
    	    	{loginError && <Text style={[styles.loginError, styles.field]}>{loginError}</Text>}
    	    	<TextInput mode='outlined' style={styles.field} value={userEmail} label='Email' 
    	    		keyboardType='email-address' autoCompleteType='email' textContentType='emailAddress' 
              onChangeText={email => setUserEmail(email)} enablesReturnKeyAutomatically 
              onSubmitEditing={() => login()} blurOnSubmit={true} autoCapitalize='none' disabled={isLoading} />
    	    	<TextInput mode='outlined' style={styles.field} value={userPassword} label='Password' 
    	    		onChangeText={password => setUserPassword(password)} enablesReturnKeyAutomatically
    	    		autoCompleteType='password' textContentType='password' secureTextEntry 
              onSubmitEditing={() => login()} blurOnSubmit={true} disabled={isLoading} />
    	      <Button icon='login' mode='contained' disabled={isLoading} loading={isLoading} 
              onPress={() => login()}>Sign in / Register</Button>
            </View>
        	</View>
          <View style={styles.spacer} />
        </KeyboardAwareScrollView>
      </TouchableWithoutFeedback>
    </Animatable.View>
  );
}
