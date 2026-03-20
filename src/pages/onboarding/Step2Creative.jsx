import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

const Step2Creative = () => {
    const navigate = useNavigate();
    const { user, userData } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    // State
    const [specialization, setSpecialization] = useState('UI Design');
    const [tools, setTools] = useState(['FIGMA']);
    const [portfolioUrl, setPortfolioUrl] = useState('');
    const [freelance, setFreelance] = useState(true);

    useEffect(() => {
        if (userData?.onboarding?.creativeJourney) {
            const data = userData.onboarding.creativeJourney;
            if (data.specialization) setSpecialization(data.specialization);
            if (data.tools) setTools(data.tools);
            if (data.portfolioUrl) setPortfolioUrl(data.portfolioUrl);
            if (data.freelance !== undefined) setFreelance(data.freelance);
        }
    }, [userData]);

    const handleContinue = async () => {
        if (!user) return;
        setIsLoading(true);
        try {
            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, {
                "onboarding.creativeJourney": {
                    specialization,
                    tools,
                    portfolioUrl,
                    freelance
                }
            });
            navigate('/onboarding/step-3');
        } catch (error) {
            console.error("Error saving step 2 creative:", error);
            alert("Failed to save. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const toggleTool = (tool) => {
        if (tools.includes(tool)) {
            setTools(tools.filter(t => t !== tool));
        } else {
            setTools([...tools, tool]);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row w-full min-h-[calc(100vh-140px)] gap-10 px-6 py-10 max-w-7xl mx-auto items-start">
            {/* Left Column */}
            <div className="flex-1 lg:max-w-md space-y-8 mt-4 lg:sticky lg:top-10">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <span className="text-[12px] font-black tracking-widest text-[#3b28cc] uppercase">Step 2 of 2</span>
                        <div className="h-[3px] w-48 bg-[#3b28cc]/10 rounded-full overflow-hidden">
                            <div className="h-full w-full bg-[#3b28cc]"></div>
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-[900] text-[#0f172a] leading-[1.05] tracking-tight">
                        Tell us about your <span className="italic text-[#3b28cc]">Creative Skills</span>
                    </h1>
                    <p className="text-slate-500 leading-relaxed text-[16px] max-w-[400px]">
                        We use these details to curate specialized creative opportunities and match your aesthetic profile with top studios.
                    </p>
                </div>

                {/* AI Career Insight Card */}
                <div className="bg-white border-2 border-slate-50 p-7 rounded-[40px] shadow-sm relative overflow-hidden group max-w-[380px]">
                    <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
                        <span className="material-symbols-outlined text-9xl text-[#3b28cc]">auto_awesome</span>
                    </div>
                    <div className="flex items-start gap-4 mb-5 relative z-10">
                        <div className="size-14 rounded-2xl bg-[#eeebf9] text-[#3b28cc] flex items-center justify-center shrink-0 shadow-sm border border-white">
                            <span className="material-symbols-outlined text-[28px] font-bold">auto_awesome</span>
                        </div>
                        <div>
                            <h4 className="font-black text-slate-900 text-[16px] mb-1">AI Career Insight</h4>
                            <p className="text-[14px] text-slate-500 leading-relaxed font-medium">
                                Creatives with a mix of UI and Motion skills see 40% higher engagement.
                            </p>
                        </div>
                    </div>
                    {/* Placeholder Progress Bars matching the design */}
                    <div className="space-y-2 mt-6 relative z-10">
                        <div className="h-2 w-[85%] bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full w-[40%] bg-[#3b28cc]/20"></div>
                        </div>
                        <div className="h-2 w-[55%] bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full w-[25%] bg-[#3b28cc]/20"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column (Form Card) */}
            <div className="flex-[1.1] w-full bg-[#f4f7ff]/60 backdrop-blur-sm rounded-[56px] p-8 md:p-12 border border-white shadow-[0_30px_60px_-20px_rgba(59,40,204,0.05)]">
                <div className="space-y-12">
                    
                    {/* Creative specialization */}
                    <div className="space-y-5">
                        <h3 className="text-[18px] font-black text-[#0f172a]">Creative specialization</h3>
                        <div className="flex flex-wrap gap-3">
                            {['Graphic Design', 'UI Design', 'Motion', 'Video Editing', 'Content Writing'].map((spec) => (
                                <button
                                    key={spec}
                                    onClick={() => setSpecialization(spec)}
                                    className={`px-7 py-3.5 rounded-full text-[14px] font-[700] transition-all flex items-center gap-2.5 ${
                                        specialization === spec 
                                        ? 'bg-[#3b28cc] text-white shadow-xl shadow-[#3b28cc]/20 scale-[1.03]' 
                                        : 'bg-white text-slate-600 hover:bg-white/80 border border-transparent'
                                    }`}
                                >
                                    {spec}
                                    {specialization === spec && <span className="material-symbols-outlined text-[18px] font-bold">check</span>}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Preferred Design Tools */}
                    <div className="space-y-5">
                        <h3 className="text-[18px] font-black text-[#0f172a]">Preferred Design Tools</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { name: 'FIGMA', icon: 'edit_square' },
                                { name: 'ADOBE SUITE', icon: 'brush' },
                                { name: 'CANVA', icon: 'auto_awesome' },
                                { name: 'BLENDER', icon: 'deployed_code' }
                            ].map((tool) => (
                                <button
                                    key={tool.name}
                                    onClick={() => toggleTool(tool.name)}
                                    className={`flex flex-col items-center justify-center p-7 rounded-3xl border-2 transition-all gap-5 group ${
                                        tools.includes(tool.name)
                                        ? 'border-[#3b28cc] bg-white text-[#3b28cc] scale-[1.03] shadow-lg shadow-[#3b28cc]/5'
                                        : 'border-transparent bg-white text-slate-400 hover:border-slate-200 shadow-sm'
                                    }`}
                                >
                                    <div className={`p-3 rounded-2xl transition-colors ${tools.includes(tool.name) ? 'bg-[#eeebf9]' : 'bg-slate-50'}`}>
                                        <span className="material-symbols-outlined text-[32px]">{tool.icon}</span>
                                    </div>
                                    <span className={`text-[11px] font-[900] tracking-[0.1em] ${tools.includes(tool.name) ? 'opacity-100' : 'opacity-60'}`}>
                                        {tool.name}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Portfolio Showcase */}
                    <div className="space-y-5">
                        <h3 className="text-[18px] font-black text-[#0f172a]">Portfolio Showcase</h3>
                        <div className="relative group">
                            <div className="absolute left-[22px] top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#3b28cc] transition-colors">
                                <span className="material-symbols-outlined text-[22px]">link</span>
                            </div>
                            <input
                                type="text"
                                value={portfolioUrl}
                                onChange={(e) => setPortfolioUrl(e.target.value)}
                                placeholder="Behance, Dribbble or personal website URL"
                                className="w-full h-[72px] bg-white rounded-3xl pl-16 pr-8 text-[15px] outline-none border-2 border-transparent focus:border-[#3b28cc]/10 transition-all placeholder:text-slate-400 font-semibold shadow-sm focus:shadow-md"
                            />
                        </div>
                    </div>

                    {/* Freelance experience */}
                    <div 
                        className="p-7 bg-white rounded-[32px] border border-transparent flex items-center justify-between group cursor-pointer hover:shadow-md transition-all shadow-sm"
                        onClick={() => setFreelance(!freelance)}
                    >
                        <div className="flex items-center gap-5">
                            <div className="size-14 rounded-2xl bg-slate-50 text-[#3b28cc] flex items-center justify-center transition-all group-hover:bg-[#eeebf9]">
                                <span className="material-symbols-outlined text-[24px]">work</span>
                            </div>
                            <div>
                                <h4 className="text-[15px] font-black text-[#0f172a] mb-0.5">Freelance experience</h4>
                                <p className="text-[13px] text-slate-500 font-semibold tracking-tight">
                                    Do you take on independent client projects?
                                </p>
                            </div>
                        </div>
                        <div className={`w-14 h-[30px] rounded-full transition-all relative flex items-center px-1 shrink-0 ${
                            freelance ? 'bg-[#3b28cc]' : 'bg-slate-200'
                        }`}>
                            <div className={`size-6 bg-white rounded-full shadow-lg transition-all duration-300 ${
                                freelance ? 'translate-x-6' : 'translate-x-0'
                            }`} />
                        </div>
                    </div>

                    {/* Continue Button */}
                    <button
                        onClick={handleContinue}
                        disabled={isLoading}
                        className="w-full h-[76px] bg-[#3b28cc] text-white rounded-[32px] font-black transition-all hover:bg-slate-900 flex items-center justify-center gap-3 group disabled:opacity-70 shadow-2xl shadow-[#3b28cc]/25 hover:-translate-y-1"
                    >
                        {isLoading ? (
                            <div className="size-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <>
                                <span className="text-[17px] tracking-wide">Continue</span>
                                <span className="material-symbols-outlined group-hover:translate-x-1.5 transition-transform font-black">arrow_forward</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Step2Creative;
