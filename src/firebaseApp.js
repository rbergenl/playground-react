// Firebase
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/messaging';

// Get the Firebase config from the auto generated file.
import * as Config from 'config';

// Initialize Firebase
const firebaseApp = firebase.initializeApp(Config.firebase);

// Retrieve Firebase Messaging object.
const messaging = firebaseApp.messaging();

module.exports = {
    firebaseApp,
    messaging
}
