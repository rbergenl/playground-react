// React core
import React from 'react';
import ReactDOM from 'react-dom';

// SCSS entry point
import './style/index.scss';

// Service Worker
import registerServiceWorker from './registerServiceWorker';

// The Splash Page containing the login UI.
import { MyApp } from './components/my-app';

// Load the app in the browser.
ReactDOM.render(<MyApp/>, document.getElementsByTagName('my-app')[0]);

// Register service worker
registerServiceWorker();
