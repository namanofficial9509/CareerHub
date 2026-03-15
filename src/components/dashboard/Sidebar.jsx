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
        <aside className="fixed left-0 top-0 h-screen w-64 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 flex flex-col z-40 hidden md:flex font-display transition-colors duration-300">
            {/* Logo Area */}
            <div className="p-8 mb-2">
                <div className="flex items-center gap-3">
                    <div className="size-[32px] bg-[#5d46e2] rounded-full flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
                        <span className="material-symbols-outlined text-[18px] filled">rocket_launch</span>
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-[18px] font-[900] tracking-tight text-[#1a0db0] dark:text-indigo-400 leading-none">CareerTech</h1>
                        <span className="text-[9px] font-[900] tracking-wider text-gray-400 dark:text-gray-500 mt-1 uppercase">Student Ecosystem</span>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto w-full">
                {links.map((link) => (
                    <NavLink
                        key={link.path}
                        to={link.path}
                        end={link.path === '/dashboard'} // Only exact match for Dashboard
                        className={({ isActive }) => `
                            flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200 relative w-full
                            ${isActive
                                ? 'bg-[#5d46e2]/[0.08] dark:bg-[#5d46e2]/[0.15] text-[#5d46e2] dark:text-indigo-400 font-[900]'
                                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white font-bold'
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
                                    <span className="text-[9px] font-[900] bg-indigo-50 dark:bg-indigo-500/10 text-[#5d46e2] dark:text-indigo-400 px-2 py-0.5 rounded-full uppercase tracking-wider absolute right-4">
                                        {link.badge}
                                    </span>
                                )}
                                {isActive && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#5d46e2] rounded-r-full"></div>
                                )}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Bottom Support Section / Pro Plan */}
            <div className="p-6">
                <div className="bg-[#f8f7ff] dark:bg-gray-800 rounded-[24px] p-6 text-gray-900 dark:text-white border border-[#2513ec]/10 dark:border-gray-700 shadow-[0_4px_20px_-4px_rgba(37,19,236,0.05)] transition-colors duration-300">
                    <h4 className="text-[10px] font-[900] text-[#2513ec] dark:text-indigo-400 uppercase tracking-widest mb-2.5">Pro Plan</h4>
                    <p className="text-[12px] font-medium text-gray-600 dark:text-gray-400 leading-relaxed mb-5">
                        Unlock AI Mock Interviews & Resume Analysis.
                    </p>
                    <button className="w-full bg-[#2513ec] hover:bg-[#1a0db0] dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white text-[13px] font-[900] py-3 rounded-xl transition-colors shadow-lg shadow-[#2513ec]/20">
                        Upgrade Now
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
