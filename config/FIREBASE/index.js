// config/FIREBASE.js
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyC71IY8WTFTVekHvNIStMPksODOGreN7EQ",
    authDomain: "geoease-2d55b.firebaseapp.com",
    databaseURL: "https://geoease-2d55b-default-rtdb.firebaseio.com",
    projectId: "geoease-2d55b",
    storageBucket: "geoease-2d55b.appspot.com",
    messagingSenderId: "171630224015",
    appId: "1:171630224015:web:95580cbc4243f3dcb406fa"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);

// Mendapatkan instance database
const database = getDatabase(app);

export { app, database };