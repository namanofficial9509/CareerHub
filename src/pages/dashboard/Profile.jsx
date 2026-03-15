import { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';

const Profile = () => {
    const { user, userData } = useAuth();
    const [viewAsRecruiter, setViewAsRecruiter] = useState(true);
    const [avatarImage, setAvatarImage] = useState(null);
    const fileInputRef = useRef(null);

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
        <div className="flex flex-col gap-6 w-full max-w-[1400px] mx-auto pb-12 font-display">
            
            {/* Top Identity Section - Integrated card/banner style */}
            <div className="bg-white dark:bg-gray-800 rounded-[32px] overflow-hidden border border-gray-100 dark:border-gray-700 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.08)] transition-colors">
                {/* Gradient Banner Background */}
                <div className="h-[280px] bg-gradient-to-r from-[#5d46e2] via-[#5d46e2] to-[#c72bb9] relative">
                    {/* Status at top right */}
                    <div className="absolute top-6 right-8 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 shadow-sm border border-white/20">
                        <div className="size-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-[11px] font-[900] text-gray-700 uppercase tracking-widest leading-none">Recruiter Mode Active</span>
                    </div>
                </div>

                {/* Profile Info Overlay */}
                <div className="px-10 xl:pl-14 xl:pr-24 pb-8 -mt-28 relative z-10 flex flex-col xl:flex-row xl:items-start justify-between gap-12">
                    {/* Left: Avatar & Identity Wrapper */}
                    <div className="flex flex-col xl:flex-row items-center xl:items-start gap-8">
                        {/* High-quality Avatar Shadow & Border */}
                        <div className="relative shrink-0 group">
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                onChange={handleImageChange} 
                                accept="image/*" 
                                className="hidden" 
                            />
                            <div className="size-[160px] rounded-full bg-white p-1.5 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)] relative overflow-hidden">
                                <div className="w-full h-full rounded-full bg-[#fde0d9] border border-gray-100 overflow-hidden relative flex items-end justify-center">
                                    {avatarImage ? (
                                        <img src={avatarImage} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        /* Professional Avatar SVG Illustration */
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
                                    {/* Overlay for hover */}
                                    <div 
                                        onClick={() => fileInputRef.current.click()}
                                        className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                                    >
                                        <span className="material-symbols-outlined text-white text-[32px]">photo_camera</span>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Blue Verified Badge - Larger and Glowy */}
                            <div className="absolute bottom-1 right-1 size-10 bg-[#2513ec] rounded-full border-4 border-white flex items-center justify-center shadow-lg shadow-indigo-600/30 z-20">
                                <span className="material-symbols-outlined text-[20px] text-white filled">verified</span>
                            </div>

                            {/* Camera Trigger for Mobile/Always visible touch point */}
                            <button 
                                onClick={() => fileInputRef.current.click()}
                                className="absolute top-2 right-2 size-10 bg-white rounded-full border border-gray-100 flex items-center justify-center shadow-md hover:scale-110 transition-transform xl:hidden"
                            >
                                <span className="material-symbols-outlined text-[20px] text-gray-600">photo_camera</span>
                            </button>
                        </div>

                        {/* Textual Identity Information */}
                        <div className="flex flex-col mt-4 xl:mt-8 text-center xl:text-left">
                            <div className="flex items-center gap-4 justify-center xl:justify-start">
                                <h1 className="text-[40px] font-[900] text-white tracking-tight leading-none drop-shadow-md">
                                    {userData?.onboarding?.displayName || userData?.fullName || user?.displayName || 'User'}
                                </h1>
                                <div className="bg-white text-[#2513ec] px-3 py-1.5 rounded-lg flex items-center gap-1.5 border border-white shadow-sm shadow-indigo-500/5">
                                    <span className="material-symbols-outlined text-[14px] filled">verified</span>
                                    <span className="text-[11px] font-[900] uppercase tracking-wider leading-none">AI VERIFIED</span>
                                </div>
                            </div>
                            <p className="text-[17px] font-medium text-white mt-3 drop-shadow-sm whitespace-nowrap">
                                {userData?.onboarding?.course || userData?.course || 'Course'}, {userData?.onboarding?.university || userData?.college || 'University'} 
                                <span className="text-white/60 mx-2">|</span> 
                                Batch of {userData?.onboarding?.currentYear || userData?.batch || '202X'}
                            </p>
                            
                            {/* Detailed Metadata Badges */}
                            <div className="flex flex-wrap items-center gap-6 mt-5 justify-center xl:justify-start">
                                <div className="flex items-center gap-2 text-[14px] font-[900] text-[#111827] bg-white/90 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                                    <span className="material-symbols-outlined text-[18px] text-[#2513ec]">inventory_2</span>
                                    Grandmaster on Codeforces
                                </div>
                                <div className="flex items-center gap-2 text-[14px] font-[900] text-[#111827] bg-white/90 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                                    <span className="material-symbols-outlined text-[18px] text-[#2513ec]">school</span>
                                    Dean's List 2024
                                </div>
                            </div>

                            {/* Integrated Profile Completion Bar */}
                            <div className="mt-8 flex items-center gap-4 xl:max-w-md">
                                <div className="h-2.5 flex-1 bg-white/30 rounded-full overflow-hidden backdrop-blur-sm border border-white/10 shadow-inner">
                                    <div className="w-[30%] h-full bg-gradient-to-r from-pink-500 to-[#2513ec] rounded-full shadow-[0_0_15px_rgba(255,255,255,0.6)]"></div>
                                </div>
                                <span className="text-[11px] font-[900] text-[#111827] uppercase tracking-widest whitespace-nowrap drop-shadow-sm bg-white/40 px-2 py-0.5 rounded-md backdrop-blur-sm">30% Profile Completion</span>
                            </div>
                        </div>
                    </div>

                    {/* Action Hub */}
                    <div className="flex items-center gap-3 justify-center xl:justify-end xl:mt-12 w-full xl:w-auto">
                        <button className="h-[42px] px-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-[900] rounded-2xl transition-all flex items-center gap-2 shadow-sm text-[13px]">
                            <span className="material-symbols-outlined text-[18px] text-gray-500 dark:text-gray-400">share</span>
                            Share
                        </button>
                        <button className="h-[42px] px-4 bg-[#111827] dark:bg-gray-700 hover:bg-black dark:hover:bg-gray-600 text-white font-[900] rounded-2xl transition-all flex items-center gap-2 shadow-sm shadow-gray-900/10 text-[13px]">
                            <span className="material-symbols-outlined text-[18px] text-gray-400 dark:text-gray-300">download</span>
                            Resume
                        </button>
                        <button className="h-[42px] px-5 bg-[#2513ec] hover:bg-[#1a0db0] text-white font-[900] rounded-2xl transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/20 text-[13px]">
                            <span className="material-symbols-outlined text-[18px] filled text-white/90">visibility</span>
                            Portfolio
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Bento Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                
                {/* Left Section (Core & Academic) */}
                <div className="xl:col-span-2 flex flex-col gap-6">
                    
                    {/* Academic Excellence Segment */}
                    <div className="bg-white dark:bg-gray-800 rounded-[32px] p-10 border border-gray-100 dark:border-gray-700 shadow-[0_4px_25px_-10px_rgba(0,0,0,0.05)] transition-colors">
                        <div className="flex justify-between items-center mb-10">
                            <div className="flex items-center gap-3">
                                <div className="size-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/40 flex items-center justify-center text-[#2513ec] dark:text-indigo-400 shadow-sm">
                                    <span className="material-symbols-outlined text-[20px] filled">bar_chart</span>
                                </div>
                                <h3 className="text-[20px] font-[900] text-gray-900 dark:text-white tracking-tight">Academic Performance</h3>
                            </div>
                            <span className="text-[10px] font-[900] text-gray-400 dark:text-gray-500 uppercase tracking-[0.15em] opacity-80">Registrar Verified</span>
                        </div>

                        {/* Core Academic Metrics */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-12">
                            <div className="bg-[#fbfcff] dark:bg-gray-800/50 border border-indigo-100/20 dark:border-gray-700 rounded-[24px] p-6 flex flex-col justify-center">
                                <span className="text-[12px] font-bold text-gray-400 dark:text-gray-500 mb-2">Current CGPA</span>
                                <span className="text-[36px] font-[900] text-[#2513ec] dark:text-indigo-400 leading-none tracking-tight">9.2</span>
                            </div>
                            <div className="bg-[#fbfcff] dark:bg-gray-800/50 border border-indigo-100/20 dark:border-gray-700 rounded-[24px] p-6 flex flex-col justify-center">
                                <span className="text-[12px] font-bold text-gray-400 dark:text-gray-500 mb-2">Major GPA</span>
                                <span className="text-[36px] font-[900] text-gray-900 dark:text-white leading-none tracking-tight">9.5</span>
                            </div>
                            <div className="bg-[#fbfcff] dark:bg-gray-800/50 border border-indigo-100/20 dark:border-gray-700 rounded-[24px] p-6 flex flex-col justify-center">
                                <span className="text-[12px] font-bold text-gray-400 dark:text-gray-500 mb-2">Completed</span>
                                <div className="flex items-baseline gap-1.5">
                                    <span className="text-[36px] font-[900] text-gray-900 dark:text-white leading-none tracking-tight">6/8</span>
                                    <span className="text-[13px] font-bold text-gray-400 dark:text-gray-500">Sem</span>
                                </div>
                            </div>
                            <div className="bg-[#fbfcff] dark:bg-gray-800/50 border border-indigo-100/20 dark:border-gray-700 rounded-[24px] p-6 flex flex-col justify-center">
                                <span className="text-[12px] font-bold text-gray-400 dark:text-gray-500 mb-2">Credits</span>
                                <span className="text-[36px] font-[900] text-gray-900 dark:text-white leading-none tracking-tight">120</span>
                            </div>
                        </div>

                        {/* Semantic Bar Graph with Precise Visual Styling */}
                        <div className="h-[180px] flex items-end gap-5 justify-between px-4 mt-8 relative border-b-2 border-dashed border-indigo-50/50">
                            {/* Sem 1 - 6 Bars */}
                            {[
                                { h: '45%', color: 'from-[#dbe0ff] to-[#c6cfff]', label: 'SEM 1' },
                                { h: '70%', color: 'from-[#c6cfff] to-[#a8b7ff]', label: 'SEM 2' },
                                { h: '60%', color: 'from-[#a8b7ff] to-[#8398ff]', label: 'SEM 3' },
                                { h: '88%', color: 'from-[#8398ff] to-[#5b64ff]', label: 'SEM 4' },
                                { h: '82%', color: 'from-[#5b64ff] to-[#4c3ce4]', label: 'SEM 5' },
                                { h: '100%', color: 'from-[#3613e5] to-[#2513ec]', label: 'SEM 6' },
                            ].map((bar, idx) => (
                                <div key={idx} className="flex-1 flex flex-col items-center group h-full justify-end">
                                    <div 
                                        style={{ height: bar.h }}
                                        className={`w-[70%] max-w-[48px] bg-gradient-to-t ${bar.color} rounded-t-[14px] transition-all duration-500 group-hover:scale-y-105 shadow-sm`}
                                    />
                                    <span className="absolute -bottom-8 text-[10px] font-[900] text-gray-400 tracking-[0.1em]">{bar.label}</span>
                                </div>
                            ))}
                        </div>

                        {/* Professional Verification Badge */}
                        <div className="flex items-center justify-between mt-16 pt-6 border-t border-indigo-50/30">
                            <div className="flex items-center gap-2 text-[12px] font-bold text-gray-400">
                                <span className="material-symbols-outlined text-[16px] text-emerald-500 filled">security</span>
                                Verified through university registrar API integration • Last updated: 2 days ago
                            </div>
                            <button className="flex items-center gap-1.5 px-4 py-2 bg-[#2513ec]/10 text-[#2513ec] hover:bg-[#2513ec] hover:text-white transition-all rounded-xl text-[12px] font-[900] uppercase tracking-wider shadow-sm">
                                <span className="material-symbols-outlined text-[18px]">add</span>
                                Add
                            </button>
                        </div>
                    </div>

                    {/* Skill-Set Portfolio */}
                    <div className="bg-white dark:bg-gray-800 rounded-[32px] p-10 border border-gray-100 dark:border-gray-700 shadow-[0_4px_25px_-10px_rgba(0,0,0,0.05)] transition-colors">
                        <div className="flex items-center gap-3 mb-10">
                            <div className="size-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/40 flex items-center justify-center text-[#2513ec] dark:text-indigo-400">
                                <span className="material-symbols-outlined text-[20px] filled">military_tech</span>
                            </div>
                            <h3 className="text-[20px] font-[900] text-gray-900 dark:text-white tracking-tight">Skill Set</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            {/* Tech Core */}
                            <div>
                                <h4 className="text-[11px] font-[900] text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">Core Technical</h4>
                                <div className="flex flex-wrap gap-2.5">
                                    {['React.js', 'Node.js', 'Python', 'TypeScript'].map(skill => (
                                        <span key={skill} className="bg-[#f6f6ff] dark:bg-indigo-900/20 text-[#2513ec] dark:text-indigo-300 font-[900] text-[13px] px-5 py-2 rounded-2xl border border-indigo-50 dark:border-indigo-800/30 select-none hover:bg-white dark:hover:bg-gray-700 hover:shadow-md transition-all">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Verified Soft Skills */}
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <h4 className="text-[11px] font-[900] text-gray-400 dark:text-gray-500 uppercase tracking-widest">Soft Skills</h4>
                                    <span className="text-[9px] font-[900] text-[#2513ec] dark:text-indigo-400 uppercase italic tracking-tighter opacity-80">AI-VERIFIED</span>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                {['Leadership', 'Communication'].map(skill => (
                                    <div key={skill} className="bg-white dark:bg-gray-800 shadow-sm text-emerald-600 dark:text-emerald-400 font-[900] text-[13px] px-4 pl-2 py-2 rounded-2xl border border-emerald-100/60 dark:border-emerald-800/40 flex items-center gap-2 select-none">
                                        <span className="material-symbols-outlined text-[16px] filled">check_circle</span>
                                        {skill}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end mt-10">
                        <button className="flex items-center gap-1.5 px-4 py-2 bg-[#2513ec]/10 text-[#2513ec] hover:bg-[#2513ec] hover:text-white transition-all rounded-xl text-[12px] font-[900] uppercase tracking-wider shadow-sm">
                            <span className="material-symbols-outlined text-[18px]">add</span>
                            Add
                        </button>
                    </div>
                </div>

                    {/* Showcased Projects Section */}
                    <div className="flex flex-col gap-5 mt-2">
                        <div className="flex items-center justify-between px-2">
                            <div className="flex items-center gap-3">
                                <div className="size-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/40 flex items-center justify-center text-[#2513ec] dark:text-indigo-400">
                                    <span className="material-symbols-outlined text-[18px] filled">category</span>
                                </div>
                                <h3 className="text-[18px] font-[900] text-gray-900 dark:text-white tracking-tight">Projects & Works</h3>
                            </div>
                            <button className="text-[12px] font-[900] text-[#2513ec] dark:text-indigo-400 hover:indigo-800 tracking-widest uppercase">View All</button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {[
                                { title: 'AI Resume Parser', desc: 'Built a multi-modal parser using OpenAI GPT-4 to extract structured data from complex formats.', tags: ['Python', 'LLM'] },
                                { title: 'Distributed Task Queue', desc: 'A high-performance task scheduling system built with Go and Redis. Scalable to 10k ops/sec.', tags: ['Golang', 'Redis'] }
                            ].map(proj => (
                                <div key={proj.title} className="bg-white dark:bg-gray-800 rounded-[28px] p-8 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all group cursor-pointer border-t-4 border-t-transparent hover:border-t-indigo-500">
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="text-[16px] font-[900] text-gray-900 dark:text-white tracking-tight group-hover:text-indigo-600 transition-colors">{proj.title}</h4>
                                        <span className="material-symbols-outlined text-[#2513ec] dark:text-indigo-400 text-[20px] filled">verified</span>
                                    </div>
                                    <p className="text-[13px] font-medium text-gray-500 dark:text-gray-400 leading-relaxed mb-8 opacity-80 line-clamp-2">
                                        {proj.desc}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <div className="flex gap-2">
                                            {proj.tags.map(tag => (
                                                <span key={tag} className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-[10px] font-[900] px-3 py-1.5 rounded-lg border border-gray-100 dark:border-gray-600 uppercase tracking-widest">{tag}</span>
                                            ))}
                                        </div>
                                        <div className="size-8 rounded-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center text-gray-400 dark:text-gray-400 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/30 group-hover:text-indigo-500 transition-colors">
                                            <span className="material-symbols-outlined text-[16px]">link</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-end mt-4">
                            <button className="flex items-center gap-1.5 px-4 py-2 bg-white text-[#2513ec] border border-indigo-100 hover:bg-[#2513ec] hover:text-white transition-all rounded-xl text-[12px] font-[900] uppercase tracking-wider shadow-sm">
                                <span className="material-symbols-outlined text-[18px]">add</span>
                                Add
                            </button>
                        </div>
                    </div>

                    {/* Accreditations & Badges Grid */}
                    <div className="flex flex-col gap-5 mt-2">
                        <div className="flex items-center gap-3 px-2">
                            <div className="size-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/40 flex items-center justify-center text-[#2513ec] dark:text-indigo-400">
                                <span className="material-symbols-outlined text-[18px] filled">video_library</span>
                            </div>
                            <h3 className="text-[18px] font-[900] text-gray-900 dark:text-white tracking-tight">Courses & Certifications</h3>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="bg-white dark:bg-gray-800 rounded-[28px] p-7 border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-5 hover:border-indigo-100 transition-all group cursor-pointer">
                                <div className="size-[64px] bg-blue-50 dark:bg-blue-900/40 text-blue-500 dark:text-blue-400 rounded-2xl flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined text-[28px] filled">auto_awesome</span>
                                </div>
                                <div>
                                    <h4 className="text-[14px] font-[900] text-gray-900 dark:text-white tracking-tight group-hover:text-indigo-600 transition-colors">Microsoft AI Camp</h4>
                                    <p className="text-[11px] font-bold text-gray-400 dark:text-gray-500 mt-1 uppercase tracking-wider">Issued Oct 2023</p>
                                </div>
                            </div>
                            
                            <div className="bg-white dark:bg-gray-800 rounded-[28px] p-7 border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-5 hover:border-indigo-100 transition-all group cursor-pointer">
                                <div className="size-[64px] bg-orange-50 dark:bg-orange-900/40 text-orange-500 dark:text-orange-400 rounded-2xl flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined text-[28px] filled">cloud</span>
                                </div>
                                <div>
                                    <h4 className="text-[14px] font-[900] text-gray-900 dark:text-white tracking-tight group-hover:text-indigo-600 transition-colors">AWS Certified Developer</h4>
                                    <p className="text-[11px] font-bold text-gray-400 dark:text-gray-500 mt-1 uppercase tracking-wider">Associate Level • 2024</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end mt-4">
                            <button className="flex items-center gap-1.5 px-4 py-2 bg-white text-[#2513ec] border border-indigo-100 hover:bg-[#2513ec] hover:text-white transition-all rounded-xl text-[12px] font-[900] uppercase tracking-wider shadow-sm">
                                <span className="material-symbols-outlined text-[18px]">add</span>
                                Add
                            </button>
                        </div>
                    </div>

                </div>

                {/* Right Pipeline (Recruitment & Performance Analytics) */}
                <div className="xl:col-span-1 flex flex-col gap-6">
                    
                    {/* Recruiter Action Control Console */}
                    <div className="bg-white dark:bg-gray-800 rounded-[32px] p-8 border border-gray-100 dark:border-gray-700 shadow-xl shadow-[#2513ec]/5 dark:shadow-none flex flex-col gap-6 transition-colors">
                        <div className="flex items-center justify-between pb-6 border-b border-indigo-50/50 dark:border-gray-700">
                            <span className="text-[14px] font-[900] text-[#111827] dark:text-white tracking-tight">View as Recruiter</span>
                            <div 
                                onClick={() => setViewAsRecruiter(!viewAsRecruiter)}
                                className={`w-12 h-6 rounded-full relative cursor-pointer shadow-lg transition-all duration-300 ${viewAsRecruiter ? 'bg-[#2513ec] shadow-indigo-200 dark:shadow-indigo-900/50' : 'bg-gray-200 dark:bg-gray-700 shadow-none'}`}
                            >
                                <div className={`absolute top-1 size-4 bg-white rounded-full transition-all duration-300 ${viewAsRecruiter ? 'right-1' : 'right-7'}`}></div>
                            </div>
                        </div>
                        {viewAsRecruiter && (
                            <div className="flex flex-col gap-3">
                                <button className="w-full bg-[#f8f9ff] hover:bg-indigo-50 text-[#111827] text-[14px] font-[900] py-4 rounded-2xl transition-all border border-indigo-100/50 flex items-center justify-center gap-2 group">
                                    <span className="material-symbols-outlined text-[20px] text-indigo-400 group-hover:scale-110 transition-transform">schedule</span>
                                    Schedule Interview
                                </button>
                                <button className="w-full bg-[#2513ec] hover:bg-[#1a0db0] text-white text-[14px] font-[900] py-4 rounded-2xl transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-2 group">
                                    <span className="material-symbols-outlined text-[20px] text-white/90 group-hover:scale-110 transition-transform">mail</span>
                                    Contact Student
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Job Readiness Analytical Dashboard */}
                    <div className="bg-white dark:bg-gray-800 rounded-[32px] p-10 border border-gray-100 dark:border-gray-700 shadow-[0_4px_25px_-10px_rgba(37,19,236,0.05)] dark:shadow-none relative overflow-hidden group transition-colors">
                        {/* Decorative background element */}
                        <div className="absolute top-0 right-0 w-40 h-40 bg-[#f0efff] dark:bg-indigo-900/20 rounded-full blur-[50px] -translate-y-12 translate-x-12 opacity-60"></div>
                        
                        <h3 className="text-[18px] font-[900] text-gray-900 dark:text-white tracking-tight mb-10 relative z-10">Job Readiness Score</h3>
                        
                        {/* High-Impact Circular Gauge */}
                        <div className="flex justify-center mb-12 relative z-10">
                            <div className="relative size-[160px] flex items-center justify-center transform group-hover:scale-105 transition-transform duration-700">
                                <svg className="size-full -rotate-90 drop-shadow-sm dark:drop-shadow-none" viewBox="0 0 36 36">
                                    <path className="text-indigo-50/50 dark:text-gray-700" strokeWidth="3.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                    <path className="text-[#2513ec] dark:text-indigo-500 filter drop-shadow-[0_0_4px_rgba(37,19,236,0.3)] dark:drop-shadow-[0_0_4px_rgba(99,102,241,0.5)]" strokeWidth="4" strokeDasharray="88, 100" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                </svg>
                                <div className="absolute text-center flex flex-col justify-center bg-white dark:bg-gray-800 size-[115px] rounded-full shadow-inner dark:shadow-none border border-indigo-50/20 dark:border-gray-700">
                                    <span className="text-[38px] font-[900] text-[#111827] dark:text-white leading-none tracking-tight">88%</span>
                                    <span className="text-[10px] font-[900] text-[#2513ec] dark:text-indigo-400 mt-1.5 uppercase tracking-[0.2em]">Excellent</span>
                                </div>
                            </div>
                        </div>

                        {/* Secondary Analytics Bar */}
                        <div className="relative z-10 space-y-3 px-2">
                            <div className="flex justify-between items-baseline mb-1">
                                <span className="text-[12px] font-[900] text-gray-800 dark:text-gray-300 tracking-tight">Technical Assessment</span>
                                <span className="text-[14px] font-[900] text-[#2513ec] dark:text-indigo-400">94%</span>
                            </div>
                            <div className="w-full bg-indigo-50/50 h-2.5 rounded-full overflow-hidden border border-indigo-50">
                                <div className="bg-[#2513ec] h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(37,19,236,0.4)]" style={{ width: '94%' }}></div>
                            </div>
                        </div>
                    </div>

                    {/* Accolades & Winning Records */}
                    <div className="bg-white dark:bg-gray-800 rounded-[32px] p-8 border border-gray-100 dark:border-gray-700 shadow-[0_4px_25px_-10px_rgba(0,0,0,0.05)] dark:shadow-none transition-colors">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="size-9 rounded-xl bg-orange-50 dark:bg-orange-900/30 border border-orange-100 dark:border-orange-800 flex items-center justify-center text-orange-500 dark:text-orange-400 shadow-sm">
                                <span className="material-symbols-outlined text-[20px] filled">emoji_events</span>
                            </div>
                            <h3 className="text-[17px] font-[900] text-gray-900 dark:text-white tracking-tight">Winning List</h3>
                        </div>
                        
                        <div className="flex gap-5 items-center bg-orange-50/20 dark:bg-orange-900/10 p-5 rounded-[24px] border border-orange-100/50 dark:border-orange-800/30">
                            <div className="size-14 rounded-2xl bg-white dark:bg-gray-800 flex items-center justify-center shrink-0 shadow-sm border border-orange-100/30 dark:border-orange-800/50">
                                <span className="material-symbols-outlined text-[32px] text-yellow-500 filled">workspace_premium</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[15px] font-[900] text-gray-900 dark:text-white mb-0.5 tracking-tight">1st Runner Up</span>
                                <span className="text-[12px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest opacity-80">Google HashCode 2023</span>
                            </div>
                        </div>
                    </div>

                    {/* Professional Career Roadmap */}
                    <div className="bg-white dark:bg-gray-800 rounded-[32px] p-8 border border-gray-100 dark:border-gray-700 shadow-[0_4px_25px_-10px_rgba(0,0,0,0.05)] dark:shadow-none transition-colors">
                        <div className="mb-8">
                            <h3 className="text-[17px] font-[900] text-gray-900 dark:text-white tracking-tight">Work Experience</h3>
                        </div>
                        
                        <div className="flex gap-5 relative group cursor-default">
                            {/* Vertical Progress Line */}
                            <div className="absolute left-[7px] top-6 bottom-4 w-0.5 bg-gradient-to-b from-[#2513ec] dark:from-indigo-500 to-gray-200 dark:to-gray-700 opacity-60"></div>
                            
                            <div className="relative shrink-0 mt-1.5">
                                <div className="size-4 rounded-full bg-[#2513ec] dark:bg-indigo-500 border-4 border-white dark:border-gray-800 relative z-10 shadow-md group-hover:scale-125 transition-transform"></div>
                            </div>
                            
                            <div className="pb-2">
                                <h4 className="text-[15px] font-[900] text-[#111827] dark:text-white mb-1 tracking-tight">Software Engineer Intern</h4>
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-[11px] font-[900] text-gray-400 dark:text-gray-500 uppercase tracking-wider">Big Tech Co</span>
                                    <span className="size-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                                    <span className="text-[11px] font-[900] text-gray-400 dark:text-gray-500 uppercase tracking-wider">6 months</span>
                                </div>
                                <p className="text-[13px] font-medium text-gray-500 dark:text-gray-400 leading-relaxed opacity-90">
                                    Worked on the Video Ads Ranking team improving ML pipelines using massive-scale distributed training models.
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Profile;
