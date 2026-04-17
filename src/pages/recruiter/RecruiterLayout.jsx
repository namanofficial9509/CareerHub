import { Outlet } from 'react-router-dom';
import RecruiterSidebar from '../../components/recruiter/RecruiterSidebar';
import { useEffect } from 'react';

const RecruiterLayout = () => {
    // Force light background on body while recruiter section is mounted to prevent dark mode bleed
    useEffect(() => {
        document.body.style.backgroundColor = '#F4F6FB';
        return () => {
            document.body.style.backgroundColor = ''; // Revert on unmount
        };
    }, []);

    return (
        <div className="min-h-screen bg-[#F4F6FB] text-slate-900 font-display relative transition-colors duration-300">
            <RecruiterSidebar />

            {/* Main Content Wrapper */}
            <main className="md:pl-64 min-h-screen flex flex-col transition-all duration-300 relative">
                {/* Dashboard Page Content */}
                <div className="p-6 md:p-8 max-w-[1600px] mx-auto w-full">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default RecruiterLayout;
