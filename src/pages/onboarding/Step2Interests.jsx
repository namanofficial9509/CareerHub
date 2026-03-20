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

    // Load existing data
    useEffect(() => {
        if (userData?.onboarding?.careerpath) {
            setSelectedPath(userData.onboarding.careerpath);
        }
    }, [userData]);

    const careerPaths = [
        {
            id: 'tech',
            title: 'Digital & Technology\nCareers',
            desc: 'Software development, AI, Data Science, UI/UX, Product and Cloud roles.',
            icon: 'desktop_windows'
        },
        {
            id: 'business',
            title: 'Business &\nManagement Careers',
            desc: 'Marketing, Finance, Consulting, Strategy and Operations roles.',
            icon: 'insights'
        },
        {
            id: 'engineering',
            title: 'Core Engineering\nCareers',
            desc: 'Mechanical, Civil, Electrical and Industrial technical roles.',
            icon: 'precision_manufacturing'
        },
        {
            id: 'creative',
            title: 'Creative & Media\nCareers',
            desc: 'Design, content creation, branding and visual storytelling.',
            icon: 'palette'
        }
    ];

    const handleContinue = async (pathId) => {
        if (!user) return;
        setIsLoading(true);
        try {
            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, {
                "onboarding.careerpath": pathId
            });
            if (pathId === 'tech') {
                navigate('/onboarding/step-2-tech');
            } else if (pathId === 'business') {
                navigate('/onboarding/step-2-business');
            } else if (pathId === 'engineering') {
                navigate('/onboarding/step-2-engineering');
            } else if (pathId === 'creative') {
                navigate('/onboarding/step-2-creative');
            } else {
                navigate('/onboarding/step-3');
            }
        } catch (error) {
            console.error("Error saving step 2:", error);
            alert("Failed to save. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center w-full min-h-[calc(100vh-140px)] pb-24">
            <div className="mb-12 text-center mt-2">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#eeebf9] text-[#3b28cc] text-[10px] font-[800] tracking-widest uppercase mb-6">
                    <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                    Personalized Career Discovery
                </div>
                <h1 className="text-4xl md:text-[44px] font-[800] tracking-tight text-gray-900 mb-4 leading-tight">
                    Choose Your <span className="text-[#3b28cc]">Career</span><br />
                    <span className="text-[#3b28cc]">Direction</span>
                </h1>
                <p className="text-gray-500 text-[15px] md:text-[18px] max-w-[600px] mx-auto leading-relaxed">
                    Select the field you want to grow in. We will personalize your roadmap, challenges, scholarships, and recruiter opportunities.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full px-4 md:px-0">
                {careerPaths.map((path) => (
                    <div
                        key={path.id}
                        onClick={() => setSelectedPath(path.id)}
                        className={`relative flex flex-col p-8 rounded-[28px] border-2 transition-all duration-300 cursor-pointer overflow-hidden ${
                            selectedPath === path.id
                                ? 'border-[#3b28cc] bg-white shadow-[0_8px_30px_-4px_rgba(59,40,204,0.15)] scale-[1.02] z-10'
                                : 'border-gray-100 bg-white hover:border-[#3b28cc]/30 hover:shadow-lg'
                        }`}
                        style={{ minHeight: '340px' }}
                    >
                        {selectedPath === path.id && (
                            <div className="absolute top-6 right-6 size-6 bg-[#3b28cc] rounded-full flex items-center justify-center text-white">
                                <span className="material-symbols-outlined text-[14px] font-bold">check</span>
                            </div>
                        )}
                        
                        <div className={`size-14 rounded-2xl flex items-center justify-center mb-6 transition-colors ${
                            selectedPath === path.id ? 'bg-[#3b28cc] text-white' : 'bg-[#eeebf9] text-[#3b28cc]'
                        }`}>
                            <span className="material-symbols-outlined text-[28px]">{path.icon}</span>
                        </div>
                        
                        <h3 className="text-[20px] font-[800] text-gray-900 mb-3 whitespace-pre-line leading-[1.2]">
                            {path.title}
                        </h3>
                        
                        <p className="text-gray-500 text-[14px] leading-relaxed mb-auto">
                            {path.desc}
                        </p>
                        
                        <div className="mt-8 pt-6">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleContinue(path.id);
                                }}
                                disabled={isLoading}
                                className={`text-[12px] font-[800] tracking-widest uppercase flex items-center gap-2 transition-colors ${
                                    selectedPath === path.id ? 'text-[#3b28cc]' : 'text-[#3b28cc] hover:text-indigo-800'
                                }`}
                            >
                                EXPLORE TRACK {selectedPath === path.id && <span className="material-symbols-outlined text-[16px]">arrow_forward</span>}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Bottom Progress Indicator matching the image */}
            <div className="fixed bottom-0 left-0 right-0 h-20 border-t border-gray-100 flex items-center justify-center gap-16 z-50 bg-[#f9fafb]">
                <div 
                    className="flex items-center flex-col gap-1.5 cursor-pointer opacity-100" 
                    onClick={() => navigate('/onboarding/step-1')}
                >
                    <div className="size-7 bg-[#eeebf9] text-[#3b28cc] rounded flex items-center justify-center text-[13px] font-bold">
                        1
                    </div>
                    <span className="text-[10px] font-[800] tracking-widest text-[#3b28cc] uppercase">Step 1</span>
                </div>
                <div className="flex items-center flex-col gap-1.5 opacity-60">
                    <div className="size-7 bg-gray-400 text-white rounded flex items-center justify-center text-[13px] font-bold">
                        2
                    </div>
                    <span className="text-[10px] font-[800] tracking-widest text-gray-500 uppercase">Step 2</span>
                </div>
            </div>
        </div>
    );
};

export default Step2Interests;
