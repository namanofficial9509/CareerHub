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
                    <span className="font-bold text-xl tracking-tight text-[#3b28cc]">CareerTech</span>
                </div>

                <div className="hidden md:flex items-center gap-6">
                    <a href="#" className="text-gray-600 font-medium hover:text-gray-900 transition-colors">Login</a>
                    <button className="bg-[#3b28cc] text-white px-5 py-2 rounded-full font-medium hover:bg-indigo-700 transition-colors">
                        Skip to Dashboard
                    </button>
                </div>
            </header>

            {/* Main Content Area */}
            <main className={`flex-1 flex flex-col items-center py-10 px-4 md:px-0 ${currentStep === 2 ? 'w-full' : ''}`}>
                {/* Progress Bar Container */}
                {currentStep !== 2 && (
                    <div className="w-full max-w-3xl mb-8">
                        <div className="flex justify-between items-end mb-3">
                            <span className="text-[11px] font-[800] text-gray-500 tracking-widest uppercase">Personalizing your journey</span>
                            <span className="text-[13px] font-[800] text-[#3b28cc]">Step {currentStep} of {totalSteps}</span>
                        </div>
                        <div className="h-1.5 w-full bg-[#E5E5EA] rounded-full overflow-hidden">
                            <div
                                className="h-full bg-[#3b28cc] transition-all duration-500 ease-out rounded-full"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                    </div>
                )}

                {/* Card Container */}
                <div className={`w-full ${currentStep === 2 ? 'max-w-6xl' : 'max-w-2xl bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_-4px_rgba(0,0,0,0.03)] p-8 md:p-12 relative overflow-hidden'}`}>


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
