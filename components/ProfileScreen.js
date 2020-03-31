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
    display: 'none',
    opacity: 0,
    ...StyleSheet.absoluteFill
  },
  open: {
    display: 'flex',
  },
  scrollview: {
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
    marginTop: 8,
    marginBottom: 4
  },
  field: {
  	marginBottom: 16
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

  const [userImage, setUserImage] = React.useState(props.localUserData?.userImage);
  const [userName, setUserName] = React.useState(props.localUserData?.userName);
  const [userAddress, setUserAddress] = React.useState(props.localUserData?.userAddress);
  const [userZIP, setUserZIP] = React.useState(props.localUserData?.userZIP);
  const [userCity, setUserCity] = React.useState(props.localUserData?.userCity);
  const [userPhone, setUserPhone] = React.useState(props.localUserData?.userPhone);
  const [userEmail, setUserEmail] = React.useState(props.localUserData?.userEmail);
  const [isLoading, setIsLoading] = React.useState(false);
  const [profileError, setProfileError] = React.useState(null);
  const [isOpen, setIsOpen] = React.useState(null);

  const scrollViewRef = React.useRef(null);

  const loadData = async () => {
    const user = props.firebase.auth().currentUser;
    if (!user) return;
    setIsLoading(true);
    await props.firebase.database().ref('/users/' + user.uid).once('value').then(snapshot => {
      setUserName(snapshot.val()?.name);
      setUserAddress(snapshot.val()?.address);
      setUserZIP(snapshot.val()?.zip);
      setUserCity(snapshot.val()?.city);
      setUserPhone(snapshot.val()?.phone);
      setUserEmail(user.email);
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

  const save = () => {
    return new Promise(async (resolve, reject) => {
      setIsLoading(true);
      const user = props.firebase.auth().currentUser;
      await user.updateProfile({
        displayName: userName,
        photoURL: userImage
      }).catch(error => reject(error));
      await props.firebase.database().ref('/users/' + user.uid).set({
        name: userName,
        address: userAddress,
        zip: userZIP,
        city: userCity,
        phone: userPhone
      }).catch(error => reject(error));
      if (userImage) {
        const storageRef = props.firebase.storage().ref();
        const userImageRef = storageRef.child(`profileImages/${user.uid}/${user.uid}.jpg`);
        await uriToBlob(userImage).then(blob => {
          userImageRef.put(blob, {contentType: 'image/jpeg'}).then(() => {
            blob.close();
          });
        }).catch(error => reject(error));
      }
      resolve();
    });
  }

  const logout = () => {
    setIsLoading(true);
    setProfileError(null);
    props.firebase.auth().signOut().then(() => {
      setTimeout(() => {
        resetUserData();
        actionSuccess();
        props.setCurrentScreenIndex(1);
      }, 1000);
    }).catch(error => actionFail(error.message));
  }

  const actionSuccess = () => {
    setProfileError(null);
    setIsLoading(false);
    scrollViewRef.current.scrollToPosition(0, 0);
    props.setShowLoadOL('success');
  }

  const actionFail = (error) => {
    setProfileError(error);
    setIsLoading(false);
    scrollViewRef.current.scrollToPosition(0, 0);
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
    setUserEmail(null);
    props.setLocalUserData(null);
  }

  React.useEffect(() => {
    if (isOpen) scrollViewRef.current.scrollToPosition(0, 0, false);
    if (isOpen && !props.localUserData) loadData();
    if (!isOpen) setIsLoading(false);
  }, [isOpen]);

  React.useEffect(() => {
    if (isLoading) {
      props.setShowLoadOL(true);
      setProfileError(null);
    }
  }, [isLoading]);

  React.useEffect(() => {
    const open = props.currentScreenIndex === props.screenIndex;
    setTimeout(() => setIsOpen(open), 375);
  }, [props.currentScreenIndex]);

  React.useEffect(() => {
    if (!props.authState) return;
    props.setLocalUserData({
      userName: userName || props.localUserData?.userName,
      userAddress: userAddress || props.localUserData?.userAddress,
      userZIP: userZIP || props.localUserData?.userZIP,
      userCity: userCity || props.localUserData?.userCity,
      userPhone: userPhone || props.localUserData?.userPhone,
      userImage: userImage || props.localUserData?.userImage,
      userEmail: userEmail || props.localUserData?.userEmail
    });
  }, [userName, userAddress, userZIP, userCity, userPhone, userImage]);

  return (
    <Animatable.View style={[styles.container, isOpen && styles.open]} 
      animation={isOpen ? 'fadeInDown' : null} duration={125} useNativeDriver>
    	<TouchableWithoutFeedback style={{flex: 1}} onPress={Keyboard.dismiss} accessible={false}>
    		<KeyboardAwareScrollView ref={scrollViewRef} keyboardOpeningTime={50} 
          contentContainerStyle={styles.scrollview}>
          <Title style={[styles.title, styles.field]}>
            Hello, {userName || 'unknown hylfer!'}!
          </Title>
          <Paragraph style={[styles.p, styles.field]}>
            This is your hylf profile.{'\n'}You can set your personal details which 
            will gain you trustworthyness on the platform.
          </Paragraph>
          <View style={{alignItems: 'center', marginBottom: 16}}>
            <TouchableOpacity onPress={() => changeUserImage()}>
              <Image style={styles.image} 
                source={userImage ? {uri: userImage, cache: 'default'} : require('../assets/user.png')} />
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
          <TextInput mode='outlined' style={styles.field} value={userEmail} 
            label='Email' keyboardType='email-address' textContentType='emailAddress' autoCompleteType='email' 
            onChangeText={phone => setUserEmail(email)} enablesReturnKeyAutomatically 
            disabled={true} />
          <Button icon='check' style={styles.field} color='#2da84a' mode='contained' 
            disabled={isLoading} onPress={
              () => save().then(() => actionSuccess()).catch(error => actionFail(error.message))
            }>Save</Button>
          <Button icon='logout' color='#ed5247' mode='contained' 
            disabled={isLoading} onPress={() => logout()}>Logout</Button>
        </KeyboardAwareScrollView>
      </TouchableWithoutFeedback>
    </Animatable.View>
  );
}
