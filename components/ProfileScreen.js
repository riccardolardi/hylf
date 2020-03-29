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
    if (result.items.length) {
      userImageRef = storageRef.child(`profileImages/${user.uid}/${user.uid}.jpg`);
      await userImageRef.getDownloadURL().then(url => {
        setUserImage(url);
      }).catch(error => actionFail(error.message));
      actionSuccess();
    } else {
      actionSuccess();
    }
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
        resetUserData();
        actionSuccess();
        props.navigation.navigate('Login');
      }, 1000);
    }).catch(error => actionFail(error.message));
  }

  const actionSuccess = () => {
    setProfileError(null);
    setIsLoading(false);
    props.setShowLoadOL('success');
  }

  const actionFail = (error) => {
    setProfileError(error);
    setIsLoading(false);
    props.setShowLoadOL('fail');
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

  const resetUserData = () => {
    setUserName(null);
    setUserAddress(null);
    setUserZIP(null);
    setUserCity(null);
    setUserPhone(null);
    setUserImage(null);
  }

  React.useEffect(() => {
    props.navigation.addListener('focus', () => {
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

  React.useEffect(() => {
    if (!props.authState) return;
    props.setLocalUserData({
      userName: userName || props.localUserData?.userName,
      userAddress: userAddress || props.localUserData?.userAddress,
      userZIP: userZIP || props.localUserData?.userZIP,
      userCity: userCity || props.localUserData?.userCity,
      userPhone: userPhone || props.localUserData?.userPhone,
      userImage: userImage || props.localUserData?.userImage
    });
  }, [userName, userAddress, userZIP, userCity, userPhone, userImage]);

  return (isOpen && 
    <Animatable.View style={{flex: 1}} 
      animation='fadeInDown' duration={125} useNativeDriver>
    	<TouchableWithoutFeedback style={{flex: 1}} onPress={Keyboard.dismiss} accessible={false}>
    		<KeyboardAwareScrollView ref={scrollView} keyboardOpeningTime={50} 
          contentContainerStyle={styles.container}>
          <Title style={[styles.title]}>
            Hello, {props.localUserData?.userName || userName || 'unknown hylfer!'}!
          </Title>
          <Paragraph style={[styles.p, styles.field]}>
            This is your hylf profile.{'\n'}You can set your personal details which 
            will gain you trustworthyness on the platform.
          </Paragraph>
          <View style={{alignItems: 'center', marginBottom: 16}}>
            <TouchableOpacity onPress={() => changeUserImage()}>
              <Image style={styles.image} 
                source={props.localUserData?.userImage || userImage ? 
                  {uri: props.localUserData?.userImage || userImage, cache: 'default'} : 
                    require('../assets/user.png')} />
            </TouchableOpacity>
          </View>
          {profileError && <Text style={[styles.profileError, styles.field]}>{profileError}</Text>}
          <TextInput mode='outlined' style={styles.field} value={props.localUserData?.userName || userName} 
            label='Name' keyboardType='default' autoCompleteType='name' textContentType='name' 
            onChangeText={name => setUserName(name)} enablesReturnKeyAutomatically 
            disabled={isLoading} />
          <TextInput mode='outlined' style={styles.field} value={props.localUserData?.userAddress || userAddress} 
            label='Address' keyboardType='default' autoCompleteType='street-address' textContentType='fullStreetAddress' 
            onChangeText={address => setUserAddress(address)} enablesReturnKeyAutomatically 
            disabled={isLoading} />
          <TextInput mode='outlined' style={styles.field} value={props.localUserData?.userZIP || userZIP} 
            label='ZIP' keyboardType='numeric' autoCompleteType='postal-code' textContentType='postalCode' 
            onChangeText={zip => setUserZIP(zip)} enablesReturnKeyAutomatically 
            disabled={isLoading} />
          <TextInput mode='outlined' style={styles.field} value={props.localUserData?.userCity || userCity} 
            label='City' keyboardType='default' textContentType='addressCity' 
            onChangeText={city => setUserCity(city)} enablesReturnKeyAutomatically 
            disabled={isLoading} />
          <TextInput mode='outlined' style={styles.field} value={props.localUserData?.userPhone || userPhone} 
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
