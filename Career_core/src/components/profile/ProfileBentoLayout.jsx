import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../lib/firebase';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'motion/react';
import {
    GraduationCap,
    Award,
    FolderKanban,
    Users,
    CheckCircle2,
    Clock,
    X,
    TrendingUp,
    FileText,
    ExternalLink,
    Plus,
    Code2
} from 'lucide-react';
import TechSync from './TechSync';

const ProfileBentoLayout = () => {
    const navigate = useNavigate();
    const { user, userData } = useAuth();
    const [activeTab, setActiveTab] = useState('academics');
    const [showAddForm, setShowAddForm] = useState(null);
    const [newItem, setNewItem] = useState({ title: '', description: '' });

    // --- State Management ---
    const [certifications, setCertifications] = useState([]);
    const [projects, setProjects] = useState([]);
    const [activities, setActivities] = useState([]);

    useEffect(() => {
        if (userData) {
            setCertifications(userData.certifications || []);
            setProjects(userData.projects || []);
            setActivities(userData.activities || []);
        }
    }, [userData]);

    const semesters = [
        { sem: 'Sem 1', sgpa: 8.2 }, { sem: 'Sem 2', sgpa: 7.8 },
        { sem: 'Sem 3', sgpa: 9.0 }, { sem: 'Sem 4', sgpa: 8.5 },
        { sem: 'Sem 5', sgpa: 9.4 }, { sem: 'Sem 6', sgpa: 8.5 } // Projected
    ];


    // --- Stats Data for 2x2 Grid ---
    const currentYear = parseInt(userData?.onboarding?.currentYear || '1');
    const semesterCount = currentYear * 2;

    const stats = [
        { id: 'academics', label: 'Academics', icon: GraduationCap, color: 'text-blue-600', bg: 'bg-blue-50', count: semesterCount.toString(), suffix: 'Semesters' },
        { id: 'certifications', label: 'Certifications', icon: Award, color: 'text-amber-600', bg: 'bg-amber-50', count: certifications.length, suffix: 'items' },
        { id: 'projects', label: 'Projects', icon: FolderKanban, color: 'text-purple-600', bg: 'bg-purple-50', count: projects.length, suffix: 'items' },
        { id: 'activities', label: 'Activities', icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50', count: activities.length, suffix: 'items' },
    ];

    // --- Helper Functions ---
    const handleAddItem = async (type) => {
        if (!newItem.title || !newItem.description || !user) return;

        const item = {
            id: Date.now(),
            title: newItem.title,
            description: newItem.description,
            status: 'pending',
            date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        };

        // Optimistic UI Update
        if (type === 'certifications') setCertifications(prev => [...prev, item]);
        if (type === 'projects') setProjects(prev => [...prev, item]);
        if (type === 'activities') setActivities(prev => [...prev, item]);

        try {
            const userRef = doc(db, 'users', user.uid);
            await updateDoc(userRef, {
                [type]: arrayUnion(item)
            });
            setShowAddForm(null);
            setNewItem({ title: '', description: '' });
        } catch (error) {
            console.error(`Error adding ${type}:`, error);
            alert("Failed to save changes. Please check your connection.");
        }
    };

    const StatusBadge = ({ status }) => (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${status === 'verified' ? 'bg-green-100 text-green-700' :
            status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
            }`}>
            {status === 'verified' ? <CheckCircle2 className="size-3" /> : status === 'pending' ? <Clock className="size-3" /> : <X className="size-3" />}
            {status}
        </span>
    );

    // eslint-disable-next-line react/no-unstable-nested-components
    const RenderList = ({ items, type }) => (
        <div className="space-y-4">
            <AnimatePresence mode='popLayout'>
                {items.map((item) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                        className="group bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-lg hover:border-indigo-100 transition-all cursor-default"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h4 className="font-bold text-gray-900 text-base">{item.title}</h4>
                                <p className="text-sm text-gray-500 font-medium">{item.description}</p>
                            </div>
                            <StatusBadge status={item.status} />
                        </div>
                        <div className="flex items-center justify-between mt-4">
                            <span className="text-xs font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded">{item.date}</span>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="text-xs font-bold text-gray-500 hover:text-indigo-600 flex items-center gap-1">
                                    <FileText className="size-3" /> View Proof
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
            {showAddForm === type ? (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-gray-50 border border-gray-200 rounded-2xl p-5 space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Title</label>
                        <input type="text" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" placeholder={`New ${type.slice(0, -1)} title`} value={newItem.title} onChange={e => setNewItem({ ...newItem, title: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
                        <input type="text" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" placeholder="Details..." value={newItem.description} onChange={e => setNewItem({ ...newItem, description: e.target.value })} />
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button onClick={() => handleAddItem(type)} className="flex-1 bg-gray-900 text-white font-bold py-2.5 rounded-xl text-sm hover:bg-black transition-colors shadow-lg shadow-gray-900/10">Confirm Add</button>
                        <button onClick={() => setShowAddForm(null)} className="px-6 bg-white border border-gray-200 text-gray-600 font-bold py-2.5 rounded-xl text-sm hover:bg-gray-50 transition-colors">Cancel</button>
                    </div>
                </motion.div>
            ) : (
                <button onClick={() => setShowAddForm(type)} className="w-full py-4 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center gap-2 text-gray-400 font-bold hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all group">
                    <div className="size-8 rounded-full bg-gray-100 group-hover:bg-indigo-100 flex items-center justify-center transition-colors"><Plus className="size-5" /></div>
                    <span>Add New {type.slice(0, -1)}</span>
                </button>
            )}
        </div>
    );

    return (
        <div className="space-y-8">
            {/* --- THE INTEGRATED GRID --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* Column 1: The LEAD ANCHOR (Academic Excellence) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="md:col-span-2 lg:col-span-1 bg-white rounded-[2rem] p-8 border border-gray-100 shadow-xl shadow-gray-200/40 relative overflow-hidden group flex flex-col justify-between h-auto lg:h-full"
                >
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                        <GraduationCap className="size-32 text-indigo-900" />
                    </div>

                    <div>
                        <h2 className="text-gray-500 font-bold uppercase tracking-widest text-xs mb-4">Academic Excellence</h2>

                        <div className="flex justify-between items-end mb-6">
                            <div>
                                <div className="flex items-baseline gap-2 mb-1">
                                    <span className="text-7xl font-[900] text-gray-900 tracking-tighter">9.42</span>
                                    <span className="text-xl font-bold text-gray-400">CGPA</span>
                                </div>
                                <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-xl border border-green-100">
                                    <TrendingUp className="size-4" />
                                    <span className="text-xs font-bold">+0.12 increase</span>
                                </div>
                            </div>

                            {/* Sparkline Graph */}
                            <div className="h-16 w-32 relative">
                                <svg className="w-full h-full overflow-visible" viewBox="0 0 100 40" preserveAspectRatio="none">
                                    {/* Line */}
                                    <motion.path
                                        d="M0,25 Q15,30 20,28 T40,15 T60,20 T80,5 T100,5"
                                        fill="none"
                                        stroke="#4f46e5"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        initial={{ pathLength: 0 }}
                                        animate={{ pathLength: 1 }}
                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                    />
                                    {/* Gradient Area */}
                                    <motion.path
                                        d="M0,25 Q15,30 20,28 T40,15 T60,20 T80,5 T100,5 V40 H0 Z"
                                        fill="url(#sparkline-gradient)"
                                        opacity="0.2"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 0.2 }}
                                        transition={{ delay: 0.5 }}
                                    />
                                    <defs>
                                        <linearGradient id="sparkline-gradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#4f46e5" />
                                            <stop offset="100%" stopColor="transparent" />
                                        </linearGradient>
                                    </defs>
                                    {/* Points */}
                                    {[25, 28, 15, 20, 5, 5].map((y, i) => (
                                        <motion.circle
                                            key={i}
                                            cx={i * 20}
                                            cy={y}
                                            r="2"
                                            fill="#fff"
                                            stroke="#4f46e5"
                                            strokeWidth="2"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: 1 + (i * 0.1) }}
                                        />
                                    ))}
                                </svg>
                            </div>
                        </div>


                        <div className="space-y-4 border-t border-gray-100 pt-6">
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-gray-400 uppercase">JEE Advanced Rank</span>
                                <span className="text-sm font-bold text-gray-900">AIR 412 (Top 0.1%)</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-gray-400 uppercase">Electives</span>
                                <span className="text-sm font-bold text-gray-900 text-right truncate pl-2">
                                    {userData?.onboarding?.subjects?.slice(0, 2).join(', ') || 'None selected'}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className=" text-center mt-6">
                        <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest flex items-center justify-center gap-1">
                            <CheckCircle2 className="size-3" /> Verified & Synced with College ERP
                        </span>
                    </div>
                </motion.div>

                {/* Column 2 & 3: The STATS GRID (2x2) */}
                <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={stat.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className={`size-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                                    <stat.icon className="size-6" />
                                </div>
                                {stat.label === 'Academics' && <span className="text-[10px] font-bold bg-gray-100 px-2 py-1 rounded-full text-gray-500">Synced</span>}
                            </div>
                            <div>
                                <p className="text-3xl font-[900] text-gray-900 mb-1">{stat.count}</p>
                                <div className="flex items-center gap-1.5">
                                    <span className="bg-gray-100 text-gray-900 text-xs font-bold px-2 py-1 rounded-md">
                                        {stat.suffix === 'CGPA' ? 'Target: 9.5' : stat.suffix}
                                    </span>
                                </div>
                                <p className="text-sm font-bold text-gray-400 mt-2">{stat.label}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* --- TABS AREA --- */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/40 min-h-[500px] flex flex-col overflow-hidden">
                {/* Tab Header */}
                <div className="px-8 pt-8 pb-4">
                    <div className="flex gap-8 border-b-2 border-gray-50 flex-wrap">
                        {['academics', 'certifications', 'projects', 'activities', 'skills'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`pb-4 text-sm font-bold capitalize transition-colors relative ${activeTab === tab ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'
                                    }`}
                            >
                                {tab}
                                {activeTab === tab && (
                                    <motion.div layoutId="underline" className="absolute bottom-[-2px] left-0 right-0 h-0.5 bg-gray-900" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tab Content */}
                <div className="p-8">
                    <AnimatePresence mode="wait">
                        {activeTab === 'academics' && (
                            <motion.div key="academics" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <h3 className="text-lg font-bold text-gray-900 mb-6">Semester-wise Performance</h3>
                                <div className="h-64 flex items-end justify-between gap-4 px-4 bg-gray-50 rounded-2xl p-8 border border-gray-100 border-dashed mb-8 overflow-x-auto">
                                    {semesters.map((sem, i) => (
                                        <div key={i} className="flex-1 h-full flex flex-col items-center gap-3 group min-w-[40px]">
                                            <div className="w-full flex-1 bg-white rounded-t-xl relative overflow-hidden shadow-sm">
                                                <motion.div
                                                    initial={{ height: 0 }}
                                                    animate={{ height: `${(sem.sgpa / 10) * 100}%` }}
                                                    transition={{ duration: 1, delay: i * 0.1 }}
                                                    className="absolute bottom-0 left-0 right-0 bg-indigo-600 rounded-t-xl opacity-90 group-hover:opacity-100 transition-opacity"
                                                />
                                                <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity z-10">{sem.sgpa}</span>
                                            </div>
                                            <span className="text-xs font-bold text-gray-400 uppercase text-center whitespace-nowrap">{sem.sem}</span>
                                        </div>
                                    ))}
                                </div>
                                {/* Detailed Academic Report Placeholder becoming real */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="p-6 border border-gray-200 rounded-2xl">
                                        <h4 className="font-bold text-gray-900 mb-4">Core Coursework</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {(userData?.onboarding?.subjects || ['Data Structures', 'Algorithms', 'OS']).map(c => (
                                                <span key={c} className="bg-gray-100 text-gray-700 font-bold text-xs px-3 py-1.5 rounded-lg">{c}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="p-6 border border-gray-200 rounded-2xl">
                                        <h4 className="font-bold text-gray-900 mb-4">Academic Achievements</h4>
                                        <ul className="space-y-3">
                                            <li className="flex items-center gap-2 text-sm text-gray-600"><CheckCircle2 className="size-4 text-green-500" /> Dean's List (Sem 3, 4, 5)</li>
                                            <li className="flex items-center gap-2 text-sm text-gray-600"><CheckCircle2 className="size-4 text-green-500" /> Class Representative (2023-24)</li>
                                        </ul>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                        {activeTab === 'certifications' && <motion.div key="cert" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><RenderList items={certifications} type="certifications" /></motion.div>}
                        {activeTab === 'projects' && <motion.div key="proj" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><RenderList items={projects} type="projects" /></motion.div>}
                        {activeTab === 'activities' && <motion.div key="act" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><RenderList items={activities} type="activities" /></motion.div>}
                        {activeTab === 'skills' && (
                            <motion.div key="skills" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <TechSync />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default ProfileBentoLayout;
