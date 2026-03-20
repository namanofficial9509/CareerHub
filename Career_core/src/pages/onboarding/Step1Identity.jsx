import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

const Step1Identity = () => {
    const navigate = useNavigate();
    const { user, userData } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    // State for form fields
    const [formData, setFormData] = useState({
        displayName: '',
        university: '',
        course: '',
        currentYear: ''
    });

    // Load existing data if available
    useEffect(() => {
        if (userData?.onboarding) {
            setFormData(userData.onboarding);
        } else if (user?.displayName) {
            setFormData(prev => ({ ...prev, displayName: user.displayName }));
        }
    }, [user, userData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleContinue = async () => {
        if (!user) return;
        setIsLoading(true);
        try {
            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, {
                "identity.name": formData.displayName,
                "identity.college": formData.university,
                "identity.branch": formData.course,
                "identity.year": formData.currentYear === '1' ? '1st Year' : 
                                 formData.currentYear === '2' ? '2nd Year' :
                                 formData.currentYear === '3' ? '3rd Year' :
                                 formData.currentYear === '4' ? '4th Year' : 'Final Year',
                "onboardingCompleted": false // Not complete yet
            });
            navigate('/onboarding/step-2');
        } catch (error) {
            console.error("Error saving step 1:", error);
            alert("Failed to save. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-8 w-full max-w-lg mx-auto md:max-w-none">
            <div className="text-center">
                <h2 className="text-2xl md:text-3xl font-[800] tracking-tight text-gray-900 mb-2">Tell us about yourself</h2>
                <p className="text-gray-500 text-base md:text-lg">This helps us personalize your learning journey and career recommendations.</p>
            </div>

            <div className="space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 block uppercase tracking-wide">Full Name</label>
                    <div className="relative group">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">person</span>
                        <input
                            type="text"
                            name="displayName"
                            value={formData.displayName}
                            onChange={handleChange}
                            placeholder="e.g. Arjun Sharma"
                            className="w-full h-14 bg-gray-50 border border-gray-200 rounded-2xl pl-12 pr-4 text-gray-900 font-medium placeholder:text-gray-400 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 block uppercase tracking-wide">University</label>
                    <div className="relative group">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">search</span>
                        <input
                            type="text"
                            name="university"
                            value={formData.university}
                            onChange={handleChange}
                            placeholder="e.g. Indian Institute of Technology"
                            className="w-full h-14 bg-gray-50 border border-gray-200 rounded-2xl pl-12 pr-4 text-gray-900 font-medium placeholder:text-gray-400 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 block uppercase tracking-wide">Course</label>
                        <div className="relative group">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">school</span>
                            <input
                                type="text"
                                name="course"
                                value={formData.course}
                                onChange={handleChange}
                                placeholder="e.g. B.Tech CS"
                                className="w-full h-14 bg-gray-50 border border-gray-200 rounded-2xl pl-12 pr-4 text-gray-900 font-medium placeholder:text-gray-400 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 block uppercase tracking-wide">Current Year</label>
                        <div className="relative group">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">calendar_today</span>
                            <select
                                name="currentYear"
                                value={formData.currentYear}
                                onChange={handleChange}
                                className="w-full h-14 bg-gray-50 border border-gray-200 rounded-2xl pl-12 pr-10 text-gray-900 font-medium outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all appearance-none cursor-pointer"
                            >
                                <option value="" disabled>Select Year</option>
                                <option value="1">1st Year</option>
                                <option value="2">2nd Year</option>
                                <option value="3">3rd Year</option>
                                <option value="4">4th Year</option>
                                <option value="5">Final Year / Other</option>
                            </select>
                            <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">expand_more</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="pt-4">
                <button
                    onClick={handleContinue}
                    disabled={isLoading}
                    className="w-full h-14 bg-primary text-white text-lg font-bold rounded-2xl shadow-xl shadow-primary/30 hover:bg-indigo-600 hover:scale-[1.01] hover:shadow-2xl hover:shadow-primary/40 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Saving...' : 'Continue'}
                    {!isLoading && <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>}
                </button>
            </div>

            {/* Step Indicators Preview (Static for visual) */}
            <div className="flex justify-center gap-8 pt-8 opacity-40 grayscale pointer-events-none">
                <div className="flex flex-col items-center gap-2 text-primary">
                    <div className="size-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-[18px]">code</span>
                    </div>
                    <span className="text-[10px] font-bold tracking-wider uppercase">Tech</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <div className="size-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-[18px]">brush</span>
                    </div>
                    <span className="text-[10px] font-bold tracking-wider uppercase">Design</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <div className="size-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-[18px]">campaign</span>
                    </div>
                    <span className="text-[10px] font-bold tracking-wider uppercase">Comm</span>
                </div>
            </div>
        </div>
    );
};

export default Step1Identity;
