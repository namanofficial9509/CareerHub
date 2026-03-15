import React from 'react';
import { Sparkles } from 'lucide-react';
import ResumeOptimizer from '../../components/Insights/ResumeOptimizer';
import CareerPathmap from '../../components/Insights/CareerPathmap';

const Insights = () => {
    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Sparkles size={120} />
                </div>
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-white/20 backdrop-blur-md rounded-lg">
                            <Sparkles size={24} className="text-white" />
                        </div>
                        <h1 className="text-3xl font-bold">AI Career Navigator</h1>
                    </div>
                    <p className="text-blue-100 text-lg max-w-2xl">
                        Personalized guidance based on your profile. Unlock your potential with our AI-driven insights.
                    </p>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column - Resume Optimizer */}
                <div className="lg:col-span-4">
                    <ResumeOptimizer />
                </div>

                {/* Right Column - Career Pathmap */}
                <div className="lg:col-span-8">
                    <CareerPathmap />
                </div>
            </div>
        </div>
    );
};

export default Insights;
