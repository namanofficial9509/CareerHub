import { useState } from 'react';
import { Search, Plus, Lightbulb, TrendingUp, Cpu, Database, Award } from 'lucide-react';
import { motion } from 'motion/react';

const RecruiterHome = () => {
    const kpis = [
        { label: 'Active Vacancies', value: '24', trend: '+12%' },
        { label: 'Pipeline Students', value: '1.2k', trend: '+5%' },
        { label: 'Interviews Scheduled', value: '42', trend: '+8%' },
        { label: 'Total Hires', value: '85', trend: '+15%' },
    ];

    const candidates = [
        { 
            id: 1, name: 'Alex Johnson', school: 'Stanford University • B.S CS', 
            badge: { text: 'Python Sprint Winner', color: 'text-amber-700', bg: 'bg-amber-100', icon: <Award className="size-3" /> },
            avatar: 'https://i.pravatar.cc/150?u=alex'
        },
        { 
            id: 2, name: 'Priya Sharma', school: 'IIT Bombay • AI Research Intern', 
            badge: { text: 'React Master', color: 'text-blue-700', bg: 'bg-blue-100', icon: <Award className="size-3" /> },
            avatar: 'https://i.pravatar.cc/150?u=priya'
        },
        { 
            id: 3, name: 'Marcus Chen', school: 'MIT • Cybersecurity Focus', 
            badge: { text: 'Top Hackathon Rank', color: 'text-emerald-700', bg: 'bg-emerald-100', icon: <Award className="size-3" /> },
            avatar: 'https://i.pravatar.cc/150?u=marcus'
        },
    ];

    const activities = [
        { id: 1, title: 'Alex topped the React Challenge', time: '2 hours ago', color: 'bg-indigo-500', bg: 'bg-indigo-100' },
        { id: 2, title: 'Interview accepted by Priya', time: '5 hours ago • Technical Round', color: 'bg-emerald-400', bg: 'bg-emerald-100' },
        { id: 3, title: 'New application: Marcus Chen', time: 'Yesterday • Cyber Specialist', color: 'bg-amber-400', bg: 'bg-amber-100' },
        { id: 4, title: 'Vacancy published: AI Research Associate', time: '2 days ago', color: 'bg-slate-400', bg: 'bg-slate-100' },
    ];

    const skills = [
        { id: 1, name: 'PyTorch / ML', growth: '+24% this month', icon: <Cpu className="size-5 text-indigo-600" />, iconBg: 'bg-indigo-100' },
        { id: 2, name: 'Rust', growth: '+18% this month', icon: <Database className="size-5 text-orange-600" />, iconBg: 'bg-orange-100' },
        { id: 3, name: 'Vector DBs', growth: '+12% this month', icon: <Database className="size-5 text-emerald-600" />, iconBg: 'bg-emerald-100' },
    ];

    return (
        <div className="space-y-8 pb-10">
            {/* Topbar */}
            <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 w-full">
                <div>
                    <h1 className="text-[28px] font-[900] text-slate-900 leading-tight tracking-tight">Welcome back, Sudhanshu!</h1>
                    <p className="text-[15px] font-medium text-slate-500 mt-1">Latest update on your student recruitment pipeline.</p>
                </div>
                <div className="flex items-center gap-4 w-full lg:w-auto">
                    <div className="relative flex-1 lg:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="Search candidates, skills..." 
                            className="w-full h-12 pl-11 pr-4 bg-white border border-slate-200 rounded-full text-[14px] font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-sm"
                        />
                    </div>
                    <button className="flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-indigo-600 px-6 text-white text-[14px] font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20">
                        <Plus className="size-4" strokeWidth={3} />
                        <span className="hidden sm:inline">Post New Vacancy</span>
                    </button>
                </div>
            </header>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {kpis.map((kpi, index) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}
                        key={index} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between"
                    >
                        <p className="text-[13px] font-semibold text-slate-500 mb-4">{kpi.label}</p>
                        <div className="flex items-end justify-between">
                            <span className="text-4xl font-[900] text-slate-900 tracking-tighter">{kpi.value}</span>
                            <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-600 px-2 py-1 rounded-md text-[12px] font-bold">
                                {kpi.trend} <TrendingUp className="size-3" strokeWidth={3} />
                            </span>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Main Content Layout */}
            <div className="flex flex-col xl:flex-row gap-6">
                {/* Left Column (Main Feed) */}
                <div className="flex-1 space-y-6">
                    {/* Connect with Talent */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                        <div className="p-6 md:p-8 flex items-center justify-between border-b border-slate-50">
                            <h2 className="text-xl font-[800] text-slate-900">Connect with Talent</h2>
                            <button className="text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors">View All</button>
                        </div>
                        <div className="p-2 md:p-4">
                            {candidates.map((candidate, i) => (
                                <div key={candidate.id} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 hover:bg-slate-50 transition-colors rounded-2xl w-full">
                                    <div className="flex items-center gap-4 flex-1">
                                        <div className="size-14 rounded-full bg-slate-100 overflow-hidden shrink-0 ring-4 ring-white shadow-sm border border-slate-100">
                                            <img src={candidate.avatar} alt={candidate.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h4 className="text-[16px] font-[800] text-slate-900 leading-none truncate max-w-[180px] md:max-w-none">{candidate.name}</h4>
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-bold ${candidate.badge.bg} ${candidate.badge.color} whitespace-nowrap`}>
                                                    {candidate.badge.icon} {candidate.badge.text}
                                                </span>
                                            </div>
                                            <p className="text-[13px] font-medium text-slate-500 truncate">{candidate.school}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 w-full sm:w-auto mt-2 sm:mt-0 justify-end shrink-0">
                                        <button className="flex-1 sm:flex-none px-5 py-2.5 rounded-full border border-slate-200 text-slate-700 text-[13px] font-bold hover:bg-slate-50 transition-colors">Profile</button>
                                        <button className="flex-1 sm:flex-none px-6 py-2.5 rounded-full bg-indigo-600 text-white text-[13px] font-bold hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-600/20">Invite</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Bottom Split Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Heatmap */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 md:p-8 flex flex-col">
                            <h2 className="text-xl font-[800] text-slate-900 mb-6">Skill Availability Heatmap</h2>
                            <div className="flex-1 min-h-[220px] bg-slate-50 rounded-2xl border border-dashed border-slate-200 overflow-hidden relative flex flex-col justify-end p-4">
                                {/* Simulated Heatmap Background */}
                                <div className="absolute inset-0 pattern-dots pattern-slate-200 pattern-bg-white pattern-size-4 pattern-opacity-100 text-transparent opacity-50 z-0"></div>
                                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-purple-500/10 to-transparent z-0"></div>
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-32 bg-indigo-500/20 blur-[40px] rounded-full mix-blend-multiply z-0"></div>
                                
                                {/* Labels */}
                                <div className="relative z-10 flex justify-between px-2 opacity-60 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                                    <span>North America</span>
                                    <span>Europe</span>
                                    <span>Asia</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 mt-6">
                                <div className="flex items-center gap-1.5"><div className="size-3 bg-indigo-200 rounded-[3px]"></div><span className="text-[12px] font-semibold text-slate-500">Low</span></div>
                                <div className="flex items-center gap-1.5"><div className="size-3 bg-indigo-400 rounded-[3px]"></div><span className="text-[12px] font-semibold text-slate-500">Med</span></div>
                                <div className="flex items-center gap-1.5"><div className="size-3 bg-indigo-600 rounded-[3px]"></div><span className="text-[12px] font-semibold text-slate-500">High</span></div>
                            </div>
                        </motion.div>

                        {/* Emerging Skills */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 md:p-8">
                            <h2 className="text-xl font-[800] text-slate-900 mb-6 mt-1">Top Emerging Skills</h2>
                            <div className="space-y-4">
                                {skills.map((skill, i) => (
                                    <div key={skill.id} className="flex items-center justify-between p-4 bg-slate-50/80 rounded-2xl border border-slate-100 relative group overflow-hidden">
                                        <div className="flex items-center gap-4">
                                            <div className={`size-12 rounded-xl ${skill.iconBg} flex items-center justify-center`}>
                                                {skill.icon}
                                            </div>
                                            <div>
                                                <h4 className="text-[16px] font-bold text-slate-900">{skill.name}</h4>
                                                <p className="text-[12px] font-semibold text-slate-500">{skill.growth}</p>
                                            </div>
                                        </div>
                                        <div className="text-emerald-500 bg-emerald-50 size-8 rounded-full flex items-center justify-center shrink-0">
                                            <TrendingUp className="size-4" strokeWidth={3} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Right Column (Sidebar Widgets) */}
                <div className="w-full xl:w-[380px] space-y-6 shrink-0">
                    {/* Tip Card */}
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="bg-[#EAE8FE] rounded-[2rem] p-8 relative overflow-hidden group">
                        <div className="absolute -right-10 -top-10 size-40 bg-white/20 rounded-full blur-[30px] group-hover:scale-150 transition-transform duration-700 ease-out"></div>
                        <div className="flex items-center gap-3 mb-4 relative z-10">
                            <div className="size-8 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30">
                                <Lightbulb className="size-4" strokeWidth={3} />
                            </div>
                            <h3 className="text-lg font-[800] text-indigo-900">AI Hiring Tip</h3>
                        </div>
                        <p className="text-[15px] font-medium text-indigo-900/80 leading-relaxed relative z-10">
                            "Candidates like <span className="font-bold text-indigo-700">Alex</span> are most responsive between 4 PM and 6 PM. Try messaging now to increase response rates by 40%."
                        </p>
                    </motion.div>

                    {/* Recent Activity Feed */}
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 md:p-8 flex flex-col h-full">
                        <h2 className="text-xl font-[800] text-slate-900 mb-8 mt-1">Recent Activity</h2>
                        <div className="flex-1 relative">
                            {/* Vertical Line connecting timeline */}
                            <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-slate-100"></div>
                            
                            <div className="space-y-8 relative z-10">
                                {activities.map((activity, i) => (
                                    <div key={activity.id} className="flex gap-4 relative">
                                        <div className={`mt-1 size-8 rounded-full ${activity.bg} shrink-0 flex items-center justify-center ring-4 ring-white relative z-10`}>
                                            <div className={`size-2.5 rounded-full ${activity.color}`}></div>
                                        </div>
                                        <div>
                                            <p className="text-[14px] font-bold text-slate-900 leading-snug break-words">
                                                {/* Bold specific keywords for styling */}
                                                {activity.title.split(/ (React Challenge|Priya|Marcus Chen|AI Research Associate)/).map((part, i) => 
                                                    i % 2 === 1 ? <span key={i} className="text-indigo-600">{part}</span> : part
                                                )}
                                            </p>
                                            <p className="text-[12px] font-medium text-slate-400 mt-1">{activity.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <button className="w-full mt-8 py-3.5 rounded-xl bg-slate-50 text-slate-600 text-[13px] font-bold hover:bg-slate-100 transition-colors">
                            Show All Notifications
                        </button>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default RecruiterHome;
