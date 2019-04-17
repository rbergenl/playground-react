# Used Resources
- Project structure:
  - https://github.com/fongandrew/firebase-tsx-boilerplate/
  - https://github.com/firebase/firebaseui-web-react/tree/master/example
  - https://github.com/ionic-team/ionic-pwa-toolkit
  - https://github.com/facebook/create-react-app/tree/master/packages/react-scripts/template
- Typescript:
  - https://www.typescriptlang.org/docs/handbook/declaration-files/templates/module-function-d-ts.html
- React Router
  - https://reacttraining.com/react-router/core/guides/philosophy
- Firebase Auth
  - https://github.com/firebase/firebaseui-web-react
  - https://github.com/firebase/firebaseui-web/blob/master/README.md
- Push / Database
  - https://developers.google.com/web/ilt/pwa/lab-integrating-web-push
  - https://firebase.google.com/docs/cloud-messaging/js/first-message
  - https://css-tricks.com/implementing-push-notifications-back-end/
- Web Components
  - https://github.com/shawnbot/custom-elements
- Google Payments
  - https://developers.google.com/web/fundamentals/payments/deep-dive-into-payment-request
  - https://developers.google.com/web/fundamentals/codelabs/payment-request-api/
- Redux (Store)
  - https://github.com/prescottprue/react-redux-firebase
- Firebase Storage (image upload)
- Device API's
  - https://developers.google.com/web/fundamentals/
  - https://developers.google.com/web/funredamentals/media/recording-audio/

# Prerequisites
- Have a Google account
- Have a Github account and a repository created
- Login to Cloud9 with your Github account and start a workspace attached to the repository
- Create a project in console.firebase.google.com (and enable Firestore in the Database section)

# Setup Node Project
- Run `$ npm init --yes`
- Run `$ touch .editorconfig` and add the following lines of code:
```
indent_style = space
indent_size = 2
```

# Setup Firebase project with hosting
- Run `$ npm install -g firebase-tools`
- Run `$ firebase login --no-localhost`
- Run `$ firebase init` and select all options (firestore, functions, hosting, database, etc..) and accept all defaults (but choose typescript and dont install dependencies)
- Run `$ npm --prefix ./functions install` (to now outside the firebase init do the installation of dependencies in the just generated functions folder)
- Run `$ firebase serve --port $PORT --host $IP` to check the preview locally (do CTRL+C to stop)
- Run `$ firebase deploy`

# Create, test and serve a first function
- Use the file `https://github.com/firebase/functions-samples/blob/master/quickstarts/uppercase-firestore/functions/index.js`
- Run `$ npm --prefix ./functions serve` and in another terminal, run `$ curl <url>`
- Run `$ npm --prefix ./functions shell` and execute: addMessage.get('/?text=test'); then execute: makeUppercase({original: 'test2'}, {params:{documentId:'tJ2MyOHLkDs9Fd0RGH0n'}});
- Run `$ firebase deploy --only functions`

# Add Webpack support
- run `$ npm install --save-dev webpack webpack-cli webpack-dev-server`.
- add to package.json the following script `"start": "webpack-dev-server --mode development --host $IP --public $C9_HOSTNAME --content-base public --output-public-path build --open"`.
- create a file `src/index.js` and cut/paste the `DOMContentLoaded` section into this file.
- in `public\index.html` replace each script source `/__/firebase/` with `https://www.gstatic.com/firebasejs/` and remove the `defer` from the script tag.
- go to the firebase console and get the javscript config snippet for initializing the web app. Place this `<script>` section just below the firebase scripts.
- also add `<script src="build/main.js"></script>` to the `index.html` file.
- run `$ npm start` and see the browser window display the features it loaded from the Firebase SDK.

# Add ES6 support
- run `$ npm install --save-dev babel-core babel-loader babel-preset-env`.
- add a `.babelrc` file with the following configuration:

```json
{
    "presets": [
        "env"
    ]
}
```

- create a file `webpack.config.js` with the following configuration:

```javascript
module.exports = {
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader'
				}
			}
		]
	}
}
```

- add to `src/index.js` the following ES6 code:

```javascript
const arr = [1, 2, 3];
const iAmJavascriptES6 = () => console.log(...arr);
window.iAmJavascriptES6 = iAmJavascriptES6;
```

- run `$ npm start` and enter in the browser console the command `iAmJavascriptES6()`.

# Add React support
- run the command `$ npm install --save-dev react react-dom babel-preset-react`.
- add to the `.babelrc` file the option `"react"` to the `"presets"` array.
- in the file `public/index.html` move the script tag from the head to the bottom of the body so that the code will get loaded once the document content is loaded.
- in the file `public/index.html` add a container element (to which child elements can be appended) above the just moved script tag `<div id="root"></div>`.
- replace the code in `src/index.js` with the following code:

```javascript
import React from 'react';
import ReactDOM from 'react-dom';

ReactDOM.render(
  <h1>Hello React!</h1>,
  document.getElementById('root')
);
```

- run `$ npm start` and see the text 'Hello React!' being displayed

# Add Typescript support
- run `$ npm install --save-dev typescript ts-loader @types/{react,react-dom}`.
- run `$ ./node_modules/.bin/tsc --init`.
- modify the just created `tsconfig.json` by enabling the flag `"jsx": "react"`.
- also add `"exclude": [ "functions"]` to the bottom of the json file.
- add the extensions and ts-loader to `webpack.config.js` until it reflects the following code:

```javascript
module.exports = {
	resolve: {
		extensions: ['.ts', '.tsx', '.js']
	},
	module: {
		rules: [
			{
				test: /\.ts(x?)$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'babel-loader'
					},
					{
						loader: 'ts-loader'
					}
				]
			},
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader'
				}
			}
		]
	}
}
```

- create a jsx file `src/components/component.tsx` with the following code:

```javascript
import React from 'react';

export class AabComponent extends React.Component {
	render() {
		return <h1>Hello Component!</h1>;
	}
}
```

- load the newly created component in `index.js` by adding `import { MyComponent } from './components/my-component';` and replacing `<h1>Hello React!</h1>` with `<MyComponent />`.
- run `$ npm start` and see the text 'Hello Component!'.

# Build project
- add to package.json the following script `"build": "webpack --mode production --output-path public/build src/main.tsx"`.
- add to package.json the following script `"deploy": "npm run build && firebase deploy --only hosting"`.

# Add Routing
- `npm install --save react-router-dom`
- add to `my-app.tsx` the line `import { BrowserRouter as Router, Link, Route } from 'react-router-dom';`
- create a simple component called `Dashboard`.
- add:
```javascript
<Router>
  <div>
    <nav>
      <Link to="/dashboard">Dashboard</Link>
    </nav>
    <div>
      <Route path="/dashboard" component={Dashboard}/>
    </div>
  </div>
</Router>
```
- add to webpack.config.json webpack-dev-server: historyApiFallback: true

# Refactor Firebase
- `$npm install firebase`
- create `firebaseApp.js` and `types/firebaseApp.d.ts`
- add to webpack.config.js resolve alias: `firebaseApp$: path.join(__dirname, 'src/firebaseApp')`

# Authentication
`https://console.developers.google.com/apis/credentials?project=my-pwa-4cce7`
`https://console.firebase.google.com/project/my-pwa-4cce7/authentication/providers`

<meta name="google-site-verification" content="b4h49rPs65kOjBCKC2ulEOhZ1AziLM7_3WvNI01o2NI" />

tsconfig.json
"noImplicitAny": false,
"strictNullChecks": false,

SASS support:
check: https://github.com/webpack-contrib/mini-css-extract-plugin

npm install --save-dev node-sass
npm install --save-dev extract-text-webpack-plugin autoprefixer
npm install --save-dev style-loader css-loader postcss-loader sass-loader
npm i -D extract-text-webpack-plugin@next

# Redux to store state (e.g. login)
- 


# Turn it into a Progressive Web App
- add a file `public/manifest.json` with the following code:
```json
{
  "name": "My App",
  "short_name": "MyApp",
  "start_url": "/",
  "display": "standalone",
  "icons": [{
    "src": "assets/icon/icon.png",
    "sizes": "512x512",
    "type": "image/png"
  }],
  "background_color": "#16161d",
  "theme_color": "#16161d"
}
```
- upload an `icon.png` to `public/assets/icon`
- add the following tag just below the meta tags in the `public/index.html` file `<link rel="manifest" href="/manifest.json">`.
- run `$ npm run deploy` and view the webpage on the hosting url (in Android you can now add the webpage to the Homescreen as an app).

## Service Worker (offline capability)
- npm install workbox-webpack-plugin --save-dev

- add to `index.js` the following code:
```javascript
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js').then(function(registration) {
      // Registration was successful
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, function(err) {
      // registration failed :(
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}
```
- Go to `chrome://inspect/#service-workers`.
```
self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push Received.');
  console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);

  const title = 'Push Notification';
  const options = {
    body: `${event.data.text()}`,
    icon: 'images/icon.png',
    badge: 'images/badge.png'
  };

  event.waitUntil(self.registration.showNotification(title, options));
});
```

## Push from Google PWA Training
- git clone https://github.com/google-developer-training/pwa-training-labs.git
- manifest.json will in "gcm_sender_id": "347308707337" from Firebase settings cloud messaging
- npm install http-server -g
- npm install web-push -g
- web-push generate-vapid-keys [--json]
- fill in the public and private keys in node/main.js and js/main.js
- http-server -p $PORT -a $IP -c 0
- open the browser en click subscribe
- replace subscription object in node/main.js
- node node/main.js
- or run `curl "ENDPOINT_URL" --request POST --header "TTL: 60" --header "Content-Length: 0" --header "Authorization: key=SERVER_KEY"`
```
curl -X POST -H "Authorization: key=YOUR_SERVER_KEY" -H "Content-Type: application/json" -d '{
  "notification": {
    "title": "Portugal vs. Denmark",
    "body": "5 to 1",
    "icon": "firebase-logo.png",
    "click_action": "http://localhost:8081"
  },
  "to": "dy_7ZoEHQ7o:APA91bHHilzlBKQbu9zEP2FBo-eBjdU3yb33JpXsLJeenJxWUBLVmiSjoveisrb1ygi-0d5vljXZ-i3h4Cc2VEgKW92ZLKXUp5cVYHLNCnnlKin6IWgtrJOQ5W51RN4kweu0gPRtVUAm"
}' "https://fcm.googleapis.com/fcm/send"
```


## Push Notifactions

## GeoLocation and Camera (QR)

## Firebase Storage


## Config for Development and Production
- add to `tsconfig.json` "typeRoots": ["./types"],
- add a folder `src/types` with `config.d.ts`
- add a folder `src/config` with a file `development.js`.
- add `resolve:{ alias: {
      // Special config path based on environment
      config$: path.join(__dirname, 'src/config', NODE_ENV)
    } },` to `webpack.config.js`.
    
    
# Development Quality
## Unit Testing

## E2E Cross-Device/Browser Testing

