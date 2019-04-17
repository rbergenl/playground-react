import React from 'react';
import * as Config from 'config';

import {firebaseApp} from 'firebaseApp';

import { resetUI, appendMessage, showToken, setTokenSentToServer, sendTokenToServer } from './settings/notifications';

export class SettingsScreen extends React.Component {
    private firebase: any;
    private messaging: any;
  
    constructor(props) {
        super(props);
        
        this.firebase = firebaseApp;
        this.messaging = this.firebase.messaging();
        
        // This binding is necessary to make `this` work in the callback
        this.deleteToken = this.deleteToken.bind(this);
        this.requestPermission = this.requestPermission.bind(this);
    }
    
    deleteToken() {
        let self = this;
        // Delete Instance ID token.
        // [START delete_token]
        self.messaging.getToken()
        .then(function(currentToken) {
          self.messaging.deleteToken(currentToken)
          .then(function() {
            console.log('Token deleted.');
            setTokenSentToServer(false);
            // [START_EXCLUDE]
            // Once token is deleted update UI.
            resetUI(self.messaging);
            // [END_EXCLUDE]
          })
          .catch(function(err) {
            console.log('Unable to delete token. ', err);
          });
          // [END delete_token]
        })
        .catch(function(err) {
          console.log('Error retrieving Instance ID token. ', err);
          showToken('Error retrieving Instance ID token. ');
        });
    }
    
    requestPermission() {
        let self = this;
        console.log('Requesting permission...');
        // [START request_permission]
        self.messaging.requestPermission()
        .then(function() {
          console.log('Notification permission granted.');
          // TODO(developer): Retrieve an Instance ID token for use with FCM.
          // [START_EXCLUDE]
          // In many cases once an app has been granted notification permission, it
          // should update its UI reflecting this.
          resetUI(self.messaging);
          // [END_EXCLUDE]
        })
        .catch(function(err) {
          console.log('Unable to get permission to notify.', err);
        });
        // [END request_permission]
    }
    
    componentDidMount() {

        let self = this;

        resetUI(self.messaging);

        // [START refresh_token]
        // Callback fired if Instance ID token is updated.
        self.messaging.onTokenRefresh(function() {
          self.messaging.getToken()
          .then(function(refreshedToken) {
            console.log('Token refreshed.');
            // Indicate that the new Instance ID token has not yet been sent to the
            // app server.
            setTokenSentToServer(false);
            // Send Instance ID token to app server.
            sendTokenToServer(refreshedToken);
            // [START_EXCLUDE]
            // Display new Instance ID token and clear UI of all previous messages.
            resetUI(self.messaging);
            // [END_EXCLUDE]
          })
          .catch(function(err) {
            console.log('Unable to retrieve refreshed token ', err);
            showToken('Unable to retrieve refreshed token ');
          });
        });
        // [END refresh_token]
                    
          // [START receive_message]
          // Handle incoming messages. Called when:
          // - a message is received while the app has focus
          // - the user clicks on an app notification created by a sevice worker
          //   `messaging.setBackgroundMessageHandler` handler.
          self.messaging.onMessage(function(payload) {
            console.log("Message received. ", payload);
            // [START_EXCLUDE]
            // Update the UI to include the received message.
            appendMessage(payload);
            // [END_EXCLUDE]
          });
          // [END receive_message]
  
    }
    
    render() {
        return(<div className="mdl-layout__content mdl-color--grey-100">
                <div className="mdl-cell mdl-cell--12-col mdl-cell--12-col-tablet mdl-grid">
                    {/* Container for the Table of content */}
                  <div className="mdl-card mdl-shadow--2dp mdl-cell mdl-cell--12-col mdl-cell--12-col-tablet mdl-cell--12-col-desktop">
                    <div className="mdl-card__supporting-text mdl-color-text--grey-600">
                      {/* div to display the generated Instance ID token */}
                      <div id="token_div" style={{display: 'none'}}>
                        <h4>Instance ID Token</h4>
                        <p id="token" style={{wordBreak: 'break-all'}}></p>
                        <button id="delete-token" onClick={this.deleteToken} className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored">Delete Token</button>
                      </div>
                      {/* div to display the UI to allow the request for permission to
                           notify the user. This is shown if the app has not yet been
                           granted permission to notify. */}
                      <div id="permission_div" style={{display: 'none'}}>
                        <h4>Needs Permission</h4>
                        <p id="token"></p>
                        <button id="request-permission" onClick={this.requestPermission} className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored">Request Permission</button>
                      </div>
                      {/* div to display messages received by this app. */}
                      <div id="messages"></div>
                    </div>
                  </div>
                </div>
              </div>);
    }
}
