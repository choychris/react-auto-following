import firebase from 'firebase';

var config = {
    apiKey: "FIREBASE_API_KEY",
    authDomain: "FIREBASE_DOMAIN",
    databaseURL: "FIREBASE_DB_URL",
    projectId: "FIRBASE_PROJECTJD",
    storageBucket: "FIREBASE_STORAGE",
    messagingSenderId: "FIREBASE_MESGID",
  };

export const firebaseApp = firebase.initializeApp(config);
export const firebaseAuthen = firebase.auth();
export const firebasedb = firebase.database();