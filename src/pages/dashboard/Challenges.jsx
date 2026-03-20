import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Challenges = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('Live');
    
    // Countdown Timer State
    const [timeLeft, setTimeLeft] = useState({ days: '00', hours: '00', mins: '00' });

    useEffect(() => {
        // Target date 3 days from now
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + 3);
        targetDate.setHours(targetDate.getHours() + 14);
        targetDate.setMinutes(targetDate.getMinutes() + 25);

        const updateTimer = () => {
            const now = new Date();
            const diff = targetDate - now;

            if (diff <= 0) {
                setTimeLeft({ days: '00', hours: '00', mins: '00' });
                return;
            }

            const d = Math.floor(diff / (1000 * 60 * 60 * 24));
            const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const m = Math.floor((diff / 1000 / 60) % 60);

            setTimeLeft({
                days: d.toString().padStart(2, '0'),
                hours: h.toString().padStart(2, '0'),
                mins: m.toString().padStart(2, '0')
            });
        };

        updateTimer();
        const interval = setInterval(updateTimer, 60000); // update every minute
        return () => clearInterval(interval);
    }, []);

    // Mock Toast notification state
    const [showToast, setShowToast] = useState(false);
    const handleRegister = () => {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    const challengesData = [
        {
            id: 1,
            title: 'Data Science Sprint',
            company: 'TechCorp',
            desc: 'Predictive analytics for sustainable energy consumption.',
            prize: '$2,000',
            participants: '1.2k',
            image: "url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000')",
            color: 'teal',
            bgGradient: 'from-slate-800 to-indigo-950',
            timeInfo: '48h remaining',
            progress: 75,
            status: 'Live'
        },
        {
            id: 2,
            title: 'UI/UX Design Jam',
            company: 'DesignStudio',
            desc: 'Reimagine the future of digital education interfaces.',
            prize: '$1,500',
            participants: '800',
            color: 'emerald',
            bgGradient: 'from-emerald-800 to-teal-950',
            customBg: 'bg-[#A2B8A4]',
            hasCustomTitle: true,
            timeInfo: '5d left',
            progress: 30,
            status: 'Live'
        },
        {
            id: 3,
            title: 'Cloud Architecture Buildout',
            company: 'CloudNet',
            desc: 'Design a highly available serverless backend architecture.',
            prize: '$3,000',
            participants: '0',
            color: 'blue',
            bgGradient: 'from-blue-900 to-indigo-950',
            customBg: 'bg-blue-400',
            timeInfo: 'Starts in 2 weeks',
            progress: 0,
            status: 'Upcoming'
        },
        {
            id: 4,
            title: 'Fintech Security Audit',
            company: 'SecureBank',
            desc: 'Identify vulnerabilities in a mock banking application.',
            prize: '$5,000',
            participants: '2.5k',
            color: 'red',
            bgGradient: 'from-zinc-800 to-neutral-900',
            customBg: 'bg-red-900',
            timeInfo: 'Ended 1 month ago',
            progress: 100,
            status: 'Past'
        }
    ];

    const filteredChallenges = challengesData.filter(c => c.status === activeTab);

    return (
        <div className="flex flex-col xl:flex-row gap-8 w-full relative transition-colors">
            {/* Toast Notification */}
            {showToast && (
                <div className="fixed top-24 right-8 bg-gray-900 dark:bg-gray-800 text-white px-6 py-4 rounded-2xl shadow-sm flex items-center gap-3 z-50 animate-bounce border border-gray-700">
                    <span className="material-symbols-outlined text-green-400">check_circle</span>
                    <div>
                        <h4 className="font-bold text-sm">Successfully Registered!</h4>
                        <p className="text-xs text-gray-400">Keep an eye on your email.</p>
                    </div>
                </div>
            )}

            {/* Left Column: Main Content */}
            <div className="flex-1 flex flex-col gap-8 min-w-0">
                {/* Hero Section: Featured Challenge */}
                <div className="w-full bg-[#111322] rounded-3xl p-8 relative overflow-hidden shadow-lg border border-gray-800">
                    {/* Background decorations */}
                    <div className="absolute top-0 right-0 w-2/3 h-full  pointer-events-none"></div>
                    <div className="absolute -top-32 -right-16 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none"></div>
                    
                    <div className="absolute inset-0 flex items-center justify-end pr-12 opacity-[0.03] pointer-events-none select-none overflow-hidden">
                        <span className="text-[140px] font-black leading-none text-white whitespace-nowrap hidden md:block tracking-tighter mix-blend-overlay">AI<br/>NATION<br/>2024</span>
                    </div>

                    <div className="relative z-10 w-full max-w-2xl">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="material-symbols-outlined text-blue-600 text-[18px]">star</span>
                            <span className="bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">Featured Challenge</span>
                        </div>

                        <h2 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight tracking-tight">Global AI Innovation Hackathon 2024</h2>
                        <p className="text-gray-300 text-sm md:text-base mb-8 max-w-xl">
                            Win <strong className="text-white">$5,000</strong> + Google Referral. Join the world's most elite AI challenge.
                        </p>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8">
                            <div className="flex gap-4">
                                <div className="flex flex-col items-center">
                                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 flex flex-col items-center justify-center min-w-[3.5rem] border border-white/5">
                                        <span className="text-xl font-bold text-white leading-none">{timeLeft.days}</span>
                                    </div>
                                    <span className="text-[10px] text-gray-400 mt-2 font-bold font-medium">Days</span>
                                </div>
                                <div className="text-white/30 font-bold text-xl mt-3">:</div>
                                <div className="flex flex-col items-center">
                                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 flex flex-col items-center justify-center min-w-[3.5rem] border border-white/5">
                                        <span className="text-xl font-bold text-white leading-none">{timeLeft.hours}</span>
                                    </div>
                                    <span className="text-[10px] text-gray-400 mt-2 font-bold font-medium">Hours</span>
                                </div>
                                <div className="text-white/30 font-bold text-xl mt-3">:</div>
                                <div className="flex flex-col items-center">
                                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 flex flex-col items-center justify-center min-w-[3.5rem] border border-white/5">
                                        <span className="text-xl font-bold text-white leading-none">{timeLeft.mins}</span>
                                    </div>
                                    <span className="text-[10px] text-gray-400 mt-2 font-bold font-medium">Mins</span>
                                </div>
                            </div>
                        </div>

                        <button 
                            onClick={handleRegister}
                            className="bg-blue-600 hover:bg-indigo-600 hover:scale-[1.02] active:scale-[0.98] transition-all text-white font-bold py-3.5 px-8 rounded-xl shadow-lg shadow-primary/30 flex items-center gap-2 group"
                        >
                            Register Now
                            <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                        </button>
                    </div>
                </div>

                {/* Filters and List */}
                <div className="w-full space-y-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        {/* Tabs */}
                        <div className="bg-gray-100/80 dark:bg-gray-800/80 p-1.5 rounded-2xl flex items-center gap-1 border border-transparent dark:border-gray-700">
                            {['Live', 'Upcoming', 'Past'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
                                        activeTab === tab 
                                            ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm' 
                                            : 'text-slate-500 dark:text-slate-400 hover:text-gray-800 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-700/50'
                                    }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                            <span className="text-slate-500 dark:text-slate-400 font-medium">Sort by:</span>
                            <button className="flex items-center gap-1 text-slate-900 dark:text-slate-100 font-bold hover:text-blue-600 dark:hover:text-indigo-400 transition-colors">
                                Ending Soon
                                <span className="material-symbols-outlined text-[18px]">keyboard_arrow_down</span>
                            </button>
                        </div>
                    </div>

                    {/* Grid List */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8">
                        {filteredChallenges.length > 0 ? filteredChallenges.map((challenge) => (
                            <div 
                                key={challenge.id} 
                                onClick={() => {
                                    if(challenge.title === 'Data Science Sprint') {
                                        navigate('/dashboard/challenges/data-science-sprint');
                                    }
                                }}
                                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden group hover:shadow-sm hover:shadow-primary/5 hover:border-primary/20 dark:hover:border-indigo-500/50 transition-all cursor-pointer flex flex-col h-full"
                            >
                                <div className={`h-40 bg-gradient-to-br ${challenge.bgGradient} relative overflow-hidden shrink-0`}>
                                    {challenge.image ? (
                                        <div className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity group-hover:scale-105 transition-transform duration-700" style={{ backgroundImage: challenge.image }}></div>
                                    ) : (
                                        <div className={`absolute inset-0 ${challenge.customBg} opacity-80 mix-blend-color group-hover:scale-105 transition-transform duration-700`}></div>
                                    )}
                                    
                                    {challenge.hasCustomTitle && (
                                        <div className="absolute inset-0 flex items-center justify-center opacity-40 mix-blend-overlay -rotate-3 group-hover:scale-110 transition-transform duration-700">
                                            <span className="text-5xl font-black text-white tracking-tighter shadow-sm">{challenge.title.toUpperCase().split(' ')[0]} JAM</span>
                                        </div>
                                    )}

                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80  to-transparent"></div>
                                    <div className="absolute top-4 left-4 bg-white dark:bg-[#0B0F19] rounded-full px-3 py-1 flex items-center gap-2 shadow-md">
                                        <div className={`size-4 rounded-full bg-${challenge.color}-500`}></div>
                                        <span className="text-[10px] font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wide">{challenge.company}</span>
                                    </div>
                                </div>
                                <div className="p-6 flex-1 flex flex-col">
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2 group-hover:text-blue-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">{challenge.title}</h3>
                                    <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm mb-6 line-clamp-2">{challenge.desc}</p>
                                    
                                    <div className="mt-auto space-y-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-lg border border-green-100 dark:border-green-800/50">
                                                <span className="material-symbols-outlined text-[18px]">payments</span>
                                                <span className="font-bold text-sm">{challenge.prize} Prize</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                                                <span className="material-symbols-outlined text-[18px]">group</span>
                                                <span className="text-sm font-medium">{challenge.participants} joined</span>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between text-xs font-bold">
                                                <span className={challenge.status === 'Live' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'}>{challenge.timeInfo}</span>
                                                <span className="text-slate-500 dark:text-slate-400 uppercase tracking-wider">{challenge.progress}% Complete</span>
                                            </div>
                                            <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                                                <div className={`h-full rounded-full relative ${challenge.progress === 100 ? 'bg-green-500' : 'bg-blue-600 dark:bg-blue-500'}`} style={{ width: `${challenge.progress}%` }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="col-span-1 md:col-span-2 text-center py-12 bg-[#F8FAFC] dark:bg-gray-800/50 rounded-3xl border border-slate-200 dark:border-slate-800 border-dashed">
                                <span className="material-symbols-outlined text-gray-300 dark:text-gray-600 text-[48px] mb-4">sentiment_dissatisfied</span>
                                <h3 className="text-slate-500 dark:text-slate-400 font-bold">No {activeTab.toLowerCase()} challenges found.</h3>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Right Column: Sidebar */}
            <div className="w-full xl:w-[340px] shrink-0 space-y-6">
                
                {/* Winner Spotlight */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group transition-colors">
                    <div className="flex items-center gap-2 mb-6">
                        <span className="material-symbols-outlined text-yellow-500">emoji_events</span>
                        <h3 className="font-bold text-slate-900 dark:text-slate-100">Winner Spotlight</h3>
                    </div>

                    <div className="bg-[#F8FAFC] dark:bg-gray-700/50 rounded-2xl p-6 flex flex-col items-center text-center border border-gray-100 dark:border-gray-600 group-hover:bg-blue-600/5 dark:group-hover:bg-indigo-900/30 transition-colors">
                        <div className="relative mb-4">
                            <div className="size-20 rounded-full border-4 border-white dark:border-gray-800 shadow-lg overflow-hidden relative z-10 transition-colors">
                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Mark&backgroundColor=111827" alt="Winner" className="w-full h-full object-cover" />
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-yellow-900 rounded-full size-8 flex items-center justify-center border-2 border-white dark:border-gray-800 shadow-sm z-20">
                                <span className="material-symbols-outlined text-[16px] font-bold">star</span>
                            </div>
                            {/* Decorative background glow */}
                            <div className="absolute inset-0 bg-yellow-400 scale-150 blur-xl opacity-20 -z-0"></div>
                        </div>

                        <h4 className="font-bold text-slate-900 dark:text-slate-100 text-lg">Manish Sharma</h4>
                        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mt-1 mb-6">Winner: Python Data Sprint #42</p>

                        <button className="w-full bg-[#EFEFFC] dark:bg-blue-500/10 hover:bg-blue-600 hover:text-white dark:hover:bg-indigo-600 transition-colors text-blue-600 dark:text-blue-400 font-bold py-3 rounded-xl flex items-center justify-center gap-2 text-sm shadow-sm group/btn">
                            View Project
                            <span className="material-symbols-outlined text-[16px] group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform">open_in_new</span>
                        </button>
                    </div>
                </div>

                {/* Top Players */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-slate-900 dark:text-slate-100">Top Players</h3>
                        <button className="text-blue-600 dark:text-blue-400 text-xs font-bold hover:underline uppercase tracking-wide">View All</button>
                    </div>

                    <div className="space-y-4">
                        {/* Player 1 */}
                        <div className="flex items-center justify-between p-3 rounded-2xl hover:bg-[#F8FAFC] dark:hover:bg-gray-700/50 transition-colors border border-transparent hover:border-gray-100 dark:hover:border-gray-600 -mx-3 cursor-pointer">
                            <div className="flex items-center gap-3">
                                <span className="text-gray-400 font-bold text-sm w-5 text-center">01</span>
                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun&backgroundColor=f3f4f6" alt="Arjun" className="size-10 rounded-full border border-gray-200 dark:border-gray-600" />
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm leading-tight">Arjun Singh</h4>
                                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mt-0.5">12 WINS</p>
                                </div>
                            </div>
                            <div className="text-blue-600 dark:text-blue-400 font-black text-sm text-right">
                                5,200 XP
                            </div>
                        </div>

                        {/* Player 2 */}
                        <div className="flex items-center justify-between p-3 rounded-2xl hover:bg-[#F8FAFC] dark:hover:bg-gray-700/50 transition-colors border border-transparent hover:border-gray-100 dark:hover:border-gray-600 -mx-3 cursor-pointer">
                            <div className="flex items-center gap-3">
                                <span className="text-gray-400 font-bold text-sm w-5 text-center">02</span>
                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Madhav&backgroundColor=e5e7eb" alt="Madhav" className="size-10 rounded-full border border-gray-200 dark:border-gray-600" />
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm leading-tight">Madhav Mishra</h4>
                                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mt-0.5">9 WINS</p>
                                </div>
                            </div>
                            <div className="text-blue-600 dark:text-blue-400 font-black text-sm text-right">
                                4,850 XP
                            </div>
                        </div>

                        {/* Player 3 */}
                        <div className="flex items-center justify-between p-3 rounded-2xl hover:bg-[#F8FAFC] dark:hover:bg-gray-700/50 transition-colors border border-transparent hover:border-gray-100 dark:hover:border-gray-600 -mx-3 cursor-pointer">
                            <div className="flex items-center gap-3">
                                <span className="text-gray-400 font-bold text-sm w-5 text-center">03</span>
                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Simran&backgroundColor=bfdbfe" alt="Simran" className="size-10 rounded-full border border-gray-200 dark:border-gray-600" />
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm leading-tight">Simran Kaur</h4>
                                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mt-0.5">7 WINS</p>
                                </div>
                            </div>
                            <div className="text-blue-600 dark:text-blue-400 font-black text-sm text-right">
                                4,120 XP
                            </div>
                        </div>
                    </div>
                </div>

                {/* Host Your Own Challenge CTA */}
                <div className="bg-blue-600 rounded-3xl p-8 relative overflow-hidden shadow-lg shadow-primary/20 text-white">
                    <div className="absolute inset-0 "></div>
                    
                    <div className="relative z-10 flex flex-col items-start gap-4">
                        <div className="size-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg border border-white/10">
                            <span className="material-symbols-outlined text-white text-[24px]">work</span>
                        </div>
                        
                        <h3 className="text-2xl font-bold leading-tight mt-1">Host Your Own Challenge</h3>
                        
                        <p className="text-white/80 text-sm leading-relaxed mb-4">
                            Ready to find top talent? Launch a custom challenge and hire the best students globally.
                        </p>
                        
                        <button className="w-full bg-white text-blue-600 font-bold py-3.5 rounded-xl shadow-md hover:shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all">
                            Get Started
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Challenges;
