import React from 'react';

import {firebaseApp} from 'firebaseApp';

import { SignInScreen } from './signin-screen';

export class LandingScreen extends React.Component {
    
    componentDidMount() {
		try {
	      let app = firebaseApp;
	      let features = ['auth', 'database', 'messaging', 'storage'].filter(feature => typeof app[feature] === 'function');
	      document.getElementById('load').innerHTML = `Firebase SDK loaded with ${features.join(', ')}`;
	    } catch (e) {
	      console.error(e);
	      document.getElementById('load').innerHTML = 'Error loading the Firebase SDK, check the console.';
	    }	
	}
	
    render() {
        return(<div>
        	    <div id="message">
			      <h2>Welcome</h2>
			      <h1>Firebase Hosting Setup Complete</h1>
			      <p>You're seeing this because you've successfully setup Firebase Hosting. Now it's time to go build something extraordinary!</p>
			      <a target="_blank" href="https://firebase.google.com/docs/hosting/">Open Hosting Documentation</a>
			      <SignInScreen />
			    </div>
			    <p id="load">Firebase SDK Loading&hellip;</p>
			   </div>)
    }
}