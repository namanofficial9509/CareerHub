import { NavLink } from 'react-router-dom';
import { LayoutGrid, Users, Sparkles, ChevronsUpDown } from 'lucide-react';

const RecruiterSidebar = () => {
    const links = [
        { icon: LayoutGrid, label: 'Dashboard', path: '/recruiter' },
        { icon: Users, label: 'Talent Hunt', path: '/recruiter/talent-hunt' },
        { icon: Sparkles, label: 'Recommendations', path: '/recruiter/recommendations' },
    ];

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-[#F9FAFB] border-r border-slate-200 flex flex-col z-40 hidden md:flex font-display transition-colors duration-300">
            {/* Logo Area */}
            <div className="p-8 pb-4 mb-4">
                <div className="flex items-center gap-3">
                    <div className="size-[32px] bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-sm overflow-hidden">
                         {/* Simple Rocket Icon SVG as placeholder or use Lucide if we want */}
                         <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.5a.5.5 0 0 1 .5.5v1.2a19.78 19.78 0 0 1 5.3 3.6c.92.93 1.6 2 2 3.14a9.96 9.96 0 0 1 .2 5.06h-16a9.96 9.96 0 0 1 .2-5.06c.4-1.14 1.08-2.21 2-3.14a19.78 19.78 0 0 1 5.3-3.6V3a.5.5 0 0 1 .5-.5z"/><path d="M11.5 16h1v2.5a.5.5 0 0 1-1 0V16zm-3.5 0h1v2.5a.5.5 0 0 1-1 0V16zm7 0h1v2.5a.5.5 0 0 1-1 0V16z"/><path d="M12 21.5c-1.5 0-3-1-3-2.5h6c0 1.5-1.5 2.5-3 2.5z"/></svg>
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-[20px] font-[900] tracking-tight text-slate-900 leading-none">CareerTech</h1>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-2 space-y-2 overflow-y-auto w-full">
                {links.map((link) => {
                    const Icon = link.icon;
                    return (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            end={link.path === '/recruiter'}
                            className={({ isActive }) => `
                                flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-200 relative w-full
                                ${isActive
                                    ? 'bg-indigo-100/50 text-indigo-700 font-bold shadow-sm ring-1 ring-indigo-500/10'
                                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900 font-semibold'
                                }
                            `}
                        >
                            {({ isActive }) => (
                                <>
                                    <Icon className={`size-5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} strokeWidth={isActive ? 2.5 : 2} />
                                    <span className="text-[14px]">{link.label}</span>
                                </>
                            )}
                        </NavLink>
                    )
                })}
            </nav>

            {/* Bottom Profile Section */}
            <div className="p-4 border-t border-slate-100">
                <button className="flex w-full items-center justify-between p-3 rounded-2xl hover:bg-slate-100 transition-colors duration-200 group">
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full overflow-hidden bg-indigo-100 ring-2 ring-white shadow-sm border border-slate-200 shrink-0">
                            <img src="https://i.pravatar.cc/150?u=sudhanshu" alt="Sudhanshu Profile" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex flex-col items-start">
                            <span className="text-[14px] font-bold text-slate-900 leading-tight">Sudhanshu</span>
                            <span className="text-[12px] font-medium text-slate-500">Senior Recruiter</span>
                        </div>
                    </div>
                    <ChevronsUpDown className="size-4 text-slate-400 group-hover:text-slate-600" />
                </button>
            </div>
        </aside>
    );
};

export default RecruiterSidebar;
