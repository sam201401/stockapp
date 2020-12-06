import React, {useState, useEffect,useRef} from 'react';
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
  AsyncStorage
} from 'react-native';

// Import Google Signin

import { GoogleSignin,
    GoogleSigninButton,
    statusCodes, } from '@react-native-community/google-signin';


const App = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [gettingLoginStatus, setGettingLoginStatus] = useState(true);
  const appState = useRef(AppState.currentState);
  const [display,setDisplay] = useState(false);
  const [displayState,setDisplayState] = useState(false);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
 

  
  useEffect(() => {
    // Initial configuration

    console.log("component will mount");
   
    GoogleSignin.configure({
      // Mandatory method to call before calling signIn()
      //scopes: ['https://www.googleapis.com/auth/drive.readonly'],
      // Repleace with your webClientId
      // Generated from Firebase console
      webClientId: '1098529183539-s9p4a6ta2gdnlpj9t7l8dn602eats5i5.apps.googleusercontent.com',
    });
    // Check if user is already signed in
    _isSignedIn();

    AppState.addEventListener("change", handleAppStateChange);


      
      






    return () => {
      // Anything in here is fired on component unmount.
     
      //setbackgroundStatus(true);
      AppState.removeEventListener("change", handleAppStateChange);
      

  }

  }, []);

  const handleAppStateChange = (nextAppState) => {
   
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      
      console.log("App has come to the foreground!");
      

    
    
    }

    appState.current = nextAppState;
   // setAppStateVisible(appState.current);
    if(appState.current==="background")
    {
      
      setAppStateVisible(appState.current);
      console.log("appstate"+appState.current);
      console.log("appstatevisibility from bg"+appStateVisible);






    }

    if(appState.current==="active")
    {
      
     
      console.log("appstatevisibility from active"+appStateVisible);
      
    }
    
    console.log("AppState", appState.current);
    console.log("AppStatevisi", appStateVisible);
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
      
      setDisplay(true);
     // setUserInfo(userInfo);
      
      
     
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
    
    } catch (error) {
      console.error(error);
    }
    setGettingLoginStatus(false);
  };
   
   const _changeStatus= async (cond) => {
       console.log("changeStatus");
     
       const userInfo = await GoogleSignin.signIn();
       setUserInfo(userInfo);
       setDisplay(false);
      
     
         //setChangeStatus(cond);
  };

 
  
  
  if (gettingLoginStatus) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  } else {
    
    return (
      <SafeAreaView style={{flex: 1}}>
        <View style={styles.container}>
          <Text style={styles.titleText}>
            Example of Google Sign In in React Native
          </Text>
          <View style={styles.container}>
            {userInfo !== null ? (
             
              <>
            
                {AppState.currentState==="active"&&appStateVisible==="active"?(<>
                
                  <BiometricPopup changeStatus={_changeStatus}/>
             
                
                </>):( <>
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
                  <Text>{appStateVisible}</Text>
                </TouchableOpacity>

              </>)
               
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
                 {display&&<BiometricPopup changeStatus={_changeStatus}/>}
             
                
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