# Used Resources
- https://firebase.googleblog.com/2016/01/the-beginners-guide-to-react-native-and_84.html
- https://community.c9.io/t/support-expo-io-for-native-app-development/16437/6


npm install -g exp
exp login

npm install -g react-native-cli
react-native init GroceryApp


make sure package.json has:
"expo": "^20.0.0",
"react": "16.0.0-alpha.12",
"react-native": "https://github.com/expo/react-native/archive/sdk-20.0.0.tar.gz"

and app.json has:
"expo": {
    "sdkVersion": "25.0.0"
  }
  
  
exp start --tunnel

(install expo app on your phone and scan the qr code)



Or:
exp init my-new-project


Or react-native-web:
- npm install react react-dom react-native-web
- npm install babel-plugin-react-native-web
- see web/webpack.config.js and index.web.js
- add to package.json `"serve": " ./node_modules/.bin/webpack-dev-server -d --config ./web/webpack.config.js --inline --hot --colors --host $IP --public $C9_HOSTNAME"`