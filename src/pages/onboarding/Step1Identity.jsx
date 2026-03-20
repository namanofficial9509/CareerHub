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
        <div className="flex flex-col gap-10 w-full max-w-lg mx-auto md:max-w-none relative">
            {/* Header Section */}
            <div className="flex justify-between items-start">
                <div className="max-w-sm">
                    <h2 className="text-[28px] font-[800] tracking-tight text-gray-900 mb-3 leading-tight">Tell us about yourself</h2>
                    <p className="text-gray-500 text-[15px] leading-relaxed">This helps us personalize your learning journey, recommendations and career roadmap.</p>
                </div>
                {/* Avatar */}
                <div className="relative shrink-0 hidden sm:block">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-[#e8ecef] flex items-end justify-center">
                        <img src="https://api.dicebear.com/7.x/open-peeps/svg?seed=Felix&face=smile&shading=1" alt="Avatar" className="w-14 h-14 object-cover" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm border border-gray-100">
                        <span className="material-symbols-outlined text-[#3b28cc] text-[14px]">auto_awesome</span>
                    </div>
                </div>
            </div>

            <div className="space-y-8">
                {/* Basic Details Section */}
                <div className="space-y-4">
                    <label className="text-[11px] font-[800] text-gray-500 block uppercase tracking-widest">Basic Details</label>
                    <div className="space-y-4">
                        <div className="relative group">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 transition-colors">person</span>
                            <input
                                type="text"
                                name="displayName"
                                value={formData.displayName}
                                onChange={handleChange}
                                placeholder="e.g. Arjun Sharma"
                                className="w-full h-[52px] bg-[#f4f5f7] rounded-xl pl-12 pr-4 text-gray-900 font-medium placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-[#3b28cc]/20 transition-all border-none"
                            />
                        </div>
                        <div className="relative group">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 transition-colors">search</span>
                            <input
                                type="text"
                                name="university"
                                value={formData.university}
                                onChange={handleChange}
                                placeholder="Search your university"
                                className="w-full h-[52px] bg-[#f4f5f7] rounded-xl pl-12 pr-4 text-gray-900 font-medium placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-[#3b28cc]/20 transition-all border-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Academic Info Section */}
                <div className="space-y-4">
                    <label className="text-[11px] font-[800] text-gray-500 block uppercase tracking-widest">Academic Info</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative group">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 transition-colors">school</span>
                            <input
                                type="text"
                                name="course"
                                value={formData.course}
                                onChange={handleChange}
                                placeholder="e.g. B.Tech Computer Science"
                                className="w-full h-[52px] bg-[#f4f5f7] rounded-xl pl-12 pr-4 text-gray-900 font-[500] placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-[#3b28cc]/20 transition-all border-none"
                            />
                        </div>
                        <div className="relative group">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 transition-colors">calendar_today</span>
                            <select
                                name="currentYear"
                                value={formData.currentYear}
                                onChange={handleChange}
                                className="w-full h-[52px] bg-[#f4f5f7] rounded-xl pl-12 pr-10 text-gray-900 font-[500] outline-none focus:ring-2 focus:ring-[#3b28cc]/20 transition-all appearance-none cursor-pointer border-none"
                            >
                                <option value="" disabled>Current Year</option>
                                <option value="1">1st Year</option>
                                <option value="2">2nd Year</option>
                                <option value="3">3rd Year</option>
                                <option value="4">4th Year</option>
                                <option value="5">Final Year / Other</option>
                            </select>
                            <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">expand_more</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* AI Insight Box */}
            <div className="bg-[#eeebf9] rounded-2xl p-4 flex gap-4 items-start pb-6">
                <div className="shrink-0 size-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <span className="material-symbols-outlined text-[#3b28cc] text-[18px]">lightbulb</span>
                </div>
                <div className="font-[600] text-[#3b28cc] text-[14px] pt-1">
                    AI Insight: Students who complete onboarding get 2x better roadmap accuracy.
                </div>
            </div>

            {/* Continue Button */}
            <div className="pt-2">
                <button
                    onClick={handleContinue}
                    disabled={isLoading}
                    className="w-full h-[60px] bg-[#4b3ccb] text-white text-[16px] font-[600] rounded-2xl shadow-xl shadow-[#4b3ccb]/30 hover:bg-[#3b28cc] hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Saving...' : 'Continue'}
                    {!isLoading && <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>}
                </button>
            </div>
        </div>
    );
};

export default Step1Identity;
