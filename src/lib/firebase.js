// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, onValue, child } from 'firebase/database';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: 'AIzaSyDvD-NmAzIyKclIao147pQ3zCxPoPNdhW8',
	authDomain: 'moveverso.firebaseapp.com',
	databaseURL: 'https://moveverso-default-rtdb.firebaseio.com',
	projectId: 'moveverso',
	storageBucket: 'moveverso.firebasestorage.app',
	messagingSenderId: '589898005458',
	appId: '1:589898005458:web:26f9e32af88ac7c17aa60b'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db, ref, get, onValue, getDatabase, child };
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
