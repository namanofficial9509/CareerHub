import { TrendingUp, Sparkles, Award, Target, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { calculateSkillLevel, calculateIntelligenceScore, getBehavioralInsight } from '../../lib/intelligenceEngine';
import { Activity } from 'lucide-react';
import { useState } from 'react';

const DashboardHome = () => {
    const { user, userData } = useAuth();
    const navigate = useNavigate();
    const [showPremiumModal, setShowPremiumModal] = useState(false);
    const firstName = userData?.identity?.name?.split(' ')[0] 
        || userData?.fullName?.split(' ')[0] 
        || user?.displayName?.split(' ')[0] 
        || 'Student';
    const skillLevel = calculateSkillLevel(userData?.metrics);
    const intelligenceScore = calculateIntelligenceScore(userData);
    const readinessPercentage = Math.floor(intelligenceScore / 10);
    const dashboardInsight = getBehavioralInsight(userData);
    const userGoal = userData?.career_dna?.learning_goal || 'Software Engineering';
    const topLanguages = userData?.metrics?.top_languages || [];

    return (
        <>
        <div className="flex flex-col gap-10 w-full mt-2 font-display">
            {/* 1. Header & Status Section */}
            <section className="flex flex-col gap-6">
                <div className="mb-2 max-w-2xl px-1">
                    <h1 className="text-[32px] md:text-[40px] font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
                        Welcome back, <span className="text-blue-600">{firstName}</span>.
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mt-2 text-[16px] leading-relaxed">
                        You're <span className="text-slate-900 dark:text-slate-200 font-bold">12% closer</span> to your Software Engineer goal this week. Let's keep the momentum going.
                    </p>
                </div>

                {/* Top 4 Metric Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    {/* Readiness Score */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col justify-between gap-4 transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                        <div className="flex justify-between items-start">
                            <div>
                                <h4 className="text-[12px] font-semibold text-slate-500 dark:text-slate-400 mb-1">Readiness</h4>
                                <div className="text-[20px] font-bold text-slate-900 dark:text-white leading-none">{skillLevel}</div>
                            </div>
                            <div className="relative size-[60px] flex items-center justify-center flex-shrink-0">
                                <svg className="size-full -rotate-90 drop-shadow-sm" viewBox="0 0 36 36">
                                    <path className="text-slate-100 dark:text-slate-800" strokeWidth="4" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                    <path className="text-blue-600" strokeWidth="4" strokeDasharray={`${readinessPercentage}, 100`} strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                </svg>
                                <span className="absolute text-[13px] font-bold text-slate-900 dark:text-white">{readinessPercentage}%</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-1.5 text-[12px] font-medium text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-500/20 px-3 py-1.5 rounded-full w-fit">
                            <TrendingUp className="size-3.5" strokeWidth={2.5} />
                            <span>+4% this week</span>
                        </div>
                    </div>

                    {/* Current Goal */}
                    <div onClick={() => navigate('/dashboard/career-navigator')} className="cursor-pointer bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col justify-between gap-4 transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                        <div>
                            <h4 className="text-[12px] font-semibold text-slate-500 dark:text-slate-400 mb-1">Current Goal</h4>
                            <div className="text-[18px] font-bold text-slate-900 dark:text-white truncate">{userGoal}</div>
                        </div>
                        <div className="mt-auto">
                            <div className="flex justify-between text-[13px] font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                <span>Progress</span>
                                <span>{readinessPercentage}%</span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-600 rounded-full transition-all duration-500" style={{width: `${readinessPercentage}%`}}></div>
                            </div>
                        </div>
                    </div>

                    {/* Profile Completion */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col justify-between transition-all duration-300 hover:shadow-md hover:-translate-y-1 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                            <span className="material-symbols-outlined text-[64px] filled">person</span>
                        </div>
                        <div className="relative z-10">
                            <h4 className="text-[12px] font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Profile Completion</h4>
                            <div className="text-[18px] font-bold text-slate-900 dark:text-white mb-2">Almost there!</div>
                            <p className="text-[13px] text-slate-500 dark:text-slate-400">Unlock more opportunities by completing your profile.</p>
                        </div>
                        <Link to="/dashboard/profile" className="relative z-10 text-[13px] font-medium text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1 mt-4 w-max">
                            Complete Profile <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                        </Link>
                    </div>

                    {/* Platform Stats */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col justify-between transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="text-[12px] font-semibold text-slate-500 dark:text-slate-400">Platform Stats</h4>
                            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-2.5 py-1 rounded-md uppercase tracking-wider">History</span>
                        </div>
                        <div className="space-y-4 mt-auto">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 text-[14px] font-medium text-slate-600 dark:text-slate-300">
                                    <div className="size-[8px] rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,146,60,0.6)]"></div>
                                    <span>Applications</span>
                                </div>
                                <span className="font-bold text-slate-900 dark:text-white text-[16px]">12</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 text-[14px] font-medium text-slate-600 dark:text-slate-300">
                                    <div className="size-[8px] rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                                    <span>Interviews</span>
                                </div>
                                <span className="font-bold text-slate-900 dark:text-white text-[16px]">3</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. Insights Section */}
            <section className="flex flex-col gap-6">
                <div className="flex items-center gap-2 px-1">
                    <Sparkles className="size-5 text-blue-600" />
                    <h2 className="text-[18px] font-bold text-slate-900 dark:text-white">Insights & Analysis</h2>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* Skill Gap Analysis */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-sm border border-slate-200 dark:border-slate-800 transition-colors duration-300 xl:col-span-2">
                        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8 pb-6 border-b border-slate-100 dark:border-slate-800/50">
                            <div className="flex items-center gap-3 text-slate-900 dark:text-white">
                                <div className="flex items-center justify-center p-2.5 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-blue-600">
                                    <span className="material-symbols-outlined text-[24px] filled">troubleshoot</span>
                                </div>
                                <div>
                                    <h3 className="text-[18px] font-bold leading-tight">Skill Gap Analysis</h3>
                                    <p className="text-[13px] text-slate-500 font-medium">Based on your synced GitHub languages</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div>
                                <h4 className="text-[12px] font-semibold text-slate-500 dark:text-slate-400 mb-4 uppercase tracking-wider">Core Strengths</h4>
                                <div className="flex flex-wrap gap-2.5">
                                    {topLanguages.length > 0 ? topLanguages.slice(0,5).map(lang => (
                                        <span key={lang} className="bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 text-[13px] font-medium px-4 py-2 rounded-xl whitespace-nowrap">{lang}</span>
                                    )) : (
                                        <>
                                            <span className="bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 text-[13px] font-medium px-4 py-2 rounded-xl whitespace-nowrap">JavaScript</span>
                                            <span className="bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 text-[13px] font-medium px-4 py-2 rounded-xl whitespace-nowrap">React</span>
                                            <span className="bg-slate-100 dark:bg-slate-700 text-slate-400 text-[11px] font-medium px-4 py-2 rounded-xl">Sync GitHub to see more →</span>
                                        </>
                                    )}
                                </div>
                            </div>
                            <div>
                                <h4 className="text-[12px] font-semibold text-slate-500 dark:text-slate-400 mb-4 uppercase tracking-wider">Areas to Develop</h4>
                                <div className="flex flex-col gap-5">
                                    <div>
                                        <div className="flex items-center justify-between text-[13px] font-medium text-slate-700 dark:text-slate-300 mb-2">
                                            <span>Docker</span>
                                            <span className="text-slate-400 text-[12px]">Beginner</span>
                                        </div>
                                        <div className="flex gap-1.5 h-2">
                                            <div className="h-full flex-1 bg-blue-600 rounded-full"></div>
                                            <div className="h-full flex-1 bg-blue-600 rounded-full"></div>
                                            <div className="h-full flex-1 bg-slate-100 dark:bg-slate-800 rounded-full"></div>
                                            <div className="h-full flex-1 bg-slate-100 dark:bg-slate-800 rounded-full"></div>
                                            <div className="h-full flex-1 bg-slate-100 dark:bg-slate-800 rounded-full"></div>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between text-[13px] font-medium text-slate-700 dark:text-slate-300 mb-2">
                                            <span>AWS Lambda</span>
                                            <span className="text-slate-400 text-[12px]">Not Started</span>
                                        </div>
                                        <div className="flex gap-1.5 h-2">
                                            <div className="h-full flex-1 bg-slate-100 dark:bg-slate-800 rounded-full"></div>
                                            <div className="h-full flex-1 bg-slate-100 dark:bg-slate-800 rounded-full"></div>
                                            <div className="h-full flex-1 bg-slate-100 dark:bg-slate-800 rounded-full"></div>
                                            <div className="h-full flex-1 bg-slate-100 dark:bg-slate-800 rounded-full"></div>
                                            <div className="h-full flex-1 bg-slate-100 dark:bg-slate-800 rounded-full"></div>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between text-[13px] font-medium text-slate-700 dark:text-slate-300 mb-2">
                                            <span>Testing (Jest)</span>
                                            <span className="text-slate-400 text-[12px]">Intermediate</span>
                                        </div>
                                        <div className="flex gap-1.5 h-2">
                                            <div className="h-full flex-1 bg-blue-600 rounded-full"></div>
                                            <div className="h-full flex-1 bg-blue-600 rounded-full"></div>
                                            <div className="h-full flex-1 bg-blue-600 rounded-full"></div>
                                            <div className="h-full flex-1 bg-slate-100 dark:bg-slate-800 rounded-full"></div>
                                            <div className="h-full flex-1 bg-slate-100 dark:bg-slate-800 rounded-full"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col justify-center gap-5 xl:col-span-1 border-t-4 border-t-blue-600 xl:border-t-[1px] xl:border-l-4 xl:border-l-blue-600 transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                        <div className="size-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center flex-shrink-0">
                            <Sparkles className="size-6" />
                        </div>
                        <div>
                            <h4 className="text-[15px] font-bold text-slate-900 dark:text-white mb-2">Your AI Career Coach suggests:</h4>
                            <p className="text-[14px] text-slate-600 dark:text-slate-400 leading-relaxed italic">
                                "{dashboardInsight}"
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. Actions Section */}
            <section className="flex flex-col gap-6 mt-2">
                <div className="flex items-center gap-2 px-1">
                    <Target className="size-5 text-blue-600" />
                    <h2 className="text-[18px] font-bold text-slate-900 dark:text-white">Recommended Actions</h2>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* Left Column (2/3 width) - Primary Next Action + Interactive Cards */}
                    <div className="xl:col-span-2 flex flex-col gap-6">
                        
                        {/* Massive CTA for Assessment */}
                        <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 sm:p-10 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-8 transition-all duration-300 hover:shadow-md hover:-translate-y-1 group">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="size-2 bg-blue-600 rounded-full animate-pulse"></div>
                                    <h2 className="text-[12px] font-bold tracking-widest uppercase text-slate-500 dark:text-slate-400">Next Step For You</h2>
                                </div>
                                <h3 className="text-[22px] md:text-[28px] font-bold text-slate-900 dark:text-white leading-tight mb-2">
                                    Take the Backend Architecture Assessment
                                </h3>
                                <p className="text-[14px] text-slate-500 dark:text-slate-400 mb-8 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[16px]">schedule</span> Estimated time: 20 minutes
                                </p>
                                <button onClick={() => navigate('/dashboard/challenges')} className="bg-blue-600 text-white hover:bg-blue-700 font-medium text-[15px] px-8 py-3.5 rounded-xl transition-colors w-full sm:w-auto text-center shadow-sm">
                                    Start Assessment
                                </button>
                            </div>
                            <div className="hidden md:flex size-[140px] bg-[#F8FAFC] dark:bg-slate-800 rounded-full items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-500">
                                <span className="material-symbols-outlined text-[64px] text-blue-600">quiz</span>
                            </div>
                        </div>

                        {/* Grid for two bottom left cards (Challenges & Connect) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Hackathons / Challenges */}
                            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col gap-4 transition-all duration-300 hover:shadow-md hover:-translate-y-1 h-[320px]">
                                <div className="flex justify-between items-center mb-2">
                                    <div className="flex items-center gap-2 text-slate-900 dark:text-white">
                                        <span className="material-symbols-outlined text-[20px] text-blue-600">emoji_events</span>
                                        <h3 className="text-[16px] font-bold">Hackathons</h3>
                                    </div>
                                    <button onClick={() => navigate('/dashboard/challenges')} className="text-[12px] font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">See all</button>
                                </div>
                                
                                <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                                    <a href="https://codingcompetitions.withgoogle.com/hashcode" target="_blank" rel="noreferrer" className="group cursor-pointer bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 flex flex-col gap-3 border border-slate-100 dark:border-slate-700/50 hover:border-blue-300 dark:hover:border-slate-600 transition-colors block">
                                        <h4 className="text-[14px] font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">Google Hash Code</h4>
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-1.5 text-[12px] font-medium text-slate-500 dark:text-slate-400">
                                                <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                                                <span>Oct 24</span>
                                            </div>
                                            <span className="text-[11px] font-bold text-blue-600 bg-blue-50 dark:bg-blue-600/10 px-3 py-1 rounded-md">Register ↗</span>
                                        </div>
                                    </a>

                                    <a href="https://devpost.com" target="_blank" rel="noreferrer" className="group cursor-pointer bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 flex flex-col gap-3 border border-slate-100 dark:border-slate-700/50 hover:border-blue-300 dark:hover:border-slate-600 transition-colors block">
                                        <h4 className="text-[14px] font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">Devpost Hackathons</h4>
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-1.5 text-[12px] font-medium text-slate-500 dark:text-slate-400">
                                                <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                                                <span>Ongoing</span>
                                            </div>
                                            <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400 bg-slate-200 dark:bg-slate-800 px-3 py-1 rounded-md">View ↗</span>
                                        </div>
                                    </a>
                                </div>
                            </div>

                            {/* Recruiter Connect */}
                            <div className="bg-slate-900 dark:bg-[#0B0F19] rounded-2xl p-8 shadow-sm border border-slate-800 text-white flex flex-col h-[320px] relative overflow-hidden group transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600 rounded-full blur-[80px] opacity-30 group-hover:opacity-50 transition-opacity duration-700"></div>
                                
                                <div className="relative z-10 flex justify-between items-start mb-6">
                                    <h2 className="text-[20px] font-bold leading-tight">Recruiter<br/>Connect</h2>
                                    <div className="bg-slate-800/80 border border-slate-700 px-3 py-1.5 rounded-lg flex flex-col items-center">
                                        <span className="material-symbols-outlined text-[16px] text-slate-400 mb-0.5">lock</span>
                                        <span className="text-[9px] text-slate-300 uppercase font-bold tracking-widest leading-none">LOCKED</span>
                                    </div>
                                </div>
                                
                                <p className="text-slate-300 text-[13px] font-medium leading-relaxed relative z-10 max-w-[220px]">
                                    Unlock recruiter visibility by completing weekly challenges and maintaining a high readiness score.
                                </p>

                                <div className="mt-auto relative z-10">
                                    <button onClick={() => setShowPremiumModal(true)} className="w-full bg-white text-slate-900 hover:bg-slate-100 font-bold py-3.5 rounded-xl text-[14px] shadow-sm transition-colors flex items-center justify-center gap-2">
                                        Learn More <span className="material-symbols-outlined text-[16px]">trending_up</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Right Column (1/3 width) - Weekly Activity & Reminders */}
                    <div className="flex flex-col gap-6 xl:col-span-1">
                        
                        {/* Critical Reminders */}
                        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                            <h4 className="text-[12px] font-bold text-slate-500 dark:text-slate-400 mb-4 uppercase tracking-wider">Deadlines</h4>
                            <div className="flex gap-4">
                                <div className="size-11 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 flex items-center justify-center flex-shrink-0">
                                    <span className="material-symbols-outlined filled text-[20px]">hourglass_top</span>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-[14px] font-bold text-slate-900 dark:text-white mb-1">2 applications</h3>
                                    <p className="text-[13px] font-medium text-slate-500 dark:text-slate-400 mb-3">Closing this weekend.</p>
                                    <button onClick={() => navigate('/dashboard/career-navigator')} className="text-[12px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 w-max">
                                        Review now <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Weekly Activity */}
                        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col h-[300px] transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                            <div className="flex justify-between items-start mb-auto gap-4">
                                <div>
                                    <h2 className="text-[16px] font-bold text-slate-900 dark:text-white leading-tight mb-1">Activity</h2>
                                    <p className="text-[12px] text-slate-500">Last 7 days</p>
                                </div>
                                <div className="text-right flex flex-col items-end">
                                    <div className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest max-w-[120px] mb-2 leading-snug">SYNC DAILY</div>
                                    <div className="w-10 h-5 bg-blue-600 rounded-full relative ml-auto flex items-center shadow-inner cursor-pointer">
                                        <div className="size-[14px] bg-white rounded-full absolute right-1 shadow-sm border border-blue-600"></div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Bar Chart */}
                            <div className="mt-6 flex items-end justify-between h-28 gap-2">
                                {['M','T','W','T','F','S','S'].map((day, i) => {
                                    const heights = [30, 50, 40, 70, 100, 45, 30];
                                    const isToday = day === 'F';
                                    return (
                                        <div key={i} className="flex flex-col items-center justify-end gap-2 w-full h-full">
                                            <div className="w-full flex-1 flex items-end group">
                                                <div className={`w-full rounded-t-lg transition-all duration-300 ${isToday ? 'bg-blue-600 shadow-sm' : 'bg-slate-100 dark:bg-slate-800 group-hover:bg-blue-200 dark:group-hover:bg-blue-800'}`} style={{height: `${heights[i]}%`}}></div>
                                            </div>
                                            <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">{day}</span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Upgrade to Premium */}
                        <div className="rounded-2xl p-6 shadow-sm border border-blue-600/10 dark:border-blue-600/20 text-center flex flex-col items-center bg-slate-50 dark:bg-slate-800/30 transition-all duration-300 hover:-translate-y-1">
                            <h3 className="text-[16px] font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                                <Award className="size-4 text-blue-600" /> Upgrade Portfolio
                            </h3>
                            <p className="text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed mb-4">Unlock AI Mock Interviews and verified referrals.</p>

                            <button onClick={() => setShowPremiumModal(true)} className="w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 hover:border-blue-600 dark:hover:border-blue-600 font-bold py-2.5 rounded-xl text-[13px] shadow-sm transition-all hover:shadow-md">
                                View Plans
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>

        {/* Premium Modal */}
        {showPremiumModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowPremiumModal(false)}>
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-700 relative" onClick={e => e.stopPropagation()}>
                    <button onClick={() => setShowPremiumModal(false)} className="absolute top-4 right-4 size-8 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                        <X className="size-4 text-slate-500" />
                    </button>
                    <div className="size-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center mb-5 shadow-lg shadow-blue-300/30">
                        <Award className="size-7 text-white" />
                    </div>
                    <h2 className="text-[22px] font-bold text-slate-900 dark:text-white mb-2">CareerHub Premium</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-[14px] leading-relaxed mb-6">Unlock AI Mock Interviews, Verified GitHub Badges, and direct Recruiter Connects. Available soon for early adopters.</p>
                    <div className="space-y-2.5 mb-6">
                        {['AI Mock Interviews', 'Recruiter Connect', 'Verified Skill Badges', 'Priority AI Analysis'].map(f => (
                            <div key={f} className="flex items-center gap-3">
                                <div className="size-5 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                                    <span className="material-symbols-outlined text-blue-600 text-[14px]">check</span>
                                </div>
                                <span className="text-[14px] font-medium text-slate-700 dark:text-slate-300">{f}</span>
                            </div>
                        ))}
                    </div>
                    <button className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl text-[15px] shadow-lg shadow-blue-300/20 hover:opacity-90 transition-opacity">
                        Join Waitlist — Free
                    </button>
                </div>
            </div>
        )}
    </>
    );
};

export default DashboardHome;
