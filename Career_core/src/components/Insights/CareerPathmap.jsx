import React from 'react';
import { ArrowRight, Layout, Server, Bug } from 'lucide-react';

const CareerPathmap = () => {
    const steps = [
        {
            id: 1,
            title: 'Database Fundamentals',
            description: 'Learn to integrate and manage relational (PostgreSQL) and non-relational (MongoDB) databases for your projects.',
            icon: <Server size={20} className="text-white" />,
            color: 'bg-blue-600'
        },
        {
            id: 2,
            title: 'DevOps & Cloud Infrastructure',
            description: 'Master containerization with Docker and explore cloud deployment strategies on platforms like AWS or Azure.',
            icon: <Layout size={20} className="text-gray-500" />,
            color: 'bg-white border border-gray-200'
        },
        {
            id: 3,
            title: 'Testing & QA',
            description: 'Implement automated testing suites using Jest or Cypress to improve code reliability and maintainability.',
            icon: <Bug size={20} className="text-gray-500" />,
            color: 'bg-white border border-gray-200'
        }
    ];

    return (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm h-full flex flex-col">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-lg font-bold text-gray-900">Interactive Career Pathmap</h2>
                <button className="text-primary text-sm font-semibold hover:underline">Customize Target Role</button>
            </div>

            <div className="space-y-0 relative">
                {/* Vertical Line */}
                <div className="absolute left-[27px] top-8 bottom-8 w-0.5 bg-gray-100 z-0"></div>

                {steps.map((step, index) => (
                    <div key={step.id} className="relative z-10 flex gap-6 pb-8 last:pb-0 group">
                        <div className={`flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm ${step.id === 1 ? 'bg-primary text-white shadow-primary/30' : 'bg-white border border-gray-100 text-gray-400'}`}>
                            <span className="text-xl font-bold">{step.id}</span>
                        </div>

                        <div className="flex-1 pt-1">
                            <h3 className="text-base font-bold text-gray-900 mb-2">{step.title}</h3>
                            <p className="text-sm text-gray-500 leading-relaxed mb-4">{step.description}</p>

                            <div className="flex items-center gap-4">
                                <button className="flex items-center gap-1 text-primary text-xs font-bold hover:gap-2 transition-all">
                                    Take Recommended Course <ArrowRight size={14} />
                                </button>
                                <button className="text-gray-400 text-xs font-medium hover:text-gray-600 transition-colors">
                                    Mark as Completed
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CareerPathmap;
