import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    Upload,
    Plus,
    FileText,
    ExternalLink
} from 'lucide-react';

const RecordTabs = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('certifications');
    const [showAddForm, setShowAddForm] = useState(null);
    const [newItem, setNewItem] = useState({ title: '', description: '' });

    // --- State Management ---
    const [certifications, setCertifications] = useState([
        {
            id: 1,
            title: 'AWS Cloud Practitioner',
            description: 'Amazon Web Services (AWS)',
            status: 'verified',
            date: '2024-12',
        },
        {
            id: 2,
            title: 'Full Stack MERN Course',
            description: 'Udemy',
            status: 'rejected',
            date: '2025-01',
        },
        {
            id: 3,
            title: 'Basic Python Workshop',
            description: 'GDG Campus',
            status: 'pending',
            date: '2025-01',
        }
    ]);

    const [projects, setProjects] = useState([
        {
            id: 1,
            title: 'Student Hub Platform',
            description: 'Comprehensive dashboard for student progression tracking.',
            status: 'verified',
            date: '2024-11',
        }
    ]);

    const [activities, setActivities] = useState([]);

    // --- Stats Data ---
    const stats = [
        { id: 'academics', label: 'Academics', icon: GraduationCap, color: 'text-blue-600', bg: 'bg-blue-50', count: '9.42', suffix: 'CGPA' },
        { id: 'certifications', label: 'Certifications', icon: Award, color: 'text-amber-600', bg: 'bg-amber-50', count: certifications.length, suffix: 'items' },
        { id: 'projects', label: 'Projects', icon: FolderKanban, color: 'text-purple-600', bg: 'bg-purple-50', count: projects.length, suffix: 'items' },
        { id: 'activities', label: 'Activities', icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50', count: activities.length, suffix: 'items' },
    ];

    // --- Helpers ---
    const handleAddItem = (type) => {
        if (!newItem.title || !newItem.description) return;

        const item = {
            // eslint-disable-next-line react-hooks/purity
            id: Date.now(),
            title: newItem.title,
            description: newItem.description,
            status: 'pending',
            date: new Date().toISOString().slice(0, 7),
        };

        if (type === 'certifications') setCertifications([item, ...certifications]);
        if (type === 'projects') setProjects([item, ...projects]);
        if (type === 'activities') setActivities([item, ...activities]);

        setNewItem({ title: '', description: '' });
        setShowAddForm(null);
    };

    const StatusBadge = ({ status }) => {
        if (status === 'verified' || status === 'approved') return (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-700 uppercase tracking-wide">
                <CheckCircle2 className="size-3" /> Verified
            </span>
        );
        if (status === 'pending') return (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700 uppercase tracking-wide">
                <Clock className="size-3" /> Pending
            </span>
        );
        return (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700 uppercase tracking-wide">
                <X className="size-3" /> Rejected
            </span>
        );
    };

    // --- Render List Component ---
    // eslint-disable-next-line react/no-unstable-nested-components
    const RenderList = ({ items, type }) => (
        <div className="space-y-4">
            <AnimatePresence mode='popLayout'>
                {items.map((item) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
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

            {/* Add Item Form */}
            {showAddForm === type ? (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-50 border border-gray-200 rounded-2xl p-5 space-y-4"
                >
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Title</label>
                        <input
                            type="text"
                            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                            placeholder="e.g. AWS Solutions Architect"
                            value={newItem.title}
                            onChange={e => setNewItem({ ...newItem, title: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description / Issuer</label>
                        <input
                            type="text"
                            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                            placeholder="e.g. Amazon Web Services"
                            value={newItem.description}
                            onChange={e => setNewItem({ ...newItem, description: e.target.value })}
                        />
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button
                            onClick={() => handleAddItem(type)}
                            className="flex-1 bg-gray-900 text-white font-bold py-2.5 rounded-xl text-sm hover:bg-black transition-colors shadow-lg shadow-gray-900/10"
                        >
                            Confirm Add
                        </button>
                        <button
                            onClick={() => setShowAddForm(null)}
                            className="px-6 bg-white border border-gray-200 text-gray-600 font-bold py-2.5 rounded-xl text-sm hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </motion.div>
            ) : (
                <button
                    onClick={() => setShowAddForm(type)}
                    className="w-full py-4 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center gap-2 text-gray-400 font-bold hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all group"
                >
                    <div className="size-8 rounded-full bg-gray-100 group-hover:bg-indigo-100 flex items-center justify-center transition-colors">
                        <Plus className="size-5" />
                    </div>
                    <span>Add New {type === 'certifications' ? 'Certification' : type === 'projects' ? 'Project' : 'Activity'}</span>
                </button>
            )}
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <motion.div
                        key={stat.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-default"
                    >
                        <div className={`size-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center mb-3`}>
                            <stat.icon className="size-5" />
                        </div>
                        <p className="text-gray-900 font-[900] text-lg leading-none mb-1">{stat.label}</p>
                        <div className="flex items-center gap-1.5">
                            <span className="bg-gray-100 text-gray-900 text-xs font-bold px-2 py-1 rounded-md">
                                {stat.count} <span className="text-gray-500 font-medium ml-0.5">{stat.suffix}</span>
                            </span>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Main Tabs Container */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/40 overflow-hidden flex flex-col min-h-[600px]">
                {/* Scrollable Tab Header */}
                <div className="px-6 pt-6 pb-2">
                    <div className="p-1.5 bg-gray-50/80 backdrop-blur-sm rounded-2xl flex border border-gray-100 overflow-x-auto scrollbar-hide">
                        {stats.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                                    flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold rounded-xl transition-all whitespace-nowrap relative
                                    ${activeTab === tab.id
                                        ? 'bg-white text-gray-900 shadow-sm ring-1 ring-black/5 z-10'
                                        : 'text-gray-500 hover:text-gray-900 hover:bg-white/50'
                                    }
                                `}
                            >
                                <tab.icon className={`size-4 ${activeTab === tab.id ? tab.color : 'text-gray-400'}`} />
                                {tab.label}
                                {tab.count > 0 && (
                                    <span className={`text-[10px] px-1.5 rounded-full ${activeTab === tab.id ? 'bg-gray-100 text-gray-900' : 'bg-gray-200 text-gray-500'}`}>
                                        {tab.count}
                                    </span>
                                )}
                            </button>
                        ))}
                        <button
                            onClick={() => navigate('/dashboard/portfolio')}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold rounded-xl text-indigo-600 hover:bg-indigo-50 transition-all whitespace-nowrap"
                        >
                            <ExternalLink className="size-4" />
                            Portfolio
                        </button>
                    </div>
                </div>

                {/* Tab Content Area */}
                <div className="p-8 bg-gray-50/30 flex-1">
                    <AnimatePresence mode='wait'>
                        {activeTab === 'certifications' && (
                            <motion.div
                                key="certifications"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                            >
                                <RenderList items={certifications} type="certifications" />
                            </motion.div>
                        )}

                        {activeTab === 'projects' && (
                            <motion.div
                                key="projects"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                            >
                                <RenderList items={projects} type="projects" />
                            </motion.div>
                        )}

                        {activeTab === 'activities' && (
                            <motion.div
                                key="activities"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                            >
                                <RenderList items={activities} type="activities" />
                            </motion.div>
                        )}

                        {activeTab === 'academics' && (
                            <motion.div
                                key="academics"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center justify-center h-96 border-2 border-dashed border-gray-200 rounded-3xl"
                            >
                                <div className="size-16 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-4">
                                    <GraduationCap className="size-8" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900">Academic Records Synced</h3>
                                <p className="text-gray-500 font-medium text-sm mt-1 max-w-xs text-center">Your academic data is securely synced with IIT Delhi's ERP system.</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default RecordTabs;
