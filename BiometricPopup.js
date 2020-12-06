import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Alert,
  Image,
  Text,
  TouchableOpacity,
  View,
  ViewPropTypes,
  Platform,
} from 'react-native';
 
import FingerprintScanner from 'react-native-fingerprint-scanner';
import styles from './src/FingerprintPopup.component.styles';
import ShakingText from './src/ShakingText.component';
 
 
// - this example component supports both the
//   legacy device-specific (Android < v23) and
//   current (Android >= 23) biometric APIs
// - your lib and implementation may not need both
class BiometricPopup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMessageLegacy: undefined,
      biometricLegacy: undefined
    };
 
    this.description = null;
  }
 
  componentDidMount() {
    if (this.requiresLegacyAuthentication()) {
      this.authLegacy();
    } else {
      this.authCurrent();
    }
  }
 
  componentWillUnmount = () => {
    FingerprintScanner.release();
  }
 
  requiresLegacyAuthentication() {
    return Platform.Version < 23;
  }
 
  authCurrent() {
    FingerprintScanner
      .authenticate({ title: 'Log in with Biometrics' })
      .then(() => {
          console.log("authenticated");
        //  Alert.alert('Fingerprint Authentication', 'Authenticated successfully');
          
        this.props.changeStatus(true);
        this.props.onAuthenticate();
        
      }).catch(()=>{
       
       
        this.props.upd();
      });
  }
 
  authLegacy() {
    FingerprintScanner
      .authenticate({ onAttempt: this.handleAuthenticationAttemptedLegacy })
      .then(() => {
        this.props.handlePopupDismissedLegacy();
        Alert.alert('Fingerprint Authentication', 'Authenticated successfully');
        console.log("authenticated");
        
      })
      .catch((error) => {
        this.setState({ errorMessageLegacy: error.message, biometricLegacy: error.biometric });
        this.description.shake();
      });
  }
 
  handleAuthenticationAttemptedLegacy = (error) => {
    this.setState({ errorMessageLegacy: error.message });
    this.description.shake();
  };
 
  renderLegacy() {
    const { errorMessageLegacy, biometricLegacy } = this.state;
    const { style, handlePopupDismissedLegacy ,changeStatus} = this.props;
 
    return (
      <View style={styles.container}>
        <View style={[styles.contentContainer, style]}>
 
          <Image
            style={styles.logo}
            source={require('./src/assets/finger_print.png')}
          />
 
          <Text style={styles.heading}>
            Biometric{'\n'}Authentication
          </Text>
          <ShakingText
            ref={(instance) => { this.description = instance; }}
            style={styles.description(!!errorMessageLegacy)}>
            {errorMessageLegacy || `Scan your ${biometricLegacy} on the\ndevice scanner to continue`}
          </ShakingText>
 
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={handlePopupDismissedLegacy}
          >
            <Text style={styles.buttonText}>
              BACK TO MAIN
            </Text>
          </TouchableOpacity>
 
        </View>
      </View>
    );
  }
 
 
  render = () => {
    if (this.requiresLegacyAuthentication()) {
      return this.renderLegacy();
    }
 
    // current API UI provided by native BiometricPrompt
    return null;
  }
}
 
BiometricPopup.propTypes = {
  onAuthenticate: PropTypes.func.isRequired,
  handlePopupDismissedLegacy: PropTypes.func,
  style: ViewPropTypes.style,
};
 
export default BiometricPopup;