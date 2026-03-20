import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ChallengeDetail = () => {
    const navigate = useNavigate();
    const [isStarted, setIsStarted] = useState(false);
    const [tasksCompleted, setTasksCompleted] = useState({
        cleaning: false,
        eda: false,
        training: false,
        evaluating: false,
    });

    const toggleTask = (key) => {
        setTasksCompleted(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="flex flex-col gap-6 w-full max-w-[1200px] mx-auto min-h-screen pb-12">
            {/* Top Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-[24px] p-5 flex items-center gap-4 shadow-[0_2px_12px_rgba(0,0,0,0.02)] border border-slate-100">
                    <div className="size-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[24px]">group</span>
                    </div>
                    <div>
                        <p className="text-[11px] font-[600] text-slate-500 uppercase tracking-widest mb-0.5">Participants</p>
                        <h4 className="text-[22px] font-[800] text-slate-900 leading-none">1,243</h4>
                    </div>
                </div>

                <div className="bg-white rounded-[24px] p-5 flex items-center gap-4 shadow-[0_2px_12px_rgba(0,0,0,0.02)] border border-slate-100">
                    <div className="size-12 rounded-2xl bg-fuchsia-50 text-fuchsia-600 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[24px]">schedule</span>
                    </div>
                    <div>
                        <p className="text-[11px] font-[600] text-slate-500 uppercase tracking-widest mb-0.5">Duration</p>
                        <h4 className="text-[22px] font-[800] text-slate-900 leading-none">5 Days</h4>
                    </div>
                </div>

                <div className="bg-white rounded-[24px] p-5 flex items-center gap-4 shadow-[0_2px_12px_rgba(0,0,0,0.02)] border border-slate-100">
                    <div className="size-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[24px]">verified</span>
                    </div>
                    <div>
                        <p className="text-[11px] font-[600] text-slate-500 uppercase tracking-widest mb-0.5">Prize</p>
                        <h4 className="text-[18px] font-[800] text-slate-900 leading-tight">Verified<br/>Badge</h4>
                    </div>
                </div>

                <div className="bg-white rounded-[24px] p-5 flex items-center gap-4 shadow-[0_2px_12px_rgba(0,0,0,0.02)] border border-slate-100">
                    <div className="size-12 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[24px]">stars</span>
                    </div>
                    <div>
                        <p className="text-[11px] font-[600] text-slate-500 uppercase tracking-widest mb-0.5">Skill Points</p>
                        <h4 className="text-[22px] font-[800] text-slate-900 leading-none">+120</h4>
                    </div>
                </div>
            </div>

            {/* Split Content Area */}
            <div className="flex flex-col lg:flex-row gap-6 mt-2 relative items-start">
                
                {/* Left Column (Main Scrollable Content) */}
                <div className="flex-1 space-y-6 w-full">
                    
                    {/* About Challenge */}
                    <div className="bg-white rounded-[32px] p-8 shadow-[0_2px_16px_rgba(0,0,0,0.02)] border border-slate-100 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-[#5d3fd3]"></div>
                        <h2 className="text-2xl font-[800] text-slate-900 mb-4 pl-2">About Challenge</h2>
                        <p className="text-slate-500 leading-relaxed text-[15px] mb-8 pl-2 w-full xl:w-[90%]">
                            This sprint focuses on the end-to-end data science lifecycle. Your performance is evaluated based on model accuracy, creative feature engineering, and the clarity of your insights. You'll be working with a real-world e-commerce dataset to predict customer churn.
                        </p>
                        <div className="flex flex-wrap items-center justify-between gap-4 pl-2">
                            <div className="flex flex-wrap gap-2">
                                {['Python', 'Pandas', 'Scikit-Learn', 'EDA'].map(skill => (
                                    <span key={skill} className="bg-slate-100 text-slate-700 px-4 py-1.5 rounded-full text-[13px] font-[600]">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                            
                            {!isStarted && (
                                <button 
                                    onClick={() => navigate('/dashboard/challenges/data-science-sprint/assessment')}
                                    className="bg-[#5d3fd3] text-white px-8 py-3.5 rounded-2xl font-[700] text-[15px] hover:bg-[#4a32a8] active:scale-[0.98] transition-all flex items-center gap-2 shadow-lg shadow-[#5d3fd3]/25"
                                >
                                    Start Challenge
                                    <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Challenge Tasks (Visible Only When Started) */}
                    {isStarted && (
                        <div className="space-y-6 animate-fade-in-up">
                            <h2 className="text-xl font-[800] text-slate-900 mb-2 pl-2">Challenge Tasks</h2>

                            {/* Task 1: Dataset Exploration */}
                            <div className="bg-white rounded-[32px] p-8 shadow-[0_2px_16px_rgba(0,0,0,0.02)] border border-slate-100">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                                    <div className="flex gap-4 items-start">
                                        <div className="size-10 rounded-full bg-[#5d3fd3] text-white font-[800] text-[15px] flex items-center justify-center shrink-0 shadow-md">
                                            1
                                        </div>
                                        <div>
                                            <h3 className="text-[17px] font-[800] text-slate-900 mb-1">Dataset Exploration</h3>
                                            <p className="text-[13px] text-slate-500">Download the raw data and perform initial sanity checks.</p>
                                        </div>
                                    </div>
                                    <button className="bg-[#f0edff] text-[#5d3fd3] px-6 py-3 rounded-2xl font-[700] text-[14px] hover:bg-[#e4dfff] transition-all flex items-center flex-col gap-0.5 justify-center min-w-[140px]">
                                        <span className="material-symbols-outlined text-[18px]">download</span>
                                        Download CSV
                                    </button>
                                </div>
                                <div className="w-full overflow-x-auto border border-slate-100 rounded-2xl">
                                    <table className="w-full text-left text-[12px] font-[600] text-slate-500">
                                        <thead className="border-b border-slate-100 uppercase tracking-wider text-[11px]">
                                            <tr>
                                                <th className="px-6 py-4">CUSTOM_ID</th>
                                                <th className="px-6 py-4">PURCHASE_FREQ</th>
                                                <th className="px-6 py-4">TOTAL_SPENT</th>
                                                <th className="px-6 py-4">LAST_LOGIN</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 text-slate-700 font-[500]">
                                            <tr>
                                                <td className="px-6 py-4">C-8021</td>
                                                <td className="px-6 py-4">12.4</td>
                                                <td className="px-6 py-4">$4,502</td>
                                                <td className="px-6 py-4">2h ago</td>
                                            </tr>
                                            <tr>
                                                <td className="px-6 py-4">C-4412</td>
                                                <td className="px-6 py-4">2.1</td>
                                                <td className="px-6 py-4">$120</td>
                                                <td className="px-6 py-4">15d ago</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Task 2: Build Prediction Model */}
                            <div className="bg-white rounded-[32px] p-8 shadow-[0_2px_16px_rgba(0,0,0,0.02)] border border-slate-100">
                                <div className="flex gap-4 items-start mb-8">
                                    <div className="size-10 rounded-full bg-[#5d3fd3] text-white font-[800] text-[15px] flex items-center justify-center shrink-0 shadow-md">
                                        2
                                    </div>
                                    <div>
                                        <h3 className="text-[17px] font-[800] text-slate-900 mb-1">Build Prediction Model</h3>
                                        <p className="text-[13px] text-slate-500">Create a robust model to identify high-risk churn customers.</p>
                                    </div>
                                </div>

                                <div className="flex flex-col md:flex-row gap-8">
                                    <div className="flex-1 space-y-3">
                                        <label className="flex items-center gap-4 bg-slate-50/50 p-4 rounded-2xl cursor-pointer hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                                            <input type="checkbox" checked={tasksCompleted.cleaning} onChange={() => toggleTask('cleaning')} className="size-5 rounded text-[#5d3fd3] focus:ring-[#5d3fd3]/20" />
                                            <span className={`text-[14px] font-[600] ${tasksCompleted.cleaning ? 'text-slate-900' : 'text-slate-600'}`}>Data Cleaning & Null Imputation</span>
                                        </label>
                                        <label className="flex items-center gap-4 bg-slate-50/50 p-4 rounded-2xl cursor-pointer hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                                            <input type="checkbox" checked={tasksCompleted.eda} onChange={() => toggleTask('eda')} className="size-5 rounded text-[#5d3fd3] focus:ring-[#5d3fd3]/20" />
                                            <span className={`text-[14px] font-[600] ${tasksCompleted.eda ? 'text-slate-900' : 'text-slate-600'}`}>Exploratory Data Analysis (EDA)</span>
                                        </label>
                                        <label className="flex items-center gap-4 bg-slate-50/50 p-4 rounded-2xl cursor-pointer hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                                            <input type="checkbox" checked={tasksCompleted.training} onChange={() => toggleTask('training')} className="size-5 rounded text-[#5d3fd3] focus:ring-[#5d3fd3]/20" />
                                            <div>
                                                <span className={`block text-[14px] font-[600] ${tasksCompleted.training ? 'text-slate-900' : 'text-slate-600'}`}>Model Training</span>
                                                <span className="block text-[12px] font-[500] text-slate-400 mt-0.5">(XGBoost/RandomForest)</span>
                                            </div>
                                        </label>
                                        <label className="flex items-center gap-4 bg-slate-50/50 p-4 rounded-2xl cursor-pointer hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                                            <input type="checkbox" checked={tasksCompleted.evaluating} onChange={() => toggleTask('evaluating')} className="size-5 rounded text-[#5d3fd3] focus:ring-[#5d3fd3]/20" />
                                            <div>
                                                <span className={`block text-[14px] font-[600] ${tasksCompleted.evaluating ? 'text-slate-900' : 'text-slate-600'}`}>Performance Evaluation</span>
                                                <span className="block text-[12px] font-[500] text-slate-400 mt-0.5">(F1 Score)</span>
                                            </div>
                                        </label>
                                    </div>
                                    <div className="flex-[1.2] min-h-[200px] border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center bg-slate-50/30 text-center p-8 hover:bg-slate-50 cursor-pointer transition-colors group">
                                        <div className="size-14 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                            <span className="material-symbols-outlined text-[28px]">cloud_upload</span>
                                        </div>
                                        <h4 className="text-[15px] font-[800] text-slate-700 mb-1">Upload Notebook/Model</h4>
                                        <p className="text-[12px] font-[600] text-slate-400 tracking-wide uppercase">Supported: .ipynb, .pkl, .h5</p>
                                    </div>
                                </div>
                            </div>

                            {/* Task 3: Insight Report */}
                            <div className="bg-white rounded-[32px] p-8 shadow-[0_2px_16px_rgba(0,0,0,0.02)] border border-slate-100">
                                <div className="flex gap-4 items-start mb-6">
                                    <div className="size-10 rounded-full bg-[#5d3fd3] text-white font-[800] text-[15px] flex items-center justify-center shrink-0 shadow-md">
                                        3
                                    </div>
                                    <div>
                                        <h3 className="text-[17px] font-[800] text-slate-900 mb-1">Insight Report</h3>
                                        <p className="text-[13px] text-slate-500">Summarize your findings and business recommendations.</p>
                                    </div>
                                </div>
                                <textarea 
                                    className="w-full min-h-[160px] bg-slate-50 border-none outline-none rounded-2xl p-6 text-[14px] font-[500] text-slate-700 placeholder:text-slate-400 resize-y focus:ring-2 focus:ring-[#5d3fd3]/20 transition-all"
                                    placeholder="Type your strategic insights here..."
                                ></textarea>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column (Sidebar) */}
                {isStarted && (
                    <div className="w-full lg:w-[320px] 2xl:w-[360px] shrink-0 space-y-6 animate-fade-in-up delay-100">
                        
                        {/* Your Progress */}
                        <div className="bg-white rounded-[28px] p-7 shadow-[0_2px_16px_rgba(0,0,0,0.02)] border border-slate-100">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-[16px] font-[800] text-slate-900">Your Progress</h3>
                                <span className="text-[14px] font-[800] text-[#5d3fd3]">45%</span>
                            </div>
                            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-6">
                                <div className="h-full bg-[#5d3fd3] rounded-full w-[45%]"></div>
                            </div>
                            <div className="space-y-4">
                                {[
                                    { label: 'Dataset Loaded', complete: true },
                                    { label: 'EDA Completed', complete: true },
                                    { label: 'Model Training', complete: false },
                                    { label: 'Final Report', complete: false },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className={`size-5 rounded-full flex items-center justify-center border-2 ${
                                            item.complete ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-slate-200'
                                        }`}>
                                            {item.complete && <span className="material-symbols-outlined text-[14px] font-bold">check</span>}
                                        </div>
                                        <span className={`text-[13px] font-[600] ${item.complete ? 'text-slate-900' : 'text-slate-400'}`}>
                                            {item.label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Top Performers */}
                        <div className="bg-white rounded-[28px] p-7 shadow-[0_2px_16px_rgba(0,0,0,0.02)] border border-slate-100">
                            <h3 className="text-[16px] font-[800] text-slate-900 mb-6">Top Performers</h3>
                            <div className="space-y-5 mb-6">
                                {[
                                    { name: 'Alex Rivera', score: '98.2', acc: '94% Acc', seed: 'Alex', color: 'bg-emerald-100' },
                                    { name: 'Sarah Chen', score: '96.5', acc: '92% Acc', seed: 'Sarah', color: 'bg-blue-100' },
                                    { name: 'Mark Sloan', score: '94.0', acc: '91% Acc', seed: 'Mark', color: 'bg-indigo-100' },
                                ].map((player, i) => (
                                    <div key={i} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <span className="text-[12px] font-[800] text-slate-300">#{i+1}</span>
                                            <div className="size-10 rounded-full border border-slate-100 overflow-hidden relative">
                                                <div className={`absolute inset-0 ${player.color} opacity-40 mix-blend-multiply`}></div>
                                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${player.seed}&backgroundColor=f8fafc`} alt="Avatar" className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <h4 className="text-[14px] font-[800] text-slate-900">{player.name}</h4>
                                                <p className="text-[11px] font-[600] text-slate-400">Score: {player.score}</p>
                                            </div>
                                        </div>
                                        <div className="bg-indigo-50 text-indigo-600 px-2 py-1 rounded text-[10px] font-[800] tracking-wide">
                                            {player.acc}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className="w-full bg-[#f8f9fc] hover:bg-[#f1f4f9] text-[#5d3fd3] py-2.5 rounded-xl text-[12px] font-[800] tracking-wide uppercase transition-colors">
                                See Full Rankings
                            </button>
                        </div>

                        {/* Rewards */}
                        <div className="bg-[#2d2a58] rounded-[28px] p-7 shadow-xl shadow-[#2d2a58]/20 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#4a32a8] blur-[60px] rounded-full opacity-60"></div>
                            <div className="relative z-10 w-full">
                                <h3 className="text-[18px] font-[800] text-white mb-1">Rewards</h3>
                                <p className="text-[12px] text-white/70 font-[500] mb-6">Complete all steps to unlock:</p>
                                
                                <div className="space-y-4 mb-8">
                                    <div className="flex items-center gap-3">
                                        <div className="size-7 rounded-full bg-white/10 flex items-center justify-center text-white shrink-0">
                                            <span className="material-symbols-outlined text-[14px] font-bold">share</span>
                                        </div>
                                        <span className="text-[13px] font-[600] text-white leading-tight">Expert ML Endorsement</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="size-7 rounded-full bg-white/10 flex items-center justify-center text-white shrink-0">
                                            <span className="material-symbols-outlined text-[14px] font-bold">work</span>
                                        </div>
                                        <span className="text-[13px] font-[600] text-white leading-tight">Priority Company Referral</span>
                                    </div>
                                </div>

                                <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 w-full flex flex-col items-center text-center">
                                    <div className="flex items-center gap-3 w-full mb-3">
                                        <div className="size-10 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 shadow-md flex items-center justify-center shrink-0">
                                            <span className="material-symbols-outlined text-white text-[20px]">workspace_premium</span>
                                        </div>
                                        <span className="text-[13px] font-[800] text-white text-left leading-tight">CareerTech Specialist Badge</span>
                                    </div>
                                    <div className="w-full bg-white/40 shadow-[0_0_15px_rgba(255,255,255,0.4)] text-[#2d2a58] py-2 rounded-xl text-[10px] font-[900] tracking-widest uppercase">
                                        GLOWING UNLOCK AVAILABLE
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Challenge Timeline */}
                        <div className="bg-white rounded-[28px] p-7 shadow-[0_2px_16px_rgba(0,0,0,0.02)] border border-slate-100">
                            <h3 className="text-[16px] font-[800] text-slate-900 mb-6">Challenge Timeline</h3>
                            <div className="relative border-l-2 border-slate-100 ml-4 space-y-8">
                                
                                <div className="relative pl-6">
                                    <div className="absolute -left-[11px] top-0.5 size-5 bg-emerald-500 rounded-full flex items-center justify-center border-4 border-white shadow-sm">
                                        <span className="material-symbols-outlined text-[10px] text-white font-bold">check</span>
                                    </div>
                                    <h4 className="text-[13px] font-[800] text-slate-900 leading-tight">Day 1: Release</h4>
                                    <p className="text-[11px] font-[500] text-slate-400 mt-1">Datasets and prompts published</p>
                                </div>

                                <div className="relative pl-6">
                                    <div className="absolute -left-[11px] top-0.5 size-5 bg-white border-2 border-[#5d3fd3] rounded-full flex items-center justify-center shadow-sm">
                                        <div className="size-2 bg-[#5d3fd3] rounded-full"></div>
                                    </div>
                                    <h4 className="text-[13px] font-[800] text-slate-900 leading-tight">Day 3: Eval (Today)</h4>
                                    <p className="text-[11px] font-[500] text-slate-400 mt-1">Mid-point performance review</p>
                                </div>

                                <div className="relative pl-6">
                                    <div className="absolute -left-[11px] top-0.5 size-5 bg-slate-200 rounded-full border-4 border-white shadow-sm"></div>
                                    <h4 className="text-[13px] font-[800] text-slate-400 leading-tight">Day 5: Final</h4>
                                    <p className="text-[11px] font-[500] text-slate-400 mt-1">Submission window closes</p>
                                </div>

                            </div>
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
};

export default ChallengeDetail;
