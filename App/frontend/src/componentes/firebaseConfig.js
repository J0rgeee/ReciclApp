// src/componentes/FirebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBXkq7HEwbRpNJSN7I92JsCgjZsV5pw-8o",
  authDomain: "reciclapp-2129e.firebaseapp.com",
  projectId: "reciclapp-2129e",
  storageBucket: "reciclapp-2129e.appspot.com",
  messagingSenderId: "746201262698",
  appId: "1:746201262698:web:d07b746c1492aa778d7813"
};

// Inicializa la aplicación Firebase
const app = initializeApp(firebaseConfig);

// Inicializa la autenticación
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
