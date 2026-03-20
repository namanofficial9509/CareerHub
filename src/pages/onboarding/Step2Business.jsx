import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

const Step2Business = () => {
    const navigate = useNavigate();
    const { user, userData } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    // Form State
    const [domains, setDomains] = useState(['Finance']);
    const [experience, setExperience] = useState('');
    const [leadership, setLeadership] = useState(true);
    const [tools, setTools] = useState(['Power BI', 'Google Analytics']);
    const [communication, setCommunication] = useState(85); // 0 to 100
    const [targetRole, setTargetRole] = useState('');

    useEffect(() => {
        if (userData?.onboarding?.businessJourney) {
            const data = userData.onboarding.businessJourney;
            if (data.domains) setDomains(data.domains);
            if (data.experience) setExperience(data.experience);
            if (data.leadership !== undefined) setLeadership(data.leadership);
            if (data.tools) setTools(data.tools);
            if (data.communication) setCommunication(data.communication);
            if (data.targetRole) setTargetRole(data.targetRole);
        }
    }, [userData]);

    const handleContinue = async () => {
        if (!user) return;
        setIsLoading(true);
        try {
            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, {
                "onboarding.businessJourney": {
                    domains,
                    experience,
                    leadership,
                    tools,
                    communication,
                    targetRole
                }
            });
            navigate('/onboarding/step-3');
        } catch (error) {
            console.error("Error saving step 2 business:", error);
            alert("Failed to save. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const toggleDomain = (d) => {
        setDomains(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);
    };
    
    const toggleTool = (t) => {
        setTools(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);
    };

    // Calculate Communication level
    const getCommLevel = (val) => {
        if (val < 33) return 'DEVELOPING';
        if (val < 66) return 'FLUENT';
        if (val < 90) return 'INFLUENTIAL';
        return 'EXPERT';
    };

    return (
        <div className="flex flex-col items-center w-full min-h-[calc(100vh-140px)] pb-16 text-center">
            
            {/* Custom Progress Line Outside Card */}
            <div className="w-full max-w-[280px] mx-auto mt-6 mb-8">
                <div className="flex justify-center items-center mb-3">
                    <span className="text-[10px] font-[800] text-[#3b28cc] tracking-widest uppercase">Step 2 of 2</span>
                </div>
                <div className="h-1 w-full bg-[#E5E5EA] rounded-full overflow-hidden">
                    <div className="h-full bg-[#3b28cc] rounded-full w-[100%]"></div>
                </div>
            </div>

            {/* Form Card */}
            <div className="w-full max-w-2xl bg-white rounded-3xl shadow-[0_8px_30px_-4px_rgba(0,0,0,0.03)] p-8 md:p-12 relative overflow-hidden text-left shrink-0">
                <div className="space-y-10 animate-fade-in relative z-10">
                    
                    <div className="text-center">
                        <h1 className="text-[34px] md:text-[38px] font-[800] tracking-tight text-gray-900 mb-3 leading-tight">
                            Tell us about your Business<br/>Interests
                        </h1>
                        <p className="text-gray-500 text-[14px] font-[500] max-w-[420px] mx-auto leading-relaxed">
                            Help us calibrate your career trajectory by sharing your professional focus and leadership style.
                        </p>
                    </div>

                    {/* Which domains excite you most? */}
                    <div className="space-y-4">
                        <label className="text-[14px] font-[800] text-gray-900 block">Which domains excite you most?</label>
                        <div className="flex flex-wrap gap-3">
                            {['Marketing', 'Finance', 'Consulting', 'Product Strategy', 'Operations'].map(d => (
                                <button
                                    key={d}
                                    onClick={() => toggleDomain(d)}
                                    className={`px-5 py-2.5 rounded-full text-[13px] font-[600] transition-colors border ${
                                        domains.includes(d)
                                        ? 'bg-[#3b28cc] text-white border-[#3b28cc]'
                                        : 'bg-white text-gray-700 border-gray-200 hover:border-[#3b28cc]/30'
                                    }`}
                                >
                                    {d}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Work Experience */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                        <div className="space-y-3">
                            <label className="text-[14px] font-[800] text-gray-900 block">Work Experience</label>
                            <div className="relative group">
                                <select
                                    value={experience}
                                    onChange={(e) => setExperience(e.target.value)}
                                    className="w-full h-[54px] bg-white border border-gray-200 rounded-[12px] px-4 text-gray-900 font-[500] outline-none focus:ring-2 focus:ring-[#3b28cc]/20 focus:border-[#3b28cc] transition-all appearance-none cursor-pointer"
                                >
                                    <option value="" disabled>Select experience level</option>
                                    <option value="student">Student / No Experience</option>
                                    <option value="intern">Internship (0-1 years)</option>
                                    <option value="entry">Entry Level (1-3 years)</option>
                                    <option value="senior">Experienced / Senior</option>
                                </select>
                                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">expand_more</span>
                            </div>
                        </div>

                        <div className="bg-[#f8f9fe] rounded-[16px] p-4 flex items-center justify-between border border-[#e4ecfa] h-[76px] shadow-sm">
                            <div>
                                <h4 className="text-[13px] font-[800] text-gray-900 mb-0.5">Leadership Experience</h4>
                                <p className="text-[11px] font-[500] text-gray-500">Clubs, teams, or management</p>
                            </div>
                            <button 
                                onClick={() => setLeadership(!leadership)}
                                className={`w-11 h-6 rounded-full transition-colors relative flex items-center shrink-0 ${leadership ? 'bg-[#3b28cc]' : 'bg-gray-300'}`}
                            >
                                <div className={`size-[18px] bg-white rounded-full absolute shadow-sm transition-transform ${leadership ? 'translate-x-[22px]' : 'translate-x-[3px]'}`}></div>
                            </button>
                        </div>
                    </div>

                    {/* Tools You Have Used */}
                    <div className="bg-[#f8f9fe] border border-[#f0f2fb] rounded-[20px] p-6 space-y-6">
                        <label className="text-[14px] font-[800] text-gray-900 block">Tools You Have Used</label>
                        
                        <div className="space-y-3">
                            <h5 className="text-[11px] font-[800] text-[#3b28cc] uppercase tracking-widest">Finance</h5>
                            <div className="flex flex-wrap gap-2.5">
                                {['Excel Advanced', 'Power BI', 'SQL', 'Tableau', 'Python', 'Bloomberg Terminal'].map(t => (
                                     <button
                                        key={t}
                                        onClick={() => toggleTool(t)}
                                        className={`px-4 py-2 rounded-full text-[12px] font-[600] transition-colors border ${
                                            tools.includes(t)
                                            ? 'bg-[#3b28cc] text-white border-[#3b28cc]'
                                            : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                                        }`}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h5 className="text-[11px] font-[800] text-[#3b28cc] uppercase tracking-widest">Marketing</h5>
                            <div className="flex flex-wrap gap-2.5">
                                {['Meta Ads', 'Google Analytics', 'SEO', 'HubSpot'].map(t => (
                                     <button
                                        key={t}
                                        onClick={() => toggleTool(t)}
                                        className={`px-4 py-2 rounded-full text-[12px] font-[600] transition-colors border ${
                                            tools.includes(t)
                                            ? 'bg-[#3b28cc] text-white border-[#3b28cc]'
                                            : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                                        }`}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Communication Confidence */}
                    <div className="space-y-5">
                        <div className="flex justify-between items-center">
                            <label className="text-[14px] font-[800] text-gray-900 block">Communication Confidence</label>
                            <div className="bg-[#a855f7] text-white px-3 py-1 rounded-full text-[10px] font-[800] tracking-widest uppercase shadow-sm">
                                {getCommLevel(communication)}
                            </div>
                        </div>
                        
                        <div className="relative pt-2 pb-6">
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={communication}
                                onChange={(e) => setCommunication(Number(e.target.value))}
                                className="w-full h-1.5 bg-[#eae5fc] rounded-lg appearance-none cursor-pointer relative z-10"
                                style={{
                                    background: `linear-gradient(to right, #3b28cc ${communication}%, #eae5fc ${communication}%)`
                                }}
                            />
                            <style dangerouslySetInnerHTML={{__html: `
                                input[type=range]::-webkit-slider-thumb {
                                    -webkit-appearance: none;
                                    width: 18px;
                                    height: 18px;
                                    background: #3b28cc;
                                    border-radius: 50%;
                                    cursor: pointer;
                                    box-shadow: 0 0 0 4px white;
                                    border: none;
                                }
                            `}} />
                            
                            <div className="absolute inset-x-0 bottom-0 flex justify-between text-[10px] font-[700] tracking-widest text-gray-400">
                                <span>DEVELOPING</span>
                                <span>FLUENT</span>
                                <span>INFLUENTIAL</span>
                            </div>
                        </div>
                    </div>

                    {/* Target Career Role */}
                    <div className="space-y-3">
                        <label className="text-[14px] font-[800] text-gray-900 block">Target Career Role</label>
                        <div className="relative group">
                            <span className="material-symbols-outlined flex items-center text-[20px] absolute left-4 top-1/2 -translate-y-1/2 text-[#3b28cc]">adjust</span>
                            <input
                                type="text"
                                value={targetRole}
                                onChange={(e) => setTargetRole(e.target.value)}
                                placeholder="e.g. Senior Business Analyst"
                                className="w-full h-[54px] bg-white rounded-[14px] border border-gray-100 pl-[44px] pr-4 text-gray-900 font-[500] placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-[#3b28cc]/20 focus:border-[#3b28cc] transition-all shadow-sm"
                            />
                        </div>
                    </div>

                    {/* Continue Button */}
                    <div className="pt-2">
                        <button
                            onClick={handleContinue}
                            disabled={isLoading}
                            className="w-full h-[56px] bg-[#4b3ccb] text-white text-[16px] font-[600] rounded-xl hover:bg-indigo-700 hover:scale-[1.01] active:scale-[0.98] transition-all shadow-lg shadow-[#4b3ccb]/30 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Saving...' : 'Continue'}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Step2Business;
