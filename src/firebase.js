import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBG8B2zWRZp3eOf31QlZwolmkL1YHh1t0Q",
    authDomain: "oogway-app.firebaseapp.com",
    projectId: "oogway-app",
    storageBucket: "oogway-app.appspot.com",
    messagingSenderId: "391111841510",
    appId: "1:391111841510:web:83e721e35d50989674cd27",
    measurementId: "G-ZQ6S52K7TD"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();
const storage = firebaseApp.storage();

export {auth, provider, storage};
export default db;
