import { useState, useEffect } from 'react';

const SprintAssessment = () => {
    // State for selected answers
    const [answers, setAnswers] = useState({});
    
    // State for countdown timer (12:45 initially based on mockup)
    const [timeLeft, setTimeLeft] = useState(12 * 60 + 45); // in seconds

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const handleAnswer = (qId, optionIndex) => {
        setAnswers(prev => ({ ...prev, [qId]: optionIndex }));
    };

    // Mock Questions based on mockup
    const questions = [
        {
            id: 'Q1',
            text: 'What is Data Analytics?',
            options: ['Collecting data only', 'Processing data to extract insights', 'Deleting data', 'Storing data']
        },
        {
            id: 'Q2',
            text: 'Which of the following is NOT a type of data analytics?',
            options: ['Descriptive', 'Predictive', 'Prescriptive', 'Decorative']
        },
        {
            id: 'Q3',
            text: 'Which tool is commonly used for data analysis?',
            options: ['MS Word', 'Excel', 'Paint', 'Notepad']
        },
        {
            id: 'Q4',
            text: 'What does "Data Cleaning" mean?',
            options: ['Deleting all data', 'Removing errors and inconsistencies', 'Encrypting data', 'Compressing data']
        }
    ];

    const totalQuestions = 10;
    const answeredCount = Object.keys(answers).length;
    const progressPerc = (answeredCount / totalQuestions) * 100;

    return (
        <div className="flex flex-col lg:flex-row gap-6 w-full max-w-[1200px] mx-auto min-h-screen pb-12 items-start mt-2">
            
            {/* Left Column: Questions */}
            <div className="flex-[1.2] w-full space-y-6">
                
                {/* Header */}
                <div className="mb-4 pl-2">
                    <h1 className="text-3xl md:text-4xl font-[900] text-[#1e293b] tracking-tight mb-2">Sprint Assessment</h1>
                    <p className="text-[14px] text-slate-500 font-[500] max-w-[500px]">
                        Answer the following questions to validate your foundational data science knowledge.
                    </p>
                </div>

                {/* Question Cards */}
                <div className="space-y-6">
                    {questions.map((q) => {
                        const isAnswered = answers[q.id] !== undefined;
                        // Example: giving active style to Q1 (like the mockup has a blue left border natively, but we can do it if answered or active)
                        const isActive = q.id === 'Q1'; 
                        
                        return (
                            <div 
                                key={q.id} 
                                className={`bg-white rounded-[24px] p-8 shadow-[0_2px_12px_rgba(0,0,0,0.02)] border border-slate-100 relative overflow-hidden transition-all ${isActive ? 'shadow-md border-[#5d3fd3]/20' : ''}`}
                            >
                                {isActive && (
                                    <div className="absolute top-0 left-0 w-1.5 h-full bg-[#5d3fd3] rounded-l-[24px]"></div>
                                )}
                                
                                <div className="flex items-start gap-4 mb-6">
                                    <div className="bg-[#f0edff] text-[#5d3fd3] px-3 py-1 rounded-lg text-[12px] font-[800]">
                                        {q.id}
                                    </div>
                                    <h3 className="text-[17px] font-[800] text-slate-900 mt-0.5 leading-snug">
                                        {q.text}
                                    </h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {q.options.map((opt, idx) => {
                                        const isSelected = answers[q.id] === idx;
                                        return (
                                            <button
                                                key={idx}
                                                onClick={() => handleAnswer(q.id, idx)}
                                                className={`text-left p-4 rounded-xl text-[14px] font-[600] border transition-all ${
                                                    isSelected 
                                                    ? 'bg-[#5d3fd3] text-white border-[#5d3fd3] shadow-lg shadow-[#5d3fd3]/20 scale-[1.01]' 
                                                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                                                }`}
                                            >
                                                {opt}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* AI Performance Projections Card */}
                <div className="bg-white rounded-[24px] p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] border border-slate-100 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-[#5d3fd3] rounded-l-[24px]"></div>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-200/50">
                        <span className="material-symbols-outlined text-[80px]">psychology</span>
                    </div>
                    
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-3 text-[#5d3fd3]">
                            <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                            <span className="text-[11px] font-[800] tracking-widest uppercase">AI Performance Projections</span>
                        </div>
                        <p className="text-[14px] font-[500] text-slate-600 leading-relaxed max-w-[85%]">
                            Based on your first 4 answers, you're tracking toward an <strong className="text-[#5d3fd3] font-[800]">Advanced Practitioner</strong> score. Keep focusing on the definitions of structured vs unstructured storage.
                        </p>
                    </div>
                </div>

                {/* Continue block styling */}
                <div className="bg-slate-50 border border-slate-200 border-dashed rounded-[24px] p-8 text-center mt-6 shadow-sm">
                    <p className="text-slate-500 font-[500] text-[14px] italic">Questions 5-10 continue below...</p>
                </div>

            </div>

            {/* Right Column: Sidebar */}
            <div className="w-full lg:w-[340px] shrink-0 space-y-6 lg:sticky lg:top-8 animate-fade-in-up">
                
                {/* Progress Card */}
                <div className="bg-white rounded-[24px] p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] border border-slate-100">
                    <h3 className="text-[18px] font-[800] text-slate-900 mb-6">Test Progress</h3>
                    
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[13px] font-[700] text-slate-600">Questions Answered</span>
                        <span className="text-[13px] font-[800] text-[#5d3fd3]">{answeredCount}/{totalQuestions}</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-8">
                        <div className="h-full bg-[#5d3fd3] rounded-full transition-all duration-500" style={{ width: `${progressPerc}%` }}></div>
                    </div>

                    {/* Timer Box */}
                    <div className="bg-[#f3f0ff] rounded-2xl p-4 flex items-center justify-between border border-[#e4dfff] mb-6 shadow-inner">
                        <div className="flex items-center gap-3 text-[#5d3fd3]">
                            <span className="material-symbols-outlined">timer</span>
                            <span className="text-[13px] font-[700]">Time Remaining</span>
                        </div>
                        <span className="text-[18px] font-[900] text-[#5d3fd3] tracking-wider">{formatTime(timeLeft)}</span>
                    </div>

                    {/* Question Nav Grid */}
                    <div className="grid grid-cols-5 gap-2.5">
                        {Array.from({ length: totalQuestions }).map((_, i) => {
                            const num = i + 1;
                            const qId = `Q${num}`;
                            // Force first 4 to be 'answered' for mockup accuracy, or use actual state
                            const isMockAnswered = num <= 4; 
                            const isAns = answers[qId] !== undefined || isMockAnswered;

                            return (
                                <div 
                                    key={num}
                                    className={`h-10 rounded-xl flex items-center justify-center text-[12px] font-[800] transition-all cursor-default ${
                                        isAns 
                                        ? 'bg-[#5d3fd3] text-white shadow-md shadow-[#5d3fd3]/20' 
                                        : 'bg-white text-slate-500 border border-slate-200'
                                    }`}
                                >
                                    Q{num}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Velocity Check */}
                <div className="bg-fuchsia-100 rounded-[24px] p-5 flex items-start gap-4 border border-fuchsia-200 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-fuchsia-200 blur-[40px] rounded-full opacity-60 pointer-events-none"></div>
                    <div className="bg-fuchsia-400 text-white p-2.5 rounded-xl shrink-0 shadow-md relative z-10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-[20px]">bolt</span>
                    </div>
                    <div className="relative z-10">
                        <h4 className="text-[13px] font-[900] text-slate-900 mb-0.5">Velocity Check</h4>
                        <p className="text-[11px] font-[500] text-fuchsia-900/80 leading-relaxed">
                            You're completing this sprint 15% faster than average.
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="space-y-4 pt-4">
                    <button className="w-full bg-[#5d3fd3] text-white py-4 rounded-2xl text-[15px] font-[700] hover:bg-[#4a32a8] transition-all shadow-lg shadow-[#5d3fd3]/20 hover:-translate-y-0.5 active:translate-y-0">
                        Submit Sprint Test
                    </button>
                    <button className="w-full text-slate-500 text-[13px] font-[700] hover:text-slate-800 transition-colors py-2">
                        Save & Continue Later
                    </button>
                </div>

            </div>

        </div>
    );
};

export default SprintAssessment;
