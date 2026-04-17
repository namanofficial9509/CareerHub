import React, { useState } from 'react';
import { Lightbulb, Bookmark, MoreHorizontal, MessageSquare, Video, ChevronDown, Check, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const RecruiterRecommendations = () => {
    const [showNotification, setShowNotification] = useState(true);

    const candidates = [
        {
            id: 1,
            name: 'Alexandra Chen',
            school: 'Stanford University • Computer Science',
            matchScore: '98%',
            badges: [
                { text: 'HACKATHON WINNER', color: 'text-amber-700', bg: 'bg-amber-100/50', border: 'border-amber-200' },
                { text: 'TOP 1% REACT', color: 'text-blue-600', bg: 'bg-blue-50/50', border: 'border-blue-100' }
            ],
            reason: 'Alexandra outperformed 450+ students in the Advanced Python Challenge and has demonstrated strong full-stack experience through a 6-month open-source contribution to a high-traffic React framework.',
            location: 'Palo Alto, CA (Remote)',
            availability: 'June 2024',
            avatar: 'https://i.pravatar.cc/150?img=47',
            status: 'online'
        },
        {
            id: 2,
            name: 'Jordan Miller',
            school: 'MIT • EE & Computer Science',
            matchScore: '94%',
            badges: [
                { text: 'ALGORITHM SPECIALIST', color: 'text-purple-700', bg: 'bg-purple-50/50', border: 'border-purple-200' },
                { text: 'STRIPE ALUMNUS', color: 'text-emerald-700', bg: 'bg-emerald-50/50', border: 'border-emerald-200' }
            ],
            reason: 'Jordan ranked in the 99th percentile for system design and has practical experience scaling high-load payment infrastructure. Highly proficient in Go and SQL.',
            location: 'Cambridge, MA',
            availability: 'May 2024',
            avatar: 'https://i.pravatar.cc/150?img=13',
            status: 'offline'
        }
    ];

    return (
        <div className="relative min-h-[calc(100vh-4rem)] pb-24 pt-6">
            
            <div className="flex flex-col xl:flex-row gap-10">
                
                {/* Left Sidebar Filters */}
                <aside className="w-full xl:w-[300px] shrink-0 space-y-10 pl-2">
                    
                    {/* Match Score */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="text-[11px] font-[800] text-slate-400 tracking-[0.15em] uppercase">Match Score</label>
                            <span className="text-[13px] font-bold text-indigo-700 tracking-tight">70% - 100%</span>
                        </div>
                        <div className="relative pt-2 pb-6">
                            <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-1.5 bg-slate-200 rounded-full"></div>
                            {/* Selected Range Line */}
                            <div className="absolute top-1/2 -translate-y-1/2 h-1.5 bg-indigo-600 rounded-full" style={{ left: '70%', right: '0%' }}></div>
                            
                            {/* Thumb Left */}
                            <div className="absolute top-1/2 -translate-y-1/2 size-[14px] bg-indigo-600 rounded-full ring-4 ring-white shadow-sm cursor-pointer z-10" style={{ left: '70%', transform: 'translate(-50%, -50%)' }}></div>
                            {/* Thumb Right */}
                            <div className="absolute top-1/2 -translate-y-1/2 size-[14px] bg-indigo-600 rounded-full ring-4 ring-white shadow-sm cursor-pointer z-10" style={{ right: '0%', transform: 'translate(50%, -50%)' }}></div>
                            
                            {/* Labels */}
                            <div className="absolute mt-4 w-full flex justify-between text-[10px] font-[800] text-slate-400">
                                <span>0%</span>
                                <span>50%</span>
                                <span>100%</span>
                            </div>
                        </div>
                    </div>

                    {/* Required Skills */}
                    <div className="space-y-4">
                        <label className="text-[11px] font-[800] text-slate-400 tracking-[0.15em] uppercase">Required Skills</label>
                        <div className="flex flex-wrap gap-2.5">
                            <div className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-100 border border-indigo-100 rounded-full text-indigo-700 text-[12px] font-bold tracking-wide transition-colors cursor-pointer hover:bg-indigo-200 flex-shrink-0">
                                Python <X className="size-3 text-indigo-500" strokeWidth={3} />
                            </div>
                            <div className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-100 border border-indigo-100 rounded-full text-indigo-700 text-[12px] font-bold tracking-wide transition-colors cursor-pointer hover:bg-indigo-200 flex-shrink-0">
                                React <X className="size-3 text-indigo-500" strokeWidth={3} />
                            </div>
                            <div className="flex items-center gap-1.5 px-3.5 py-1.5 bg-transparent border border-transparent rounded-full text-slate-600 text-[12px] font-[800] tracking-wide transition-colors cursor-pointer hover:bg-slate-100 flex-shrink-0">
                                SQL
                            </div>
                            <div className="flex items-center gap-1.5 px-3.5 py-1.5 bg-transparent border border-transparent rounded-full text-slate-600 text-[12px] font-[800] tracking-wide transition-colors cursor-pointer hover:bg-slate-100 flex-shrink-0">
                                Node.js
                            </div>
                        </div>
                    </div>

                    {/* University Tier */}
                    <div className="space-y-4">
                        <label className="text-[11px] font-[800] text-slate-400 tracking-[0.15em] uppercase">University Tier</label>
                        <div className="space-y-3">
                            <label className="flex items-center gap-3.5 cursor-pointer group">
                                <div className="size-5 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                                    <Check className="size-3.5 text-white" strokeWidth={3} />
                                </div>
                                <span className="text-[14px] font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">Tier 1 (Ivy League / Elite)</span>
                            </label>
                            <label className="flex items-center gap-3.5 cursor-pointer group">
                                <div className="size-5 rounded-full bg-white border border-slate-300 flex items-center justify-center flex-shrink-0 group-hover:border-slate-400 transition-colors">
                                </div>
                                <span className="text-[14px] font-semibold text-slate-600 group-hover:text-slate-800 transition-colors">Tier 2 (Highly Selective)</span>
                            </label>
                        </div>
                    </div>

                    {/* AI Insight Callout */}
                    <div className="bg-[#EEF2FC] rounded-2xl p-6 relative overflow-hidden group border border-[#E3EAFA]">
                       <div className="flex items-center gap-2 mb-3 relative z-10">
                           <Lightbulb className="size-4 text-indigo-600" strokeWidth={2.5} />
                           <span className="text-[12px] font-[900] text-indigo-700 tracking-wide">AI Insight</span>
                       </div>
                       <p className="text-[13px] text-slate-600 leading-[1.6] font-medium relative z-10 pr-2">
                           Recommendations are prioritized based on verified technical skill assessments, real-world project contributions, and top 5% performance in recent coding challenges.
                       </p>
                    </div>

                </aside>

                {/* Right Main Content */}
                <div className="flex-1 w-full flex flex-col gap-8 pb-32">
                    
                    {candidates.map((candidate, index) => (
                        <motion.div 
                            key={candidate.id}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, ease: 'easeOut' }}
                            className="bg-white rounded-[1.5rem] border border-slate-100 shadow-[0_2px_15px_-5px_rgba(0,0,0,0.05)] p-6 sm:p-8 flex flex-col transition-all duration-300 relative group"
                        >
                            {/* Card Header */}
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                                <div className="flex items-start gap-4">
                                    {/* Avatar */}
                                    <div className="relative shrink-0">
                                        <div className="size-16 rounded-full overflow-hidden bg-slate-100 border border-slate-200">
                                            <img src={candidate.avatar} alt={candidate.name} className="w-full h-full object-cover" />
                                        </div>
                                        {/* Status Dot */}
                                        {candidate.status === 'online' && (
                                            <div className="absolute bottom-0 right-0 size-3.5 bg-emerald-500 rounded-full ring-2 ring-white"></div>
                                        )}
                                    </div>
                                    
                                    {/* Name & Meta */}
                                    <div className="flex flex-col border-b border-transparent">
                                        <div className="flex flex-wrap items-center gap-3 mb-1">
                                            <h2 className="text-[20px] font-[800] text-slate-900 leading-none">{candidate.name}</h2>
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#4012DE] text-white text-[12px] font-[900] tracking-wide shadow-sm shadow-indigo-600/30">
                                                <Sparkles className="size-3" strokeWidth={3} /> {candidate.matchScore} Match
                                            </span>
                                        </div>
                                        <p className="text-[14px] font-semibold text-slate-500 leading-snug">{candidate.school}</p>
                                    </div>
                                </div>
                                
                                {/* Right Actions */}
                                <div className="flex items-center gap-2 shrink-0">
                                    <button className="size-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors">
                                        <Bookmark className="size-4" strokeWidth={2.5} />
                                    </button>
                                    <button className="size-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors">
                                        <MoreHorizontal className="size-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Tags Row */}
                            <div className="pl-0 sm:pl-[5rem] mb-6 flex flex-wrap gap-2">
                                {candidate.badges.map((badge, si) => (
                                    <span key={si} className={`px-2.5 py-1 rounded-full text-[10px] sm:text-[10px] font-[900] tracking-widest uppercase border ${badge.bg} ${badge.color} ${badge.border}`}>
                                        {badge.text}
                                    </span>
                                ))}
                            </div>

                            {/* Why Recommended AI Box */}
                            <div className="bg-[#F5F3FF] rounded-[1.25rem] p-6 mb-8 border border-[#EDE9FE] relative">
                                <div className="absolute top-4 left-4 size-6 rounded-md bg-indigo-100/80 flex items-center justify-center">
                                     <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-indigo-600">
                                         <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 18C11.45 18 11 17.55 11 17V11C11 10.45 11.45 10 12 10C12.55 10 13 10.45 13 11V17C13 17.55 12.55 18 12 18ZM13 8C13 8.55 12.55 9 12 9C11.45 9 11 8.55 11 8C11 7.45 11.45 7 12 7C12.55 7 13 7.45 13 8Z" fill="currentColor"/>
                                     </svg>
                                </div>
                                <p className="text-[14px] text-slate-700 leading-relaxed font-medium pl-10">
                                    <strong className="text-indigo-700 font-bold mr-1">Why Recommended:</strong>
                                    {candidate.reason}
                                </p>
                            </div>

                            {/* Footer Divider */}
                            <hr className="border-t border-slate-100 mb-6" />

                            {/* Card Footer */}
                            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                                {/* Metadata */}
                                <div className="flex gap-10">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[10px] font-black text-slate-400 tracking-widest uppercase">Location</span>
                                        <span className="text-[14px] font-[800] text-slate-800">{candidate.location}</span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[10px] font-black text-slate-400 tracking-widest uppercase">Availability</span>
                                        <span className="text-[14px] font-[800] text-slate-800">{candidate.availability}</span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-3 w-full lg:w-auto">
                                    <button className="flex-1 lg:flex-none px-4 py-3 text-[14px] font-bold text-slate-700 hover:text-slate-900 transition-colors whitespace-nowrap hidden sm:block">
                                        View Full Profile
                                    </button>
                                    <button className="flex-1 lg:flex-none h-[44px] px-6 rounded-full bg-slate-100 flex items-center justify-center gap-2 text-slate-800 hover:bg-slate-200 transition-colors font-bold text-[14px] whitespace-nowrap">
                                        <MessageSquare className="size-4" strokeWidth={2.5}/>
                                        Message
                                    </button>
                                    <button className="flex-1 lg:flex-none h-[44px] px-6 rounded-full bg-[#4012DE] flex items-center justify-center gap-2 text-white hover:bg-indigo-700 transition-colors font-bold text-[14px] shadow-md shadow-indigo-600/20 whitespace-nowrap">
                                        <Video className="size-4" fill="currentColor" strokeWidth={0}/>
                                        Invite to Interview
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}

                    {/* Load More Button */}
                    <div className="mt-4">
                        <button className="w-full py-6 rounded-[1.5rem] border-2 border-dashed border-slate-200 bg-transparent hover:bg-slate-50 transition-colors flex items-center justify-center gap-3 text-slate-400 font-bold group">
                            <ChevronDown className="size-5 group-hover:translate-y-0.5 transition-transform" />
                            <span className="text-[15px]">Load 10 More AI Recommendations</span>
                        </button>
                    </div>

                </div>
            </div>

            {/* Floating Notification Toast */}
            <AnimatePresence>
                {showNotification && (
                    <motion.div 
                        initial={{ opacity: 0, y: 50, x: '-50%' }}
                        animate={{ opacity: 1, y: 0, x: '-50%' }}
                        exit={{ opacity: 0, y: 20, x: '-50%' }}
                        className="fixed bottom-10 left-[55%] -translate-x-1/2 z-50 bg-[#0B1120] text-white rounded-xl shadow-2xl px-5 py-4 flex items-center gap-4 min-w-[380px] w-[90%] sm:w-auto shadow-black/20"
                    >
                        <div className="flex items-center gap-3 flex-1">
                            <Sparkles className="size-5 text-indigo-400" />
                            <span className="text-[14px] font-[800] tracking-wide">12 new matches based on updated filters.</span>
                        </div>
                        <button 
                            onClick={() => setShowNotification(false)}
                            className="text-[11px] font-[800] tracking-[0.1em] uppercase text-slate-400 hover:text-white transition-colors shrink-0"
                        >
                            Dismiss
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
            
        </div>
    );
};

export default RecruiterRecommendations;
