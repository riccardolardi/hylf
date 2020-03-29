import React from 'react';
import { StyleSheet, Keyboard, TouchableWithoutFeedback, 
  TouchableOpacity, View, Image } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as Animatable from 'react-native-animatable';
import { Button, TextInput, Title, Text, 
  Paragraph, Subheading } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    padding: 32,
    backgroundColor: '#fff',
    paddingTop: 64,
    paddingBottom: 64 * 2,
    minHeight: '100%'
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 120,
    backgroundColor: '#dadada',
    marginTop: 8
  },
  field: {
  	marginBottom: 8
  },
  title: {
    fontFamily: 'Itim',
    fontSize: 32,
    lineHeight: 36,
    textAlign: 'center'
  },
  p: {
    textAlign: 'center'
  },
  registerError: {
  	color: 'red',
  	textAlign: 'center'
  },
  profileError: {
    color: 'red',
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
  const [isOpen, setIsOpen] = React.useState(false);

  const scrollView = React.useRef(null);

  const loadData = async () => {
    const user = props.firebase.auth().currentUser;
    if (!user) return;
    await props.firebase.database().ref('/users/' + user.uid).once('value').then(snapshot => {
      setUserName(snapshot.val()?.name);
      setUserAddress(snapshot.val()?.address);
      setUserZIP(snapshot.val()?.zip);
      setUserCity(snapshot.val()?.city);
      setUserPhone(snapshot.val()?.phone);
    });
    const storageRef = props.firebase.storage().ref();
    let userImageRef = storageRef.child(`profileImages/${user.uid}`);
    const result = await userImageRef.listAll().then(result => result);
    if (!result.items.length) return;
    userImageRef = storageRef.child(`profileImages/${user.uid}/${user.uid}.jpg`);
    await userImageRef.getDownloadURL().then(url => {
      setUserImage(url);
    }).catch(error => actionFail(error.message));
    actionSuccess();
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
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5
    });
    if (!result.cancelled) setUserImage(result.uri);
  };

  const save = async () => {
    setIsLoading(true);
    const user = props.firebase.auth().currentUser;
    await user.updateProfile({
      displayName: userName,
      photoURL: userImage
    }).catch(error => {
      actionFail(error.message);
      return;
    });
    await props.firebase.database().ref('/users/' + user.uid).set({
      name: userName,
      address: userAddress,
      zip: userZIP,
      city: userCity,
      phone: userPhone
    }).catch(error => {
      actionFail(error.message);
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
        actionFail(error.message);
        return;
      });
    }
    actionSuccess();
  }

  const logout = () => {
    setIsLoading(true);
    setProfileError(null);
    props.firebase.auth().signOut().then(() => {
      setTimeout(() => {
        actionSuccess();
        props.navigation.navigate('Login');
      }, 1000);
    }).catch(error => actionFail(error.message));
  }

  const actionSuccess = () => {
    setProfileError(null);
    setIsLoading(false);
    props.setShowLoadOL('success');
    scrollView.current.scrollToPosition(0, 0);
  }

  const actionFail = (error) => {
    setProfileError(error);
    setIsLoading(false);
    props.setShowLoadOL('fail');
    scrollView.current.scrollToPosition(0, 0);
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
    loadData();
    props.navigation.addListener('focus', () => {
      isOpen && scrollView.current.scrollToPosition(0, 0);
      loadData();
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

  React.useEffect(() => {
    if (isLoading) {
      props.setShowLoadOL(true);
      setProfileError(null);
    }
  }, [isLoading]);

  return (isOpen && 
    <Animatable.View style={{flex: 1}} 
      animation='fadeInDown' duration={125} useNativeDriver>
    	<TouchableWithoutFeedback style={{flex: 1}} onPress={Keyboard.dismiss} accessible={false}>
    		<KeyboardAwareScrollView ref={scrollView} keyboardOpeningTime={50} 
          contentContainerStyle={styles.container}>
          <Title style={[styles.title]}>
            Hello, {userName || 'unknown hylfer!'}!
          </Title>
          <Paragraph style={[styles.p, styles.field]}>
            This is your hylf profile.{'\n'}You can set your personal details which 
            will gain you trustworthyness on the platform.
          </Paragraph>
          <View style={{alignItems: 'center', marginBottom: 16}}>
            <TouchableOpacity onPress={() => changeUserImage()}>
              <Image style={styles.image} source={userImage ? {uri: userImage} : require('../assets/user.png')} />
            </TouchableOpacity>
          </View>
          {profileError && <Text style={[styles.profileError, styles.field]}>{profileError}</Text>}
          <TextInput mode='outlined' style={styles.field} value={userName} 
            label='Name' keyboardType='default' autoCompleteType='name' textContentType='name' 
            onChangeText={name => setUserName(name)} enablesReturnKeyAutomatically 
            disabled={isLoading} />
          <TextInput mode='outlined' style={styles.field} value={userAddress} 
            label='Address' keyboardType='default' autoCompleteType='street-address' textContentType='fullStreetAddress' 
            onChangeText={address => setUserAddress(address)} enablesReturnKeyAutomatically 
            disabled={isLoading} />
          <TextInput mode='outlined' style={styles.field} value={userZIP} 
            label='ZIP' keyboardType='numeric' autoCompleteType='postal-code' textContentType='postalCode' 
            onChangeText={zip => setUserZIP(zip)} enablesReturnKeyAutomatically 
            disabled={isLoading} />
          <TextInput mode='outlined' style={styles.field} value={userCity} 
            label='City' keyboardType='default' textContentType='addressCity' 
            onChangeText={city => setUserCity(city)} enablesReturnKeyAutomatically 
            disabled={isLoading} />
          <TextInput mode='outlined' style={styles.field} value={userPhone} 
            label='Phone' keyboardType='numeric' textContentType='telephoneNumber' autoCompleteType='tel' 
            onChangeText={phone => setUserPhone(phone)} enablesReturnKeyAutomatically 
            disabled={isLoading} />
          <Button icon='check' style={styles.field} color='#2da84a' mode='contained' 
            disabled={isLoading} onPress={() => save()}>Save</Button>
          <Button icon='logout' color='#ed5247' mode='contained' 
            disabled={isLoading} onPress={() => logout()}>Logout</Button>
        </KeyboardAwareScrollView>
      </TouchableWithoutFeedback>
    </Animatable.View>
  );
}
