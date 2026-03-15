// eslint-disable-next-line no-unused-vars
import { motion } from 'motion/react';
import {
    TrendingUp,
    AlertTriangle,
    Code2,
    GitCommit,
    Target,
    Cpu,
    BookOpen,
    ArrowRight,
    CheckCircle2,
    RefreshCw
} from 'lucide-react';

const CareerNavigator = () => {
    return (
        <div className="space-y-8 max-w-[1400px] mx-auto pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-[900] text-gray-900 tracking-tight">AI Career Navigator Insights</h1>
                    <p className="text-gray-500 font-medium mt-1">Deep technical depth analysis and readiness for target roles.</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl text-sm shadow-sm hover:bg-gray-50 flex items-center gap-2">
                        <RefreshCw className="size-4" /> Sync Accounts
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white font-bold rounded-xl text-sm shadow-lg shadow-blue-500/30 hover:bg-blue-700 flex items-center gap-2">
                        Refresh Analysis
                    </button>
                </div>
            </div>

            {/* Top Split Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Role Match Card (2/3 width) */}
                <div className="lg:col-span-2 bg-white rounded-[2rem] p-8 border border-gray-100 shadow-xl shadow-gray-200/40 relative overflow-hidden">
                    <div className="flex flex-col md:flex-row gap-8 items-center">
                        {/* Donut Chart Simulation */}
                        <div className="relative size-48 flex-shrink-0">
                            <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                                <path className="text-gray-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                                <path className="text-blue-600" strokeDasharray="68, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-4xl font-[900] text-gray-900">68%</span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 space-y-6">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Data Analyst</h2>
                                <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Role Match Match</p>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-xs font-bold mb-1">
                                        <span className="text-gray-500 uppercase">Analysis Breakdown</span>
                                    </div>
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        Your profile is strongly aligned with data visualization and SQL requirements. To reach the 85% benchmark for Tier-1 companies, focus on advanced statistical modeling and cloud-native data warehousing.
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <div>
                                        <div className="flex justify-between text-xs font-bold mb-1.5">
                                            <span className="text-gray-500">CORE SKILLS MATCH</span>
                                            <span className="text-blue-600">82%</span>
                                        </div>
                                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-blue-600 w-[82%] rounded-full"></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-xs font-bold mb-1.5">
                                            <span className="text-gray-500">PROJECT RELEVANCY</span>
                                            <span className="text-orange-500">54%</span>
                                        </div>
                                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-orange-500 w-[54%] rounded-full"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button className="w-full h-10 bg-blue-600 text-white font-bold rounded-xl text-sm hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                                View Full Roadmap <ArrowRight className="size-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Risk Alerts (1/3 width) */}
                <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-xl shadow-gray-200/40 flex flex-col">
                    <div className="flex items-center gap-2 mb-6">
                        <AlertTriangle className="size-5 text-orange-500 fill-orange-500/20" />
                        <h3 className="font-bold text-gray-900 text-lg">Risk Alerts</h3>
                    </div>

                    <div className="space-y-4 flex-1">
                        <div className="p-4 bg-orange-50 border border-orange-100 rounded-2xl">
                            <div className="flex items-center gap-2 text-orange-700 font-bold text-sm mb-1">
                                <Target className="size-4" /> Low Project Variety
                            </div>
                            <p className="text-xs text-orange-600/80 leading-relaxed font-medium">
                                Projects are concentrated in Finance. Recruiters look for cross-domain experience.
                            </p>
                        </div>

                        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl">
                            <div className="flex items-center gap-2 text-red-700 font-bold text-sm mb-1">
                                <TrendingUp className="size-4" /> Consistency Drop
                            </div>
                            <p className="text-xs text-red-600/80 leading-relaxed font-medium">
                                30-day commit frequency is down 15%. Aim for 3 weekly contributions.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'GitHub Repos', value: '24', trend: '+2', color: 'text-gray-900' },
                    { label: 'DSA Solved', value: '142', trend: '+12', color: 'text-gray-900' },
                    { label: 'LeetCode Rank', value: 'Top 12%', sub: 'Global', color: 'text-blue-600' },
                    { label: 'Commit Frequency', value: 'High', trend: '+15%', color: 'text-green-600' },
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm"
                    >
                        <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">{stat.label}</p>
                        <div className="flex items-baseline gap-2">
                            <span className={`text-3xl font-[900] ${stat.color} tracking-tight`}>{stat.value}</span>
                            {stat.sub && <span className="text-xs font-bold text-blue-500">{stat.sub}</span>}
                        </div>
                        {stat.trend && (
                            <div className="mt-2 inline-flex items-center text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                                <TrendingUp className="size-3 mr-1" /> {stat.trend}
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>

            {/* Bottom Split (AI Summary & Skill Gaps) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* AI Technical Depth Summary */}
                <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-xl shadow-gray-200/40">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="size-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                            <Cpu className="size-6" />
                        </div>
                        <h3 className="font-bold text-gray-900 text-lg">AI Technical Depth Summary</h3>
                    </div>

                    <div className="space-y-4 text-sm text-gray-600 leading-relaxed font-medium">
                        <p>
                            Based on your GitHub repository structure and commit history, you demonstrate <span className="text-indigo-600 font-bold">exceptional proficiency in Python and SQL</span>. Your DSA problem-solving pattern shows a strong grasp of Dynamic Programming and Graph Algorithms.
                        </p>
                        <p>
                            However, your technical depth in <span className="text-gray-900 font-bold">Deployment (Docker/CI/CD)</span> is currently superficial. Most of your projects are localized. We recommend migrating one of your existing data pipelines to a cloud-based architecture (AWS/GCP) to demonstrate enterprise-level readiness.
                        </p>
                    </div>

                    <div className="mt-6 flex gap-2">
                        {['Advanced Python', 'SQLExpert', 'DevOps Level: Junior'].map(tag => (
                            <span key={tag} className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs font-bold rounded-lg border border-gray-200">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Skill Gaps & Actions */}
                <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-xl shadow-gray-200/40 flex flex-col justify-between">
                    <div>
                        <h3 className="font-bold text-gray-900 text-lg mb-6">Skill Gaps & Actions</h3>

                        <div className="space-y-6">
                            {[
                                { title: 'Tableau Dashboarding', sub: 'Missing from portfolio', icon: 'grid_view' },
                                { title: 'A/B Testing Methodology', sub: 'Theoretical knowledge only', icon: 'science' },
                                { title: 'AWS Data Pipeline', sub: 'Industry high-demand', icon: 'cloud_sync' },
                            ].map((skill, i) => (
                                <div key={i} className="flex items-center justify-between group cursor-pointer">
                                    <div className="flex items-center gap-4">
                                        <div className="size-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                            <span className="material-symbols-outlined">{skill.icon}</span>
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900 text-sm">{skill.title}</p>
                                            <p className="text-xs font-medium text-gray-500">{skill.sub}</p>
                                        </div>
                                    </div>
                                    <button className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                        Start
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-8 bg-green-50 border border-green-100 rounded-xl p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <CheckCircle2 className="size-5 text-green-600" />
                            <span className="text-xs font-bold text-green-800">Next Milestone: Reach 75% Match</span>
                        </div>
                        <span className="text-[10px] font-bold text-green-600/70">~ 2 weeks away</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CareerNavigator;
