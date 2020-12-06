import React, {useState, useEffect} from 'react';
import BiometricPopup from './BiometricPopup'
// Import all the components we are going to use
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  AppState,
} from 'react-native';

// Import Google Signin

import { GoogleSignin,
    GoogleSigninButton,
    statusCodes, } from '@react-native-community/google-signin';


const App = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [gettingLoginStatus, setGettingLoginStatus] = useState(true);
  const [changeStatus, setChangeStatus] = useState(false);
  const [backgroundStatus, setbackgroundStatus] = useState(false);
  const [displayStatus, setdisplayStatus] = useState(false);

  useEffect(() => {
    // Initial configuration

    console.log("component will mount");
    AppState.addEventListener('change', _handleAppStateChange);
    GoogleSignin.configure({
      // Mandatory method to call before calling signIn()
      //scopes: ['https://www.googleapis.com/auth/drive.readonly'],
      // Repleace with your webClientId
      // Generated from Firebase console
      webClientId: '1098529183539-s9p4a6ta2gdnlpj9t7l8dn602eats5i5.apps.googleusercontent.com',
    });
    // Check if user is already signed in
    _isSignedIn();
    return () => {
      // Anything in here is fired on component unmount.
      setbackgroundStatus(true);

      AppState.removeEventListener('change', _handleAppStateChange);
      console.log("unmount");
      

  }

  }, []);

  let _handleAppStateChange = (nextAppState) => {

    

    if (nextAppState === 'background') {
      // Do something here on app background.
      console.log("App is in Background Mode.")
      //setbackgroundStatus(true);
      
       

      

    }

    if (nextAppState === 'active') {
      // Do something here on app active foreground mode.
      console.log("App is in Active Foreground Mode.")
      console.log("background"+backgroundStatus);

      setbackgroundStatus(true); 
      console.log("background"+backgroundStatus);
      console.log("background"+backgroundStatus);
      console.log("background"+backgroundStatus);
      
      
        
      
    }

    if (nextAppState === 'inactive') {
      // Do something here on app inactive mode.
      console.log("App is in inactive Mode.")
    }
  };

  const _isSignedIn = async () => {
    const isSignedIn = await GoogleSignin.isSignedIn();
    if (isSignedIn) {
      alert('User is already signed in');
      // Set User Info if user is already signed in
      _getCurrentUserInfo();
    } else {
      console.log('Please Login');
    }
    setGettingLoginStatus(false);
   
  };

  const _getCurrentUserInfo = async () => {
    try {
      let info = await GoogleSignin.signInSilently();
      console.log('User Info --> ', info);
      setUserInfo(info);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_REQUIRED) {
        alert('User has not signed in yet');
        console.log('User has not signed in yet');
      } else {
        alert("Unable to get user's info");
        console.log("Unable to get user's info");
      }
    }
  };

  const _signIn = async () => {
    // It will prompt google Signin Widget
    try {
      await GoogleSignin.hasPlayServices({
        // Check if device has Google Play Services installed
        // Always resolves to true on iOS
        showPlayServicesUpdateDialog: true,
      });
      const userInfo = await GoogleSignin.signIn();
      //console.log('User Info --> ', userInfo);
      
      setdisplayStatus(true);
      setUserInfo(userInfo);
      
      
     
    } catch (error) {
      console.log('Message', JSON.stringify(error));
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        alert('User Cancelled the Login Flow');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        alert('Signing In');
      } else if (
          error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE
        ) {
        alert('Play Services Not Available or Outdated');
      } else {
        alert(error.message);
      }
    }
  };

  const _signOut = async () => {
    setGettingLoginStatus(true);
    // Remove user session from the device.
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      // Removing user Info
      setUserInfo(null); 
      setChangeStatus(false);
      setdisplayStatus(false);
    } catch (error) {
      console.error(error);
    }
    setGettingLoginStatus(false);
  };
   
   const _changeStatus= async (cond) => {
       console.log("changeStatus");
     
       const userInfo = await GoogleSignin.signIn();
       setUserInfo(userInfo);
       setChangeStatus(false); 
     
         //setChangeStatus(cond);
  };

 
  
  
  if (gettingLoginStatus) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  } else {
    console.log(backgroundStatus);
    return (
      <SafeAreaView style={{flex: 1}}>
        <View style={styles.container}>
          <Text style={styles.titleText}>
            Example of Google Sign In in React Native
          </Text>
          <View style={styles.container}>
            {userInfo !== null ? (
              <>
             {backgroundStatus&&<BiometricPopup/>}
                {
                <>
                <Image
                  source={{uri: userInfo.user.photo}}
                  style={styles.imageStyle}
                />
                <Text style={styles.text}>
                  Name: {userInfo.user.name}
                </Text>
                <Text style={styles.text}>
                  Email: {userInfo.user.email}
                </Text>
                <TouchableOpacity
                  style={styles.buttonStyle}
                  onPress={_signOut}>
                  <Text>Logout</Text>
                </TouchableOpacity>
              </>
  }




              </>
            ) : (
              <>
                <GoogleSigninButton
                style={{width: 312, height: 48}}
                size={GoogleSigninButton.Size.Wide}
                color={GoogleSigninButton.Color.Light}
                onPress={_signIn}
                 />
             
                
              </>
            )}
          </View>
          <Text style={styles.footerHeading}>
            Google SignIn in React Native
          </Text>
          <Text style={styles.footerText}>
            www.aboutreact.com
          </Text>
        </View>
      </SafeAreaView>
    );
  }
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 20,
  },
  imageStyle: {
    width: 200,
    height: 300,
    resizeMode: 'contain',
  },
  buttonStyle: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
    width: 300,
    marginTop: 30,
  },
  footerHeading: {
    fontSize: 18,
    textAlign: 'center',
    color: 'grey',
  },
  footerText: {
    fontSize: 16,
    textAlign: 'center',
    color: 'grey',
  },
});