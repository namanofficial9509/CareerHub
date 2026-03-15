import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/setup#config-object
const firebaseConfig = {
    apiKey: "AIzaSyBjdkfmMnNFvPDgofERCBadWydV377S6kw",
    authDomain: "carrier-ai-hub-2026.firebaseapp.com",
    projectId: "carrier-ai-hub-2026",
    storageBucket: "carrier-ai-hub-2026.firebasestorage.app",
    messagingSenderId: "174995282934",
    appId: "1:174995282934:web:3fe1e3b9479f8edb23c5d7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

import { getFirestore, initializeFirestore } from "firebase/firestore";
import { getAI } from "firebase/ai";

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = initializeFirestore(app, {
    experimentalForceLongPolling: true
});

const ai = getAI(app);

export { auth, googleProvider, db, ai };
