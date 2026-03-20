import { useAuth } from '../../context/AuthContext';

const PortfolioHeader = () => {
    const { user, userData } = useAuth();
    const name = user?.displayName || 'Student Name';
    const avatarSeed = name.replace(/\s/g, '');
    const university = userData?.onboarding?.university || 'University Name';
    const course = userData?.onboarding?.course || 'Course Name';
    // Mock class of 2025 calculation based on current year if needed, or static
    const graduationYear = userData?.onboarding?.currentYear ? new Date().getFullYear() + (4 - parseInt(userData.onboarding.currentYear)) : '2025';

    return (
        <div className="flex flex-col md:flex-row gap-8 items-start pb-8 border-b border-gray-100">
            {/* Avatar */}
            <div className="relative shrink-0">
                <div className="size-32 rounded-full border-4 border-white shadow-xl overflow-hidden bg-gray-100">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}`} alt="Profile" className="w-full h-full object-cover" />
                </div>
                <div className="absolute bottom-2 right-2 bg-indigo-600 text-white p-1.5 rounded-full shadow-md border-2 border-white">
                    <span className="material-symbols-outlined text-[16px]">verified</span>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="text-4xl font-[900] text-gray-900 tracking-tight leading-none">{name}</h1>
                            <span className="bg-green-100 text-green-700 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full tracking-wide border border-green-200">Verified Student</span>
                        </div>
                        <p className="text-indigo-600 font-bold text-lg">{course}</p>
                    </div>
                </div>

                <p className="text-gray-500 font-medium mb-4">{university} • Class of {graduationYear}</p>

                <div className="flex flex-wrap gap-4 text-sm font-bold text-gray-500">
                    <a href="#" className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors">
                        <span className="material-symbols-outlined text-[18px]">link</span>
                        github.com/{name.toLowerCase().replace(/\s/g, '')}
                    </a>
                    <a href="#" className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors">
                        <span className="material-symbols-outlined text-[18px]">mail</span>
                        {user?.email || 'email@example.com'}
                    </a>
                </div>
            </div>
        </div>
    );
};

export default PortfolioHeader;
