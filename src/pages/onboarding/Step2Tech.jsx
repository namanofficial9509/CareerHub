import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

const Step2Tech = () => {
    const navigate = useNavigate();
    const { user, userData } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    // Form State
    const [stage, setStage] = useState('Student');
    const [goal, setGoal] = useState('');
    const [skills, setSkills] = useState('');
    const [portfolio, setPortfolio] = useState('');
    const [hasProjects, setHasProjects] = useState(true);

    // Load existing data
    useEffect(() => {
        if (userData?.onboarding?.techJourney) {
            const data = userData.onboarding.techJourney;
            if (data.stage) setStage(data.stage);
            if (data.goal) setGoal(data.goal);
            if (data.skills) setSkills(data.skills);
            if (data.portfolio) setPortfolio(data.portfolio);
            if (data.hasProjects !== undefined) setHasProjects(data.hasProjects);
        }
    }, [userData]);

    const handleContinue = async () => {
        if (!user) return;
        setIsLoading(true);
        try {
            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, {
                "onboarding.techJourney": {
                    stage,
                    goal,
                    skills,
                    portfolio,
                    hasProjects
                }
            });
            navigate('/onboarding/step-3');
        } catch (error) {
            console.error("Error saving step 2 tech:", error);
            alert("Failed to save. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const stages = ['Student', 'Graduate', 'Professional'];

    return (
        <div className="flex flex-col items-center w-full min-h-[calc(100vh-140px)] pb-24 text-center">
            {/* Header Area */}
            <div className="mb-4 mt-2">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#eeebf9] text-[#3b28cc] text-[10px] font-[800] tracking-widest uppercase mb-6">
                    <span className="material-symbols-outlined text-[14px]">desktop_windows</span>
                    Digital & Technology Cluster
                </div>
                <h1 className="text-4xl md:text-[44px] font-[800] tracking-tight text-gray-900 mb-6 leading-tight">
                    Tell us about your <span className="text-[#3b28cc]">Tech Journey</span>
                </h1>
                
                {/* Custom Progress Line */}
                <div className="w-full max-w-[400px] mx-auto mt-2">
                    <div className="flex justify-between items-center mb-2 px-1 text-[10px] font-[800] tracking-widest uppercase">
                        <span className="text-gray-500">Step 2 of 2</span>
                        <span className="text-gray-500">100% Complete</span>
                    </div>
                    <div className="h-1.5 w-full bg-[#E5E5EA] rounded-full overflow-hidden">
                        <div className="h-full bg-[#3b28cc] rounded-full w-full"></div>
                    </div>
                </div>
            </div>

            {/* Form Card */}
            <div className="w-full max-w-2xl bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_-4px_rgba(0,0,0,0.03)] p-8 md:p-12 relative overflow-hidden mt-6 text-left">
                <div className="space-y-8 animate-fade-in relative z-10">
                    
                    {/* Current Stage */}
                    <div className="space-y-3">
                        <label className="text-[11px] font-[800] text-gray-500 block uppercase tracking-widest">Current Stage</label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {stages.map(s => (
                                <button
                                    key={s}
                                    onClick={() => setStage(s)}
                                    className={`h-[52px] rounded-xl font-[600] text-[15px] transition-all border ${
                                        stage === s 
                                        ? 'bg-[#eeebf9] text-[#3b28cc] border-[#3b28cc]' 
                                        : 'bg-[#f4f5f7] text-gray-600 border-transparent hover:bg-gray-200'
                                    }`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Current Goal */}
                    <div className="space-y-3">
                        <label className="text-[11px] font-[800] text-gray-500 block uppercase tracking-widest">Current Goal</label>
                        <div className="relative group">
                            <select
                                value={goal}
                                onChange={(e) => setGoal(e.target.value)}
                                className="w-full h-[52px] bg-[#f4f5f7] rounded-xl px-4 text-gray-900 font-[500] outline-none focus:ring-2 focus:ring-[#3b28cc]/20 transition-all appearance-none cursor-pointer border-none"
                            >
                                <option value="" disabled>Select your domain / specialization</option>
                                <option value="frontend">Frontend Development</option>
                                <option value="backend">Backend Development</option>
                                <option value="fullstack">Full Stack Development</option>
                                <option value="ai">AI & Machine Learning</option>
                                <option value="data">Data Science & Analytics</option>
                                <option value="cloud">Cloud Computing & DevOps</option>
                                <option value="uiux">UI / UX Design</option>
                            </select>
                            <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">expand_more</span>
                        </div>
                    </div>

                    {/* Skill Set */}
                    <div className="space-y-3">
                        <label className="text-[11px] font-[800] text-gray-500 block uppercase tracking-widest">Skill Set</label>
                        <div className="relative group">
                            <select
                                value={skills}
                                onChange={(e) => setSkills(e.target.value)}
                                className="w-full h-[52px] bg-[#f4f5f7] rounded-xl px-4 text-gray-900 font-[500] outline-none focus:ring-2 focus:ring-[#3b28cc]/20 transition-all appearance-none cursor-pointer border-none"
                            >
                                <option value="" disabled>Select your core skills / tools</option>
                                <option value="react">React / Node.js</option>
                                <option value="python">Python / Django</option>
                                <option value="java">Java / Spring Boot</option>
                                <option value="ml">PyTorch / TensorFlow</option>
                                <option value="aws">AWS / Docker / Kubernetes</option>
                                <option value="figma">Figma / Adobe CC</option>
                            </select>
                            <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">expand_more</span>
                        </div>
                    </div>

                    {/* Github / Portfolio */}
                    <div className="space-y-3">
                        <label className="text-[11px] font-[800] text-gray-500 block uppercase tracking-widest">Github / Portfolio Link</label>
                        <div className="relative group">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 transition-colors text-[20px]">link</span>
                            <input
                                type="text"
                                value={portfolio}
                                onChange={(e) => setPortfolio(e.target.value)}
                                placeholder="github.com/username"
                                className="w-full h-[52px] bg-[#f4f5f7] rounded-xl pl-12 pr-4 text-gray-900 font-[500] placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-[#3b28cc]/20 transition-all border-none"
                            />
                        </div>
                    </div>

                    {/* Built Real Projects */}
                    <div className="space-y-3">
                        <label className="text-[11px] font-[800] text-gray-500 block uppercase tracking-widest">Built Real Projects?</label>
                        <div className="flex items-center gap-4 text-[15px] font-[600] text-gray-900">
                            <span>No</span>
                            <button 
                                onClick={() => setHasProjects(!hasProjects)}
                                className={`w-14 h-7 rounded-full transition-colors relative flex items-center ${hasProjects ? 'bg-[#3b28cc]' : 'bg-gray-300'}`}
                            >
                                <div className={`size-5 bg-white rounded-full absolute shadow transition-transform ${hasProjects ? 'translate-x-[26px]' : 'translate-x-[2px]'}`}></div>
                            </button>
                            <span>Yes</span>
                        </div>
                    </div>

                    {/* Continue Button */}
                    <div className="pt-4">
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
            </div>
        </div>
    );
};

export default Step2Tech;
