import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, Keyboard, 
	TouchableWithoutFeedback, Alert } from 'react-native';
import LottieView from 'lottie-react-native';
import * as Animatable from 'react-native-animatable';
import * as MailComposer from 'expo-mail-composer';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Text, Title, Headline, Subheading, 
	Paragraph, Button, List } from 'react-native-paper';

const helpSrc = require('../assets/lottie/help.json');

const styles = {
	container: {
    justifyContent: 'center',
    padding: 32,
    backgroundColor: '#fff',
    paddingTop: 64,
    paddingBottom: 64 * 2,
    minHeight: '100%'
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
  lottie: {
    width: '35%',
    alignSelf: 'center',
    marginBottom: 42
  },
  listText: {
  	fontSize: 14,
  	lineHeight: 20,
  	letterSpacing: 0.5
  }
}

export default function HelpScreen(props) {

	const [isOpen, setIsOpen] = React.useState(false);

	const scrollView = React.useRef(null);

	const sendMail = () => {
		MailComposer.composeAsync({saveOptions: {
			recipients: ['info@hylf.ch'],
			subject: 'hylf me!',
			body: 'Yo hylf, I wanted to ask you...'
		}}).then(result => {
			// ...
		}).catch(error => Alert.alert('Oh no!', error.message));
	}

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
  		<TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false} style={{flex: 1}}>
    		<KeyboardAwareScrollView keyboardOpeningTime={50} ref={scrollView} 
    			contentContainerStyle={styles.container}>
    			<LottieView style={styles.lottie} source={helpSrc} autoPlay loop={false} />
          <Title style={styles.title}>hylf help & faq</Title>
          <Paragraph style={[styles.p, styles.field]}>
            We'll try covering the most frequently asked questions here. 
            If you have any further questions or remarks, feel free to drop a line at:
          </Paragraph>
    	    <Button icon='email' mode='contained' style={styles.field} uppercase={false} 
    	    	onPress={() => sendMail()}>info@hylf.ch</Button>
    	    <List.Accordion title='What are the types of services I can find on hylf? Is it legal?' 
    	    	titleNumberOfLines={10}>
    	    	<List.Item title="You'll find services like animal sitting, helping buying groceries, 
    	    		delivering packages and items, gardening, ... everything except illegal services." 
    	    		titleStyle={styles.listText} titleNumberOfLines={10}/>
    	    </List.Accordion>
    	    <List.Accordion title='How do I know if I can trust the service offering / consuming partner?' 
    	    	titleNumberOfLines={10}>
    	    	<List.Item title="You're responsible yourself to only choose partners that seem serious. 
    	    		hylf cannot take responsibility for criminal or prankish activity on the platform." 
    	    		titleStyle={styles.listText} titleNumberOfLines={10}/>
    	    </List.Accordion>
    	    <List.Accordion title="What do I do if the person doesn't show up or doesn't hold promise?" 
    	    	titleNumberOfLines={10}>
    	    	<List.Item title="You're responsible yourself to only choose partners that seem serious. 
    	    		hylf cannot take responsibility for criminal or prankish activity on the platform." 
    	    		titleStyle={styles.listText} titleNumberOfLines={10}/>
    	    </List.Accordion>
    	    <List.Accordion title="Is my data safe?" 
    	    	titleNumberOfLines={10}>
    	    	<List.Item title="All user data is hosted securely on Google Firebase. 
    	    		Passwords are safely encrypted and cannot be seen not even by the hylf creators." 
    	    		titleStyle={styles.listText} titleNumberOfLines={10}/>
    	    </List.Accordion>
    	    <List.Accordion title="Who made hylf and why?" 
    	    	titleNumberOfLines={10}>
    	    	<List.Item title="hylf started while Covid-19 outbreak started spreading in Switzerland 
    	    		and as a side project for learning to code in React-Native." 
    	    		titleStyle={styles.listText} titleNumberOfLines={10}/>
    	    </List.Accordion>
			  </KeyboardAwareScrollView>
	    </TouchableWithoutFeedback>
    </Animatable.View>
  );
}
