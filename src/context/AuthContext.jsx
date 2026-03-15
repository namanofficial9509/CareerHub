import { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                try {
                    // Fetch user data from Firestore
                    const docRef = doc(db, "users", currentUser.uid);
                    const docSnap = await getDoc(docRef);

                    if (docSnap.exists()) {
                        setUserData(docSnap.data());
                    } else {
                        // Initialize new user if not exists
                        const initialData = {
                            email: currentUser.email,
                            displayName: currentUser.displayName,
                            photoURL: currentUser.photoURL,
                            createdAt: new Date().toISOString(),
                        };
                        await setDoc(docRef, initialData);
                        setUserData(initialData);
                    }
                } catch (error) {
                    console.error("Firebase error:", error);
                    // Still allow the app to continue even if Firestore fails
                    setUserData({
                        email: currentUser.email,
                        displayName: currentUser.displayName,
                        photoURL: currentUser.photoURL,
                    });
                }
            } else {
                setUserData(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const value = {
        user,
        userData,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
