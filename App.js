import React, { Component } from "react";
import ChartUI  from './ChartUI';
import { AppState, StyleSheet, Text, View,
  SafeAreaView,

  
  
  Image,
  ActivityIndicator,
  TouchableOpacity,


} from "react-native";
import BiometricPopup from './BiometricPopup'
import { GoogleSignin,
  GoogleSigninButton,
  statusCodes, } from '@react-native-community/google-signin';
class App extends Component {
  state = {
    appState: AppState.currentState,
    display:false,
    displayforuser:false,
    gettingLoginStatus:true,
    userInfo:null,
    key:1
    
  };

  componentDidMount() {
    GoogleSignin.configure({
      // Mandatory method to call before calling signIn()
      //scopes: ['https://www.googleapis.com/auth/drive.readonly'],
      // Repleace with your webClientId
      // Generated from Firebase console
      webClientId: '1098529183539-s9p4a6ta2gdnlpj9t7l8dn602eats5i5.apps.googleusercontent.com',
    });
    // Check if user is already signed in
  
    AppState.addEventListener("change", this._handleAppStateChange);
   
    this._isSignedIn();
    
  }

  componentWillUnmount() {
    AppState.removeEventListener("change", this._handleAppStateChange);
  }

  _handleAppStateChange = nextAppState => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === "active"
    

    ) {
      
      
      console.log("App has come to the foreground!");
      
      this.setState({})
      
      console.log(this.state.display);
      

    }
    this.setState({ appState: nextAppState });
    if(this.state.appState==="background")
    {
      console.log("appstate"+this.state.appState);
      this.state.displayforuser=true;
      this.state.display=true;
    }
    
  };
   _isSignedIn = async () => {
    const isSignedIn = await GoogleSignin.isSignedIn();
    if (isSignedIn) {
      alert('User is already signed in');
      // Set User Info if user is already signed in
      this._getCurrentUserInfo();
    } else {
      console.log('Please Login');
    }
   
    this.setState({gettingLoginStatus:false});
   
  };

   _getCurrentUserInfo = async () => {
    try {
      let info = await GoogleSignin.signInSilently();
      console.log('User Info --> ', info);
      this.setState({userInfo: info})
      
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

 _signIn = async () => {
    // It will prompt google Signin Widget
    try {
      await GoogleSignin.hasPlayServices({
        // Check if device has Google Play Services installed
        // Always resolves to true on iOS
        showPlayServicesUpdateDialog: true,
      });
      const userInfo = await GoogleSignin.signIn();
     
      this.setState({display:true})

      //console.log('User Info --> ', userInfo);
      
      
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

   _signOut = async () => {
    this.state.gettingLoginStatus=true;
    
    // Remove user session from the device.
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      // Removing user Info
      this.state.userInfo=null; 
    
    } catch (error) {
      console.error(error);
    }
    this.state.gettingLoginStatus=false;
   this.setState({display:false});
  };
   
    _changeStatus= async (cond) => {
       console.log("changeStatus");
     
       const userInfo = await GoogleSignin.signIn();
      this.setState({
        userInfo: userInfo,
        displayforuser:false
      })
      
     
         //setChangeStatus(cond);
  };
  _upd= async () => {
    console.log("upddd")
    console.log("upddd"+this.state.displayforuser)
    this.setState({ key: Math.random(),display:false});
  
   
  
      //setChangeStatus(cond);
};
  render() {
    if (this.state.gettingLoginStatus) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    } else {
    return (
      <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
     { this.state.userInfo !== null ? (
          this.state.displayforuser===true?(
        <><BiometricPopup key={this.state.key} upd={this._upd} changeStatus={this._changeStatus}/></>
      ):(
        <>
       <ChartUI/>
       <TouchableOpacity
        style={styles.buttonStyle}
        onPress={this._signOut}>
        <Text>Logout</Text>
       
      </TouchableOpacity>
</>
      )
        
    ):(

      <>
      <GoogleSigninButton
      style={{width: 312, height: 48,marginLeft:20}}
      size={GoogleSigninButton.Size.Wide}
      color={GoogleSigninButton.Color.Light}
      onPress={this._signIn}
       />
       {this.state.display&&<BiometricPopup upd={this._upd} changeStatus={this._changeStatus}/>}
   
      
    </>
    )
    }
    </View>
      </SafeAreaView>

    )
    }
    
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    //alignItems: 'center',
    justifyContent: 'center',
  
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
   marginLeft:20,
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

export default App;