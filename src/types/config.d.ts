/*
  Custom type def for config options
*/
declare module "config" {
  var config: {
    production: boolean;
    firebase: object;
    firebasePublicVapidKey?: string;
    CLIENT_ID?: string;
  };
  export = config;
}