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
    Rocket
} from 'lucide-react';

const Roadmap = () => {
    return (
        <div className="max-w-[1440px] mx-auto pb-24 relative transition-colors">
            {/* Background Decor */}
            <div className="fixed top-[-10%] left-[-5%] size-[500px] bg-indigo-600/10 blur-[150px] rounded-full pointer-events-none -z-10"></div>
            <div className="fixed bottom-[5%] right-[0%] size-[500px] bg-purple-600/10 blur-[150px] rounded-full pointer-events-none -z-10"></div>

            <div className="grid grid-cols-12 gap-8">
                {/* Main Journey Content */}
                <div className="col-span-12 lg:col-span-8 flex flex-col">
                    
                    {/* Next Recommended Action (High Visibility) */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 rounded-[2.5rem] shadow-xl shadow-blue-500/20 mb-12 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full -mr-32 -mt-32 transition-transform group-hover:scale-110 duration-1000"></div>
                        
                        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black text-white uppercase tracking-wider">Recommended Next Step</span>
                                    <span className="flex items-center gap-1 text-blue-100 text-[10px] font-bold">
                                        <Timer className="size-3" /> 2h estimated
                                    </span>
                                </div>
                                <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">Master Node.js Authentication</h2>
                                <p className="text-blue-100/80 text-sm font-medium max-w-md leading-relaxed">
                                    Unlock "Backend Developer" roles by mastering JWT and specialized middleware patterns.
                                </p>
                            </div>
                            <button className="bg-white text-blue-600 px-8 py-4 rounded-3xl font-black text-[15px] shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-3 shrink-0">
                                <Rocket className="size-5" /> Start Learning Now
                            </button>
                        </div>
                    </div>

                    {/* Journey Stats Dashboard */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                        {[
                            { label: 'Overall Readiness', val: '78%', sub: '+5% this week', color: 'text-emerald-500', icon: Rocket },
                            { label: 'Level', val: 'LVL 3', sub: 'Pro Developer', color: 'text-blue-500', icon: Zap },
                            { label: 'Career XP', val: '12,450', sub: '+400 today', color: 'text-purple-500', icon: Sparkles },
                            { label: 'Modules', val: '24/36', sub: 'Done', color: 'text-orange-500', icon: Flag }
                        ].map((stat, i) => (
                            <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl shadow-sm transition-all hover:border-blue-200 dark:hover:border-blue-500">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className={`size-8 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center ${stat.color}`}>
                                        <stat.icon className="size-4" />
                                    </div>
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-tight">{stat.label}</span>
                                </div>
                                <p className="text-2xl font-black text-slate-900 dark:text-white">{stat.val}</p>
                                <p className={`text-[10px] font-bold mt-1 ${stat.color}`}>{stat.sub}</p>
                            </div>
                        ))}
                    </div>

                    {/* Snake Journey Area */}
                    <div className="relative min-h-[1200px] flex flex-col items-center">
                        {/* SVG Path (Vibrant Gradient) */}
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
                                {/* DSA Interactive Card */}
                                <div className="w-[280px] bg-white dark:bg-slate-900 rounded-[2rem] p-6 border-2 border-emerald-500 shadow-xl shadow-emerald-500/5 relative group cursor-pointer hover:-translate-y-2 transition-all">
                                    <div className="absolute -top-3 -right-3 size-10 bg-emerald-500 rounded-full flex items-center justify-center border-4 border-white dark:border-slate-800 text-white shadow-lg">
                                        <Check className="size-5 stroke-[4]" />
                                    </div>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="size-12 bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                                            <Terminal className="size-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-slate-900 dark:text-white leading-tight">Data Structures</h4>
                                            <p className="text-[10px] font-bold text-emerald-600 uppercase">Mastered</p>
                                        </div>
                                    </div>
                                    <div className="space-y-2 mb-4">
                                        {['Arrays & Lists', 'Trees & Graphs', 'O(n) Analysis'].map(tag => (
                                            <div key={tag} className="flex items-center gap-2 text-[11px] font-bold text-slate-500">
                                                <div className="size-1 rounded-full bg-emerald-500"></div> {tag}
                                            </div>
                                        ))}
                                    </div>
                                    <button className="w-full py-3 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-[11px] font-black rounded-xl hover:bg-slate-100 transition-colors uppercase">Review Topics</button>
                                </div>

                                {/* OS Interactive Card */}
                                <div className="w-[280px] bg-white dark:bg-slate-900 rounded-[2rem] p-6 border-2 border-emerald-500 shadow-xl shadow-emerald-500/5 relative group cursor-pointer hover:-translate-y-2 transition-all">
                                    <div className="absolute -top-3 -right-3 size-10 bg-emerald-500 rounded-full flex items-center justify-center border-4 border-white dark:border-slate-800 text-white shadow-lg">
                                        <Check className="size-5 stroke-[4]" />
                                    </div>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="size-12 bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                                            <Code className="size-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-slate-900 dark:text-white leading-tight">Operating Systems</h4>
                                            <p className="text-[10px] font-bold text-emerald-600 uppercase">Mastered</p>
                                        </div>
                                    </div>
                                    <div className="space-y-2 mb-4">
                                        {['Processes', 'Memory Magmt', 'File Systems'].map(tag => (
                                            <div key={tag} className="flex items-center gap-2 text-[11px] font-bold text-slate-500">
                                                <div className="size-1 rounded-full bg-emerald-500"></div> {tag}
                                            </div>
                                        ))}
                                    </div>
                                    <button className="w-full py-3 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-[11px] font-black rounded-xl hover:bg-slate-100 transition-colors uppercase">Review Topics</button>
                                </div>
                            </div>
                        </div>

                        {/* Phase 2: Active Specialization */}
                        <div className="relative z-10 w-full flex flex-col items-center gap-10 mb-32">
                            <div className="px-6 py-2 bg-blue-600 text-white rounded-full text-[11px] font-black uppercase tracking-[0.2em] shadow-lg shadow-blue-500/20">
                                Phase 2: Professional Specialization
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 w-full max-w-4xl px-10">
                                {/* MERN Active Journey Card */}
                                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border-4 border-blue-600 shadow-2xl shadow-blue-500/10 relative overflow-hidden group">
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
                                            <span>65%</span>
                                        </div>
                                        <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-blue-600 rounded-full transition-all duration-1000" style={{ width: '65%' }}></div>
                                        </div>
                                        <p className="text-[10px] font-bold text-slate-500 mt-2">Finish Node.js Auth to reach 75%</p>
                                    </div>

                                    <div className="space-y-3 mb-8">
                                        {[
                                            { label: 'React Basics', done: true },
                                            { label: 'REST APIs', done: true },
                                            { label: 'Authentication', done: false },
                                            { label: 'Deployment', done: false }
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

                                    <button className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all text-[15px] flex items-center justify-center gap-2">
                                        Continue Learning <ArrowRight className="size-4" />
                                    </button>
                                </div>

                                {/* Cloud Interactive Journey Card */}
                                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border-2 border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-500/5 relative overflow-hidden flex flex-col">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="size-14 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400">
                                            <Cloud className="size-8" />
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Secondary Goal</p>
                                            <h3 className="text-2xl font-black text-slate-900 dark:text-white">Cloud Systems</h3>
                                        </div>
                                    </div>

                                    <div className="mb-8">
                                        <div className="flex justify-between text-[11px] font-black text-slate-400 mb-2 uppercase">
                                            <span>Progress</span>
                                            <span>12%</span>
                                        </div>
                                        <div className="h-3 w-full bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-slate-200 dark:bg-slate-700 rounded-full" style={{ width: '12%' }}></div>
                                        </div>
                                    </div>

                                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl border border-blue-100 dark:border-blue-800/50 mb-8 mt-auto">
                                        <p className="text-[10px] font-black text-blue-600 uppercase mb-1">Why learn this?</p>
                                        <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                                            Cloud knowledge increases backend salary prospects by **25%** in current job markets.
                                        </p>
                                    </div>

                                    <button className="w-full py-4 border-2 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-black rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-[15px]">Resume Journey</button>
                                </div>
                            </div>
                        </div>

                        {/* Phase 3: Career Readiness (Vibrant Locked State) */}
                        <div className="relative z-10 w-full flex flex-col items-center gap-10">
                            <div className="px-6 py-2 bg-indigo-600 text-white rounded-full text-[11px] font-black uppercase tracking-[0.2em] shadow-lg shadow-indigo-500/20">
                                Phase 3: Total Career Readiness
                            </div>
                            
                            <div className="flex flex-wrap justify-center gap-10">
                                {[
                                    { icon: 'description', label: 'Pro Resume Studio', unlock: 'Finish MERN' },
                                    { icon: 'forum', label: 'AI Mock Interviews', unlock: 'Finish MERN' }
                                ].map((node, i) => (
                                    <div key={i} className="w-[200px] flex flex-col items-center text-center">
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

                {/* Right Sidebar: Dynamic Intelligence */}
                <aside className="col-span-12 lg:col-span-4 flex flex-col gap-6 lg:sticky lg:top-24 h-fit">
                    
                    {/* Career Milestones Checklist */}
                    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
                        <h3 className="font-black text-lg mb-8 text-slate-900 dark:text-white uppercase tracking-tight">Milestones</h3>
                        <div className="space-y-6 relative ml-4">
                            <div className="absolute left-[11px] top-0 bottom-0 w-0.5 bg-slate-100 dark:bg-slate-800"></div>
                            {[
                                { label: 'First Pro Project Built', done: true },
                                { label: 'DSA Fundamentals Mastery', done: true },
                                { label: 'System Design Project', done: false, next: true },
                                { label: 'Mock Interview Ready', done: false }
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

                    {/* Highly Actionable AI Mentor */}
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
                                "To unlock **Full-Stack High-Paying roles**, your next focus must be security and scale."
                            </p>

                            <div className="space-y-3 mb-8">
                                {[
                                    { text: 'Complete Node Auth module', link: 'Continue Learning' },
                                    { text: 'Build 1 Security-focused project', link: 'View Ideas' },
                                    { text: 'Deploy to AWS using Docker', link: 'Learn Cloud' }
                                ].map((task, i) => (
                                    <button key={i} className="w-full p-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl text-left transition-all">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-[10px] font-black text-indigo-200 uppercase tracking-widest">Plan Item {i+1}</span>
                                            <ArrowRight className="size-3 text-white" />
                                        </div>
                                        <p className="text-white text-xs font-bold">{task.text}</p>
                                    </button>
                                ))}
                            </div>

                            <button className="w-full bg-white text-indigo-600 py-4 rounded-2xl text-sm font-black shadow-lg hover:scale-[1.02] active:scale-95 transition-all">
                                Update Career Plan
                            </button>
                        </div>
                    </div>

                    {/* Weekly Learning Goals (Gamified) */}
                    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-black text-lg text-slate-900 dark:text-white uppercase tracking-tight">Weekly Goals</h3>
                            <span className="text-xs font-black text-blue-600 bg-blue-50 dark:bg-blue-500/10 px-2 py-1 rounded-lg">3/5 DONE</span>
                        </div>
                        <div className="space-y-4">
                            {[
                                { text: 'Complete Node.js Auth', xp: '+50 XP', done: false },
                                { text: 'Solve 5 LeetCode problems', xp: '+30 XP', done: true },
                                { text: 'Update Project README', xp: '+10 XP', done: true },
                                { text: 'Read System Design article', xp: '+15 XP', done: true },
                                { text: 'Join Backend Workshop', xp: '+40 XP', done: false }
                            ].map((goal, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className={`size-5 rounded-md flex items-center justify-center border-2 ${goal.done ? 'bg-blue-600 border-blue-600' : 'border-slate-200 dark:border-slate-800'}`}>
                                        {goal.done && <Check className="size-3 text-white stroke-[4]" />}
                                    </div>
                                    <div className="flex-1 flex justify-between items-center">
                                        <span className={`text-xs font-bold ${goal.done ? 'text-slate-400 line-through' : 'text-slate-900 dark:text-white'}`}>{goal.text}</span>
                                        <span className="text-[9px] font-black text-blue-500 uppercase">{goal.xp}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-8 h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-600 rounded-full w-[60%] animate-pulse"></div>
                        </div>
                    </div>

                    {/* Skill Gaps with Industry Data */}
                    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="font-black text-lg text-slate-900 dark:text-white uppercase tracking-tight">Skill Gaps</h3>
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Market Data</span>
                        </div>
                        
                        <div className="space-y-8">
                            {[
                                { skill: 'React.js', val: 90, status: 'Expert', demand: '92%', color: 'from-emerald-400 to-emerald-600' },
                                { skill: 'Express.js', val: 60, status: 'Intermediate', demand: '88%', color: 'from-blue-400 to-blue-600' },
                                { skill: 'Docker', val: 5, status: 'Not Started', demand: '78%', color: 'from-slate-200 to-slate-300' }
                            ].map(item => (
                                <div key={item.skill} className="space-y-3">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <h4 className="font-black text-slate-900 dark:text-white text-sm">{item.skill}</h4>
                                            <p className={`text-[10px] font-black uppercase ${item.val > 80 ? 'text-emerald-500' : item.val > 40 ? 'text-blue-500' : 'text-slate-400'}`}>{item.status}</p>
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

                        <div className="mt-8 p-4 bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-800/50 rounded-2xl">
                            <p className="text-[10px] font-black text-orange-600 uppercase mb-1 flex items-center gap-1">
                                <Zap className="size-3" /> Salary Impact Alert
                            </p>
                            <p className="text-[11px] text-slate-700 dark:text-slate-300 font-bold leading-relaxed">
                                Mastering **Docker & Cloud** could increase your entry-level salary offers by up to **22%**.
                            </p>
                        </div>
                    </div>
                </aside>
            </div>

            {/* Achievement Bottom Bar (Premium Floating) */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[90%] max-w-[1240px] px-8 h-24 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border border-white/20 dark:border-slate-800 rounded-[3rem] shadow-2xl flex items-center justify-between gap-8 md:ml-[128px]">
                <div className="flex items-center gap-4 shrink-0 px-2">
                    <div className="size-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center text-white shadow-xl shadow-orange-500/20">
                        <Award className="size-8 stroke-[2.5]" />
                    </div>
                    <div>
                        <p className="text-[11px] text-slate-500 font-black uppercase tracking-[0.1em]">Total Achievements</p>
                        <p className="text-xl font-black text-slate-900 dark:text-white leading-none">12 Milestones</p>
                    </div>
                </div>

                <div className="hidden md:flex flex-1 items-center gap-4 overflow-hidden border-x border-slate-100 dark:border-slate-800 px-8">
                    {[
                        { icon: 'hotel_class', label: 'DSA Master', color: 'bg-amber-100 text-amber-600' },
                        { icon: 'code', label: '100 Days', color: 'bg-emerald-100 text-emerald-600' },
                        { icon: 'api', label: 'API Pro', color: 'bg-blue-100 text-blue-600' },
                        { icon: 'database', label: 'SQL Expert', color: 'bg-indigo-100 text-indigo-600' },
                    ].map((badge, i) => (
                        <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-50 dark:border-slate-800 shrink-0 hover:scale-105 transition-all cursor-help">
                            <span className={`material-symbols-outlined ${badge.color.split(' ')[1]} text-lg`}>{badge.icon}</span>
                            <span className="text-[11px] font-black text-slate-900 dark:text-white uppercase">{badge.label}</span>
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
