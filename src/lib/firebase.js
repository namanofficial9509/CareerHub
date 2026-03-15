import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/setup#config-object
const firebaseConfig = {
    apiKey: "AIzaSyAI_B6sddcHe0gRhWrkZQVKQYfD0ohP_uQ",
    authDomain: "gdgfirebase-a1b4e.firebaseapp.com",
    projectId: "gdgfirebase-a1b4e",
    storageBucket: "gdgfirebase-a1b4e.firebasestorage.app",
    messagingSenderId: "767904643808",
    appId: "1:767904643808:web:52c4a6c4d11e161ebfee85",
    measurementId: "G-0XLLYQNRZX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

import { getFirestore, initializeFirestore } from "firebase/firestore";

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = initializeFirestore(app, {
    experimentalForceLongPolling: true
});

export { auth, googleProvider, db };
