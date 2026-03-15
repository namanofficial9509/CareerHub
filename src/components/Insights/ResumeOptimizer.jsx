import React, { useState, useRef } from 'react';
import { Upload, CheckCircle, Loader2, FileText } from 'lucide-react';

const ResumeOptimizer = () => {
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [uploadedFile, setUploadedFile] = useState(null);
    const fileInputRef = useRef(null);

    const handleAnalyze = () => {
        setIsAnalyzing(true);
        setShowResults(false);
        setUploadedFile(null); // Clear previous file if analyzing via button

        // Simulate analysis delay
        setTimeout(() => {
            setIsAnalyzing(false);
            setShowResults(true);
        }, 2000);
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setUploadedFile(file);
            setIsAnalyzing(true);
            setShowResults(false);

            // Simulate analysis delay for file
            setTimeout(() => {
                setIsAnalyzing(false);
                setShowResults(true);
            }, 2500); // Slightly longer for "processing"
        }
    };

    const triggerFileUpload = () => {
        fileInputRef.current.click();
    };

    return (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm h-full flex flex-col">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Resume Optimizer</h2>

            <div className="space-y-6 flex-1">
                <button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing || showResults}
                    className={`w-full font-medium py-3 px-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer
            ${isAnalyzing || showResults
                            ? 'bg-green-600 text-white shadow-green-600/20'
                            : 'bg-primary hover:bg-primary/90 text-white shadow-primary/20 hover:shadow-primary/30'
                        }`}
                >
                    {isAnalyzing ? (
                        <>
                            <Loader2 size={20} className="animate-spin" />
                            Analyzing...
                        </>
                    ) : showResults ? (
                        <>
                            <CheckCircle size={20} />
                            Analysis Complete
                        </>
                    ) : (
                        <>
                            <CheckCircle size={20} />
                            Analyze My Portfolio
                        </>
                    )}
                </button>

                {!showResults && !isAnalyzing && (
                    <>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                            className="hidden"
                            accept=".pdf,.doc,.docx"
                        />
                        <div
                            onClick={triggerFileUpload}
                            className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center text-gray-400 hover:border-primary/30 hover:bg-gray-50 transition-all cursor-pointer group"
                        >
                            <div className="bg-gray-100 p-3 rounded-full mb-3 group-hover:bg-white group-hover:shadow-md transition-all">
                                <Upload size={24} className="text-gray-400 group-hover:text-primary transition-colors" />
                            </div>
                            <span className="text-sm font-medium">Or Upload PDF</span>
                        </div>
                    </>
                )}

                {showResults && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-6">
                        {uploadedFile && (
                            <div className="flex items-center gap-3 p-3 bg-blue-50 text-blue-700 rounded-xl border border-blue-100">
                                <FileText size={20} />
                                <div className="text-sm">
                                    <span className="font-semibold block">Analyzed File:</span>
                                    <span className="opacity-80 truncate max-w-[200px] block">{uploadedFile.name}</span>
                                </div>
                            </div>
                        )}

                        <div>
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Readiness</span>
                                <span className="text-2xl font-bold text-primary">72%</span>
                            </div>
                            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-primary w-[72%] rounded-full animate-pulse"></div>
                            </div>
                        </div>

                        <div>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-3">Growth Areas</span>
                            <div className="flex flex-wrap gap-2">
                                {['SQL', 'PostgreSQL', 'MongoDB', 'Docker', 'Kubernetes', 'AWS', 'Unit Testing', 'Jest'].map((tag, index) => (
                                    <span
                                        key={tag}
                                        className="bg-red-50 text-red-600 border border-red-100 px-2 py-1 rounded-md text-xs font-semibold animate-in zoom-in duration-300"
                                        style={{ animationDelay: `${index * 100}ms` }}
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResumeOptimizer;
