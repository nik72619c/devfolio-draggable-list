import * as firebase from 'firebase';
const config = {
  apiKey: "AIzaSyDruECQbvHqSMBZpbe1k4i90rRkucl7-Ps",
  authDomain: "devfolio-task-1-332ff.firebaseapp.com",
  databaseURL: "https://devfolio-task-1-332ff.firebaseio.com",
  projectId: "devfolio-task-1-332ff",
  storageBucket: "devfolio-task-1-332ff.appspot.com",
  messagingSenderId: "552516000226",
  appId: "1:552516000226:web:8207c210357ed8794781bb",
  measurementId: "G-1D33HJSWFN"
};
firebase.initializeApp(config);
const databaseRef = firebase.database().ref();
export const skillsRef = databaseRef.child("skills")