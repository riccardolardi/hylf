import React from 'react';
import { StyleSheet, Keyboard, TouchableWithoutFeedback, TouchableOpacity, 
  Text, View, Image } from 'react-native';
import * as Font from 'expo-font';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Button, TextInput } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import logoSrc from './../assets/logo.png';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    padding: 32,
    backgroundColor: '#fff',
    paddingTop: 64,
    paddingBottom: 64 * 2
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 120,
    backgroundColor: '#dadada'
  },
  field: {
  	marginBottom: 16
  },
  registerError: {
  	color: 'red',
  	textAlign: 'center'
  },
  profileError: {
    color: 'red',
    textAlign: 'center'
  },
  title: {
    fontFamily: 'JosefinSans',
    fontSize: 32,
    lineHeight: 36,
    textAlign: 'center'
  }
})

export default function ProfileScreen(props) {

  const [userImage, setUserImage] = React.useState(null);
  const [userName, setUserName] = React.useState(null);
  const [userAddress, setUserAddress] = React.useState(null);
  const [userZIP, setUserZIP] = React.useState(null);
  const [userCity, setUserCity] = React.useState(null);
  const [userPhone, setUserPhone] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [profileError, setProfileError] = React.useState(null);
  const [fontLoaded, setFontLoaded] = React.useState(false);

  const scrollView = React.useRef(null);

  const navigation = useNavigation();

  const loadData = async () => {
    setProfileError(null);
    setIsLoading(true);
    const user = props.firebase.auth().currentUser;
    if (!user) return;
    await props.firebase.database().ref('/users/' + user.uid).once('value').then(snapshot => {
      setUserName(snapshot.val().name || null);
      setUserAddress(snapshot.val().address || null);
      setUserZIP(snapshot.val().zip || null);
      setUserCity(snapshot.val().city || null);
      setUserPhone(snapshot.val().phone || null);
    });
    const storageRef = props.firebase.storage().ref();
    let userImageRef = storageRef.child(`profileImages/${user.uid}`);
    await userImageRef.listAll().then(async result => {
      if (!result.items.length) return;
      userImageRef = storageRef.child(`profileImages/${user.uid}/${user.uid}.jpg`);
      await userImageRef.getDownloadURL().then(url => {
        setUserImage(url);
      }).catch(error => setProfileError(error.message));
    });
    setIsLoading(false);
  }

  const getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }
  }

  const changeUserImage = async () => {
    setProfileError(null);
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5
    });
    if (!result.cancelled) setUserImage(result.uri);
  };

  const save = async () => {
    const user = props.firebase.auth().currentUser;
    setIsLoading(true);
    setProfileError(null);
    await user.updateProfile({
      displayName: userName,
      photoURL: userImage
    }).catch(error => {
      setIsLoading(false);
      setProfileError(error.message);
      return;
    });
    await props.firebase.database().ref('/users/' + user.uid).set({
      name: userName,
      address: userAddress,
      zip: userZIP,
      city: userCity,
      phone: userPhone
    }).catch(error => {
      setIsLoading(false);
      setProfileError(error.message);
      return;
    });
    if (userImage) {
      const storageRef = props.firebase.storage().ref();
      const userImageRef = storageRef.child(`profileImages/${user.uid}/${user.uid}.jpg`);
      await uriToBlob(userImage).then(blob => {
        userImageRef.put(blob, {contentType: 'image/jpeg'}).then(() => {
          blob.close();
        });
      }).catch(error => {
        setIsLoading(false);
        setProfileError(error.message);
        return;
      });
    }
    setIsLoading(false);
  }

  const logout = () => {
    setIsLoading(true);
    setProfileError(null);
    props.firebase.auth().signOut().then(() => {
      setIsLoading(false);
      navigation.navigate('Login');
    }).catch(error => {
      setIsLoading(false);
      setProfileError(error.message);
    });
  }

  const uriToBlob = (uri) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = () => resolve(xhr.response);
      xhr.onerror = () => reject(new Error('uriToBlob failed'));
      xhr.responseType = 'blob';
      xhr.open('GET', uri, true);
      xhr.send(null);
    });
  }

  React.useEffect(() => {
    scrollView.current.scrollToPosition(0, 0);
    loadData();
    Font.loadAsync({
      'JosefinSans': require('../assets/fonts/JosefinSans-Medium.ttf')
    }).then(() => setFontLoaded(true));
    const unsubscribe = navigation.addListener('focus', () => {
      scrollView.current.scrollToPosition(0, 0);
      loadData();
    });
    return unsubscribe;
  }, []);

  React.useEffect(() => {
    props.setShowLoadOL(isLoading);
  }, [isLoading]);

  return (
    <View style={{flex: 1}}>
    	<TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    		<KeyboardAwareScrollView ref={scrollView} keyboardOpeningTime={50} 
          contentContainerStyle={styles.container}>
          {fontLoaded && <Text style={[styles.title, styles.field]}>Hello, {userName || 'unknown hylfer!'}!</Text>}
          <Text style={styles.field}>This is your profile. You can set your personal details which will gain you trustworthyness on the platform.</Text>
          <View style={{alignItems: 'center', marginBottom: 16}}>
            <TouchableOpacity onPress={() => changeUserImage()}>
              <Image style={styles.image} source={userImage ? {uri: userImage} : 
                require('../assets/user.png')} />
            </TouchableOpacity>
          </View>
          {profileError && <Text style={[styles.profileError, styles.field]}>{profileError}</Text>}
          <TextInput mode='outlined' style={styles.field} value={userName} placeholder='Name' 
            keyboardType='default' autoCompleteType='name' textContentType='name' 
            onChangeText={name => setUserName(name)} enablesReturnKeyAutomatically 
            disabled={isLoading} />
          <TextInput mode='outlined' style={styles.field} value={userAddress} placeholder='Address' 
            keyboardType='default' autoCompleteType='street-address' textContentType='fullStreetAddress' 
            onChangeText={address => setUserAddress(address)} enablesReturnKeyAutomatically 
            disabled={isLoading} />
          <TextInput mode='outlined' style={styles.field} value={userZIP} placeholder='ZIP' 
            keyboardType='numeric' autoCompleteType='postal-code' textContentType='postalCode' 
            onChangeText={zip => setUserZIP(zip)} enablesReturnKeyAutomatically 
            disabled={isLoading} />
          <TextInput mode='outlined' style={styles.field} value={userCity} placeholder='City' 
            keyboardType='default' textContentType='addressCity' 
            onChangeText={city => setUserCity(city)} enablesReturnKeyAutomatically 
            disabled={isLoading} />
          <TextInput mode='outlined' style={styles.field} value={userPhone} placeholder='Phone' 
            keyboardType='numeric' textContentType='telephoneNumber' autoCompleteType='tel' 
            onChangeText={phone => setUserPhone(phone)} enablesReturnKeyAutomatically 
            disabled={isLoading} />
          <Button icon='check' style={styles.field} color='#2da84a' mode='contained' 
            disabled={isLoading} onPress={() => save()}>Save</Button>
          <Button icon='logout' color='#ed5247' mode='contained' 
            disabled={isLoading} onPress={() => logout()}>Logout</Button>
        </KeyboardAwareScrollView>
      </TouchableWithoutFeedback>
    </View>
  );
}
