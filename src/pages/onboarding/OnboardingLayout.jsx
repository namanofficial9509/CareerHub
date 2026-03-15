import { Outlet, useLocation } from 'react-router-dom';

const OnboardingLayout = () => {
    const location = useLocation();

    // Determine current step based on route
    const getStep = () => {
        if (location.pathname.includes('step-1')) return 1;
        if (location.pathname.includes('step-2')) return 2;
        if (location.pathname.includes('step-3')) return 3;
        if (location.pathname.includes('step-4')) return 4;
        if (location.pathname.includes('step-5')) return 5;
        return 1;
    };

    const currentStep = getStep();
    const totalSteps = 5;
    const progress = (currentStep / totalSteps) * 100;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-display antialiased text-gray-900">
            {/* Minimal Header */}
            <header className="px-6 md:px-12 py-6 flex items-center justify-between bg-white border-b border-gray-100 sticky top-0 z-50">
                <div className="flex items-center gap-2.5">
                    <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-white shadow-lg shadow-primary/20">
                        <span className="material-symbols-outlined text-[20px]">hub</span>
                    </div>
                    <span className="font-bold text-lg tracking-tight text-gray-900">Student Hub</span>
                </div>

                <div className="hidden md:flex items-center gap-3">
                    <div className="size-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center">
                        <span className="material-symbols-outlined text-gray-500 text-[18px]">settings</span>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col items-center py-10 px-4 md:px-0">
                {/* Progress Bar Container */}
                <div className="w-full max-w-2xl mb-8">
                    <div className="flex justify-between items-end mb-2">
                        <span className="text-xs font-bold text-gray-500 tracking-wider uppercase">Personalizing your journey</span>
                        <span className="text-xs font-bold text-primary">Step {currentStep} of {totalSteps}</span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary transition-all duration-500 ease-out rounded-full shadow-[0_0_10px_rgba(37,19,236,0.4)]"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>

                {/* Card Container */}
                <div className="w-full max-w-2xl bg-white rounded-3xl border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] p-8 md:p-12 relative overflow-hidden">
                    {/* Subtle Background Decoration inside card */}
                    <div className="absolute top-0 right-0 size-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                    <div className="relative z-10 animate-fade-in">
                        <Outlet />
                    </div>
                </div>
            </main>

            <footer className="py-6 text-center text-gray-400 text-xs font-medium">
                Your data stays private and secure · <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            </footer>
        </div>
    );
};

export default OnboardingLayout;
