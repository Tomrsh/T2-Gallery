// Replace with your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyC4S-WRBFerZmnub3yuY131CpPvfql_NCY",
  authDomain: "t2upload.firebaseapp.com",
  databaseURL: "https://t2upload-default-rtdb.firebaseio.com",
  projectId: "t2upload",
  storageBucket: "t2upload.appspot.com",
  messagingSenderId: "1000887477924",
  appId: "1:1000887477924:web:feba016b5699e9652ea831",
  measurementId: "G-RNGDJJ1TJ8"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Firebase services
const storage = firebase.storage();
const database = firebase.database();




