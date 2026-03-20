import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

const Step4Goals = () => {
    const navigate = useNavigate();
    const { user, userData } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    // State
    const [shortTerm, setShortTerm] = useState([]);
    const [longTerm, setLongTerm] = useState(null);
    const [timeCommitment, setTimeCommitment] = useState('medium');

    const shortTermOptions = [
        'Get Internships', 'Build Projects', 'Crack Exams',
        'Explore Fields', 'Improve Skills'
    ];

    const longTermOptions = [
        'Industry Job', 'Higher Studies', 'Research',
        'Entrepreneurship', 'Still Exploring'
    ];

    // Load existing data
    useEffect(() => {
        if (userData?.onboarding) {
            if (userData.onboarding.goalsShortTerm) setShortTerm(userData.onboarding.goalsShortTerm);
            if (userData.onboarding.goalLongTerm) setLongTerm(userData.onboarding.goalLongTerm);
            if (userData.onboarding.timeCommitment) setTimeCommitment(userData.onboarding.timeCommitment);
        }
    }, [userData]);

    const toggleShortTerm = (goal) => {
        if (shortTerm.includes(goal)) {
            setShortTerm(shortTerm.filter(g => g !== goal));
        } else {
            setShortTerm([...shortTerm, goal]);
        }
    };

    const handleContinue = async () => {
        if (!user) return;
        setIsLoading(true);
        try {
            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, {
                "onboarding.goalsShortTerm": shortTerm,
                "career_dna.learning_goal": longTerm,
                "onboarding.timeCommitment": timeCommitment
            });
            navigate('/onboarding/step-5');
        } catch (error) {
            console.error("Error saving step 4:", error);
            alert("Failed to save. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-8 w-full max-w-lg mx-auto md:max-w-none">
            <div className="text-center">
                <h2 className="text-2xl md:text-3xl font-[800] tracking-tight text-gray-900 mb-2">Your Goals</h2>
                <p className="text-gray-500 text-base md:text-lg">Let's turn your ambition into a realistic roadmap.</p>
            </div>

            <div className="space-y-8">
                {/* Short Term Goals */}
                <div>
                    <label className="text-sm font-bold text-gray-700 block uppercase tracking-wide mb-3">Short-term Goal (Select multiple)</label>
                    <div className="flex flex-wrap gap-3">
                        {shortTermOptions.map((goal) => (
                            <button
                                key={goal}
                                onClick={() => toggleShortTerm(goal)}
                                className={`px-5 py-3 rounded-xl text-sm font-bold border transition-all flex items-center gap-2 ${shortTerm.includes(goal)
                                    ? 'bg-indigo-50 border-indigo-600 text-indigo-700 shadow-sm'
                                    : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                                    }`}
                            >
                                {shortTerm.includes(goal) && <span className="material-symbols-outlined text-[18px]">check</span>}
                                {goal}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Long Term Aspiration */}
                <div>
                    <label className="text-sm font-bold text-gray-700 block uppercase tracking-wide mb-3">Long-term Aspiration</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {longTermOptions.map((goal) => (
                            <button
                                key={goal}
                                onClick={() => setLongTerm(goal)}
                                className={`px-4 py-3 rounded-xl text-sm font-bold border text-center transition-all ${longTerm === goal
                                    ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
                                    : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                                    }`}
                            >
                                {goal}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Time Commitment */}
                <div>
                    <label className="text-sm font-bold text-gray-700 block uppercase tracking-wide mb-3">Time Commitment (per week)</label>
                    <div className="flex rounded-xl bg-gray-100 p-1">
                        {[
                            { id: 'low', label: '< 5 hrs' },
                            { id: 'medium', label: '5-10 hrs' },
                            { id: 'high', label: '10+ hrs' }
                        ].map((opt) => (
                            <button
                                key={opt.id}
                                onClick={() => setTimeCommitment(opt.id)}
                                className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${timeCommitment === opt.id
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="pt-4 flex gap-4">
                <button
                    onClick={() => navigate('/onboarding/step-3')}
                    disabled={isLoading}
                    className="h-14 px-8 bg-gray-100 text-gray-600 text-lg font-bold rounded-2xl hover:bg-gray-200 transition-all disabled:opacity-70"
                >
                    Back
                </button>
                <button
                    onClick={handleContinue}
                    disabled={isLoading}
                    className="flex-1 h-14 bg-primary text-white text-lg font-bold rounded-2xl shadow-xl shadow-primary/30 hover:bg-indigo-600 hover:scale-[1.01] hover:shadow-2xl hover:shadow-primary/40 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Saving...' : 'Continue'}
                    {!isLoading && <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>}
                </button>
            </div>
        </div>
    );
};

export default Step4Goals;
