import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { db } from '../../lib/firebase';
import { collection, addDoc, serverTimestamp, query, onSnapshot, orderBy } from 'firebase/firestore';
import { Download, ExternalLink, Share2, CheckCircle2, TrendingUp, Github, Briefcase, GraduationCap, MapPin, Activity, ShieldCheck, Mail, Calendar, Loader2, Sparkles, Target } from 'lucide-react';
import { calculateIntelligenceScore, calculateSkillLevel } from '../../lib/intelligenceEngine';

const Profile = () => {
    const { user, userData, updateIntelligenceSignal, syncPlatformData } = useAuth();
    const [activeTab, setActiveTab] = useState('Overview');
    const [isSyncing, setIsSyncing] = useState(false);
    const [syncSuccess, setSyncSuccess] = useState(false);
    const [avatarImage, setAvatarImage] = useState(null);
    const fileInputRef = useRef(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [profileSaved, setProfileSaved] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [projectForm, setProjectForm] = useState({
        title: '',
        description: '',
        techStack: '',
        githubLink: '',
        liveLink: '',
        academics: ''
    });

    const handleProjectSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            alert("Please login to add projects");
            return;
        }
        if (!projectForm.title || !projectForm.description) {
            alert("Please fill in project title and description");
            return;
        }

        setIsSubmitting(true);
        try {            // Add to Firestore subcollection: users/{uid}/projects
            await addDoc(collection(db, 'users', user.uid, 'projects'), {
                ...projectForm,
                createdAt: serverTimestamp()
            });
            
            // Push activity signal for projects
            await updateIntelligenceSignal('metrics.total_projects', 1, true);

            setProjectForm({
                title: '',
                description: '',
                techStack: '',
                githubLink: '',
                liveLink: '',
                academics: ''
            });
            alert('Project added successfully!');
        } catch (error) {
            console.error("Error adding project:", error);
            alert('Failed to add project: ' + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const [userProjects, setUserProjects] = useState([]);

    const handleProfileSave = async (e) => {
        e.preventDefault();
        if (!user) return;
        setIsSubmitting(true);
        const form = e.target;
        
        const identity = {
            name: form.profileName.value,
            branch: form.branch.value,
            year: form.year.value,
            college: form.college.value,
        };
        
        const social_links = {
            github: form.github.value,
            leetcode: form.leetcode.value,
        };
        
        const career_dna = {
            learning_goal: form.goal.value,
        };

        try {
            await updateIntelligenceSignal('identity', identity);
            await updateIntelligenceSignal('social_links', social_links);
            await updateIntelligenceSignal('career_dna', career_dna);
            setProfileSaved(true);
            setIsEditing(false); // Switch back to view mode
            setTimeout(() => setProfileSaved(false), 3000);
        } catch (err) {
            console.error('Profile save error:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSync = async () => {
        setIsSyncing(true);
        try {
            await syncPlatformData();
            setSyncSuccess(true);
            setTimeout(() => setSyncSuccess(false), 3000);
        } catch (err) {
            console.error('Sync error:', err);
        } finally {
            setIsSyncing(false);
        }
    };

    // Unified intelligence logic is now imported from intelligenceEngine.js
    // Background sync is now handled in AuthContext globally

    useEffect(() => {
        if (!user) return;
        const q = query(
            collection(db, 'users', user.uid, 'projects'),
            orderBy('createdAt', 'desc')
        );
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const projectsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setUserProjects(projectsData);
        }, (error) => {
            console.error("Error fetching projects for profile:", error);
        });
        return () => unsubscribe();
    }, [user]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                alert("Image must be less than 2MB");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="flex flex-col w-full max-w-[1400px] mx-auto pb-12 font-display">
            
            {/* 1. Professional Identity & Header */}
            <div className="bg-white dark:bg-slate-900 rounded-b-3xl md:rounded-3xl border-b md:border border-slate-200 dark:border-slate-800 shadow-sm relative mb-8 overflow-hidden">
                {/* Clean Professional Accent Banner */}
                <div className="h-32 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 relative">
                    <div className="absolute top-0 left-0 w-full h-1 bg-blue-600"></div>
                </div>

                <div className="px-6 md:px-12 pb-8 -mt-16 flex flex-col md:flex-row gap-8 items-start md:items-end justify-between relative z-10 w-full">
                    
                    {/* Left: Avatar & Text */}
                    <div className="flex flex-col md:flex-row gap-6 md:gap-8 md:items-end flex-1 w-full relative">
                        {/* Avatar */}
                        <div className="relative shrink-0 group">
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                onChange={handleImageChange} 
                                accept="image/*" 
                                className="hidden" 
                            />
                            <div className="size-[140px] rounded-full bg-white dark:bg-slate-900 p-1.5 shadow-sm border border-slate-200 dark:border-slate-800 relative z-20">
                                <div className="w-full h-full rounded-full bg-[#fde0d9] overflow-hidden relative flex items-end justify-center">
                                    {avatarImage ? (
                                        <img src={avatarImage} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <svg viewBox="0 0 100 100" className="w-[85%] h-[85%] mt-auto translate-y-2">
                                            <circle cx="50" cy="40" r="30" fill="#fbcbb7" />
                                            <path d="M 20 100 A 30 30 0 0 1 80 100" fill="#2563eb" />
                                            <path d="M 15 45 C 15 20, 85 20, 85 45 C 95 45, 95 60, 80 65 C 80 75, 20 75, 20 65 C 5 60, 5 45, 15 45 Z" fill="#e89481" />
                                            <circle cx="50" cy="40" r="28" fill="#fbcbb7" />
                                            <circle cx="35" cy="38" r="4" fill="#000" />
                                            <circle cx="65" cy="38" r="4" fill="#000" />
                                            <path d="M 40 50 Q 50 60 60 50" stroke="#000" strokeWidth="2" fill="none" />
                                            <path d="M 45 53 Q 50 60 55 53 Z" fill="#ef4444" />
                                        </svg>
                                    )}
                                    <div 
                                        onClick={() => fileInputRef.current.click()}
                                        className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                                    >
                                        <span className="material-symbols-outlined text-white text-[28px]">photo_camera</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Identity Information */}
                        <div className="flex flex-col gap-2 pb-2">
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-3">
                                    <h1 className="text-[32px] font-bold text-slate-900 dark:text-white leading-none tracking-tight">
                                        {userData?.identity?.name || user?.displayName || 'Student'}
                                    </h1>
                                    {/* Credibility Signals */}
                                    <div className="flex gap-2">
                                        <div className="bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 p-1 rounded-md" title="University Verified">
                                            <ShieldCheck className="size-4" />
                                        </div>
                                        <div className="bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 p-1 rounded-md" title="GitHub Connected">
                                            <Github className="size-4" />
                                        </div>
                                    </div>
                                </div>
                                <p className="text-slate-500 dark:text-slate-400 font-medium text-[15px] flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[18px]">school</span>
                                    {userData?.identity?.branch || 'Set your branch'} • {userData?.identity?.year || 'Year'}
                                </p>
                                <div className="flex flex-wrap items-center gap-3 mt-4">
                                    <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded-xl text-[13px] font-bold border border-blue-100 dark:border-blue-800/30">
                                        <Sparkles className="size-3.5" />
                                        Score: {calculateIntelligenceScore(userData)}
                                    </div>
                                    <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-3 py-1.5 rounded-xl text-[13px] font-bold border border-slate-200 dark:border-slate-700">
                                        <Target className="size-3.5" />
                                        {calculateSkillLevel(userData?.metrics)}
                                    </div>
                                </div>
                            </div>
                            
                            {/* Profile Strength Indicator */}
                            <div className="flex items-center gap-3 mt-4 bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 max-w-sm">
                                <div className="flex flex-col flex-1 gap-1.5">
                                    <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                        <span>Profile Strength</span>
                                        <span className="text-blue-600">82%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-600 rounded-full" style={{width: '82%'}}></div>
                                    </div>
                                </div>
                                <div className="text-[11px] text-slate-500 pl-3 border-l border-slate-200 dark:border-slate-700 leading-snug">
                                    Add <span className="font-medium text-slate-900 dark:text-white">1 project</span> to reach Platinum
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0 pb-2">
                        <button className="w-full sm:w-auto px-5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm text-[14px]">
                            <Share2 className="size-4" /> Share
                        </button>
                        <Link 
                            to="/dashboard/portfolio" 
                            className="w-full sm:w-auto px-5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm text-[14px]"
                        >
                            <ExternalLink className="size-4" /> Portfolio
                        </Link>
                        {/* Primary Action */}
                        <button className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm text-[14px]">
                            <Download className="size-4" /> Download Resume
                        </button>
                    </div>
                </div>
            </div>

            {/* Internal OS Tabs Navigation */}
            <div className="flex overflow-x-auto no-scrollbar gap-2 mb-8 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm w-max mx-auto md:mx-0">
                {['Overview', 'Timeline', 'Data Hub', 'Resume Studio'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-2.5 rounded-xl font-medium text-[14px] transition-all whitespace-nowrap ${
                            activeTab === tab 
                            ? 'bg-blue-600 text-white shadow-sm' 
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Layout Grid */}
            {activeTab === 'Overview' && (
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start animate-in fade-in duration-500">
                    
                    {/* Left Column (Main Content) */}
                    <div className="xl:col-span-2 flex flex-col gap-8">
                    
                    {/* 2. Structured Skills Section */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
                        <h3 className="text-[20px] font-bold text-slate-900 dark:text-white mb-6 tracking-tight">Technical & Soft Skills</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="flex flex-col gap-6">
                                <div>
                                    <h4 className="text-[12px] font-bold text-slate-500 dark:text-slate-400 mb-3 uppercase tracking-wider">Core Languages & Frameworks</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {['JavaScript (ES6+)', 'Node.js', 'React.js', 'Python', 'Go'].map(skill => (
                                            <span key={skill} className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-800/50 font-medium text-[13px] px-3.5 py-1.5 rounded-lg">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-[12px] font-bold text-slate-500 dark:text-slate-400 mb-3 uppercase tracking-wider">Cloud & Databases</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {['PostgreSQL', 'MongoDB', 'Redis', 'AWS EC2', 'Docker'].map(skill => (
                                            <span key={skill} className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-medium text-[13px] px-3.5 py-1.5 rounded-lg">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            
                            <div>
                                <h4 className="text-[12px] font-bold text-slate-500 dark:text-slate-400 mb-3 uppercase tracking-wider">Soft Skills (AI Verified)</h4>
                                <div className="flex flex-col gap-2">
                                    {['Cross-functional Leadership', 'Technical Communication', 'Agile Methodologies'].map(skill => (
                                        <div key={skill} className="flex items-center gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-xl shadow-sm">
                                            <CheckCircle2 className="size-5 text-green-500" />
                                            <span className="text-[14px] font-medium text-slate-700 dark:text-slate-300">{skill}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 3. Impact-Driven Experience */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
                        <h3 className="text-[20px] font-bold text-slate-900 dark:text-white mb-8 tracking-tight">Work Experience</h3>
                        
                        <div className="flex flex-col gap-8 relative">
                            {/* Vertical Line for Timeline */}
                            <div className="absolute left-[19px] top-6 bottom-4 w-px bg-slate-200 dark:bg-slate-700"></div>

                            {/* Timeline Item 1 */}
                            <div className="flex gap-6 relative z-10 group">
                                <div className="size-10 rounded-full bg-white dark:bg-slate-900 border-4 border-slate-100 dark:border-slate-800 flex items-center justify-center shrink-0 shadow-sm">
                                    <div className="size-4 rounded-full bg-blue-600"></div>
                                </div>
                                <div className="flex-1 pb-4">
                                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-1 mb-2">
                                        <div>
                                            <h4 className="text-[16px] font-bold text-slate-900 dark:text-white tracking-tight group-hover:text-blue-600 transition-colors">Software Engineer Intern</h4>
                                            <p className="text-[14px] font-medium text-slate-600 dark:text-slate-400">Microsoft</p>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-[12px] font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md h-max">
                                            <Calendar className="size-3.5" /> May 2024 - Aug 2024
                                        </div>
                                    </div>
                                    <p className="text-[14px] text-slate-600 dark:text-slate-400 mb-3">
                                        Worked on the Azure Core Infrastructure team improving microservice deployment pipelines.
                                    </p>
                                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50">
                                        <p className="text-[12px] font-bold text-slate-500 uppercase tracking-wider mb-2">Key Impact</p>
                                        <ul className="list-disc list-outside ml-4 text-[13.5px] text-slate-700 dark:text-slate-300 space-y-1.5 marker:text-blue-600">
                                            <li>Reduced container deployment latency by <span className="font-bold text-blue-600 dark:text-blue-400">30%</span> using optimized caching strategies.</li>
                                            <li>Authored 15+ comprehensive unit tests in Jest, increasing coverage from 75% to 92%.</li>
                                            <li>Migrated legacy CI/CD bash scripts to GitHub Actions.</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Timeline Item 2 */}
                            <div className="flex gap-6 relative z-10 group">
                                <div className="size-10 rounded-full bg-white dark:bg-slate-900 border-4 border-slate-100 dark:border-slate-800 flex items-center justify-center shrink-0 shadow-sm">
                                    <div className="size-3.5 rounded-full bg-slate-300 dark:bg-slate-600"></div>
                                </div>
                                <div className="flex-1">
                                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-1 mb-2">
                                        <div>
                                            <h4 className="text-[16px] font-bold text-slate-900 dark:text-white tracking-tight group-hover:text-blue-600 transition-colors">Backend Developer (Contract)</h4>
                                            <p className="text-[14px] font-medium text-slate-600 dark:text-slate-400">Local Startup Inc.</p>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-[12px] font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md h-max">
                                            <Calendar className="size-3.5" /> Jan 2023 - Dec 2023
                                        </div>
                                    </div>
                                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50 mt-3">
                                        <p className="text-[12px] font-bold text-slate-500 uppercase tracking-wider mb-2">Key Impact</p>
                                        <ul className="list-disc list-outside ml-4 text-[13.5px] text-slate-700 dark:text-slate-300 space-y-1.5 marker:text-slate-500">
                                            <li>Architected REST APIs using Node.js/Express handling 5,000+ daily requests.</li>
                                            <li>Integrated Stripe payment gateway for seamless user subscription flows.</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 4. Projects with Metrics */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-[20px] font-bold text-slate-900 dark:text-white tracking-tight">Featured Projects</h3>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {userProjects.length > 0 ? (
                                userProjects.slice(0, 2).map((proj) => (
                                    <div key={proj.id} className="flex flex-col bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50 transition-all hover:shadow-md hover:-translate-y-1">
                                        <div className="flex justify-between items-start mb-3">
                                            <h4 className="text-[16px] font-bold text-slate-900 dark:text-white">{proj.title}</h4>
                                            <div className="flex gap-2">
                                                {proj.githubLink && <a href={proj.githubLink} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-900 dark:hover:text-white"><Github className="size-4" /></a>}
                                                {proj.liveLink && <a href={proj.liveLink} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-900 dark:hover:text-white"><ExternalLink className="size-4" /></a>}
                                            </div>
                                        </div>
                                        
                                        <p className="text-[13px] text-slate-600 dark:text-slate-400 leading-relaxed mb-5 flex-1">
                                            {proj.description}
                                        </p>

                                        {proj.techStack && (
                                            <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-slate-200 dark:border-slate-700/50">
                                                {proj.techStack.split(',').slice(0, 3).map(tag => (
                                                    <span key={tag} className="text-[11px] font-medium text-slate-500 dark:text-slate-400 px-2.5 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md">
                                                        {tag.trim()}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-2 text-center py-12 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                                    <p className="text-slate-500 font-medium">No projects added yet.</p>
                                    <button onClick={() => setActiveTab('Data Hub')} className="text-blue-600 hover:underline text-sm mt-2">Add your first project</button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Academic Performance (Data-Rich) */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-[20px] font-bold text-slate-900 dark:text-white tracking-tight">Academic Performance</h3>
                            <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1 rounded-md uppercase tracking-wider">
                                <ShieldCheck className="size-3.5" /> Registrar Verified
                            </div>
                        </div>

                        {/* Top Metrics */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50">
                                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1">Current CGPA</p>
                                <p className="text-[28px] font-bold text-slate-900 dark:text-white">9.2<span className="text-[14px] text-slate-400">/10</span></p>
                            </div>
                            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50">
                                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1">Major GPA</p>
                                <p className="text-[28px] font-bold text-slate-900 dark:text-white">9.5<span className="text-[14px] text-slate-400">/10</span></p>
                            </div>
                            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50">
                                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1">Completed Sem.</p>
                                <p className="text-[28px] font-bold text-slate-900 dark:text-white">6<span className="text-[14px] text-slate-400">/8</span></p>
                            </div>
                            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50">
                                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1">Credits</p>
                                <p className="text-[28px] font-bold text-slate-900 dark:text-white">120</p>
                            </div>
                        </div>

                        {/* Trend Bar Graph - Fixed Scale and Data */}
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between items-center text-[12px] font-medium text-slate-500 mb-2">
                                <span>Performance Trend over 6 Semesters</span>
                                <span className="flex items-center gap-1 text-green-600 font-bold bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded"><TrendingUp className="size-3"/> +1.3 GPA Growth</span>
                            </div>
                            <div className="h-40 flex items-end gap-3 justify-between relative border-b border-slate-200 dark:border-slate-800 pt-4">
                                {/* Grid Lines */}
                                <div className="absolute top-0 w-full border-t border-dashed border-slate-200 dark:border-slate-800"></div>
                                <div className="absolute top-1/2 w-full border-t border-dashed border-slate-200 dark:border-slate-800"></div>
                                
                                {[
                                    { val: '7.9', h: '60%', g: 'bg-slate-200 dark:bg-slate-700', label: 'Sem 1' },
                                    { val: '8.1', h: '68%', g: 'bg-slate-200 dark:bg-slate-700', label: 'Sem 2' },
                                    { val: '8.5', h: '75%', g: 'bg-slate-200 dark:bg-slate-700', label: 'Sem 3' },
                                    { val: '8.9', h: '82%', g: 'bg-blue-300 dark:bg-blue-800/60', label: 'Sem 4' },
                                    { val: '9.0', h: '86%', g: 'bg-blue-400 dark:bg-blue-700', label: 'Sem 5' },
                                    { val: '9.2', h: '95%', g: 'bg-blue-600 dark:bg-blue-600', label: 'Sem 6' },
                                ].map((bar, idx) => (
                                    <div key={idx} className="flex-1 flex flex-col items-center group h-full justify-end relative z-10">
                                        <span className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-6 text-[11px] font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 p-1 rounded shadow-sm border border-slate-200 dark:border-slate-700">{bar.val}</span>
                                        <div 
                                            style={{ height: bar.h }}
                                            className={`w-full max-w-[40px] ${bar.g} rounded-t-lg transition-all duration-300 group-hover:bg-blue-500`}
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between w-full mt-2">
                                {['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6'].map((l, i) => (
                                    <span key={i} className="flex-1 text-center text-[11px] font-medium text-slate-500">{l}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column (Recruiter Sticky Panel & Analytics) */}
                <div className="xl:col-span-1 h-max sticky top-24 flex flex-col gap-8">
                    
                    {/* Sticky Recruiter Action Console */}
                    <div className="bg-slate-900 dark:bg-[#0B0F19] rounded-2xl p-8 border border-slate-800 shadow-sm flex flex-col gap-6">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                            <span className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">Recruiter Portal</span>
                        </div>
                        
                        <div className="flex flex-col gap-4 mb-2">
                            <div>
                                <h4 className="text-[12px] font-medium text-slate-500 mb-2">Available for:</h4>
                                <div className="flex gap-2">
                                    <span className="text-[12px] font-medium text-emerald-400 bg-emerald-900/30 px-3 py-1 rounded-md border border-emerald-800/50">✓ Internship</span>
                                    <span className="text-[12px] font-medium text-emerald-400 bg-emerald-900/30 px-3 py-1 rounded-md border border-emerald-800/50">✓ Full-time (2025)</span>
                                </div>
                            </div>
                            <div>
                                <h4 className="text-[12px] font-medium text-slate-500 mb-2">Preferred Roles:</h4>
                                <div className="flex gap-2 flex-wrap">
                                    <span className="text-[12px] font-medium text-slate-300 bg-slate-800 px-3 py-1 rounded-md border border-slate-700">Backend Eng</span>
                                    <span className="text-[12px] font-medium text-slate-300 bg-slate-800 px-3 py-1 rounded-md border border-slate-700">Platform Eng</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-[14px] font-medium py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm">
                                <Calendar className="size-4" /> Schedule Interview
                            </button>
                            <button className="w-full bg-slate-800 hover:bg-slate-700 text-white text-[14px] font-medium py-3 rounded-xl transition-all border border-slate-700 flex items-center justify-center gap-2">
                                <Mail className="size-4" /> Contact Student
                            </button>
                        </div>
                    </div>

                    {/* Job Readiness Analytical Dashboard */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
                        <h3 className="text-[16px] font-bold text-slate-900 dark:text-white tracking-tight mb-8">Comprehensive Readiness</h3>
                        
                        {/* High-Impact Circular Gauge */}
                        <div className="flex justify-center mb-8">
                            <div className="relative size-[140px] flex items-center justify-center">
                                <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                                    <path className="text-slate-100 dark:text-slate-800" strokeWidth="4" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                    <path className="text-blue-600 filter drop-shadow-sm" strokeWidth="4" strokeDasharray="88, 100" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                </svg>
                                <div className="absolute text-center flex flex-col justify-center">
                                    <span className="text-[32px] font-bold text-slate-900 dark:text-white leading-none tracking-tight">88%</span>
                                </div>
                            </div>
                        </div>

                        {/* Sub-score Breakdown */}
                        <div className="space-y-4">
                            {[
                                {label: 'DSA Skills', score: '92%', width:'92%'},
                                {label: 'Projects', score: '85%', width:'85%'},
                                {label: 'Communication', score: '78%', width:'78%'},
                                {label: 'System Design', score: '80%', width:'80%'},
                            ].map((item, i) => (
                                <div key={i}>
                                    <div className="flex justify-between items-baseline mb-1">
                                        <span className="text-[13px] font-medium text-slate-600 dark:text-slate-400">{item.label}</span>
                                        <span className="text-[13px] font-bold text-slate-900 dark:text-white">{item.score}</span>
                                    </div>
                                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                        <div className="bg-blue-600 h-full rounded-full" style={{ width: item.width }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Platform Activity */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center gap-2 mb-6">
                            <Activity className="size-5 text-blue-600" />
                            <h3 className="text-[16px] font-bold text-slate-900 dark:text-white tracking-tight">Recent Activity</h3>
                        </div>

                        <div className="flex flex-col gap-5">
                            <div className="flex gap-3 items-start">
                                <div className="size-2 mt-1.5 rounded-full bg-blue-600"></div>
                                <div>
                                    <p className="text-[14px] text-slate-700 dark:text-slate-300 font-medium">Solved 15 LeetCode problems this week</p>
                                    <span className="text-[11px] text-slate-500">2 days ago</span>
                                </div>
                            </div>
                            <div className="flex gap-3 items-start">
                                <div className="size-2 mt-1.5 rounded-full bg-emerald-500"></div>
                                <div>
                                    <p className="text-[14px] text-slate-700 dark:text-slate-300 font-medium">Completed Backend Architecture Assessment</p>
                                    <span className="text-[11px] text-slate-500">5 days ago</span>
                                </div>
                            </div>
                            <div className="flex gap-3 items-start">
                                <div className="size-2 mt-1.5 rounded-full bg-slate-300 dark:bg-slate-700"></div>
                                <div>
                                    <p className="text-[14px] text-slate-700 dark:text-slate-300 font-medium">Updated project: Distributed Task Queue</p>
                                    <span className="text-[11px] text-slate-500">1 week ago</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            )}

            {activeTab === 'Timeline' && (
                <div className="flex flex-col gap-8 animate-in fade-in duration-500">
                    
                    {/* Header Action */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900 rounded-2xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
                        <div className="absolute right-0 top-0 w-64 h-full bg-gradient-to-l from-blue-50/50 dark:from-blue-900/10 to-transparent pointer-events-none"></div>
                        <div>
                            <h2 className="text-[22px] font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                                <Activity className="size-5 text-blue-600" /> Career Journey
                            </h2>
                            <p className="text-[14px] text-slate-500 mt-1 max-w-xl">
                                Track your academic milestones, internships, and projects chronologically. Our AI uses this data to automatically craft ATS-optimized resume sections.
                            </p>
                        </div>
                        <button 
                            onClick={() => setActiveTab('Data Hub')}
                            className="shrink-0 px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 font-medium rounded-xl transition-all shadow-sm flex items-center gap-2 text-[14px]"
                        >
                            <span className="material-symbols-outlined text-[18px]">add</span> Add Experience
                        </button>
                    </div>

                    {/* Timeline Container */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 md:p-10 border border-slate-200 dark:border-slate-800 shadow-sm">
                        
                        <div className="relative">
                            {/* Main Vertical Track */}
                            <div className="absolute left-[23px] top-4 bottom-8 w-1 bg-slate-100 dark:bg-slate-800 rounded-full"></div>

                            {/* 2024 Header */}
                            <div className="flex items-center gap-4 mb-8">
                                <div className="bg-white dark:bg-slate-900 z-10 font-bold text-slate-900 dark:text-white text-[18px] py-1">2024</div>
                                <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1"></div>
                            </div>

                            {/* Item: Internship */}
                            <div className="flex gap-6 relative z-10 group mb-10">
                                <div className="mt-1 size-[48px] rounded-full bg-blue-50 dark:bg-blue-900/30 border-4 border-white dark:border-slate-900 flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-110">
                                    <Briefcase className="size-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div className="flex-1">
                                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2 mb-3">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-[11px] font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded uppercase tracking-wider">Internship</span>
                                                    <span className="text-[13px] text-slate-500 font-medium">Summer 2024</span>
                                                </div>
                                                <h3 className="text-[18px] font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">Software Engineer Intern</h3>
                                                <p className="text-[14px] text-slate-600 dark:text-slate-400 font-medium font-display mt-0.5">Microsoft • Seattle, WA</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"><span className="material-symbols-outlined text-[18px]">edit</span></button>
                                            </div>
                                        </div>
                                        <p className="text-[14px] text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                                            Engineered scalable microservices for Azure Core using C# and .NET. Reduced API latency by 30% through advanced Redis caching mechanisms.
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {['C#', '.NET Core', 'Azure', 'Redis'].map(tag => (
                                                <span key={tag} className="text-[12px] font-medium text-slate-600 dark:text-slate-400 px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Item: Semester */}
                            <div className="flex gap-6 relative z-10 group mb-10">
                                <div className="mt-1 size-[48px] rounded-full bg-emerald-50 dark:bg-emerald-900/30 border-4 border-white dark:border-slate-900 flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-110">
                                    <GraduationCap className="size-5 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <div className="flex-1">
                                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2 mb-3">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded uppercase tracking-wider">Academic</span>
                                                    <span className="text-[13px] text-slate-500 font-medium">Spring 2024</span>
                                                </div>
                                                <h3 className="text-[18px] font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">Semester 6 Completed</h3>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[16px] font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">GPA: 9.4</span>
                                                <button className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors"><span className="material-symbols-outlined text-[18px]">edit</span></button>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            <span className="text-[12px] font-medium text-slate-600 dark:text-slate-400 px-3 py-1 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800">Advanced Algorithms: A+</span>
                                            <span className="text-[12px] font-medium text-slate-600 dark:text-slate-400 px-3 py-1 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800">Operating Systems: A</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 2023 Header */}
                            <div className="flex items-center gap-4 mb-8">
                                <div className="bg-white dark:bg-slate-900 z-10 font-bold text-slate-900 dark:text-white text-[18px] py-1">2023</div>
                                <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1"></div>
                            </div>

                            {/* Item: Hackathon / Project */}
                            <div className="flex gap-6 relative z-10 group mb-4">
                                <div className="mt-1 size-[48px] rounded-full bg-purple-50 dark:bg-purple-900/30 border-4 border-white dark:border-slate-900 flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-110">
                                    <Activity className="size-5 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div className="flex-1">
                                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2 mb-3">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-[11px] font-bold text-purple-600 bg-purple-50 dark:bg-purple-900/30 px-2 py-0.5 rounded uppercase tracking-wider">Project / Hackathon</span>
                                                    <span className="text-[13px] text-slate-500 font-medium">Nov 2023</span>
                                                </div>
                                                <h3 className="text-[18px] font-bold text-slate-900 dark:text-white group-hover:text-purple-600 transition-colors">AI Resume Parser</h3>
                                            </div>
                                            <div className="flex gap-2">
                                                <button className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"><span className="material-symbols-outlined text-[18px]">edit</span></button>
                                            </div>
                                        </div>
                                        <p className="text-[14px] text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                                            Won 1st Place at University Hackathon. Built a multi-modal parser using OpenAI GPT-4 to extract structured data from complex PDF/Word formats, achieving a 91% accuracy rate.
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {['Python', 'FastAPI', 'React', 'OpenAI'].map(tag => (
                                                <span key={tag} className="text-[12px] font-medium text-slate-600 dark:text-slate-400 px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Baseline Indicator */}
                            <div className="flex gap-6 relative z-10 group pl-1.5 mt-8">
                                <div className="size-3 rounded-full bg-slate-300 dark:bg-slate-600 border-2 border-white dark:border-slate-900"></div>
                            </div>

                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'Data Hub' && (
                <div className="flex flex-col gap-8 animate-in fade-in duration-500">
                    
                    {/* Header Action */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900 rounded-2xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
                        <div className="absolute right-0 top-0 w-64 h-full bg-gradient-to-l from-emerald-50/50 dark:from-emerald-900/10 to-transparent pointer-events-none"></div>
                        <div>
                            <h2 className="text-[22px] font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                                <Briefcase className="size-5 text-emerald-600" /> Smart Data Hub
                            </h2>
                            <p className="text-[14px] text-slate-500 mt-1 max-w-xl">
                                Provide your raw experiences below. Our AI converts them into ATS-friendly bullets, quantifies your impact, and updates your Career Timeline automatically.
                            </p>
                        </div>
                    </div>

                    {/* My Information — feeds AI personalization */}
                    <form onSubmit={handleProfileSave} className="bg-white dark:bg-slate-900 rounded-2xl border border-blue-200 dark:border-blue-900/40 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800/50 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/20">
                            <div className="flex items-center gap-3">
                                <div className="size-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 flex items-center justify-center text-blue-600">
                                    <span className="material-symbols-outlined text-[20px]">psychology</span>
                                </div>
                                <div>
                                    <h3 className="text-[16px] font-bold text-slate-900 dark:text-white">My Information</h3>
                                    <p className="text-[12px] text-slate-500">
                                        {isEditing ? "Editing your professional profile context." : "Your AI mentor uses this data for personalization."}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                {profileSaved && (
                                    <span className="text-[12px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-lg flex items-center gap-1.5 animate-in fade-in slide-in-from-right-4">
                                        <CheckCircle2 className="size-3.5" /> Saved!
                                    </span>
                                )}
                                <button 
                                    type="button"
                                    onClick={() => setIsEditing(!isEditing)}
                                    className={`p-2 rounded-xl transition-all ${isEditing ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20'}`}
                                >
                                    <span className="material-symbols-outlined text-[20px]">{isEditing ? 'close' : 'edit'}</span>
                                </button>
                            </div>
                        </div>

                        {!isEditing ? (
                            <div className="p-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    <div className="space-y-1">
                                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Full Name</p>
                                        <p className="text-[16px] font-semibold text-slate-900 dark:text-white">{userData?.identity?.name || "Not set"}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Academic Track</p>
                                        <p className="text-[16px] font-semibold text-slate-900 dark:text-white">
                                            {userData?.identity?.branch || "Not set"} {userData?.identity?.year ? `(${userData.identity.year})` : ""}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Institution</p>
                                        <p className="text-[16px] font-semibold text-slate-900 dark:text-white">{userData?.identity?.college || "Not set"}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 text-blue-600">
                                            <Github className="size-3" /> GitHub Profille
                                        </p>
                                        {userData?.social_links?.github ? (
                                            <a href={`https://github.com/${userData.social_links.github}`} target="_blank" rel="noopener noreferrer" className="text-[16px] font-semibold text-blue-600 hover:underline flex items-center gap-1">
                                                @{userData.social_links.github} <ExternalLink className="size-3" />
                                            </a>
                                        ) : (
                                            <p className="text-[16px] font-semibold text-slate-400">Not set</p>
                                        )}
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 text-orange-600">
                                            <Sparkles className="size-3" /> LeetCode
                                        </p>
                                        {userData?.social_links?.leetcode ? (
                                            <a href={`https://leetcode.com/${userData.social_links.leetcode}`} target="_blank" rel="noopener noreferrer" className="text-[16px] font-semibold text-orange-600 hover:underline flex items-center gap-1">
                                                @{userData.social_links.leetcode} <ExternalLink className="size-3" />
                                            </a>
                                        ) : (
                                            <p className="text-[16px] font-semibold text-slate-400">Not set</p>
                                        )}
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Career Objective</p>
                                        <p className="text-[16px] font-semibold text-slate-900 dark:text-white truncate max-w-xs">{userData?.career_dna?.learning_goal || "Not set"}</p>
                                    </div>
                                </div>

                                <div className="mt-10 pt-6 border-t border-slate-100 dark:border-slate-800/50 flex flex-wrap items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <button 
                                            type="button" 
                                            onClick={handleSync}
                                            disabled={isSyncing}
                                            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[14px] font-bold transition-all ${
                                                isSyncing ? 'bg-slate-100 text-slate-400 animate-pulse' : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:scale-105 active:scale-95 shadow-sm'
                                            }`}
                                        >
                                            {isSyncing ? (
                                                <div className="size-4 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin"></div>
                                            ) : (
                                                <span className="material-symbols-outlined text-[20px]">sync</span>
                                            )}
                                            {isSyncing ? 'Syncing...' : 'Sync Everything'}
                                        </button>
                                        <div className="flex flex-col">
                                            {userData?.lastSynced ? (
                                                <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                                                    <Activity className="size-3" /> Last synced: {new Date(userData.lastSynced).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            ) : (
                                                <p className="text-[11px] text-slate-400 italic">Not synced yet</p>
                                            )}
                                            {syncSuccess && (
                                                <span className="text-[11px] font-bold text-emerald-600">Sync Complete!</span>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-2 px-4 py-2 bg-blue-50/50 dark:bg-blue-900/10 rounded-lg border border-blue-100 dark:border-blue-800/30">
                                        <div className="size-2 rounded-full bg-blue-500 animate-pulse"></div>
                                        <span className="text-[12px] font-semibold text-blue-700 dark:text-blue-400">Live AI Personalization Active</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-[12px] font-bold text-slate-600 dark:text-slate-400 mb-1.5">Full Name</label>
                                        <input name="profileName" type="text" defaultValue={userData?.identity?.name || ''} placeholder="e.g. Yashika Sharma" className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-[14px] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
                                    </div>
                                    <div>
                                        <label className="block text-[12px] font-bold text-slate-600 dark:text-slate-400 mb-1.5">Branch / Degree</label>
                                        <input name="branch" type="text" defaultValue={userData?.identity?.branch || ''} placeholder="e.g. Computer Science Engineering" className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-[14px] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
                                    </div>
                                    <div>
                                        <label className="block text-[12px] font-bold text-slate-600 dark:text-slate-400 mb-1.5">Year of Study</label>
                                        <select name="year" defaultValue={userData?.identity?.year || ''} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-[14px] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50">
                                            <option value="">Select year</option>
                                            <option value="1st Year">1st Year</option>
                                            <option value="2nd Year">2nd Year</option>
                                            <option value="3rd Year">3rd Year</option>
                                            <option value="4th Year">4th Year</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[12px] font-bold text-slate-600 dark:text-slate-400 mb-1.5">College</label>
                                        <input name="college" type="text" defaultValue={userData?.identity?.college || ''} placeholder="e.g. IIT Bombay" className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-[14px] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
                                    </div>
                                    <div>
                                        <label className="block text-[12px] font-bold text-slate-600 dark:text-slate-400 mb-1.5 text-blue-600">GitHub Username</label>
                                        <input name="github" type="text" defaultValue={userData?.social_links?.github || ''} placeholder="e.g. yashikasharma" className="w-full bg-white dark:bg-slate-900 border border-blue-100 dark:border-blue-900/50 rounded-xl px-3 py-2 text-[14px] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
                                    </div>
                                    <div>
                                        <label className="block text-[12px] font-bold text-slate-600 dark:text-slate-400 mb-1.5 text-orange-600">LeetCode Username</label>
                                        <input name="leetcode" type="text" defaultValue={userData?.social_links?.leetcode || ''} placeholder="e.g. yashika_01" className="w-full bg-white dark:bg-slate-900 border border-orange-100 dark:border-orange-900/50 rounded-xl px-3 py-2 text-[14px] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
                                    </div>
                                    <div className="md:col-span-2 lg:col-span-3">
                                        <label className="block text-[12px] font-bold text-slate-600 dark:text-slate-400 mb-1.5">Career Goal</label>
                                        <input name="goal" type="text" defaultValue={userData?.career_dna?.learning_goal || ''} placeholder="e.g. Software Engineer at a product company" className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-[14px] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
                                    </div>
                                </div>
                                <div className="px-6 pb-6 flex justify-end gap-3">
                                    <button 
                                        type="button" 
                                        onClick={() => setIsEditing(false)}
                                        className="px-6 py-2.5 rounded-xl text-[14px] font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-2.5 rounded-xl text-[14px] flex items-center gap-2 shadow-md transition-all hover:scale-105 active:scale-95 disabled:opacity-50">
                                        {isSubmitting ? 'Saving...' : (
                                            <>
                                                <span className="material-symbols-outlined text-[18px]">check</span> Save Changes
                                            </>
                                        )}
                                    </button>
                                </div>
                            </>
                        )}
                    </form>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        
                        {/* Box 1: Academics */}
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                            <div className="p-6 border-b border-slate-100 dark:border-slate-800/50 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/20">
                                <div className="flex items-center gap-3">
                                    <div className="size-10 rounded-xl bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800/30 flex items-center justify-center text-orange-600">
                                        <GraduationCap className="size-5" />
                                    </div>
                                    <h3 className="text-[16px] font-bold text-slate-900 dark:text-white">Academics</h3>
                                </div>
                                <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[11px] font-bold px-2.5 py-1 rounded-md">6 Entries</span>
                            </div>
                            <div className="p-6 flex-1 flex flex-col justify-between">
                                <p className="text-[14px] text-slate-600 dark:text-slate-400 mb-6 font-medium leading-relaxed">
                                    Log semester GPAs, relevant coursework, awards, and extracurricular leadership roles.
                                </p>
                                <button 
                                    onClick={() => document.getElementById('project-form')?.scrollIntoView({ behavior: 'smooth' })}
                                    className="w-full bg-white dark:bg-slate-900 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-orange-500 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/10 text-slate-600 dark:text-slate-400 font-medium py-3 rounded-xl transition-all flex items-center justify-center gap-2 text-[14px]"
                                >
                                    <span className="material-symbols-outlined text-[20px]">add</span> Add Semester Record
                                </button>
                            </div>
                        </div>

                        {/* Box 2: Projects */}
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow relative">
                            {/* AI Glow Effect */}
                            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-purple-500 to-blue-500"></div>
                            
                            <div className="p-6 border-b border-slate-100 dark:border-slate-800/50 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/20">
                                <div className="flex items-center gap-3">
                                    <div className="size-10 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800/30 flex items-center justify-center text-purple-600">
                                        <Github className="size-5" />
                                    </div>
                                    <h3 className="text-[16px] font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                        Projects <span className="text-[10px] bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-2 py-0.5 rounded uppercase tracking-wider font-bold">AI Active</span>
                                    </h3>
                                </div>
                                <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[11px] font-bold px-2.5 py-1 rounded-md">2 Entries</span>
                            </div>
                            <div className="p-6 flex-1 flex flex-col justify-between">
                                <p className="text-[14px] text-slate-600 dark:text-slate-400 mb-6 font-medium leading-relaxed">
                                    Paste a GitHub repo link and let our AI extract the tech stack and formulate impact bullet points.
                                </p>
                                <button 
                                    onClick={() => document.getElementById('project-form')?.scrollIntoView({ behavior: 'smooth' })}
                                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 text-[14px]"
                                >
                                    <span className="material-symbols-outlined text-[20px] font-light">magic_button</span> Auto-import Project
                                </button>
                            </div>
                        </div>

                        {/* Box 3: Experience */}
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                            <div className="p-6 border-b border-slate-100 dark:border-slate-800/50 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/20">
                                <div className="flex items-center gap-3">
                                    <div className="size-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 flex items-center justify-center text-blue-600">
                                        <Briefcase className="size-5" />
                                    </div>
                                    <h3 className="text-[16px] font-bold text-slate-900 dark:text-white">Experience</h3>
                                </div>
                                <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[11px] font-bold px-2.5 py-1 rounded-md">2 Entries</span>
                            </div>
                            <div className="p-6 flex-1 flex flex-col justify-between">
                                <p className="text-[14px] text-slate-600 dark:text-slate-400 mb-6 font-medium leading-relaxed">
                                    Add your internships, contract roles, and full-time positions. Answer a few questions about your impact.
                                </p>
                                <button 
                                    onClick={() => document.getElementById('project-form')?.scrollIntoView({ behavior: 'smooth' })}
                                    className="w-full bg-white dark:bg-slate-900 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/10 text-slate-600 dark:text-slate-400 font-medium py-3 rounded-xl transition-all flex items-center justify-center gap-2 text-[14px]"
                                >
                                    <span className="material-symbols-outlined text-[20px]">add</span> Add Experience
                                </button>
                            </div>
                        </div>

                    </div>

                    {/* Interactive Skeleton View for adding a Project (Open State) */}
                    <form 
                        id="project-form"
                        onSubmit={handleProjectSubmit} 
                        className="bg-white dark:bg-slate-900 rounded-2xl p-6 md:p-8 border border-purple-200 dark:border-purple-900/50 shadow-sm relative mt-4"
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-[18px] font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <span className="material-symbols-outlined text-purple-600 text-[20px]">auto_awesome</span> Add New Project
                                </h3>
                                <p className="text-[14px] text-slate-500 mt-1">Provide your project details. This will auto-generate your portfolio.</p>
                            </div>
                        </div>

                        <div className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-[13px] font-bold text-slate-700 dark:text-slate-300 mb-1.5">Project Name <span className="text-red-500">*</span></label>
                                    <input 
                                        type="text" 
                                        required
                                        value={projectForm.title}
                                        onChange={(e) => setProjectForm(prev => ({...prev, title: e.target.value}))}
                                        placeholder="e.g. Distributed Task Queue" 
                                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-[14px] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-[13px] font-bold text-slate-700 dark:text-slate-300 mb-1.5">Academics / Category</label>
                                    <input 
                                        type="text" 
                                        value={projectForm.academics}
                                        onChange={(e) => setProjectForm(prev => ({...prev, academics: e.target.value}))}
                                        placeholder="e.g. B.Tech Final Year" 
                                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-[14px] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50" 
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[13px] font-bold text-slate-700 dark:text-slate-300 mb-1.5">Tech Stack</label>
                                <input 
                                    type="text" 
                                    value={projectForm.techStack}
                                    onChange={(e) => setProjectForm(prev => ({...prev, techStack: e.target.value}))}
                                    placeholder="e.g. React, Node.js, Firebase" 
                                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-[14px] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50" 
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-[13px] font-bold text-slate-700 dark:text-slate-300 mb-1.5">GitHub Link</label>
                                    <input 
                                        type="url" 
                                        value={projectForm.githubLink}
                                        onChange={(e) => setProjectForm(prev => ({...prev, githubLink: e.target.value}))}
                                        placeholder="https://github.com/..." 
                                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-[14px] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-[13px] font-bold text-slate-700 dark:text-slate-300 mb-1.5">Live Link</label>
                                    <input 
                                        type="url" 
                                        value={projectForm.liveLink}
                                        onChange={(e) => setProjectForm(prev => ({...prev, liveLink: e.target.value}))}
                                        placeholder="https://..." 
                                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-[14px] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50" 
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[13px] font-bold text-slate-700 dark:text-slate-300 mb-1.5">Description <span className="text-red-500">*</span></label>
                                <textarea 
                                    rows="3" 
                                    required
                                    value={projectForm.description}
                                    onChange={(e) => setProjectForm(prev => ({...prev, description: e.target.value}))}
                                    placeholder="Briefly describe your project and your impact..." 
                                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-[14px] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none"
                                ></textarea>
                            </div>

                            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                                <button 
                                    type="button"
                                    onClick={() => setProjectForm({title: '', description: '', techStack: '', githubLink: '', liveLink: '', academics: ''})}
                                    className="px-5 py-2.5 text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors text-[14px]"
                                >
                                    Clear
                                </button>
                                <button 
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-xl transition-colors shadow-sm text-[14px] flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="size-4 animate-spin" /> Adding...
                                        </>
                                    ) : (
                                        <>
                                            <span className="material-symbols-outlined text-[18px]">add</span> Add to Portfolio
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>

                </div>
            )}

            {activeTab === 'Resume Studio' && (
                <div className="flex flex-col gap-8 animate-in fade-in duration-500">
                    
                    {/* Header Action */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900 rounded-2xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
                        <div className="absolute right-0 top-0 w-64 h-full bg-gradient-to-l from-indigo-50/50 dark:from-indigo-900/10 to-transparent pointer-events-none"></div>
                        <div>
                            <h2 className="text-[22px] font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                                <Download className="size-5 text-indigo-600" /> Resume Generation Studio
                            </h2>
                            <p className="text-[14px] text-slate-500 mt-1 max-w-xl">
                                Select specific timeline events to assemble targeted resumes for different roles. Our engine ensures 100% ATS compatibility.
                            </p>
                        </div>
                        <button className="shrink-0 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-all shadow-sm flex items-center gap-2 text-[14px]">
                            <span className="material-symbols-outlined text-[18px]">add_circle</span> New Version
                        </button>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
                        
                        {/* Left Column: Saved Versions */}
                        <div className="xl:col-span-2 flex flex-col gap-6">
                            
                            {/* Version 1 */}
                            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                                <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-indigo-600"></div>
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5 pb-5 border-b border-slate-100 dark:border-slate-800/50">
                                    <div className="pl-3">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="text-[18px] font-bold text-slate-900 dark:text-white">Backend Engineering Focus</h3>
                                            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded uppercase tracking-wider">Default</span>
                                        </div>
                                        <p className="text-[13px] text-slate-500">Updated 2 days ago • Targets distributed systems roles</p>
                                    </div>
                                    <div className="flex items-center gap-2 pl-3 md:pl-0">
                                        <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-lg transition-colors text-[13px] flex items-center gap-1.5">
                                            <span className="material-symbols-outlined text-[16px]">edit</span> Edit
                                        </button>
                                        <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors text-[13px] flex items-center gap-1.5 shadow-sm">
                                            <span className="material-symbols-outlined text-[16px]">download</span> PDF
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="pl-3 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-[13px] text-slate-600 dark:text-slate-400 font-medium">
                                            <ShieldCheck className="size-4 text-emerald-500" /> ATS Match Score
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-48 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                <div className="bg-emerald-500 h-full rounded-full" style={{width: '94%'}}></div>
                                            </div>
                                            <span className="text-[13px] font-bold text-slate-900 dark:text-white">94%</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-2 pt-2">
                                        <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 px-2.5 py-1 rounded-md border border-slate-100 dark:border-slate-800/50">Includes: Microsoft Internship</span>
                                        <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 px-2.5 py-1 rounded-md border border-slate-100 dark:border-slate-800/50">Includes: Distributed Task Queue</span>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Version 2 */}
                            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5 pb-5 border-b border-slate-100 dark:border-slate-800/50">
                                    <div>
                                        <h3 className="text-[18px] font-bold text-slate-900 dark:text-white mb-1">Fullstack Generalist</h3>
                                        <p className="text-[13px] text-slate-500">Updated 1 month ago • Startup focused</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-lg transition-colors text-[13px] flex items-center gap-1.5">
                                            <span className="material-symbols-outlined text-[16px]">edit</span> Edit
                                        </button>
                                        <button className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium rounded-lg transition-colors text-[13px] flex items-center gap-1.5 shadow-sm">
                                            <span className="material-symbols-outlined text-[16px]">download</span> PDF
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-[13px] text-slate-600 dark:text-slate-400 font-medium">
                                            <ShieldCheck className="size-4 text-emerald-500" /> ATS Match Score
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-48 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                <div className="bg-yellow-500 h-full rounded-full" style={{width: '78%'}}></div>
                                            </div>
                                            <span className="text-[13px] font-bold text-slate-900 dark:text-white">78%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* Right Column: AI Analyzer */}
                        <div className="xl:col-span-1 bg-white dark:bg-slate-900 rounded-2xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-sm relative">
                            {/* Decorative Grid Background */}
                            <div className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.08]" style={{backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
                            
                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-6">
                                    <span className="material-symbols-outlined text-indigo-600">document_scanner</span>
                                    <h3 className="text-[16px] font-bold text-slate-900 dark:text-white tracking-tight">AI Resume Feedback</h3>
                                </div>
                                
                                <p className="text-[13px] text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                                    Our parser identifies common failure points in ATS systems. Based on your default resume, here is what you can improve.
                                </p>

                                <div className="space-y-3">
                                    <div className="bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-800/30 p-4 rounded-xl flex gap-3 items-start">
                                        <span className="material-symbols-outlined text-orange-600 text-[18px] mt-0.5">warning</span>
                                        <div>
                                            <h4 className="text-[13px] font-bold text-slate-900 dark:text-white mb-1">Missing Action Verbs</h4>
                                            <p className="text-[12px] text-slate-600 dark:text-slate-400">Replace "worked on" with stronger verbs like "engineered" or "architected" in the Contract Developer role.</p>
                                        </div>
                                    </div>
                                    <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30 p-4 rounded-xl flex gap-3 items-start">
                                        <span className="material-symbols-outlined text-blue-600 text-[18px] mt-0.5">lightbulb</span>
                                        <div>
                                            <h4 className="text-[13px] font-bold text-slate-900 dark:text-white mb-1">Quantify Impact</h4>
                                            <p className="text-[12px] text-slate-600 dark:text-slate-400">You mentioned improving API latency. By how much? Add a percentage to increase recruiter interest.</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <button className="w-full mt-6 bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900 font-medium py-3 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 text-[13px]">
                                    <span className="material-symbols-outlined text-[18px]">auto_fix</span> Auto-Fix Issues
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            )}

        </div>
    );
};

export default Profile;
