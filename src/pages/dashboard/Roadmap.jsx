
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
    Code
} from 'lucide-react';

const Roadmap = () => {
    return (
        <div className="max-w-[1440px] mx-auto pb-24 relative transition-colors">
            {/* Background Decor */}
            <div className="fixed top-[-10%] left-[-5%] size-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none -z-10"></div>
            <div className="fixed bottom-[5%] right-[0%] size-[400px] bg-indigo-600/10 blur-[100px] rounded-full pointer-events-none -z-10"></div>

            <div className="grid grid-cols-12 gap-8">
                {/* Main Journey Content */}
                <div className="col-span-12 lg:col-span-8 flex flex-col">

                    {/* Header Stats */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 bg-white/5 dark:bg-gray-800/40 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700 p-6 rounded-[2rem] shadow-sm">
                        <div>
                            <span className="text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-widest">Active Journey</span>
                            <h2 className="text-3xl font-[900] mt-1 text-gray-900 dark:text-white">Software Engineering</h2>
                            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 font-medium">Estimated completion: December 2024</p>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="flex flex-col items-end">
                                <p className="text-gray-400 dark:text-gray-500 text-xs font-bold uppercase">Real-time Readiness</p>
                                <p className="text-3xl font-[900] text-emerald-500">78% <span className="text-sm font-bold text-emerald-600/70 dark:text-emerald-400 ml-1">+5% this week</span></p>
                            </div>
                            <div className="relative size-16">
                                <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                                    <path className="text-gray-100 dark:text-gray-700" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                                    <path className="text-emerald-500" strokeDasharray="78, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <TrendingUp className="size-6 text-emerald-500" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Snake Journey Area */}
                    <div className="relative min-h-[1000px] flex flex-col items-center">
                        {/* SVG Path */}
                        <svg className="absolute top-0 left-1/2 -translate-x-1/2 z-0 w-[600px] h-full pointer-events-none hidden md:block" fill="none" viewBox="0 0 600 1200">
                            <defs>
                                <linearGradient id="pathGradient" x1="300" y1="0" x2="300" y2="1200" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#2563eb" />
                                    <stop offset="0.5" stopColor="#2563eb" stopOpacity="0.5" />
                                    <stop offset="1" stopColor="#e5e7eb" stopOpacity="0.2" />
                                </linearGradient>
                            </defs>
                            <path d="M300 0V150C300 150 300 250 100 250C-100 250 100 450 300 450C500 450 700 650 500 650C300 650 100 650 100 850C100 1050 300 1050 300 1200" stroke="url(#pathGradient)" strokeWidth="4" strokeDasharray="12 12" />
                        </svg>

                        {/* Phase 1 */}
                        <div className="relative z-10 w-full flex flex-col items-center gap-12 mb-24">
                            <div className="bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800/50 text-emerald-600 dark:text-emerald-400 px-4 py-1.5 rounded-full text-xs font-[900] uppercase tracking-wide shadow-sm">
                                Phase 1: Foundations (Completed)
                            </div>
                            <div className="flex flex-wrap justify-center gap-16">
                                {/* DSA Node */}
                                <div className="group relative flex flex-col items-center cursor-pointer">
                                    <div className="size-24 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center border-4 border-emerald-100 dark:border-emerald-900/50 shadow-xl shadow-emerald-100/50 dark:shadow-none transition-transform group-hover:scale-110">
                                        <Terminal className="size-8 text-emerald-600 dark:text-emerald-400" />
                                        <div className="absolute -top-1 -right-1 size-8 bg-emerald-500 rounded-full flex items-center justify-center border-4 border-white dark:border-gray-800">
                                            <Check className="size-4 text-white stroke-[4]" />
                                        </div>
                                    </div>
                                    <p className="mt-4 font-bold text-gray-900 dark:text-white text-sm">Data Structures</p>
                                </div>
                                {/* OS Node */}
                                <div className="group relative flex flex-col items-center cursor-pointer">
                                    <div className="size-24 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center border-4 border-emerald-100 dark:border-emerald-900/50 shadow-xl shadow-emerald-100/50 dark:shadow-none transition-transform group-hover:scale-110">
                                        <Code className="size-8 text-emerald-600 dark:text-emerald-400" />
                                        <div className="absolute -top-1 -right-1 size-8 bg-emerald-500 rounded-full flex items-center justify-center border-4 border-white dark:border-gray-800">
                                            <Check className="size-4 text-white stroke-[4]" />
                                        </div>
                                    </div>
                                    <p className="mt-4 font-bold text-gray-900 dark:text-white text-sm">Operating Systems</p>
                                </div>
                            </div>
                        </div>

                        {/* Phase 2 */}
                        <div className="relative z-10 w-full flex flex-col items-center gap-12 mb-24">
                            <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800/50 text-blue-600 dark:text-blue-400 px-4 py-1.5 rounded-full text-xs font-[900] uppercase tracking-wide shadow-sm">
                                Phase 2: Specialization (In-Progress)
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-24 w-full max-w-2xl px-10">
                                {/* MERN Node (Active) */}
                                <div className="relative flex flex-col items-center cursor-pointer">
                                    <div className="relative">
                                        <div className="absolute inset-0 rounded-full border-4 border-blue-500/30 animate-ping"></div>
                                        <div className="size-36 rounded-full bg-white dark:bg-gray-800 flex flex-col items-center justify-center border-4 border-blue-600 dark:border-blue-500 shadow-2xl shadow-blue-600/30 dark:shadow-none z-10 relative">
                                            <Layers className="size-10 text-blue-600 dark:text-blue-400 mb-1" />
                                            <span className="text-2xl font-[900] text-gray-900 dark:text-white">65%</span>
                                        </div>
                                    </div>
                                    <div className="mt-6 text-center">
                                        <p className="font-[900] text-xl text-gray-900 dark:text-white">MERN Stack</p>
                                        <p className="text-gray-400 dark:text-gray-500 text-xs font-bold mb-3">8/12 Modules Completed</p>
                                        <button className="text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded-lg font-bold flex items-center mx-auto gap-1 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors">
                                            CONTINUE LESSON <ArrowRight className="size-3" />
                                        </button>
                                    </div>
                                </div>

                                {/* Cloud Node */}
                                <div className="group relative flex flex-col items-center cursor-pointer opacity-80 hover:opacity-100 transition-opacity">
                                    <div className="size-36 rounded-full bg-white dark:bg-gray-800 flex flex-col items-center justify-center border-4 border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 transition-colors">
                                        <Cloud className="size-10 text-gray-400 dark:text-gray-500 mb-1" />
                                        <span className="text-2xl font-bold text-gray-300 dark:text-gray-600">12%</span>
                                    </div>
                                    <div className="mt-6 text-center">
                                        <p className="font-bold text-xl text-gray-500 dark:text-gray-400">Cloud Computing</p>
                                        <p className="text-gray-300 dark:text-gray-600 text-xs font-bold">2/15 Modules Completed</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Phase 3 */}
                        <div className="relative z-10 w-full flex flex-col items-center gap-12 pb-32">
                            <div className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500 px-4 py-1.5 rounded-full text-xs font-[900] uppercase tracking-wide">
                                Phase 3: Career Readiness (Locked)
                            </div>
                            <div className="flex flex-wrap justify-center gap-16 ">
                                {/* Locked Nodes */}
                                {[
                                    { icon: 'description', label: 'Resume Builder' },
                                    { icon: 'forum', label: 'Mock Interviews' }
                                ].map((node, i) => (
                                    <div key={i} className="flex flex-col items-center grayscale opacity-60">
                                        <div className="size-24 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center border-4 border-gray-100 dark:border-gray-700 relative">
                                            <span className="material-symbols-outlined text-4xl text-gray-300 dark:text-gray-600">{node.icon}</span>
                                            <div className="absolute -top-1 -right-1 size-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center border-4 border-white dark:border-gray-800">
                                                <Lock className="size-4 text-gray-500 dark:text-gray-400" />
                                            </div>
                                        </div>
                                        <p className="mt-4 font-bold text-gray-400 dark:text-gray-500 text-sm">{node.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar Widgets */}
                <aside className="col-span-12 lg:col-span-4 flex flex-col gap-6 lg:sticky lg:top-24 h-fit">

                    {/* AI Mentor Widget */}
                    <div className="bg-white dark:bg-gray-800 rounded-[2rem] overflow-hidden border border-gray-100 dark:border-gray-700 shadow-xl shadow-indigo-100/50 dark:shadow-none transition-colors">
                        <div className="bg-indigo-600 dark:bg-indigo-500 p-5 flex items-center gap-3">
                            <Brain className="size-6 text-white" />
                            <h3 className="font-bold text-lg text-white">AI Mentor</h3>
                        </div>
                        <div className="p-6">
                            <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-xl p-4 border border-indigo-100 dark:border-indigo-800/50 mb-4 transition-colors">
                                <p className="text-xs text-indigo-600 dark:text-indigo-400 font-[900] uppercase mb-2">Nudge of the Week</p>
                                <p className="text-sm leading-relaxed text-indigo-900 dark:text-indigo-100 font-medium italic">
                                    "You're making great progress in the MERN path! Focus on mastering <span className="text-indigo-700 dark:text-white font-bold decoration-2 underline decoration-indigo-300 dark:decoration-indigo-500">Node.js Auth</span> next to unlock the Full-Stack Intern roles by July."
                                </p>
                            </div>
                            <button className="w-full bg-indigo-600 dark:bg-indigo-500 py-3 rounded-xl text-white text-sm font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-500/25 dark:shadow-none">
                                Get Detailed Roadmap <Sparkles className="size-4" />
                            </button>
                        </div>
                    </div>

                    {/* Skill Gaps */}
                    <div className="bg-white dark:bg-gray-800 rounded-[2rem] p-6 border border-gray-100 dark:border-gray-700 shadow-sm transition-colors">
                        <h3 className="font-bold text-lg mb-6 flex items-center justify-between text-gray-900 dark:text-white">
                            Skill Gaps
                            <span className="text-xs text-gray-400 dark:text-gray-500 font-bold">Based on 140+ Jobs</span>
                        </h3>
                        <div className="space-y-5">
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs font-bold">
                                    <span className="text-gray-600 dark:text-gray-300">React.js</span>
                                    <span className="text-emerald-500 dark:text-emerald-400">Expert</span>
                                </div>
                                <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 w-[90%] rounded-full"></div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs font-bold">
                                    <span className="text-gray-600 dark:text-gray-300">Express.js</span>
                                    <span className="text-blue-500 dark:text-blue-400">Intermediate</span>
                                </div>
                                <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500 w-[55%] rounded-full"></div>
                                </div>
                            </div>
                            <div className="space-y-2 opacity-60">
                                <div className="flex justify-between text-xs font-bold">
                                    <span className="text-gray-600 dark:text-gray-400">Docker</span>
                                    <span className="text-gray-400 dark:text-gray-500">Locked</span>
                                </div>
                                <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <div className="h-full bg-gray-300 dark:bg-gray-600 w-[5%] rounded-full"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recommended Resources */}
                    <div className="bg-white dark:bg-gray-800 rounded-[2rem] p-6 border border-gray-100 dark:border-gray-700 shadow-sm transition-colors">
                        <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">Recommended for You</h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer group">
                                <div className="size-12 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/50 transition-colors">
                                    <PlayCircle className="size-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Node.js Advanced Patterns</p>
                                    <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500">45 mins • Video Course</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer group">
                                <div className="size-12 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/50 transition-colors">
                                    <BookOpen className="size-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">Cracking the Cloud Cert</p>
                                    <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500">E-Book • AWS/Azure</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>

            {/* Achievement Bottom Bar (Fixed) */}
            <div className="fixed bottom-0 left-0 right-0 z-40 h-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-t border-gray-200 dark:border-gray-800 px-6 lg:px-20 md:ml-64 transition-colors">
                <div className="max-w-[1440px] mx-auto h-full flex items-center justify-between gap-8">
                    <div className="flex items-center gap-3 shrink-0">
                        <div className="size-10 rounded-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-500 border border-amber-100 dark:border-amber-800/50">
                            <Award className="size-5" />
                        </div>
                        <div className="hidden md:block">
                            <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-tight">Achievements</p>
                            <p className="text-sm font-[900] text-gray-900 dark:text-white">12 Milestones Unlocked</p>
                        </div>
                    </div>
                    <div className="flex-1 overflow-x-auto no-scrollbar">
                        <div className="flex items-center gap-4">
                            {[
                                { icon: 'hotel_class', label: 'DSA Master', color: 'text-amber-500' },
                                { icon: 'code', label: '100 Days', color: 'text-emerald-500' },
                                { icon: 'api', label: 'API Pro', color: 'text-blue-500' },
                                { icon: 'database', label: 'SQL Expert', color: 'text-indigo-500' },
                            ].map((badge, i) => (
                                <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shrink-0">
                                    <span className={`material-symbols-outlined ${badge.color} text-lg`}>{badge.icon}</span>
                                    <span className="text-xs font-bold text-gray-600 dark:text-gray-300">{badge.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <button className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-5 py-2 rounded-xl text-sm font-bold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors shrink-0">
                        View Gallery
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Roadmap;
