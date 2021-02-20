import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/firestore';

// firebase init - add your own config here
const firebaseConfig = {
  apiKey: 'AIzaSyBaybEzjRcudgE9_q9HsMOBrCzNmRPLi7o',
  authDomain: 'albumer-cdb7c.firebaseapp.com',
  databaseURL: 'https://albumer-cdb7c.firebaseio.com',
  projectId: 'albumer-cdb7c',
  storageBucket: 'albumer-cdb7c.appspot.com',
  messagingSenderId: '174570421104',
  appId: '1:174570421104:web:16e160c2e9bcc60c46adb5',
  measurementId: 'G-J73X7VG5NB',
};
firebase.initializeApp(firebaseConfig);

// utils
const db = firebase.database();
const auth = firebase.auth();
const functionsServer = 'https://us-central1-albumer-cdb7c.cloudfunctions.net';
// Actual 'https://us-central1-albumer-cdb7c.cloudfunctions.net'
// Local 'http://localhost:5001/albumer-cdb7c/us-central1';
// export utils/refs
export { db, auth, functionsServer };
