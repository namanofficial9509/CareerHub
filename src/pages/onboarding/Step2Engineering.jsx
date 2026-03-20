import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

const Step2Engineering = () => {
    const navigate = useNavigate();
    const { user, userData } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    // Form State (matching the design image defaults)
    const [branch, setBranch] = useState('Civil');
    const [tools, setTools] = useState(['AutoCAD', 'MATLAB']);
    const [training, setTraining] = useState(true);
    const [sector, setSector] = useState('');

    useEffect(() => {
        if (userData?.onboarding?.engineeringJourney) {
            const data = userData.onboarding.engineeringJourney;
            if (data.branch) setBranch(data.branch);
            if (data.tools) setTools(data.tools);
            if (data.training !== undefined) setTraining(data.training);
            if (data.sector) setSector(data.sector);
        }
    }, [userData]);

    const handleContinue = async () => {
        if (!user) return;
        setIsLoading(true);
        try {
            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, {
                "onboarding.engineeringJourney": {
                    branch,
                    tools,
                    training,
                    sector
                }
            });
            navigate('/onboarding/step-3');
        } catch (error) {
            console.error("Error saving step 2 engineering:", error);
            alert("Failed to save. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const toggleTool = (t) => {
        setTools(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);
    };

    return (
        <div className="flex flex-col items-center w-full min-h-[calc(100vh-140px)] pb-16 relative z-10 select-none">
            {/* Minimal ambient glow background mimicking the design's elegant style */}
            <div className="absolute inset-0 bg-[#fbfcff] -z-20 w-screen left-1/2 -translate-x-1/2 overflow-hidden">
                <div className="absolute top-[0%] right-[12%] w-[400px] h-[400px] bg-[#eeeffd] rounded-full blur-[80px] opacity-60"></div>
                <div className="absolute bottom-[15%] left-[8%] w-[500px] h-[500px] bg-[#f2f4fe] rounded-full blur-[100px] opacity-50"></div>
            </div>

            <div className="w-full max-w-[800px] mt-12 px-6 text-left mx-auto">
                {/* Header Area */}
                <div className="mb-14 relative w-full">
                    <p className="text-[12px] font-[800] text-[#3b28cc] tracking-widest uppercase mb-3.5 pl-[2px]">STEP 2 OF 2</p>
                    <div className="flex justify-between items-end">
                        <h1 className="text-[44px] md:text-[48px] font-[800] tracking-tight text-[#0f172a] leading-[1.08] max-w-[620px]">
                            Tell us about your Engineering Background
                        </h1>
                        <div className="size-[48px] rounded-full bg-[#eeeffe] text-[#3b28cc] flex items-center justify-center shrink-0 shadow-sm mb-2.5">
                            <span className="material-symbols-outlined text-[20px]">engineering</span>
                        </div>
                    </div>
                    {/* Thick purple line as per mockup */}
                    <div className="w-full h-[5px] bg-[#3b28cc] rounded-full mt-6 shadow-[0_2px_12px_rgba(59,40,204,0.3)]"></div>
                </div>

                <div className="space-y-[52px] animate-fade-in mt-16">
                    
                    {/* Engineering Branch */}
                    <div className="space-y-[18px]">
                        <div className="flex items-center gap-3">
                            <div className="size-2 rounded-full bg-[#3b28cc]"></div>
                            <h3 className="text-[19px] font-[700] text-[#0f172a]">Engineering Branch</h3>
                        </div>
                        <div className="flex flex-wrap gap-[16px]">
                            {[
                                { id: 'Mechanical', icon: 'settings' },
                                { id: 'Civil', icon: 'domain' },
                                { id: 'Electrical', icon: 'bolt' },
                                { id: 'Electronics', icon: 'memory' }
                            ].map(b => (
                                <button
                                    key={b.id}
                                    onClick={() => setBranch(b.id)}
                                    className={`flex items-center gap-2.5 px-7 py-[14px] rounded-full text-[14px] font-[600] transition-all outline-none ${
                                        branch === b.id 
                                        ? 'bg-[#3b28cc] text-white shadow-[0_4px_24px_rgba(59,40,204,0.35)] border border-[#3b28cc]' 
                                        : 'bg-white text-[#334155] shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-transparent hover:bg-[#f8f9fc]'
                                    }`}
                                >
                                    <span className={`material-symbols-outlined text-[18px] ${branch === b.id ? 'text-white' : 'text-[#64748b]'}`}>{b.icon}</span>
                                    {b.id}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Middle Grid Row: Software Tools & Practical Experience */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[72px] gap-y-12">
                        
                        {/* Software Tools */}
                        <div className="space-y-[18px]">
                            <div className="flex items-center gap-3">
                                <div className="size-2 rounded-full bg-[#3b28cc]"></div>
                                <h3 className="text-[19px] font-[700] text-[#0f172a]">Software Tools</h3>
                            </div>
                            <div className="grid grid-cols-2 gap-[14px]">
                                {['AutoCAD', 'SolidWorks', 'MATLAB', 'Ansys'].map(t => (
                                    <div 
                                        key={t}
                                        onClick={() => toggleTool(t)}
                                        className="bg-white rounded-[16px] px-5 py-[18px] flex items-center gap-4 cursor-pointer shadow-[0_4px_16px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all"
                                    >
                                        {/* Indicator square matching mockup (solid color, no checkmark) */}
                                        <div className={`size-[20px] rounded-[4px] transition-all shrink-0 border-2 ${
                                            tools.includes(t) 
                                            ? 'bg-[#3b28cc] border-[#3b28cc]' 
                                            : 'bg-white border-gray-200'
                                        }`}>
                                        </div>
                                        <span className="text-[14px] font-[600] text-[#1e293b]">{t}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Practical Experience */}
                        <div className="space-y-[18px]">
                            <div className="flex items-center gap-3">
                                <div className="size-2 rounded-full bg-[#3b28cc]"></div>
                                <h3 className="text-[19px] font-[700] text-[#0f172a]">Practical Experience</h3>
                            </div>
                            <div 
                                className="bg-[#f2f4fd] rounded-[18px] px-6 py-[22px] flex items-center justify-between shadow-sm cursor-pointer hover:bg-[#eff1f9] transition-colors" 
                                onClick={() => setTraining(!training)}
                            >
                                <div>
                                    <h4 className="text-[15px] font-[800] text-[#1e293b] mb-1 leading-snug">Industrial Training</h4>
                                    <p className="text-[12px] font-[500] text-[#64748b]">Completed 6+ months of site work</p>
                                </div>
                                <div className={`w-[52px] h-[28px] rounded-full transition-colors relative flex items-center shrink-0 px-[3px] shadow-inner ${training ? 'bg-[#3b28cc]' : 'bg-[#cbd5e1]'}`}>
                                    <div className={`size-[22px] bg-white rounded-full absolute shadow-md transition-transform ${training ? 'translate-x-[24px]' : 'translate-x-[0px]'}`}></div>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Preferred Sector */}
                    <div className="space-y-[18px]">
                        <div className="flex items-center gap-3">
                            <div className="size-2 rounded-full bg-[#3b28cc]"></div>
                            <h3 className="text-[19px] font-[700] text-[#0f172a]">Preferred Sector</h3>
                        </div>
                        <div className="relative w-full bg-white rounded-[16px] shadow-[0_4px_16px_rgba(0,0,0,0.04)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.06)] transition-all">
                            <select
                                value={sector}
                                onChange={(e) => setSector(e.target.value)}
                                className="w-full h-[64px] bg-transparent rounded-[16px] px-6 text-[#1e293b] font-[600] text-[15px] outline-none appearance-none cursor-pointer border-none focus:ring-0 !bg-none"
                            >
                                <option value="" disabled>Select a sector</option>
                                <option value="manufacturing">Manufacturing</option>
                                <option value="construction">Construction & Real Estate</option>
                                <option value="automotive">Automotive & Aerospace</option>
                                <option value="energy">Energy & Power</option>
                                <option value="telecom">Telecommunications</option>
                            </select>
                            <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col text-[#94a3b8] pointer-events-none -space-y-1">
                                <span className="material-symbols-outlined text-[18px]">expand_less</span>
                                <span className="material-symbols-outlined text-[18px]">expand_more</span>
                            </div>
                        </div>
                    </div>

                    {/* Continue Button (Standard UI placement) */}
                    <div className="pt-10">
                        <button
                            onClick={handleContinue}
                            disabled={isLoading}
                            className="w-full h-[64px] bg-[#3b28cc] text-white text-[16px] font-[700] rounded-[20px] shadow-[0_8px_24px_rgba(59,40,204,0.3)] hover:bg-[#3120b0] hover:scale-[1.005] active:scale-[0.995] transition-all flex items-center justify-center gap-2.5 disabled:opacity-70 disabled:cursor-not-allowed group"
                        >
                            {isLoading ? (
                                <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <span>Continue</span>
                                    <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                </>
                            )}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Step2Engineering;
