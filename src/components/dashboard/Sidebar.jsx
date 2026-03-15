import { NavLink } from 'react-router-dom';

const Sidebar = () => {
    const links = [
        { icon: 'space_dashboard', label: 'Dashboard', path: '/dashboard' },
        { icon: 'person', label: 'Profile', path: '/dashboard/profile' },
        { icon: 'smart_toy', label: 'AI Helper', path: '/dashboard/ai-helper' },
        { icon: 'description', label: 'Resume Analyzer', path: '/dashboard/resume-analyzer' },
        { icon: 'map', label: 'My Roadmap', path: '/dashboard/roadmap' },
        { icon: 'groups', label: 'Community', path: '/dashboard/community' },
        { icon: 'emoji_events', label: 'Challenges', path: '/dashboard/challenges', badge: 'NEW' },
    ];

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col z-40 hidden md:flex font-display transition-colors duration-300">
            {/* Logo Area */}
            <div className="p-8 mb-2">
                <div className="flex items-center gap-3">
                    <div className="size-[32px] bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-sm">
                        <span className="material-symbols-outlined text-[18px] filled">rocket_launch</span>
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-[18px] font-bold tracking-tight text-slate-900 dark:text-white leading-none">CareerTech</h1>
                        <span className="text-[10px] font-medium tracking-wider text-slate-500 dark:text-slate-400 mt-1 uppercase">Student Ecosystem</span>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto w-full">
                {links.map((link) => (
                    <NavLink
                        key={link.path}
                        to={link.path}
                        end={link.path === '/dashboard'}
                        className={({ isActive }) => `
                            flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 relative w-full
                            ${isActive
                                ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-medium'
                                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white font-medium'
                            }
                        `}
                    >
                        {({ isActive }) => (
                            <>
                                <div className="flex items-center gap-3 w-full">
                                    <span className={`material-symbols-outlined text-[20px] ${isActive ? 'filled' : ''}`}>{link.icon}</span>
                                    <span className="text-[13px]">{link.label}</span>
                                </div>
                                {link.badge && (
                                    <span className="text-[9px] font-[900] bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full uppercase tracking-wider absolute right-4">
                                        {link.badge}
                                    </span>
                                )}
                                {isActive && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-600 rounded-r-full"></div>
                                )}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Bottom Support Section / Pro Plan */}
            <div className="p-6">
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6 border border-slate-200 dark:border-slate-700/50 transition-colors duration-300">
                    <h4 className="text-[12px] text-blue-600 dark:text-blue-400 font-semibold mb-1">Pro Plan</h4>
                    <p className="text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                        Unlock AI Mock Interviews & Resume Analysis.
                    </p>
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-medium py-2.5 rounded-lg transition-colors shadow-sm">
                        Upgrade Now
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
