import { useAuth } from '../../context/AuthContext';

const ProfileHeader = () => {
    const { user, userData } = useAuth();

    // Safe data access
    const name = user?.displayName || 'Student';
    // Use the first letter of name for the seed to keep it consistent
    const avatarSeed = name.replace(/\s/g, '');
    const university = userData?.onboarding?.university || 'University';
    const course = userData?.onboarding?.course || 'Course';

    // Calculate a mock completion percentage
    const calculateCompletion = () => {
        let score = 30; // Base for just account
        if (userData?.onboarding?.university) score += 10;
        if (userData?.onboarding?.course) score += 10;
        if (userData?.onboarding?.skills) score += 15;
        if (userData?.onboarding?.careerpath) score += 10;
        if (userData?.onboardingCompleted) score += 25;
        return Math.min(score, 100);
    };

    const completion = calculateCompletion();

    return (
        <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-xl shadow-gray-200/40 relative overflow-hidden group mb-6">
            {/* Premium Gradient Background (Tighter) */}
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-r from-[#4f46e5] via-[#7c3aed] to-[#db2777]">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
            </div>

            <div className="relative z-10 pt-10 flex flex-col md:flex-row gap-6 items-center md:items-start justify-between">
                <div className="flex flex-col md:flex-row gap-6 items-center md:items-end w-full md:w-auto">
                    {/* Avatar with Ring */}
                    <div className="relative">
                        <div className="size-28 rounded-full border-[5px] border-white shadow-xl overflow-hidden bg-white">
                            <img
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}`}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="absolute bottom-1 right-1 bg-blue-500 text-white p-1.5 rounded-full shadow-lg border-2 border-white flex items-center justify-center" title="Verified Student">
                            <span className="material-symbols-outlined text-[16px] font-black">verified</span>
                        </div>
                    </div>

                    {/* Info */}
                    <div className="pb-1 text-center md:text-left flex flex-col items-center md:items-start">
                        <div className="flex items-center gap-2 mb-1 justify-center md:justify-start flex-wrap">
                            <h1 className="text-2xl md:text-3xl font-[900] text-gray-900 tracking-tight leading-none">{name}</h1>
                            <span className="bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 text-[10px] uppercase font-black px-2 py-0.5 rounded-full tracking-wider border border-blue-100 shadow-sm whitespace-nowrap">Verified Student</span>
                        </div>
                        <p className="text-gray-500 font-bold text-sm mb-2 flex flex-wrap justify-center md:justify-start gap-2">
                            {course} <span className="text-gray-300 hidden md:inline">•</span> <span className="block md:inline">{university}</span>
                        </p>

                        {/* Dynamic Progress - Moved Here */}
                        <div className="flex items-center gap-3">
                            <div className="h-1.5 w-24 md:w-32 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-indigo-500 to-pink-500 rounded-full transition-all duration-1000" style={{ width: `${completion}%` }}></div>
                            </div>
                            <span className="text-[10px] font-bold text-gray-400">{completion}% Profile Completion</span>
                        </div>
                    </div>
                </div>

                {/* Global Actions */}
                <div className="flex gap-2 w-full md:w-auto justify-center md:justify-end mt-4 md:mt-0">
                    <button className="h-10 px-4 rounded-xl bg-white border border-gray-200 text-gray-700 text-xs font-bold shadow-sm hover:shadow-md hover:border-gray-300 hover:-translate-y-0.5 transition-all flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px]">share</span>
                        Share
                    </button>
                    <button className="h-10 px-4 rounded-xl bg-gray-900 text-white text-xs font-bold shadow-xl shadow-gray-900/20 hover:bg-black hover:-translate-y-0.5 transition-all flex items-center gap-2 hidden sm:flex">
                        <span className="material-symbols-outlined text-[18px]">download</span>
                        Export PDF
                    </button>
                    <button
                        onClick={() => window.location.href = '/dashboard/portfolio'}
                        className="h-10 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-xs font-bold shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined text-[18px]">visibility</span>
                        Portfolio
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfileHeader;
