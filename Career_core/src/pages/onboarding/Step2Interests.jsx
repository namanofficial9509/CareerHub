import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

const Step2Interests = () => {
    const navigate = useNavigate();
    const { user, userData } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    // State
    const [selectedPath, setSelectedPath] = useState(null);
    const [selectedSubjects, setSelectedSubjects] = useState([]);

    // Load existing data
    useEffect(() => {
        if (userData?.onboarding) {
            if (userData.onboarding.careerpath) setSelectedPath(userData.onboarding.careerpath);
            if (userData.onboarding.subjects) setSelectedSubjects(userData.onboarding.subjects);
        }
    }, [userData]);

    const careerPaths = [
        { id: 'tech', label: 'Technology', icon: 'terminal' },
        { id: 'design', label: 'Design/Creative', icon: 'brush' },
        { id: 'business', label: 'Management', icon: 'trending_up' },
        { id: 'govt', label: 'Govt Exams', icon: 'gavel' },
        { id: 'research', label: 'Research', icon: 'science' },
        { id: 'undecided', label: 'Undecided', icon: 'explore' },
    ];

    const subjects = [
        'Programming', 'Mathematics', 'Economics', 'Psychology',
        'Writing', 'Biology', 'Data Analysis', 'Art', 'History'
    ];

    const toggleSubject = (subject) => {
        if (selectedSubjects.includes(subject)) {
            setSelectedSubjects(selectedSubjects.filter(s => s !== subject));
        } else {
            if (selectedSubjects.length < 5) {
                setSelectedSubjects([...selectedSubjects, subject]);
            }
        }
    };

    const handleContinue = async () => {
        if (!user) return;
        setIsLoading(true);
        try {
            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, {
                "onboarding.careerpath": selectedPath,
                "onboarding.subjects": selectedSubjects
            });
            navigate('/onboarding/step-3');
        } catch (error) {
            console.error("Error saving step 2:", error);
            alert("Failed to save. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-8 w-full max-w-lg mx-auto md:max-w-none">
            <div className="text-center">
                <h2 className="text-2xl md:text-3xl font-[800] tracking-tight text-gray-900 mb-2">What interests you?</h2>
                <p className="text-gray-500 text-base md:text-lg">Select a general direction and topics you enjoy.</p>
            </div>

            <div className="space-y-6">
                {/* Career Paths Grid */}
                <div>
                    <label className="text-sm font-bold text-gray-700 block uppercase tracking-wide mb-3">Career Direction</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {careerPaths.map((path) => (
                            <button
                                key={path.id}
                                onClick={() => setSelectedPath(path.id)}
                                className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-200 group ${selectedPath === path.id
                                    ? 'border-primary bg-primary/5 shadow-md shadow-primary/10'
                                    : 'border-gray-100 bg-gray-50 hover:border-gray-200 hover:bg-gray-100'
                                    }`}
                            >
                                <div className={`size-10 rounded-full flex items-center justify-center mb-3 transition-colors ${selectedPath === path.id ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500 group-hover:bg-gray-300'
                                    }`}>
                                    <span className="material-symbols-outlined text-[20px]">{path.icon}</span>
                                </div>
                                <span className={`text-sm font-bold ${selectedPath === path.id ? 'text-primary' : 'text-gray-600'
                                    }`}>{path.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Subjects Chips */}
                <div>
                    <label className="text-sm font-bold text-gray-700 block uppercase tracking-wide mb-3">Subjects you enjoy (Max 5)</label>
                    <div className="flex flex-wrap gap-2">
                        {subjects.map((subject) => (
                            <button
                                key={subject}
                                onClick={() => toggleSubject(subject)}
                                className={`px-4 py-2 rounded-full text-sm font-bold border transition-all ${selectedSubjects.includes(subject)
                                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-600/20'
                                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                    }`}
                            >
                                {subject}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="pt-4 flex gap-4">
                <button
                    onClick={() => navigate('/onboarding/step-1')}
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

export default Step2Interests;
