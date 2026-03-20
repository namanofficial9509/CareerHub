import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';
import PortfolioHeader from '../../components/portfolio/PortfolioHeader';
import TechnicalArsenal from '../../components/portfolio/TechnicalArsenal';
import ProjectShowcase from '../../components/portfolio/ProjectShowcase';

const Portfolio = () => {
    const { userData } = useAuth();
    const university = userData?.identity?.college || userData?.onboarding?.university || 'University';
    const course = userData?.identity?.branch || userData?.onboarding?.course || 'Course';
    const [copied, setCopied] = useState(false);

    const handleDownload = () => {
        window.print();
    };

    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        } catch {
            alert('Could not copy link.');
        }
    };

    return (
        <div className="max-w-[900px] mx-auto relative">
            {/* Download/Share Actions (Floating) */}
            <div className="hidden lg:flex flex-col gap-3 absolute -right-40 top-0">
                <button
                    onClick={handleDownload}
                    className="size-12 bg-gray-900 text-white rounded-xl shadow-lg hover:scale-110 transition-transform flex items-center justify-center group relative cursor-pointer"
                    title="Download PDF"
                >
                    <span className="material-symbols-outlined">download</span>
                    <span className="absolute right-full mr-3 bg-gray-800 text-white text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Download PDF</span>
                </button>
                <button
                    onClick={handleShare}
                    className="size-12 bg-white text-gray-600 border border-gray-200 rounded-xl shadow-lg hover:scale-110 transition-transform flex items-center justify-center group relative cursor-pointer"
                    title="Share Link"
                >
                    <span className="material-symbols-outlined">{copied ? 'check' : 'share'}</span>
                    <span className="absolute right-full mr-3 bg-gray-800 text-white text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">{copied ? 'Copied!' : 'Share Link'}</span>
                </button>
            </div>

            {/* Document Container */}
            <div className="bg-white p-10 md:p-12 rounded-[2.5rem] shadow-sm shadow-sm border border-gray-100 min-h-screen">
                <PortfolioHeader />

                {/* Professional Summary */}
                <div className="py-8 border-b border-gray-100">
                    <div className="flex items-center gap-3 mb-4">
                        <h3 className="text-lg font-[900] text-gray-900 border-l-4 border-indigo-600 pl-3 uppercase tracking-wide">Professional Summary</h3>
                        <span className="bg-blue-50 text-indigo-600 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wide">AI Curated</span>
                    </div>
                    <p className="text-gray-600 leading-relaxed font-medium">
                        Aspiring professional pursuing {course} at {university}. Passionate about building scalable applications and solving complex problems. Dedicated to continuous learning and leveraging technology to create impactful solutions.
                    </p>
                </div>

                <TechnicalArsenal />

                <ProjectShowcase />

                {/* Footer */}
                <div className="pt-12 text-center">
                    <p className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.3em]">Student Hub Verification System • Powered by AI Guidance Engine</p>
                </div>
            </div>
        </div>
    );
};

export default Portfolio;
