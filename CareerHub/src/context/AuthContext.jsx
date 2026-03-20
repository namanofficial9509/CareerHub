import { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, collection, serverTimestamp } from 'firebase/firestore';
import { syncAllPlatformData } from '../lib/platformConnector';

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
                        // Initialize new user with Standardized Student Schema
                        const initialData = {
                            uid: currentUser.uid,
                            email: currentUser.email,
                            createdAt: serverTimestamp(),
                            lastSynced: null,
                            
                            identity: {
                                name: currentUser.displayName || '',
                                photoURL: currentUser.photoURL || '',
                                branch: '',
                                year: '',
                                college: '',
                                batch: ''
                            },
                            
                            social_links: {
                                github: '',
                                leetcode: '',
                                linkedin: '',
                                codeforces: ''
                            },
                            
                            career_dna: {
                                target_role: 'Software Engineer',
                                skill_level: 'Beginner',
                                preferred_industry: '',
                                learning_goal: ''
                            },
                            
                            metrics: {
                                total_projects: 0,
                                github_stars: 0,
                                leetcode_solved: 0,
                                cgpa: 0,
                                hackathon_wins: 0,
                                streak: 0,
                                active_days: 1,
                                top_languages: []
                            }
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

    const updateIntelligenceSignal = async (path, value, isIncrement = false) => {
        if (!user) return;
        try {
            const docRef = doc(db, "users", user.uid);
            const updateObj = {};
            
            if (isIncrement) {
                const currentVal = path.split('.').reduce((obj, key) => obj?.[key], userData) || 0;
                updateObj[path] = currentVal + (typeof value === 'number' ? value : 1);
            } else {
                updateObj[path] = value;
            }

            await updateDoc(docRef, updateObj);
            
            // Fix: ensure deep object updates work locally for immediate UI feedback
            setUserData(prev => {
                if (!prev) return prev;
                // Deep clone to avoid mutating state directly
                const newData = JSON.parse(JSON.stringify(prev)); 
                
                const keys = path.split('.');
                let current = newData;
                // Navigate to the deepest object
                for (let i = 0; i < keys.length - 1; i++) {
                    if (!current[keys[i]]) current[keys[i]] = {};
                    current = current[keys[i]];
                }
                
                // If the value being set is an object itself, merge it rather than replacing entirely (Optional, but safer for basicProfile)
                const lastKey = keys[keys.length - 1];
                if (typeof value === 'object' && value !== null && !Array.isArray(value) && !isIncrement) {
                    current[lastKey] = { ...(current[lastKey] || {}), ...value };
                } else {
                    current[lastKey] = updateObj[path]; // For primitive values or incremented numbers
                }
                
                return newData;
            });
        } catch (error) {
            console.error("Signal update error:", error);
        }
    };

    // Background Sync Logic
    useEffect(() => {
        if (!user || !userData) return;
        
        const github = userData.social_links?.github;
        const leetcode = userData.social_links?.leetcode;
        
        if (!github && !leetcode) return;
        
        const lastSynced = userData.lastSynced;
        const ONE_HOUR = 3600000;
        
        // Auto-sync if never synced or synced > 1 hour ago
        if (!lastSynced || (Date.now() - new Date(lastSynced).getTime() > ONE_HOUR)) {
            console.log("🔄 [Intelligence] Triggering background sync...");
            syncPlatformData();
        }
    }, [user, !!userData]);

    // Debug log requested by user to verify data flows
    useEffect(() => {
        if (userData) {
            console.log("🔥 [DEBUG] Current User Data:", userData);
        }
    }, [userData]);

    const syncPlatformData = async () => {
        if (!user || !userData) return;
        
        try {
            const links = {
                github: userData.social_links?.github,
                leetcode: userData.social_links?.leetcode
            };
            
            const stats = await syncAllPlatformData(links);
            
            if (stats.github) {
                await updateIntelligenceSignal('metrics.github_stars', stats.github.totalStars);
                await updateIntelligenceSignal('metrics.total_projects', stats.github.publicRepos);
                if (stats.github.topLanguages) {
                    await updateIntelligenceSignal('metrics.top_languages', stats.github.topLanguages);
                }
            }
            
            if (stats.leetcode) {
                await updateIntelligenceSignal('metrics.leetcode_solved', stats.leetcode.totalSolved);
            }

            // Update lastSynced timestamp
            await updateIntelligenceSignal('lastSynced', new Date().toISOString());
            
            return stats;
        } catch (error) {
            console.error("Sync Error:", error);
            throw error;
        }
    };

    const value = {
        user,
        userData,
        loading,
        updateIntelligenceSignal,
        syncPlatformData
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
