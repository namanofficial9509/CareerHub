import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

const Step5Community = () => {
    const navigate = useNavigate();
    const { user, userData } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const [preferences, setPreferences] = useState({
        peerDiscussions: true,
        projectShowcases: true,
        studyGroups: false,
        challenges: true,
        careerStories: false
    });

    const [collabStyle, setCollabStyle] = useState('small_groups');

    // Load existing data
    useEffect(() => {
        if (userData?.onboarding) {
            if (userData.onboarding.preferences) setPreferences(userData.onboarding.preferences);
            if (userData.onboarding.collabStyle) setCollabStyle(userData.onboarding.collabStyle);
        }
    }, [userData]);

    const togglePreference = (key) => {
        setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleFinish = async () => {
        if (!user) return;
        setIsLoading(true);
        try {
            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, {
                "onboarding.preferences": preferences,
                "onboarding.collabStyle": collabStyle,
                "onboardingCompleted": true // Mark onboarding as done
            });
            navigate('/dashboard');
        } catch (error) {
            console.error("Error saving step 5:", error);
            alert("Failed to save. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-8 w-full max-w-lg mx-auto md:max-w-none">
            <div className="text-center">
                <h2 className="text-2xl md:text-3xl font-[800] tracking-tight text-gray-900 mb-2">Community & Preferences</h2>
                <p className="text-gray-500 text-base md:text-lg">Customize your feed and how you want to interact.</p>
            </div>

            <div className="space-y-8">
                {/* Community Feed Preferences */}
                <div>
                    <label className="text-sm font-bold text-gray-700 block uppercase tracking-wide mb-3">I want to see</label>
                    <div className="space-y-3">
                        {[
                            { id: 'peerDiscussions', label: 'Peer Discussions', icon: 'forum' },
                            { id: 'projectShowcases', label: 'Project Showcases', icon: 'rocket_launch' },
                            { id: 'studyGroups', label: 'Study Groups', icon: 'groups' },
                            { id: 'challenges', label: 'Challenges & Hackathons', icon: 'trophy' },
                            { id: 'careerStories', label: 'Career Stories', icon: 'auto_stories' },
                        ].map((item) => (
                            <div
                                key={item.id}
                                onClick={() => togglePreference(item.id)}
                                className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${preferences[item.id]
                                    ? 'bg-indigo-50 border-indigo-200 shadow-sm'
                                    : 'bg-white border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`size-10 rounded-full flex items-center justify-center ${preferences[item.id] ? 'bg-indigo-100 text-primary' : 'bg-gray-100 text-gray-500'
                                        }`}>
                                        <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                                    </div>
                                    <span className={`font-bold ${preferences[item.id] ? 'text-gray-900' : 'text-gray-600'}`}>{item.label}</span>
                                </div>
                                <div className={`size-6 rounded-full border flex items-center justify-center transition-colors ${preferences[item.id] ? 'bg-primary border-primary' : 'border-gray-300'
                                    }`}>
                                    {preferences[item.id] && <span className="material-symbols-outlined text-white text-[16px]">check</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Collaboration Style */}
                <div>
                    <label className="text-sm font-bold text-gray-700 block uppercase tracking-wide mb-3">Collaboration Style</label>
                    <div className="grid grid-cols-3 gap-3">
                        {[
                            { id: 'solo', label: 'Solo Learning' },
                            { id: 'small_groups', label: 'Small Groups' },
                            { id: 'open_community', label: 'Open Community' }
                        ].map((style) => (
                            <button
                                key={style.id}
                                onClick={() => setCollabStyle(style.id)}
                                className={`py-3 px-2 rounded-xl text-xs sm:text-sm font-bold border text-center transition-all ${collabStyle === style.id
                                    ? 'bg-gray-900 text-white border-gray-900 shadow-lg'
                                    : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                                    }`}
                            >
                                {style.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="pt-4 flex gap-4">
                <button
                    onClick={() => navigate('/onboarding/step-4')}
                    disabled={isLoading}
                    className="h-14 px-8 bg-gray-100 text-gray-600 text-lg font-bold rounded-2xl hover:bg-gray-200 transition-all disabled:opacity-70"
                >
                    Back
                </button>
                <button
                    onClick={handleFinish}
                    disabled={isLoading}
                    className="flex-1 h-14 bg-gradient-to-r from-primary to-indigo-600 text-white text-lg font-bold rounded-2xl shadow-xl shadow-primary/30 hover:scale-[1.01] hover:shadow-2xl hover:shadow-primary/40 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Setting up...' : 'Build My Dashboard'}
                    {!isLoading && <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">rocket_launch</span>}
                </button>
            </div>
        </div>
    );
};

export default Step5Community;
