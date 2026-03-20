import { useState } from 'react';
import {
    TrendingUp,
    Terminal,
    Check,
    Layers,
    Cloud,
    Lock,
    Brain,
    Sparkles,
    Video,
    BookOpen,
    PlayCircle,
    ArrowRight,
    Award,
    Code,
    Timer,
    Zap,
    Flag,
    Rocket,
    X,
    ExternalLink
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { 
    calculateIntelligenceScore, 
    calculateSkillLevel, 
    getBehavioralInsight,
    generateWeeklyGoals,
    performSkillGapAnalysis
} from '../../lib/intelligenceEngine';
import { ROADMAP_RESOURCES } from '../../lib/roadmapResources';
import { motion, AnimatePresence } from 'framer-motion';

const Roadmap = () => {
    const { userData } = useAuth();
    const metrics = userData?.metrics || {};
    const [selectedResource, setSelectedResource] = useState(null);
    
    // Logic for dynamic stats
    const rawScore = calculateIntelligenceScore(userData);
    const readinessPercent = Math.min(Math.round(rawScore / 10), 100);
    const careerXP = (metrics.leetcode_solved || 0) * 10 + (metrics.total_projects || 0) * 50 + (metrics.research_papers || 0) * 100;
    const level = Math.floor(rawScore / 100) + 1;
    const skillLevel = calculateSkillLevel(metrics);
    
    // Dynamic Phase 1 Status
    const dsaMastered = (metrics.leetcode_solved || 0) >= 100;
    const osMastered = (metrics.cgpa || 0) > 0;
    
    // AI Helper Data
    const weeklyGoals = generateWeeklyGoals(userData);
    const skillGaps = performSkillGapAnalysis(userData);

    // Next Step Logic
    const nextStep = userData?.career_dna?.learning_goal || (skillGaps[0]?.skill ? `Master ${skillGaps[0].skill}` : "Master Node.js Authentication");
    const nextStepDesc = `Unlock higher-paying roles by bridging your ${nextStep.split(' ').slice(-1)[0]} gap and mastering advanced design patterns.`;

    const ResourceModal = ({ resource, onClose }) => {
        if (!resource) return null;
        
        return (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-slate-900/60 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div 
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800"
                    onClick={e => e.stopPropagation()}
                >
                    <div className="relative h-48 bg-gradient-to-br from-indigo-600 to-purple-700 p-8 flex flex-col justify-end">
                        <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-all">
                            <X className="size-5" />
                        </button>
                        <div className="flex items-center gap-3 mb-2 text-indigo-100 uppercase text-[10px] font-black tracking-widest">
                            <Sparkles className="size-4" /> Curated Resources
                        </div>
                        <h3 className="text-3xl font-black text-white tracking-tight">{resource.title}</h3>
                    </div>

                    <div className="p-8">
                        <div className="space-y-8">
                            {/* Videos Section */}
                            <div>
                                <h4 className="flex items-center gap-2 text-slate-900 dark:text-white font-black text-sm uppercase tracking-tight mb-4">
                                    <Video className="size-4 text-indigo-600" /> Essential Masterclasses
                                </h4>
                                <div className="grid grid-cols-1 gap-3">
                                    {resource.videos.map((vid, i) => (
                                        <a key={i} href={vid.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 border border-transparent hover:border-indigo-100 dark:hover:border-indigo-800 rounded-2xl transition-all group">
                                            <div className="flex items-center gap-4">
                                                <div className="size-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                                    <PlayCircle className="size-5 text-indigo-600" />
                                                </div>
                                                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{vid.title}</span>
                                            </div>
                                            <ExternalLink className="size-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                                        </a>
                                    ))}
                                </div>
                            </div>

                            {/* Docs Section */}
                            <div>
                                <h4 className="flex items-center gap-2 text-slate-900 dark:text-white font-black text-sm uppercase tracking-tight mb-4">
                                    <BookOpen className="size-4 text-purple-600" /> Technical Documentation
                                </h4>
                                <div className="flex flex-wrap gap-3">
                                    {resource.docs.map((doc, i) => (
                                        <a key={i} href={doc.url} target="_blank" rel="noopener noreferrer" className="px-5 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:border-purple-500 hover:text-purple-600 transition-all flex items-center gap-2">
                                            {doc.title} <ExternalLink className="size-3" />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="mt-10 pt-6 border-t border-slate-100 dark:border-slate-800/50 flex justify-between items-center">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mastery Level: {resource.level}</p>
                            <button onClick={onClose} className="px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-black text-xs hover:scale-105 transition-all">
                                Got it, thanks!
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        );
    };

    return (
        <div className="max-w-[1440px] mx-auto pb-24 relative transition-colors">
            <AnimatePresence>
                {selectedResource && (
                    <ResourceModal 
                        resource={selectedResource} 
                        onClose={() => setSelectedResource(null)} 
                    />
                )}
            </AnimatePresence>

            {/* Background Decor */}
            <div className="fixed top-[-10%] left-[-5%] size-[500px] bg-indigo-600/10 blur-[150px] rounded-full pointer-events-none -z-10"></div>
            <div className="fixed bottom-[5%] right-[0%] size-[500px] bg-purple-600/10 blur-[150px] rounded-full pointer-events-none -z-10"></div>

            <div className="grid grid-cols-12 gap-8">
                {/* Main Journey Content */}
                <div className="col-span-12 lg:col-span-8 flex flex-col">
                    
                    {/* Next Recommended Action (High Visibility) */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 rounded-[2.5rem] shadow-xl shadow-blue-500/20 mb-12 relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full -mr-32 -mt-32 transition-transform group-hover:scale-110 duration-1000"></div>
                        
                        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black text-white uppercase tracking-wider">Recommended Next Step</span>
                                    <span className="flex items-center gap-1 text-blue-100 text-[10px] font-bold">
                                        <Timer className="size-3" /> Smart Priority
                                    </span>
                                </div>
                                <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">{nextStep}</h2>
                                <p className="text-blue-100/80 text-sm font-medium max-w-md leading-relaxed">
                                    {nextStepDesc}
                                </p>
                            </div>
                            <button 
                                onClick={() => setSelectedResource(ROADMAP_RESOURCES.mern)}
                                className="bg-white text-blue-600 px-8 py-4 rounded-3xl font-black text-[15px] shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-3 shrink-0"
                            >
                                <Rocket className="size-5" /> Start Learning Now
                            </button>
                        </div>
                    </motion.div>

                    {/* Journey Stats Dashboard */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                        {[
                            { label: 'Overall Readiness', val: `${readinessPercent}%`, sub: skillLevel, color: 'text-emerald-500', icon: Rocket },
                            { label: 'Level', val: `LVL ${level}`, sub: 'Career Growth', color: 'text-blue-500', icon: Zap },
                            { label: 'Career XP', val: careerXP.toLocaleString(), sub: 'Total Points', color: 'text-purple-500', icon: Sparkles },
                            { label: 'Metrics', val: `${metrics.total_projects || 0} Proj`, sub: `${metrics.leetcode_solved || 0} DSA`, color: 'text-orange-500', icon: Flag }
                        ].map((stat, i) => (
                            <motion.div 
                                key={i} 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl shadow-sm transition-all hover:border-blue-200 dark:hover:border-blue-500"
                            >
                                <div className="flex items-center gap-2 mb-3">
                                    <div className={`size-8 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center ${stat.color}`}>
                                        <stat.icon className="size-4" />
                                    </div>
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-tight">{stat.label}</span>
                                </div>
                                <p className="text-2xl font-black text-slate-900 dark:text-white">{stat.val}</p>
                                <p className={`text-[10px] font-bold mt-1 ${stat.color}`}>{stat.sub}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Snake Journey Area */}
                    <div className="relative min-h-[1200px] flex flex-col items-center">
                        {/* SVG Path */}
                        <svg className="absolute top-0 left-1/2 -translate-x-1/2 z-0 w-[600px] h-full pointer-events-none hidden md:block" fill="none" viewBox="0 0 600 1200">
                            <defs>
                                <linearGradient id="pathGradient" x1="300" y1="0" x2="300" y2="1200" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#2563eb" />
                                    <stop offset="0.5" stopColor="#8b5cf6" />
                                    <stop offset="1" stopColor="#3b82f6" strokeOpacity="0.3" />
                                </linearGradient>
                            </defs>
                            <path d="M300 0V150C300 150 300 250 100 250C-100 250 100 450 300 450C500 450 700 650 500 650C300 650 100 650 100 850C100 1050 300 1050 300 1200" stroke="url(#pathGradient)" strokeWidth="6" strokeDasharray="16 16" />
                        </svg>

                        {/* Phase 1: Completed Foundations */}
                        <div className="relative z-10 w-full flex flex-col items-center gap-10 mb-32">
                            <div className="px-6 py-2 bg-emerald-500 text-white rounded-full text-[11px] font-black uppercase tracking-[0.2em] shadow-lg shadow-emerald-500/20">
                                Phase 1: The Core Foundations
                            </div>
                            
                            <div className="flex flex-wrap justify-center gap-12">
                                {/* DSA Card */}
                                <div 
                                    onClick={() => setSelectedResource(ROADMAP_RESOURCES.dsa)}
                                    className={`w-[280px] bg-white dark:bg-slate-900 rounded-[2rem] p-6 border-2 ${dsaMastered ? 'border-emerald-500 shadow-emerald-500/5' : 'border-slate-200 dark:border-slate-800'} relative group cursor-pointer hover:-translate-y-2 transition-all shadow-xl`}
                                >
                                    {dsaMastered && (
                                        <div className="absolute -top-3 -right-3 size-10 bg-emerald-500 rounded-full flex items-center justify-center border-4 border-white dark:border-slate-800 text-white shadow-lg">
                                            <Check className="size-5 stroke-[4]" />
                                        </div>
                                    )}
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className={`size-12 rounded-2xl flex items-center justify-center ${dsaMastered ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
                                            <Terminal className="size-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-slate-900 dark:text-white leading-tight">Data Structures</h4>
                                            <p className={`text-[10px] font-bold uppercase ${dsaMastered ? 'text-emerald-600' : 'text-slate-400'}`}>{dsaMastered ? 'Mastered' : 'Recommended'}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-2 mb-4">
                                        {['Arrays & Lists', 'Trees & Graphs', 'O(n) Analysis'].map(tag => (
                                            <div key={tag} className="flex items-center gap-2 text-[11px] font-bold text-slate-500">
                                                <div className={`size-1 rounded-full ${dsaMastered ? 'bg-emerald-500' : 'bg-slate-300'}`}></div> {tag}
                                            </div>
                                        ))}
                                    </div>
                                    <button className="w-full py-3 bg-indigo-600 text-white text-[11px] font-black rounded-xl hover:bg-indigo-700 transition-colors uppercase shadow-md shadow-indigo-500/20">Open Resources</button>
                                </div>

                                {/* OS Card */}
                                <div 
                                    onClick={() => setSelectedResource(ROADMAP_RESOURCES.os)}
                                    className={`w-[280px] bg-white dark:bg-slate-900 rounded-[2rem] p-6 border-2 ${osMastered ? 'border-emerald-500 shadow-emerald-500/5' : 'border-slate-200 dark:border-slate-800'} relative group cursor-pointer hover:-translate-y-2 transition-all shadow-xl`}
                                >
                                    {osMastered && (
                                        <div className="absolute -top-3 -right-3 size-10 bg-emerald-500 rounded-full flex items-center justify-center border-4 border-white dark:border-slate-800 text-white shadow-lg">
                                            <Check className="size-5 stroke-[4]" />
                                        </div>
                                    )}
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className={`size-12 rounded-2xl flex items-center justify-center ${osMastered ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
                                            <Code className="size-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-slate-900 dark:text-white leading-tight">Operating Systems</h4>
                                            <p className={`text-[10px] font-bold uppercase ${osMastered ? 'text-emerald-600' : 'text-slate-400'}`}>{osMastered ? 'Mastered' : 'Up Next'}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-2 mb-4">
                                        {['Processes', 'Memory Mgmt', 'File Systems'].map(tag => (
                                            <div key={tag} className="flex items-center gap-2 text-[11px] font-bold text-slate-500">
                                                <div className={`size-1 rounded-full ${osMastered ? 'bg-emerald-500' : 'bg-slate-300'}`}></div> {tag}
                                            </div>
                                        ))}
                                    </div>
                                    <button className="w-full py-3 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-[11px] font-black rounded-xl hover:bg-slate-100 transition-colors uppercase">View Guide</button>
                                </div>
                            </div>
                        </div>

                        {/* Phase 2: Active Specialization */}
                        <div className="relative z-10 w-full flex flex-col items-center gap-10 mb-32">
                            <div className="px-6 py-2 bg-blue-600 text-white rounded-full text-[11px] font-black uppercase tracking-[0.2em] shadow-lg shadow-blue-500/20">
                                Phase 2: Professional Specialization
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 w-full max-w-4xl px-10">
                                {/* Specialization Card Based on Projects/Languages */}
                                <div 
                                    onClick={() => setSelectedResource(ROADMAP_RESOURCES.mern)}
                                    className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border-4 border-blue-600 shadow-2xl shadow-blue-500/10 relative overflow-hidden group cursor-pointer transition-all hover:scale-[1.02]"
                                >
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/5 rotate-45 -mr-12 -mt-12 group-hover:scale-150 transition-transform"></div>
                                    
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="size-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                                            <Layers className="size-8" />
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Journey</p>
                                            <h3 className="text-2xl font-black text-slate-900 dark:text-white">MERN Stack</h3>
                                        </div>
                                    </div>
                                    
                                    <div className="mb-8">
                                        <div className="flex justify-between text-[11px] font-black text-slate-900 dark:text-white mb-2 uppercase">
                                            <span>Progress</span>
                                            <span>{Math.min(20 + (metrics.total_projects || 0) * 15, 100)}%</span>
                                        </div>
                                        <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-blue-600 rounded-full transition-all duration-1000" style={{ width: `${Math.min(20 + (metrics.total_projects || 0) * 15, 100)}%` }}></div>
                                        </div>
                                        <p className="text-[10px] font-bold text-slate-500 mt-2">
                                            {(metrics.total_projects || 0) >= 3 ? 'Building advanced prototypes' : 'Build more projects to reach 75%'}
                                        </p>
                                    </div>

                                    <div className="space-y-3 mb-8">
                                        {[
                                            { label: 'React Basics', done: (metrics.total_projects || 0) >= 1 },
                                            { label: 'REST APIs', done: (metrics.total_projects || 0) >= 2 },
                                            { label: 'Authentication', done: (metrics.total_projects || 0) >= 4 },
                                            { label: 'Deployment', done: (metrics.total_projects || 0) >= 6 }
                                        ].map(mod => (
                                            <div key={mod.label} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-transparent hover:border-blue-100 transition-all">
                                                <span className={`text-xs font-bold ${mod.done ? 'text-slate-400 line-through' : 'text-slate-900 dark:text-white'}`}>{mod.label}</span>
                                                {mod.done ? (
                                                    <Check className="size-4 text-emerald-500 font-bold" />
                                                ) : (
                                                    <span className="text-[10px] font-black text-blue-600 uppercase">Current</span>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    <button className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all text-[15px] flex items-center justify-center gap-2 uppercase tracking-tight">
                                        Resource Pack <ArrowRight className="size-4" />
                                    </button>
                                </div>

                                {/* Secondary Goal */}
                                <div 
                                    onClick={() => setSelectedResource(ROADMAP_RESOURCES.cloud)}
                                    className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border-2 border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-500/5 relative overflow-hidden flex flex-col cursor-pointer hover:border-indigo-400 transition-all"
                                >
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="size-14 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400">
                                            <Cloud className="size-8" />
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Secondary Goal</p>
                                            <h3 className="text-2xl font-black text-slate-900 dark:text-white">Cloud Systems</h3>
                                        </div>
                                    </div>

                                    <div className="mb-8 mt-auto">
                                        <p className="text-[10px] font-black text-blue-600 uppercase mb-1">Expert Context</p>
                                        <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                                            Cloud knowledge increases backend salary prospects by **25%** for {userData?.career_dna?.target_role || 'Developers'}.
                                        </p>
                                    </div>

                                    <button className="w-full py-4 border-2 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-black rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-[15px] uppercase">Review Cloud Path</button>
                                </div>
                            </div>
                        </div>

                        {/* Phase 3: Locked Career readiness */}
                        <div className="relative z-10 w-full flex flex-col items-center gap-10">
                            <div className="px-6 py-2 bg-indigo-600 text-white rounded-full text-[11px] font-black uppercase tracking-[0.2em] shadow-lg shadow-indigo-500/20">
                                Phase 3: Total Career Readiness
                            </div>
                            
                            <div className="flex flex-wrap justify-center gap-10">
                                {[
                                    { icon: 'description', label: 'Pro Resume Studio', unlock: 'Level 5' },
                                    { icon: 'forum', label: 'AI Mock Interviews', unlock: 'Level 6' }
                                ].map((node, i) => (
                                    <div key={i} className="w-[200px] flex flex-col items-center text-center opacity-60">
                                        <div className="size-24 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 flex items-center justify-center relative shadow-lg">
                                            <span className="material-symbols-outlined text-4xl text-slate-300 dark:text-slate-600">{node.icon}</span>
                                            <div className="absolute -top-3 -right-3 size-10 bg-indigo-600 rounded-full flex items-center justify-center border-4 border-white dark:border-slate-800 text-white shadow-xl">
                                                <Lock className="size-5" />
                                            </div>
                                        </div>
                                        <p className="mt-4 font-black text-slate-900 dark:text-white text-sm">{node.label}</p>
                                        <p className="text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-tighter">Requires: {node.unlock}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar */}
                <aside className="col-span-12 lg:col-span-4 flex flex-col gap-6 lg:sticky lg:top-24 h-fit">
                    
                    {/* Career Milestones */}
                    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
                        <h3 className="font-black text-lg mb-8 text-slate-900 dark:text-white uppercase tracking-tight">Milestones</h3>
                        <div className="space-y-6 relative ml-4">
                            <div className="absolute left-[11px] top-0 bottom-0 w-0.5 bg-slate-100 dark:bg-slate-800"></div>
                            {[
                                { label: 'First Pro Project Built', done: (metrics.total_projects || 0) > 0 },
                                { label: 'DSA Fundamentals Mastery', done: (metrics.leetcode_solved || 0) >= 50 },
                                { label: 'Research Depth Added', done: (metrics.research_papers || 0) > 0, next: (metrics.research_papers || 0) === 0 },
                                { label: 'System Design Ready', done: (metrics.total_projects || 0) >= 4 }
                            ].map((milestone, i) => (
                                <div key={i} className="flex items-center gap-6 relative group">
                                    <div className={`size-6 rounded-full border-4 ${milestone.done ? 'bg-emerald-500 border-emerald-100' : milestone.next ? 'bg-blue-600 border-blue-100 animate-pulse' : 'bg-white border-slate-200'} z-10 shadow-sm`}></div>
                                    <div className={`flex-1 p-3 rounded-2xl ${milestone.next ? 'bg-blue-600/5 border border-blue-100' : ''}`}>
                                        <p className={`text-sm font-black ${milestone.done ? 'text-slate-400 line-through' : milestone.next ? 'text-blue-600' : 'text-slate-900 dark:text-white'}`}>{milestone.label}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* AI Strategy Advice */}
                    <div className="bg-indigo-600 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-indigo-500/20 relative group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-2xl rounded-full -mr-16 -mt-16"></div>
                        <div className="p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="size-10 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white">
                                    <Brain className="size-6" />
                                </div>
                                <h3 className="font-black text-lg text-white uppercase tracking-tight">AI Strategy</h3>
                            </div>
                            
                            <p className="text-indigo-100 text-sm font-medium leading-relaxed mb-8">
                                "{getBehavioralInsight(userData)}"
                            </p>

                            <div className="space-y-3 mb-8">
                                {weeklyGoals.map((goal, i) => (
                                    <button 
                                        key={i} 
                                        onClick={() => setSelectedResource(ROADMAP_RESOURCES[goal.type] || ROADMAP_RESOURCES.mern)}
                                        className="w-full p-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl text-left transition-all group"
                                    >
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-[10px] font-black text-indigo-200 uppercase tracking-widest">Ref: {goal.target.split(' ')[0]}</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[9px] font-bold text-white/60">{goal.priority} Priority</span>
                                                <ArrowRight className="size-3 text-white group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </div>
                                        <p className="text-white text-xs font-bold">{goal.target}</p>
                                    </button>
                                ))}
                            </div>

                            <button 
                                onClick={() => (window.location.href = '/profile')}
                                className="w-full bg-white text-indigo-600 py-4 rounded-2xl text-sm font-black shadow-lg hover:scale-[1.02] active:scale-95 transition-all"
                            >
                                Optimize My Profile
                            </button>
                        </div>
                    </div>

                    {/* Skill Gaps Card */}
                    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="font-black text-lg text-slate-900 dark:text-white uppercase tracking-tight">Skill Gaps</h3>
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Market Data</span>
                        </div>
                        
                        <div className="space-y-8">
                            {skillGaps.map(item => (
                                <div key={item.skill} className="space-y-3">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <h4 className="font-black text-slate-900 dark:text-white text-sm">{item.skill}</h4>
                                            <p className={`text-[10px] font-black uppercase ${item.status === 'Advanced' ? 'text-emerald-500' : 'text-blue-500'}`}>{item.status}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-bold text-slate-500 uppercase">Industry Demand</p>
                                            <p className="text-sm font-black text-slate-900 dark:text-white">{item.demand}</p>
                                        </div>
                                    </div>
                                    <div className="h-3 w-full bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div className={`h-full bg-gradient-to-r ${item.color} rounded-full transition-all duration-1000`} style={{ width: `${item.val}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>
            </div>

            {/* Achievement Bottom Bar */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[90%] max-w-[1240px] px-8 h-24 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border border-white/20 dark:border-slate-800 rounded-[3rem] shadow-2xl flex items-center justify-between gap-8 md:ml-[128px]">
                <div className="flex items-center gap-4 shrink-0 px-2">
                    <div className="size-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center text-white shadow-xl shadow-orange-500/20">
                        <Award className="size-8 stroke-[2.5]" />
                    </div>
                    <div>
                        <p className="text-[11px] text-slate-500 font-black uppercase tracking-[0.1em]">Total Achievements</p>
                        <p className="text-xl font-black text-slate-900 dark:text-white leading-none">{(metrics.total_projects || 0) + (metrics.research_papers || 0)} Milestones</p>
                    </div>
                </div>

                <div className="hidden md:flex flex-1 items-center gap-4 overflow-hidden border-x border-slate-100 dark:border-slate-800 px-8">
                    {metrics.top_languages?.slice(0, 4).map((lang, i) => (
                        <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-50 dark:border-slate-800 shrink-0 hover:scale-105 transition-all cursor-help">
                            <span className="material-symbols-outlined text-blue-600 text-lg">verified</span>
                            <span className="text-[11px] font-black text-slate-900 dark:text-white uppercase">{lang}</span>
                        </div>
                    ))}
                </div>

                <button className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-4 rounded-[1.5rem] text-sm font-black shadow-lg hover:translate-y-[-2px] transition-all active:translate-y-0 shrink-0">
                    Gallery
                </button>
            </div>
        </div>
    );
};

export default Roadmap;
