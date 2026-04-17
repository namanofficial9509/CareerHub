import React, { useState } from 'react';
import { Search, Bell, Settings, Map, ChevronDown, Check, X as CloseIcon, Eye, Bookmark, Sparkles, SlidersHorizontal } from 'lucide-react';
import { motion } from 'motion/react';

const RecruiterTalentHunt = () => {
    const candidates = [
        {
            id: 1,
            name: 'Arjun Sharma',
            school: 'IIT Delhi • Computer Science',
            readiness: 94,
            skills: ['PYTHON', 'REACT'],
            reason: '"Strong React projects, top 3% in UI challenge. Excellent performance in scalable backend architecture."',
            avatar: 'https://i.pravatar.cc/150?img=11'
        },
        {
            id: 2,
            name: 'Priya Patel',
            school: 'BITS Pilani • Data Science',
            readiness: 89,
            skills: ['SQL', 'PANDAS'],
            reason: '"Challenge Winner: Global Data Visualization Hackathon. Highly proficient in predictive modeling pipelines."',
            avatar: 'https://i.pravatar.cc/150?img=5'
        },
        {
            id: 3,
            name: 'Kabir Verma',
            school: 'VIT Vellore • Cybersecurity',
            readiness: 91,
            skills: ['GO', 'DOCKER'],
            reason: '"Outstanding CTF participant. Specialist in container security and cloud-native infrastructure automation."',
            avatar: 'https://i.pravatar.cc/150?img=12'
        }
    ];

    return (
        <div className="relative min-h-[calc(100vh-4rem)] pb-24">
            
            {/* Global Header for this view */}
            <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 py-4 md:py-6 border-b border-slate-200/60 mb-8 bg-transparent">
                <div className="relative w-full max-w-xl">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400" strokeWidth={2} />
                    <input 
                        type="text" 
                        placeholder="Search talent, skills, or institutions..." 
                        className="w-full bg-slate-50 hover:bg-slate-100 transition-colors border border-transparent focus:border-indigo-500/30 focus:bg-white rounded-xl h-12 pl-12 pr-4 text-sm font-medium text-slate-700 outline-none placeholder:text-slate-400"
                    />
                </div>
                
                <div className="flex items-center gap-5 w-full md:w-auto justify-end">
                    <div className="flex items-center gap-2">
                        <button className="relative size-10 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors">
                            <Bell className="size-5" />
                            <span className="absolute top-2 right-2.5 size-2 bg-red-500 rounded-full ring-2 ring-white"></span>
                        </button>
                        <button className="size-10 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors">
                            <Settings className="size-5" />
                        </button>
                    </div>
                    <div className="h-8 w-px bg-slate-200 mx-2"></div>
                    <button className="h-11 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-md shadow-indigo-600/20 transition-all shrink-0">
                        Post Job
                    </button>
                </div>
            </header>

            <div className="flex flex-col xl:flex-row gap-8">
                
                {/* Left Sidebar Filters */}
                <aside className="w-full xl:w-[320px] shrink-0 space-y-6">
                    {/* Main Filter Card */}
                    <div className="bg-white rounded-[1.5rem] border border-slate-100 shadow-sm p-6 lg:p-7">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-lg font-[800] text-slate-900">Filters</h2>
                            <button className="text-[11px] font-bold text-indigo-500 tracking-wider hover:text-indigo-700 uppercase transition-colors">Reset</button>
                        </div>

                        <div className="space-y-8">
                            {/* Readiness Filter */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <label className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">Readiness</label>
                                    <span className="text-[13px] font-bold text-indigo-600 tracking-tight">80+</span>
                                </div>
                                <div className="relative h-1.5 bg-slate-100 rounded-full w-full w-full">
                                    <div className="absolute left-0 top-0 h-full bg-indigo-500 rounded-full" style={{ width: '80%' }}></div>
                                    <div className="absolute top-1/2 -translate-y-1/2 size-4 bg-indigo-600 rounded-full ring-4 ring-indigo-50 shadow-sm" style={{ left: '80%', transform: 'translate(-50%, -50%)' }}></div>
                                </div>
                            </div>

                            {/* Target Skills */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">Target Skills</label>
                                <div className="flex flex-wrap gap-2">
                                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50/50 border border-indigo-100 rounded-lg text-indigo-700 text-[12px] font-semibold tracking-wide">
                                        Python <CloseIcon className="size-3 cursor-pointer hover:text-indigo-900" />
                                    </div>
                                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50/50 border border-indigo-100 rounded-lg text-indigo-700 text-[12px] font-semibold tracking-wide">
                                        React <CloseIcon className="size-3 cursor-pointer hover:text-indigo-900" />
                                    </div>
                                    <button className="px-3 py-1.5 rounded-lg border border-dashed border-slate-300 text-slate-500 text-[12px] font-medium hover:bg-slate-50 transition-colors">
                                        + Add
                                    </button>
                                </div>
                            </div>

                            {/* Work Model */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">Work Model</label>
                                <div className="relative">
                                    <select className="w-full appearance-none bg-slate-50 hover:bg-slate-100 border border-transparent rounded-xl px-4 py-3 text-[14px] font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-colors">
                                        <option>Remote First</option>
                                        <option>Hybrid</option>
                                        <option>On-site</option>
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 size-4 text-slate-500 pointer-events-none" />
                                </div>
                            </div>

                            {/* Badges */}
                            <div className="space-y-4 pt-2">
                                <label className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">Badges</label>
                                <div className="space-y-3">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div className="size-5 rounded-md bg-indigo-600 flex items-center justify-center flex-shrink-0">
                                            <Check className="size-3.5 text-white" strokeWidth={3} />
                                        </div>
                                        <span className="text-[13.5px] font-medium text-slate-700 group-hover:text-slate-900">Top 5% Performers</span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div className="size-5 rounded-md border-2 border-slate-200 group-hover:border-slate-300 flex items-center justify-center flex-shrink-0 transition-colors">
                                        </div>
                                        <span className="text-[13.5px] font-medium text-slate-600 group-hover:text-slate-800">Challenge Winners</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* AI Matching Callout */}
                    <div className="bg-[#EEF2FB] rounded-[1.25rem] p-6 relative overflow-hidden group border border-indigo-100/50">
                       <div className="absolute top-0 right-0 p-4 opacity-10 blur-xl pointer-events-none">
                            <Sparkles className="size-24 text-indigo-500" />
                       </div>
                       <div className="flex items-center gap-2 mb-4 relative z-10">
                           <Sparkles className="size-4 text-indigo-600" strokeWidth={2.5} />
                           <span className="text-[11px] font-bold text-indigo-700 tracking-widest uppercase">AI Matching</span>
                       </div>
                       <p className="text-[13.5px] text-slate-700 leading-relaxed font-medium mb-5 relative z-10">
                           <strong className="text-slate-900 font-[800]">124 candidates</strong> match your profile since yesterday.
                       </p>
                       <button className="w-full bg-white text-indigo-600 font-bold text-[13px] py-3 rounded-xl shadow-sm hover:shadow-md transition-all active:scale-[0.98] border border-white relative z-10">
                           Review Matches
                       </button>
                    </div>
                </aside>

                {/* Right Main Content */}
                <div className="flex-1 w-full space-y-6">
                    {/* Header Row */}
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
                        <div>
                            <h1 className="text-[28px] font-[900] text-slate-900 leading-tight">Verified Talent Pool</h1>
                            <p className="text-[15px] text-slate-500 font-medium mt-1">
                                Sourcing from <strong className="text-slate-800 font-[800]">1,245 students</strong> globally
                            </p>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                            <button className="flex items-center gap-3 bg-white px-5 py-2.5 rounded-full border border-slate-200 text-[13px] font-semibold text-slate-600 shadow-sm hover:bg-slate-50 transition-colors">
                                <SlidersHorizontal className="size-4" strokeWidth={2} />
                                Sort: <span className="text-indigo-600 font-bold whitespace-nowrap">Best Match</span>
                            </button>
                        </div>
                    </div>

                    {/* Candidate Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {candidates.map((candidate, index) => (
                            <motion.div 
                                key={candidate.id}
                                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{ delay: index * 0.1, ease: 'easeOut' }}
                                className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.05)] p-6 md:p-8 flex flex-col group hover:shadow-[0_8px_30px_-6px_rgba(0,0,0,0.1)] transition-all duration-300"
                            >
                                {/* Top Row: Avatar & Readiness */}
                                <div className="flex justify-between items-start mb-6">
                                    <div className="relative">
                                        <div className="size-16 rounded-2xl overflow-hidden bg-slate-100 ring-4 ring-slate-50 shadow-sm border border-slate-200">
                                            <img src={candidate.avatar} alt={candidate.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="absolute -bottom-1.5 -right-1.5 bg-blue-600 text-white size-5 rounded-full flex items-center justify-center ring-2 ring-white shadow-sm">
                                            <Check className="size-3" strokeWidth={4} />
                                        </div>
                                    </div>
                                    <div className="text-right flex flex-col items-end">
                                        <span className="text-[9px] font-black text-slate-400 tracking-widest uppercase mb-0.5">Readiness</span>
                                        <div className="flex items-baseline">
                                            <span className="text-[26px] font-[900] text-slate-900 tracking-tighter leading-none">{candidate.readiness}</span>
                                            <span className="text-[12px] font-bold text-slate-400 ml-0.5">%</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Identity */}
                                <div className="mb-4 space-y-1">
                                    <h3 className="text-[18px] font-[800] text-slate-900 tracking-tight">{candidate.name}</h3>
                                    <p className="text-[13px] font-medium text-slate-500 leading-snug">{candidate.school}</p>
                                </div>

                                {/* Skill Pills */}
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {candidate.skills.map((skill, si) => (
                                        <span key={si} className="bg-slate-50 border border-slate-100 text-slate-600 px-3 py-1.5 rounded-lg text-[10px] font-[800] tracking-widest uppercase">
                                            {skill}
                                        </span>
                                    ))}
                                </div>


                                {/* AI Recommendation Bubble */}
                                <div className="bg-[#F8F9FE] rounded-[1.25rem] p-5 mb-6 border border-indigo-50/50 flex-1 relative overflow-hidden group-hover:bg-[#F3F5FC] transition-colors">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Sparkles className="size-3.5 text-indigo-500" strokeWidth={2.5}/>
                                        <span className="text-[10px] font-bold text-indigo-600 tracking-widest uppercase">Why Recommended</span>
                                    </div>
                                    <p className="text-[13px] text-slate-600 italic font-medium leading-relaxed font-serif relative z-10">
                                        {candidate.reason}
                                    </p>
                                </div>

                                {/* Action Bar */}
                                <div className="flex items-center gap-3 mt-auto pt-2">
                                    <button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-[13.5px] font-bold py-3 rounded-xl shadow-md shadow-indigo-600/20 transition-colors">
                                        Invite to Interview
                                    </button>
                                    <button className="size-[44px] rounded-xl bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors border border-transparent hover:border-slate-200/50 shrink-0">
                                        <Eye className="size-5" strokeWidth={2} />
                                    </button>
                                    <button className="size-[44px] rounded-xl bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors border border-transparent hover:border-slate-200/50 shrink-0">
                                        <Bookmark className="size-5" strokeWidth={2} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Pagination Footer */}
                    <div className="flex flex-col sm:flex-row items-center justify-between pt-10 pb-6 gap-6">
                        <span className="text-[13px] font-bold text-slate-400">Showing 1-12 of 1,245 candidates</span>
                        <div className="flex items-center gap-2">
                            <button className="size-9 flex items-center justify-center rounded-xl text-slate-400 hover:bg-slate-50 hover:text-slate-700 transition-colors cursor-not-allowed opacity-50">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="rotate-180">
                                    <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </button>
                            <button className="size-9 rounded-xl flex items-center justify-center bg-indigo-600 text-white text-sm font-bold shadow-md shadow-indigo-600/20">1</button>
                            <button className="size-9 rounded-xl flex items-center justify-center hover:bg-slate-50 text-slate-500 hover:text-slate-800 text-sm font-bold transition-colors">2</button>
                            <button className="size-9 rounded-xl flex items-center justify-center hover:bg-slate-50 text-slate-500 hover:text-slate-800 text-sm font-bold transition-colors">3</button>
                            <span className="flex items-end justify-center size-9 text-slate-400 tracking-widest pb-2">...</span>
                            <button className="size-9 flex items-center justify-center rounded-xl text-slate-400 hover:bg-slate-50 hover:text-slate-700 transition-colors">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating Map Button */}
            <button className="fixed bottom-8 right-8 z-50 bg-[#0A1128] hover:bg-slate-900 text-white flex items-center justify-center gap-3 h-[52px] px-6 rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.2)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.3)] transition-all active:scale-95 group border border-slate-700/50">
                <Map className="size-5 text-indigo-400 group-hover:text-indigo-300 transition-colors" strokeWidth={2.5}/>
                <span className="text-[14px] font-[800] tracking-wide">Explore Map View</span>
            </button>
            
        </div>
    );
};

export default RecruiterTalentHunt;
