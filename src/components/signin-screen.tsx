// Import FirebaseAuth and firebase.
import React from 'react';
import * as Config from 'config';
import * as firebaseui from 'firebaseui'
import firebase from 'firebase/app'

import {firebaseApp} from 'firebaseApp';


// Google OAuth Client ID, needed to support One-tap sign-up.
  // Set to null if One-tap sign-up is not supported.
  var OAUTH_CLIENT_ID = '';
  
  //@return {!Object} The FirebaseUI config.
  function getUiConfig() {
    return {
       // Query parameter name for mode.
      //queryParameterForWidgetMode: 'mode',
      // Query parameter name for sign in success url.
      //queryParameterForSignInSuccessUrl: 'signInSuccessUrl',
      // Will use the default - redirect - since its recommended for mobile flow
      //signInFlow: 'popup',
      signInSuccessUrl: '/posts',
      callbacks: {
        signInSuccess: function(user, credential, redirectUrl) {
          if (window.opener) {
            // The widget has been opened in a popup, so close the window
            // and return false to not redirect the opener.
            window.close();
            return false;
          } else {
            // The widget has been used in redirect mode, so we redirect to the signInSuccessUrl.
            return true;
            //return false; // Avoid redirects after sign-in.
          }
        }
      },
      signInOptions: [
        // List of OAuth providers supported.
        {
          provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
           // Required to enable this provider in One-Tap Sign-up.
          authMethod: 'https://accounts.google.com',
          // Required to enable ID token credentials for this provider.
           // Required to enable ID token credentials for this provider. This can be obtained from the Credentials page of the Google APIs console.
          clientId: Config.CLIENT_ID
        }
      ],
      // Terms of service url.
      tosUrl: 'https://www.google.com',
      //credentialHelper: CLIENT_ID && CLIENT_ID != OAUTH_CLIENT_ID ? firebaseui.auth.CredentialHelper.GOOGLE_YOLO : firebaseui.auth.CredentialHelper.ACCOUNT_CHOOSER_COM
      credentialHelper: firebaseui.auth.CredentialHelper.ACCOUNT_CHOOSER_COM
    };
  }
  
  // Displays the UI for a signed in user.
  // @param {!firebase.User} user
  var handleSignedInUser = function(user) {
  /*
    document.getElementById('name').textContent = user.displayName;
    document.getElementById('email').textContent = user.email;
    document.getElementById('phone').textContent = user.phoneNumber;
    if (user.photoURL){
      var photoURL = user.photoURL;
      // Append size to the photo URL for Google hosted images to avoid requesting
      // the image with its original resolution (using more bandwidth than needed)
      // when it is going to be presented in smaller size.
      if ((photoURL.indexOf('googleusercontent.com') != -1) ||
          (photoURL.indexOf('ggpht.com') != -1)) {
        photoURL = photoURL + '?sz=' +
            document.getElementById('photo').clientHeight;
      }
      document.getElementById('photo').src = photoURL;
      document.getElementById('photo').style.display = 'block';
    } else {
      document.getElementById('photo').style.display = 'none';
    }
    */
  };
  
  
  // Displays the UI for a signed out user.
  var handleSignedOutUser = function(firebase, ui) {
    ui.start('#firebaseui-auth-container', getUiConfig());
  };
  
  // Deletes the user's account.
  var deleteAccount = function(firebase) {
    firebase.auth().currentUser.delete().catch(function(error) {
      if (error.code == 'auth/requires-recent-login') {
        // The user's credential is too old. She needs to sign in again.
        firebase.auth().signOut().then(function() {
          // The timeout allows the message to be displayed after the UI has
          // changed to the signed out state.
          setTimeout(function() {
            alert('Please sign in again to delete your account.');
          }, 1);
        });
      }
    });
  };
  

export class SignInScreen extends React.Component {

  private ui: any;
  private firebaseUiWidget:any;
  private unregisterAuthObserver: any;
  
  constructor(props) {
    super(props);
  }
  
  
  // The component's Local state.
  state = {
    signedIn: false // Local signed-in state.
  };

  // Listen to the Firebase Auth state and set the local state.
  // Listen to change in auth state so it displays the correct UI for when
  // the user is signed in or not.
  componentDidMount() {
    
    this.firebaseUiWidget = firebaseui.auth.AuthUI.getInstance()
                          || new firebaseui.auth.AuthUI(firebaseApp.auth());
    
   // if (this.firebaseUiWidget.isPendingRedirect()) {                 
  //    this.firebaseUiWidget.start('#firebaseui-auth-container', getUiConfig());
  //  }
    
    /*
    firebase.auth().onAuthStateChanged(
        (user) => this.setState({signedIn: !!user})
    );
      */
    let self = this;
    this.unregisterAuthObserver = firebaseApp.auth().onAuthStateChanged(function(user) {
      console.log('user', user)
      self.setState({signedIn: !!user})
      if(!user) {
        // Initialize the FirebaseUI Widget using Firebase.
        
          // The start method will wait until the DOM is loaded to include the FirebaseUI sign-in widget
          // within the element corresponding to the selector specified.
         // self.ui.start('#firebaseui-auth-container', getUiConfig());
          // Auto sign-in for returning users is enabled by default except when prompt is
          // not 'none' in the Google provider custom parameters. To manually disable: ui.disableAutoSignIn();
          //self.ui.disableAutoSignIn(); 
      }
      user ? handleSignedInUser(user) : handleSignedOutUser(firebaseApp, self.firebaseUiWidget);
    });
  }
  
  componentWillUnmount() {
    this.unregisterAuthObserver();
  }

  render() {
    if (!this.state.signedIn) {
      return (
        <div>
          <p>Please sign-in:</p>
          <div id="firebaseui-auth-container"></div>
        </div>
      );
    }
    return (
      <div>
        <p>Welcome {firebaseApp.auth().currentUser.displayName}! You are now signed-in!</p>
        <div id="email"></div>
        <div id="phone"></div>
        <img id="photo" height="100" />
        <a onClick={() => firebaseApp.auth().signOut()}>Sign-out</a>
        <button onClick={() => deleteAccount(firebaseApp)}>Delete account</button>
      </div>
    );
  }
}

