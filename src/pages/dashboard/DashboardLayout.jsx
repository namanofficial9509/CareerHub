import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/dashboard/Sidebar';
import GeminiAssistant from '../../components/dashboard/GeminiAssistant';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

const DashboardLayout = () => {
    const { isDarkMode, toggleDarkMode } = useTheme();

    return (
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B0F19] font-display relative transition-colors duration-300">
            <Sidebar />
            <GeminiAssistant />

            {/* Main Content Wrapper */}
            <main className="md:pl-64 min-h-screen flex flex-col transition-all duration-300 relative">
                
                {/* Global Top Right Header Elements */}
                <div className="absolute top-8 right-8 z-30 hidden md:flex items-center gap-4">
                    <button 
                        onClick={toggleDarkMode}
                        className="relative size-[42px] bg-white dark:bg-slate-900 rounded-full flex items-center justify-center shadow-sm border border-slate-200 dark:border-slate-800 text-gray-400 hover:text-slate-500 dark:text-slate-400 dark:hover:text-white transition-colors"
                        title="Toggle Theme"
                    >
                        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>

                    <button className="relative size-[42px] bg-white dark:bg-slate-900 rounded-full flex items-center justify-center shadow-sm border border-slate-200 dark:border-slate-800 text-gray-400 hover:text-slate-500 dark:text-slate-400 dark:hover:text-white transition-colors">
                        <span className="material-symbols-outlined filled text-[20px]">notifications</span>
                    </button>
                </div>

                {/* Dashboard Page Content */}
                <div className="p-6 md:p-8 max-w-[1600px] mx-auto w-full">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
