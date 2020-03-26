import React from 'react';
import { StyleSheet, Keyboard, TouchableWithoutFeedback, 
  Text, View, Image, KeyboardAvoidingView } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import * as ImagePicker from 'expo-image-picker';
import logoSrc from './../assets/logo.png';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    padding: 32,
    backgroundColor: '#fff',
    opacity: 0
  },
  open: {
    opacity: 1
  },
  fill: {
    ...StyleSheet.absoluteFill
  },
  photo: {
    resizeMode: 'cover'
  },
  field: {
  	marginBottom: 16
  },
  registerError: {
  	color: 'red',
  	textAlign: 'center'
  }
})

export default function ProfileScreen(props) {

  const [isOpen, setIsOpen] = React.useState(false);
  const [userName, setUserName] = React.useState(null);
  const [userSurname, setUserSurname] = React.useState(null);
  const [userAddress, setUserAddress] = React.useState(null);
  const [userZIP, setUserZIP] = React.useState(null);
  const [userCity, setUserCity] = React.useState(null);
  const [userPhone, setUserPhone] = React.useState(null);
  const [userImage, setUserImage] = React.useState(null);

  React.useEffect(() => {
    setIsOpen(true);
  }, []);

  return (
    <Animatable.View style={[styles.container, styles.fill, isOpen && styles.open]} 
      transition={['opacity']} duration={250}>
    	<TouchableWithoutFeedback style={styles.fill} 
    		onPress={Keyboard.dismiss} accessible={false}>
    		<View>
          <TextInput mode='outlined' style={styles.field} value={userName} placeholder='Name' 
            keyboardType='default' autoCompleteType='name' 
            onChangeText={name => setUserName(name)} enablesReturnKeyAutomatically />
          <TextInput mode='outlined' style={styles.field} value={userSurname} placeholder='Surname' 
            keyboardType='default' autoCompleteType='name' 
            onChangeText={surname => setUserSurname(surname)} enablesReturnKeyAutomatically />
          <TextInput mode='outlined' style={styles.field} value={userAddress} placeholder='Address' 
            keyboardType='default' autoCompleteType='street-address' 
            onChangeText={address => setUserAddress(address)} enablesReturnKeyAutomatically />
          <TextInput mode='outlined' style={styles.field} value={userZIP} placeholder='ZIP' 
            keyboardType='numeric' autoCompleteType='street-address' 
            onChangeText={zip => setUserZip(zip)} enablesReturnKeyAutomatically />
          <TextInput mode='outlined' style={styles.field} value={userCity} placeholder='City' 
            keyboardType='default' 
            onChangeText={city => setUserCity(city)} enablesReturnKeyAutomatically />
          <TextInput mode='outlined' style={styles.field} value={userPhone} placeholder='Phone' 
            keyboardType='numeric' autoCompleteType='tel' 
            onChangeText={phone => setUserPhone(phone)} enablesReturnKeyAutomatically />
      	</View>
      </TouchableWithoutFeedback>
    </Animatable.View>
  );
}
