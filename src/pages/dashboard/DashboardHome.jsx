import { TrendingUp, Sparkles, Award, BookOpen, Target, Calendar, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const DashboardHome = () => {
    const { user, userData } = useAuth();
    const firstName = userData?.onboarding?.displayName?.split(' ')[0] 
        || userData?.fullName?.split(' ')[0] 
        || user?.displayName?.split(' ')[0] 
        || 'User';

    return (
        <div className="flex flex-col gap-8 w-full mt-2">
            {/* Header */}
            <div className="pr-64 mb-2">
                <h1 className="text-[32px] font-[900] text-slate-900 dark:text-white tracking-[-0.02em] uppercase">WELCOME BACK {firstName.toUpperCase()}</h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium mt-1 text-[15px]">You're making great progress. 3 new opportunities match your profile today.</p>
            </div>

            {/* Top 4 Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {/* Readiness Score */}
                <div className="bg-white dark:bg-gray-800 rounded-[24px] p-5 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-gray-100 dark:border-gray-700 flex items-center justify-between xl:justify-start gap-4 xl:gap-5 transition-colors duration-300">
                    <div className="relative size-[64px] xl:size-[72px] flex items-center justify-center flex-shrink-0">
                        <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                            <path className="text-gray-100 dark:text-gray-700" strokeWidth="4" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                            <path className="text-[#5d46e2]" strokeWidth="4" strokeDasharray="75, 100" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        </svg>
                        <span className="absolute text-[15px] font-[900] text-gray-900 dark:text-white">75%</span>
                    </div>
                    <div>
                        <h4 className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Readiness Score</h4>
                        <div className="text-[18px] font-[900] text-gray-900 dark:text-white leading-none mb-1.5">Intermediate</div>
                        <div className="flex items-center gap-1 text-[11px] font-[900] text-emerald-500">
                            <TrendingUp className="size-3" strokeWidth={3} />
                            <span>+4% this week</span>
                        </div>
                    </div>
                </div>

                {/* Current Goal */}
                <div className="bg-white dark:bg-gray-800 rounded-[24px] p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-gray-100 dark:border-gray-700 flex flex-col justify-center gap-3 transition-colors duration-300">
                    <h4 className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Current Goal</h4>
                    <div className="text-[15px] font-[900] text-gray-900 dark:text-white truncate">Software Engineering ...</div>
                    <div className="mt-1">
                        <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden mb-2">
                            <div className="h-full bg-[#5d46e2] rounded-full w-[65%]"></div>
                        </div>
                        <div className="flex justify-between text-[11px] font-[900] text-gray-500 dark:text-gray-400">
                            <span>Progress</span>
                            <span>65%</span>
                        </div>
                    </div>
                </div>

                {/* Profile Completion */}
                <div className="bg-white dark:bg-gray-800 rounded-[24px] p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-gray-100 dark:border-gray-700 flex flex-col justify-center gap-1 transition-colors duration-300">
                    <h4 className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">Profile Completion</h4>
                    <div className="text-[15px] font-[900] text-gray-900 dark:text-white mb-3 block">Almost there!</div>
                    <Link to="/dashboard/profile" className="text-[12px] font-[900] text-[#5d46e2] hover:text-indigo-700 items-center flex gap-1 w-max mt-auto">
                        Complete Profile <span className="material-symbols-outlined text-[16px] font-bold">arrow_forward</span>
                    </Link>
                </div>

                {/* Platform Stats */}
                <div className="bg-white dark:bg-gray-800 rounded-[24px] p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-gray-100 dark:border-gray-700 flex flex-col justify-center gap-3 relative overflow-hidden transition-colors duration-300">
                    <div className="flex justify-between items-center mb-1">
                        <h4 className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Platform Stats</h4>
                        <span className="text-[9px] font-[900] text-[#5d46e2] bg-[#f0efff] px-2 py-0.5 rounded uppercase tracking-wider">History</span>
                    </div>
                    <div className="space-y-2.5">
                        <div className="flex items-center gap-2.5 text-[12px] font-[900] text-gray-600 dark:text-gray-300">
                            <div className="size-2 rounded-full bg-orange-400"></div>
                            <span>12 Applications Sent</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-[12px] font-[900] text-gray-600 dark:text-gray-300">
                            <div className="size-2 rounded-full bg-emerald-500"></div>
                            <span>3 Interviews Scheduled</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                
                {/* Left Column (2/3 width) */}
                <div className="xl:col-span-2 flex flex-col gap-6">
                    
                    {/* Skill Gap Analysis */}
                    <div className="bg-white dark:bg-gray-800 rounded-[24px] p-8 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                        <div className="flex justify-between items-center mb-8">
                            <div className="flex items-center gap-3 text-gray-900 dark:text-white">
                                <div className="flex items-center justify-center text-[#5d46e2]">
                                    <span className="material-symbols-outlined text-[20px] filled">bar_chart</span>
                                </div>
                                <h2 className="text-[18px] font-[900]">Skill Gap Analysis</h2>
                            </div>
                            <span className="text-[10px] font-[900] text-[#5d46e2] bg-[#f0efff] px-3 py-1.5 rounded-lg uppercase tracking-widest">AI Insights</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            <div>
                                <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">Strengths</h4>
                                <div className="flex flex-wrap gap-2.5">
                                    <span className="bg-emerald-50/80 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[12px] font-[900] px-3.5 py-1.5 rounded-full whitespace-nowrap">JavaScript ES6+</span>
                                    <span className="bg-emerald-50/80 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[12px] font-[900] px-3.5 py-1.5 rounded-full whitespace-nowrap">React Hooks</span>
                                    <span className="bg-emerald-50/80 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[12px] font-[900] px-3.5 py-1.5 rounded-full whitespace-nowrap">UI Design</span>
                                    <span className="bg-emerald-50/80 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[12px] font-[900] px-3.5 py-1.5 rounded-full whitespace-nowrap">Tailwind CSS</span>
                                </div>
                            </div>
                            <div>
                                <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">Missing Skills</h4>
                                <div className="flex flex-wrap gap-2.5">
                                    <span className="bg-red-50/80 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-[12px] font-[900] px-3.5 py-1.5 rounded-full whitespace-nowrap">Docker</span>
                                    <span className="bg-red-50/80 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-[12px] font-[900] px-3.5 py-1.5 rounded-full whitespace-nowrap">AWS Lambda</span>
                                    <span className="bg-red-50/80 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-[12px] font-[900] px-3.5 py-1.5 rounded-full whitespace-nowrap">Testing (Jest)</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-[20px] p-6 flex gap-4 border border-gray-100/50 dark:border-gray-700/50">
                            <div className="size-8 w-8 rounded-full bg-[#f0efff] dark:bg-indigo-900/30 text-[#5d46e2] dark:text-indigo-400 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                                <span className="material-symbols-outlined text-[16px] filled">psychology</span>
                            </div>
                            <div>
                                <h4 className="text-[13px] font-[900] text-gray-900 dark:text-gray-100 mb-1.5">Hidden Gaps</h4>
                                <p className="text-[13px] text-gray-600 dark:text-gray-400 font-medium italic leading-relaxed">"You have learned <span className="font-bold text-gray-900 dark:text-gray-100 not-italic">Docker</span> theoretically but have not applied it in any project. Suggest building a containerized deployment flow."</p>
                            </div>
                        </div>
                    </div>

                    {/* AI Mentor Recommendation Card */}
                    <div className="bg-[#5d46e2] rounded-[24px] p-8 shadow-xl shadow-indigo-600/20 text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-transparent mix-blend-overlay pointer-events-none opacity-50"></div>
                        <div className="relative z-10 flex-1">
                            <div className="flex items-center gap-2 mb-3">
                                <Sparkles className="size-5 fill-white" />
                                <h2 className="text-[20px] font-[900] tracking-tight">AI Mentor Recommendation</h2>
                            </div>
                            <p className="text-indigo-100/90 font-medium text-[14px] leading-relaxed max-w-[480px]">
                                Based on your target role as a Software Engineer, we recommend assessing your Backend Architecture knowledge to boost your Readiness Score by 12%.
                            </p>
                        </div>
                        <div className="relative z-10 w-full md:w-auto">
                            <button className="w-full md:w-auto bg-white text-[#5d46e2] hover:bg-gray-50 font-[900] text-[15px] px-8 py-3.5 rounded-[16px] shadow-lg transition-transform hover:scale-105">
                                Start<br className="hidden md:block"/>Assessment
                            </button>
                        </div>
                    </div>

                    {/* Grid for two bottom left cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Weekly Activity */}
                        <div className="bg-white dark:bg-gray-800 rounded-[24px] p-8 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-gray-100 dark:border-gray-700 flex flex-col h-[300px] transition-colors duration-300">
                            <div className="flex justify-between items-start mb-auto gap-4">
                                <h2 className="text-[18px] font-[900] text-gray-900 dark:text-white leading-tight">Weekly<br/>Activity</h2>
                                <div className="text-right flex flex-col items-end">
                                    <div className="text-[9px] font-[900] text-gray-900 dark:text-gray-300 uppercase tracking-widest max-w-[120px] mb-2 leading-snug">SEND DAILY PROGRESS VIA WHATSAPP</div>
                                    <div className="w-11 h-6 bg-emerald-500 rounded-full relative ml-auto flex items-center shadow-inner cursor-pointer">
                                        <div className="size-[18px] bg-white rounded-full absolute right-1 shadow-sm border border-emerald-100 dark:border-emerald-600"></div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Bar Chart */}
                            <div className="mt-8 flex items-end justify-between h-32 gap-3 px-1">
                                {['M','T','W','T','F','S','S'].map((day, i) => {
                                    const heights = [30, 50, 40, 70, 100, 45, 30];
                                    const isToday = day === 'F';
                                    return (
                                        <div key={i} className="flex flex-col items-center justify-end gap-3 w-full h-full">
                                            <div className="w-full flex-1 flex items-end">
                                                <div className={`w-full rounded-t-[6px] transition-all ${isToday ? 'bg-[#5d46e2]' : 'bg-gray-100 dark:bg-gray-700'}`} style={{height: `${heights[i]}%`}}></div>
                                            </div>
                                            <span className="text-[10px] font-[900] text-gray-400 dark:text-gray-500 uppercase">{day}</span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Recruiter Connect */}
                        <div className="bg-[#111827] rounded-[24px] p-8 shadow-xl shadow-gray-900/20 text-white flex flex-col h-[300px] relative overflow-hidden">
                            {/* Logo subtle background */}
                            <div className="absolute -bottom-10 -right-10 opacity-[0.05]">
                                <span className="material-symbols-outlined text-[180px] filled">layers</span>
                            </div>
                            
                            <div className="relative z-10 flex justify-between items-start mb-6">
                                <h2 className="text-[18px] font-[900] leading-tight">Recruiter<br/>Connect</h2>
                                <div className="bg-rose-900/40 border border-rose-700/50 px-3 py-1.5 rounded-lg flex flex-col">
                                    <span className="text-[8px] text-rose-400 uppercase font-bold tracking-widest leading-none mb-1">STATUS:</span>
                                    <span className="text-[10px] text-rose-400 uppercase font-[900] tracking-widest leading-none">INELIGIBLE</span>
                                </div>
                            </div>
                            
                            <p className="text-gray-400 text-[12px] font-medium leading-relaxed relative z-10 max-w-[220px]">
                                You've not unlocked visibility top tech companies. To maintain this buy Premium then keep participating in weekly coding challenges.
                            </p>

                            <div className="mt-auto relative z-10">
                                <button className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-[900] py-3.5 rounded-xl text-[13px] transition-colors">
                                    Join Challenges
                                </button>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Right Column (1/3 width) */}
                <div className="flex flex-col gap-6">
                    
                    {/* Critical Reminders */}
                    <div>
                        <h4 className="text-[10px] font-[900] text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3 ml-2">CRITICAL REMINDERS</h4>
                        <div className="bg-white dark:bg-gray-800 rounded-[24px] p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                            <div className="flex gap-4">
                                <div className="size-11 rounded-2xl bg-orange-50/80 dark:bg-orange-900/20 text-orange-500 flex items-center justify-center flex-shrink-0">
                                    <span className="material-symbols-outlined filled text-[20px]">hourglass_top</span>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-[13px] font-[900] text-gray-900 dark:text-white mb-0.5">Application deadlines</h3>
                                    <p className="text-[12px] font-medium text-gray-500 dark:text-gray-400 mb-3">2 programs closing this weekend</p>
                                    <button className="text-[11px] font-[900] text-gray-500 dark:text-gray-400 hover:text-indigo-600 flex items-center gap-1">
                                        View List <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Challenges */}
                    <div className="bg-white dark:bg-gray-800 rounded-[24px] p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-gray-100 dark:border-gray-700 flex flex-col gap-4 transition-colors duration-300">
                        <div className="flex justify-between items-center mb-1">
                            <div className="flex items-center gap-2 text-gray-900 dark:text-white">
                                <span className="material-symbols-outlined text-[18px]">emoji_events</span>
                                <h3 className="text-[15px] font-[900]">Challenges</h3>
                            </div>
                            <span className="text-[9px] font-[900] text-[#5d46e2] dark:text-indigo-400 uppercase tracking-widest">UPCOMING</span>
                        </div>

                        <div className="bg-gray-50/80 dark:bg-gray-900/50 rounded-[16px] p-5 flex flex-col gap-3 border border-gray-100/50 dark:border-gray-700/50">
                            <div className="flex justify-between items-start">
                                <h4 className="text-[13px] font-[900] text-gray-900 dark:text-white">Google Hash Code</h4>
                                <span className="text-[9px] font-[900] text-emerald-600 dark:text-emerald-400 bg-emerald-100/70 dark:bg-emerald-900/30 px-2.5 py-1 rounded uppercase tracking-wider">JOIN</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-[11px] font-[900] text-gray-500 dark:text-gray-400">
                                <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                                <span>Deadline: Oct 24</span>
                            </div>
                        </div>

                        <div className="bg-gray-50/80 dark:bg-gray-900/50 rounded-[16px] p-5 flex flex-col gap-3 border border-gray-100/50 dark:border-gray-700/50">
                            <div className="flex justify-between items-start">
                                <h4 className="text-[13px] font-[900] text-gray-900 dark:text-white">Data Science Sprint</h4>
                                <span className="text-[9px] font-[900] text-[#5d46e2] dark:text-indigo-400 bg-indigo-100/70 dark:bg-indigo-900/30 px-2.5 py-1 rounded uppercase tracking-wider">VIEW</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-[11px] font-[900] text-gray-500 dark:text-gray-400">
                                <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                                <span>Deadline: Nov 02</span>
                            </div>
                        </div>
                    </div>

                    {/* Upgrade to Premium */}
                    <div className="bg-white dark:bg-gray-800 rounded-[24px] p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 dark:border-gray-700 text-center flex flex-col items-center mt-2 transition-colors duration-300">
                        <div className="size-[72px] rounded-full bg-indigo-50/50 dark:bg-indigo-900/20 text-[#5d46e2] dark:text-indigo-400 flex items-center justify-center mb-5">
                            <div className="size-[52px] rounded-full bg-[#f0efff] dark:bg-indigo-900/40 flex items-center justify-center">
                                <span className="material-symbols-outlined filled text-[24px]">workspace_premium</span>
                            </div>
                        </div>
                        
                        <h3 className="text-[18px] font-[900] text-gray-900 dark:text-white mb-1">Upgrade to Premium</h3>
                        <p className="text-[12px] text-gray-500 dark:text-gray-400 font-medium italic mb-6">Unlock your tomorrow</p>

                        <div className="space-y-4 w-full text-left mb-8">
                            <div className="flex items-center gap-3">
                                <div className="size-5 rounded-full bg-[#5d46e2] flex items-center justify-center text-white flex-shrink-0">
                                    <span className="material-symbols-outlined text-[12px] font-bold">check</span>
                                </div>
                                <span className="text-[13px] font-[900] text-gray-700 dark:text-gray-300">Advanced Career Roadmap</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="size-5 rounded-full bg-[#5d46e2] flex items-center justify-center text-white flex-shrink-0">
                                    <span className="material-symbols-outlined text-[12px] font-bold">check</span>
                                </div>
                                <span className="text-[13px] font-[900] text-gray-700 dark:text-gray-300">Unlimited AI Mock Interviews</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="size-5 rounded-full bg-[#5d46e2] flex items-center justify-center text-white flex-shrink-0">
                                    <span className="material-symbols-outlined text-[12px] font-bold">check</span>
                                </div>
                                <span className="text-[13px] font-[900] text-gray-700 dark:text-gray-300">Verified Recruiter Referrals</span>
                            </div>
                        </div>

                        <button className="w-full bg-[#5d46e2] hover:bg-indigo-700 text-white font-[900] py-4 rounded-xl text-[14px] shadow-lg shadow-indigo-600/20 transition-transform hover:-translate-y-0.5">
                            Go Premium
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default DashboardHome;
