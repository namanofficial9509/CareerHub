import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

import {
    Search,
    Bell,
    Settings,
    MessageSquare,
    Users,
    Calendar,
    TrendingUp,
    Sparkles,
    Share2,
    MoreHorizontal,
    Briefcase,
    Zap,
    BookOpen,
    Filter,
    MapPin,
    Building2,
    GraduationCap,
    ArrowRight,
    Plus,
    CheckCircle2,
    Heart,
    Code2
} from 'lucide-react';

const Community = () => {
    const { user, userData } = useAuth();
    const [activeTab, setActiveTab] = useState('feed');
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [insightText, setInsightText] = useState('');

    return (
        <div className="max-w-[1400px] mx-auto space-y-6 pb-20">
            {/* Top Navigation / Search Bar area could go here if not in main layout */}

            {/* Stats Overview (Visible on Feed Tab) */}
            {activeTab === 'feed' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between transition-colors">
                        <div>
                            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Current Track</p>
                            <h3 className="text-xl font-[900] text-slate-900 dark:text-slate-100">Product Management</h3>
                        </div>
                        <div className="text-right">
                            <span className="text-xs font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded-lg">+5% rank</span>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between transition-colors">
                        <div>
                            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Active Circles</p>
                            <h3 className="text-xl font-[900] text-slate-900 dark:text-slate-100">12 Communities</h3>
                        </div>
                        <div className="text-right">
                            <span className="text-xs font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded-lg">+2 this week</span>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between transition-colors">
                        <div>
                            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Weekly Engagement</p>
                            <h3 className="text-xl font-[900] text-slate-900 dark:text-slate-100">85% Score</h3>
                        </div>
                        <div className="text-right">
                            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-lg">Top 10%</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                {/* Center Column (Feed/Tabs) */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Tabs */}
                    <div className="bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm inline-flex gap-2 transition-colors">
                        {[
                            { id: 'feed', label: 'Feed', icon: MessageSquare },
                            { id: 'circles', label: 'Circles', icon: Users },
                            { id: 'alumni', label: 'Alumni', icon: GraduationCap },
                            { id: 'events', label: 'Events', icon: Calendar },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-6 py-3 rounded-xl flex items-center gap-2 text-sm font-bold transition-all ${activeTab === tab.id
                                    ? 'bg-blue-600 dark:bg-blue-500 text-white shadow-lg shadow-sm dark:shadow-none'
                                    : 'text-slate-500 dark:text-slate-400 hover:bg-[#F8FAFC] dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                                    }`}
                            >
                                <tab.icon className="size-4" />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Feed Content */}
                    {activeTab === 'feed' && (
                        <div className="space-y-6">
                            {/* Post 1 */}
                            <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex gap-4">
                                        <div className="size-12 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Aditya" alt="User" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 dark:text-slate-100">Aditya Sharma</h4>
                                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Sophomore • CS @ IIT Delhi</p>
                                        </div>
                                    </div>
                                    <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wider">Career Question</span>
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">Advice on landing a first PM internship?</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-4">
                                    I've been working on my personal portfolio projects but I'm struggling with the networking aspect. Is it better to focus on direct applications or cold reachouts to alumni on LinkedIn?
                                </p>
                                <div className="flex gap-2 mb-6">
                                    <span className="bg-[#F8FAFC] dark:bg-gray-700 text-slate-500 dark:text-slate-400 text-xs font-bold px-3 py-1.5 rounded-lg">#ProductManagement</span>
                                    <span className="bg-[#F8FAFC] dark:bg-gray-700 text-slate-500 dark:text-slate-400 text-xs font-bold px-3 py-1.5 rounded-lg">#Networking</span>
                                </div>
                                <div className="flex items-center justify-between border-t border-gray-50 dark:border-gray-700/50 pt-4">
                                    <div className="flex gap-6">
                                        <button className="flex items-center gap-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 font-bold text-sm transition-colors">
                                            <Heart className="size-4" /> 24
                                        </button>
                                        <button className="flex items-center gap-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 font-bold text-sm transition-colors">
                                            <MessageSquare className="size-4" /> 8
                                        </button>
                                    </div>
                                    <button className="text-blue-600 dark:text-blue-400 font-bold text-sm hover:underline">Answer Thread</button>
                                </div>
                            </div>

                            {/* Post 2 */}
                            <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex gap-4">
                                        <div className="size-12 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Ishaan" alt="User" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 dark:text-slate-100">Ishaan Gupta</h4>
                                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Senior • Data Science</p>
                                        </div>
                                    </div>
                                    <span className="bg-indigo-100 dark:bg-blue-500/10 text-indigo-700 dark:text-blue-400 text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wider">Resource</span>
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">Free SQL Mastery Guide for Interviews</h3>
                                <div className="bg-gray-900 rounded-xl h-48 mb-4 flex items-center justify-center relative overflow-hidden group">
                                    {/* Mock Image Placeholder */}
                                    <div className="absolute inset-0 "></div>
                                    <div className="relative z-10 text-center text-emerald-100">
                                        <p className="font-serif text-2xl italic opacity-50">RESOURCE</p>
                                        <p className="text-3xl font-[900] tracking-tighter text-white mt-1">SQL CHEATSHEET</p>
                                    </div>
                                </div>
                                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-4">
                                    Found this amazing resource that covers everything from basic JOINs to complex window functions. Perfect for anyone preparing for tech interviews this season!
                                </p>
                                <div className="flex items-center justify-between border-t border-gray-50 dark:border-gray-700/50 pt-4">
                                    <div className="flex gap-6">
                                        <button className="flex items-center gap-2 text-gray-400 hover:text-pink-600 dark:hover:text-pink-400 font-bold text-sm transition-colors">
                                            <Heart className="size-4" /> 56
                                        </button>
                                        <button className="flex items-center gap-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 font-bold text-sm transition-colors">
                                            <Share2 className="size-4" /> 12
                                        </button>
                                    </div>
                                    <button className="bg-blue-600 dark:bg-blue-500 text-white px-4 py-1.5 rounded-lg font-bold text-xs hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors">Download PDF</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Circles Tab Content */}
                    {activeTab === 'circles' && (
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-2xl font-[900] text-slate-900 dark:text-slate-100">Goal Circles Workspace</h2>
                                <p className="text-gray-500 font-medium text-sm dark:text-gray-400">Welcome back, {userData?.fullName ? userData.fullName.split(' ')[0] : user?.displayName?.split(' ')[0] || 'Aryan'}! You have 2 circles needing updates today.</p>
                            </div>

                            {/* Active Commitments */}
                            <div className="space-y-4">
                                <h3 className="font-bold text-slate-900 dark:text-slate-100">Active Commitments</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex gap-3">
                                                <div className="size-10 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400">
                                                    <Code2 className="size-5" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-slate-900 dark:text-slate-100">DSA 60-day grind</h4>
                                                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Day 14 of 60 • Next sync: 8 PM</p>
                                                </div>
                                            </div>
                                            <span className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[10px] font-bold px-2 py-0.5 rounded-lg uppercase">Active</span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">
                                            <span>Group Progress</span>
                                            <span>72%</span>
                                        </div>
                                        <div className="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden mb-6">
                                            <div className="h-full bg-blue-600 dark:bg-blue-500 w-[72%] rounded-full"></div>
                                        </div>
                                        <button className="w-full py-2.5 bg-white dark:bg-slate-900 border-2 border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-400 font-bold rounded-xl text-sm hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors">
                                            Update Progress
                                        </button>
                                    </div>

                                    <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex gap-3">
                                                <div className="size-10 bg-purple-50 dark:bg-purple-900/30 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-400">
                                                    <Sparkles className="size-5" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-slate-900 dark:text-slate-100">UI/UX Portfolio Builders</h4>
                                                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Next Critique: Thursday</p>
                                                </div>
                                            </div>
                                            <span className="bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-lg uppercase">Action Required</span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">
                                            <span>Group Progress</span>
                                            <span>45%</span>
                                        </div>
                                        <div className="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden mb-6">
                                            <div className="h-full bg-blue-600 dark:bg-blue-500 w-[45%] rounded-full"></div>
                                        </div>
                                        <button className="w-full py-2.5 bg-white dark:bg-slate-900 border-2 border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-400 font-bold rounded-xl text-sm hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors">
                                            Upload Weekly Task
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Discover New Circles */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-bold text-slate-900 dark:text-slate-100">Discover New Circles</h3>
                                    <div className="flex gap-2">
                                        <button className="px-3 py-1 bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-bold text-slate-500 dark:text-slate-400 hover:bg-[#F8FAFC] dark:hover:bg-gray-700 transition-colors">Trending</button>
                                        <button className="px-3 py-1 bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-bold text-slate-500 dark:text-slate-400 hover:bg-[#F8FAFC] dark:hover:bg-gray-700 transition-colors">New</button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {[
                                        { title: 'Web3 Masters', members: '15', level: 'High', img: 'tech', label: 'Tech' },
                                        { title: '6AM Productivity Club', members: '20', level: 'Extreme', img: 'lifestyle', label: 'Lifestyle' },
                                        { title: 'Deep Work Researchers', members: '12', level: 'Steady', img: 'study', label: 'Academics' },
                                    ].map((circle, i) => (
                                        <div key={i} className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden group transition-colors">
                                            <div className="h-32 bg-gray-200 dark:bg-gray-700 relative transition-colors">
                                                <div className="absolute inset-0 "></div>
                                                <span className="absolute bottom-3 left-3 bg-white dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">{circle.label}</span>
                                            </div>
                                            <div className="p-4">
                                                <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-1">{circle.title}</h4>
                                                <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 font-medium mb-3">
                                                    <Users className="size-3" /> {circle.members} members
                                                </div>
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="h-1 w-24 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                                        <div className={`h-full rounded-full ${i === 1 ? 'bg-red-500 w-full' : 'bg-orange-500 w-2/3'}`}></div>
                                                    </div>
                                                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">{circle.level}</span>
                                                </div>
                                                <button className="w-full py-2 bg-blue-600 dark:bg-blue-500 text-white font-bold rounded-xl text-sm hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors">Join Circle</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Alumni Tab Content */}
                    {activeTab === 'alumni' && (
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-2xl font-[900] text-gray-900 mb-2">Alumni Journey Discovery</h2>
                                <p className="text-gray-500 font-medium text-sm">Explore the paths of those who came before you. Peer-led growth.</p>
                            </div>

                            {/* Search */}
                            <div className="flex gap-4">
                                <div className="flex-1 bg-[#F8FAFC] dark:bg-gray-800 rounded-xl px-4 py-3 flex items-center gap-2 border border-slate-200 dark:border-slate-800 focus-within:ring-2 focus-within:ring-blue-500/20 dark:focus-within:ring-blue-400/20 transition-all">
                                    <Search className="size-5 text-gray-400" />
                                    <input type="text" placeholder="Search by industry, company, college, or role..." className="bg-transparent border-none outline-none text-sm font-medium w-full text-gray-800 dark:text-white dark:placeholder-gray-500" />
                                </div>
                                <div className="flex gap-2">
                                    {['Tech', 'Finance', 'Creative', 'Healthcare'].map(filter => (
                                        <button key={filter} className="hidden md:flex px-4 py-3 bg-[#F8FAFC] dark:bg-gray-800 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold text-slate-500 dark:text-slate-400 items-center justify-between gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                            {filter}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Alumni Cards Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[
                                    { name: 'Ananya Rao', role: 'Senior Product Designer', company: 'Zomato', school: 'IIT Bombay \'18', major: 'Design Major', quote: 'From understanding complex systems to designing intuitive user experiences.', path: ['Intern', 'Designer', 'Senior'] },
                                    { name: 'Rohan Mehta', role: 'Software Engineer', company: 'Google', school: 'BITS Pilani \'19', major: 'CS & Robotics', quote: 'Building the future of scalable systems through code and integration.', path: ['Lab Asst', 'Junior Dev', 'SWE II'] }
                                ].map((alum, i) => (
                                    <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="flex gap-4">
                                                <div className="size-14 rounded-full bg-gray-100 dark:bg-gray-700">
                                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${alum.name}`} alt={alum.name} className="size-full" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-slate-900 dark:text-slate-100 text-lg leading-tight">{alum.name}</h4>
                                                    <p className="text-sm font-bold text-blue-600 dark:text-blue-400">{alum.role}</p>
                                                    <div className="flex items-center gap-1 text-xs font-bold text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider">
                                                        <CheckCircle2 className="size-3 text-blue-500" /> {alum.company}
                                                    </div>
                                                </div>
                                            </div>
                                            <button className="size-10 rounded-xl bg-[#F8FAFC] dark:bg-gray-700 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-gray-600 hover:text-gray-900 dark:hover:text-white transition-colors">
                                                <Briefcase className="size-5" />
                                            </button>
                                        </div>

                                        <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 mb-4">
                                            <GraduationCap className="size-4" />
                                            {alum.school} • {alum.major}
                                        </div>

                                        <p className="text-sm text-slate-500 dark:text-slate-400 italic mb-6">"{alum.quote}"</p>

                                        {/* Timeline */}
                                        <div className="relative pt-4 border-t border-gray-50 dark:border-gray-700">
                                            <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-100 dark:bg-gray-700 top-1/2 -translate-y-1/2"></div>
                                            <div className="flex justify-between relative z-10">
                                                {alum.path.map((step, idx) => (
                                                    <div key={idx} className="flex flex-col items-center gap-2">
                                                        <div className={`size-3 rounded-full border-2 border-white dark:border-gray-800 ${idx === 2 ? 'bg-blue-600 dark:bg-blue-500 ring-4 ring-blue-50 dark:ring-blue-900/30' : 'bg-blue-600 dark:bg-blue-500'}`}></div>
                                                        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{step}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <button className="w-full mt-6 py-2.5 bg-blue-600 dark:bg-blue-500 text-white font-bold rounded-xl text-sm shadow-lg shadow-sm dark:shadow-none hover:bg-blue-700 dark:hover:bg-blue-600 transition-all">
                                            View Journey
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Events Tab Content */}
                    {activeTab === 'events' && (
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-2xl font-[900] text-gray-900 mb-2">Upcoming Events</h2>
                                <p className="text-gray-500 font-medium text-sm">Discover hackathons, workshops, and meetups happening near you.</p>
                            </div>

                            {/* Featured Event */}
                            <div className=" rounded-[2rem] p-8 text-white relative overflow-hidden shadow-lg shadow-sm">
                                <div className="absolute top-0 right-0 p-8 opacity-10">
                                    <Calendar className="size-48" />
                                </div>
                                <div className="relative z-10">
                                    <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-lg uppercase tracking-wider mb-4 inline-block">Featured Hackathon</span>
                                    <h3 className="text-3xl font-[900] mb-2">Global AI Challenge 2024</h3>
                                    <p className="text-blue-100 max-w-lg mb-6 text-sm font-medium">Join 5000+ developers building the future of Generative AI. $50k in prizes and direct interviews with top tech companies.</p>

                                    <div className="flex flex-wrap gap-6 mb-8">
                                        <div className="flex items-center gap-2 text-sm font-bold">
                                            <Calendar className="size-4" /> Oct 25 - 27
                                        </div>
                                        <div className="flex items-center gap-2 text-sm font-bold">
                                            <MapPin className="size-4" /> Hybrid / San Francisco
                                        </div>
                                        <div className="flex items-center gap-2 text-sm font-bold">
                                            <Users className="size-4" /> 1.2k Registered
                                        </div>
                                    </div>

                                    <button className="bg-white text-blue-600 px-6 py-3 rounded-xl font-bold text-sm hover:bg-blue-50 transition-colors">
                                        Register Now
                                    </button>
                                </div>
                            </div>

                            {/* Events List */}
                            <div className="space-y-4">
                                <h3 className="font-bold text-slate-900 dark:text-slate-100">This Week</h3>
                                {[
                                    { title: 'Tech Interview Prep with Google Engineers', type: 'Workshop', date: 'Nov 02 • 6:00 PM', location: 'Virtual', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
                                    { title: 'Campus Meetup: Web3 Enthusiasts', type: 'Meetup', date: 'Nov 05 • 5:30 PM', location: 'Student Center, Room 302', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
                                    { title: 'Resume Review Session', type: 'Career', date: 'Nov 07 • 2:00 PM', location: 'Career Center', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
                                ].map((event, i) => (
                                    <div key={i} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between hover:border-blue-200 dark:hover:border-blue-500/50 transition-colors group cursor-pointer">
                                        <div className="flex items-center gap-4">
                                            <div className="bg-[#F8FAFC] dark:bg-gray-700/50 p-3 rounded-xl text-center min-w-[60px]">
                                                <span className="block text-xs font-bold text-red-500 dark:text-red-400 uppercase">{event.date.split(' ')[0]}</span>
                                                <span className="block text-xl font-[900] text-slate-900 dark:text-slate-100">{event.date.split(' ')[1]}</span>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{event.title}</h4>
                                                <div className="flex items-center gap-3 text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${event.color}`}>{event.type}</span>
                                                    <span>•</span>
                                                    <span className="flex items-center gap-1"><MapPin className="size-3" /> {event.location}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <button className="size-10 rounded-xl bg-[#F8FAFC] dark:bg-gray-700 flex items-center justify-center text-slate-500 dark:text-slate-400 opacity-0 group-hover:opacity-100 transition-all hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400">
                                            <ArrowRight className="size-5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Sidebar (Sticky) */}
                <div className="space-y-6 lg:sticky lg:top-24">

                    {/* Quick Actions */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
                        <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-4">Quick Actions</h3>
                        <div className="space-y-3">
                            <button className="w-full py-3 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-sm dark:shadow-none transition-all flex items-center justify-center gap-2">
                                <Plus className="size-4" /> Join New Circle
                            </button>
                            <button 
                                onClick={() => setIsShareModalOpen(true)}
                                className="w-full py-3 bg-white dark:bg-slate-900 border-[1px] border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-[#F8FAFC] dark:hover:bg-gray-700 transition-all flex items-center justify-center gap-2"
                            >
                                <Sparkles className="size-4" /> Share Insight
                            </button>
                        </div>
                    </div>

                    {/* AI Summary Card - Dark Mode */}
                    <div className="bg-gray-900 dark:bg-gray-800 p-6 rounded-[2rem] shadow-sm text-white relative overflow-hidden border border-transparent dark:border-gray-700 transition-colors">
                        <div className="absolute top-0 right-0 p-4 opacity-20">
                            <Sparkles className="size-20" />
                        </div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-4 text-indigo-300">
                                <Zap className="size-4 fill-current" />
                                <span className="text-xs font-bold font-medium">Weekly AI Summary</span>
                            </div>
                            <p className="text-sm font-medium text-gray-300 leading-relaxed mb-6">
                                This week's highlights: 4 new internship leads in Tech. Most active circle: <strong className="text-white">Data Science</strong>.
                            </p>
                            <ul className="space-y-3 text-xs font-medium text-gray-400 mb-6">
                                <li className="flex gap-2">
                                    <span className="size-1.5 bg-blue-500 rounded-full mt-1.5 shrink-0"></span>
                                    Alumni from Google are hosting a Q&A this Thursday.
                                </li>
                                <li className="flex gap-2">
                                    <span className="size-1.5 bg-purple-500 rounded-full mt-1.5 shrink-0"></span>
                                    Trending: Portfolio reviews in the UI/UX circle.
                                </li>
                            </ul>
                            <button className="w-full py-2.5 bg-indigo-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors">
                                View Full Insights
                            </button>
                        </div>
                    </div>

                    {/* Trending Alumni */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-slate-900 dark:text-slate-100">Trending Alumni</h3>
                            <button className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">See all</button>
                        </div>
                        <div className="space-y-4">
                            {[
                                { name: 'Priya Singh', role: 'Senior PM @ Swiggy', img: 'Priya' },
                                { name: 'Rohan Mehta', role: 'Data Lead @ Meta', img: 'Rohan' },
                            ].map((alumni, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="size-10 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${alumni.img}`} alt={alumni.name} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{alumni.name}</p>
                                        <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400">{alumni.role}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Popular Circles */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
                        <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-4">Popular Circles</h3>
                        <div className="space-y-4">
                            {[
                                { name: 'Engineering', count: '2.4k active', icon: 'Code2', color: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' },
                                { name: 'UI/UX Design', count: '1.8k active', icon: 'Palette', color: 'bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' },
                                { name: 'FinTech', count: '950 active', icon: 'DollarSign', color: 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400' },
                            ].map((circle, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`size-8 rounded-lg flex items-center justify-center ${circle.color}`}>
                                            {/* Simple mock icons */}
                                            <span className="font-bold text-xs">{circle.name[0]}</span>
                                        </div>
                                        <span className="text-sm font-bold text-gray-700 dark:text-white">{circle.name}</span>
                                    </div>
                                    <span className="text-[10px] font-bold text-gray-400 dark:text-gray-400">{circle.count}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
            {/* Share Insight Modal */}
            {isShareModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div 
                        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300"
                        onClick={() => setIsShareModalOpen(false)}
                    ></div>
                    
                    {/* Modal Content */}
                    <div className="relative bg-white dark:bg-slate-900 w-full max-w-xl rounded-[2.5rem] shadow-sm shadow-sm overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 duration-500 border border-slate-200 dark:border-slate-800">
                        {/* Header */}
                        <div className="p-8 pb-4 flex items-center justify-between">
                            <h3 className="text-2xl font-[900] text-slate-900 dark:text-slate-100 tracking-tight">Share New Insight</h3>
                            <button 
                                onClick={() => setIsShareModalOpen(false)}
                                className="size-10 rounded-full bg-[#F8FAFC] dark:bg-gray-700 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-gray-600 hover:text-gray-900 dark:hover:text-white transition-all"
                            >
                                <Plus className="rotate-45 size-6" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="px-8 py-4">
                            <div className="flex gap-4 items-center mb-6">
                                <div className="size-12 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden ring-4 ring-gray-50 dark:ring-gray-800">
                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userData?.fullName || user?.displayName || 'User'}`} alt="User" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-slate-100">{userData?.fullName || user?.displayName || 'User'}</h4>
                                </div>
                            </div>

                            <textarea
                                value={insightText}
                                onChange={(e) => setInsightText(e.target.value)}
                                placeholder="What's your career insight today?"
                                className="w-full min-h-[160px] bg-gray-50/50 dark:bg-gray-900/50 rounded-2xl p-6 text-gray-800 dark:text-gray-100 text-[15px] font-medium leading-relaxed outline-none border-2 border-transparent focus:border-blue-600/10 dark:focus:border-blue-500/50 focus:bg-white dark:focus:bg-gray-800 transition-all resize-none placeholder:text-gray-400 dark:placeholder:text-gray-500"
                                autoFocus
                            />
                        </div>

                        {/* Footer / Actions */}
                        <div className="p-8 pt-4 flex flex-col sm:flex-row items-center justify-between gap-6">
                            <div className="flex gap-2 w-full sm:w-auto">
                                {[
                                    { icon: Sparkles, label: 'Image', color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/30' },
                                    { icon: BookOpen, label: 'Docs', color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/30' },
                                    { icon: Code2, label: 'File', color: 'text-indigo-500 bg-blue-50 dark:bg-blue-500/10' }
                                ].map((btn, i) => (
                                    <button 
                                        key={i}
                                        className={`flex-1 sm:flex-none p-3 rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 ${btn.color}`}
                                    >
                                        <btn.icon className="size-5" />
                                        <span className="text-xs font-black font-medium hidden sm:inline">{btn.label}</span>
                                    </button>
                                ))}
                            </div>

                            <button 
                                onClick={() => {
                                    // Handle post logic
                                    setIsShareModalOpen(false);
                                    setInsightText('');
                                }}
                                className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 dark:bg-blue-500 text-white font-black text-[14px] rounded-xl shadow-lg shadow-sm dark:shadow-none hover:bg-blue-700 dark:hover:bg-blue-600 transition-all flex items-center justify-center gap-2"
                            >
                                <Zap className="size-4 fill-current" />
                                Post Insight
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Community;
