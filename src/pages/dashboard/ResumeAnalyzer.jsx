import React, { useState, useRef } from 'react';
import { getGenerativeModel } from 'firebase/ai';
import { ai } from '../../lib/firebase';

const ResumeAnalyzer = () => {
    const [atsScore, setAtsScore] = useState(0);
    const [skills, setSkills] = useState({
        matching: [],
        missing: []
    });
    const [analysisOverview, setAnalysisOverview] = useState({
        keyword_match: 0,
        impact_score: 0,
        readability: 0,
        formatting: 0
    });
    const [recruiterInsight, setRecruiterInsight] = useState('');
    const [improvementSuggestions, setImprovementSuggestions] = useState([]);
    const [optimizedBullets, setOptimizedBullets] = useState([]);

    const [jobDescription, setJobDescription] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisTriggered, setAnalysisTriggered] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    // Upload State
    const [uploadedFile, setUploadedFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    const handleFile = (file) => {
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) {
            alert("File is too large. Maximum size is 5MB.");
            return;
        }

        setUploadedFile(file);
        setIsUploading(true);
        setUploadProgress(0);
        setErrorMsg('');

        // Simulate upload progress
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 30;
            if (progress >= 100) {
                setUploadProgress(100);
                clearInterval(interval);
                setTimeout(() => setIsUploading(false), 500);
            } else {
                setUploadProgress(progress);
            }
        }, 400);
    };

    const convertFileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const base64String = reader.result.split(',')[1];
                resolve(base64String);
            };
            reader.onerror = (error) => reject(error);
        });
    };

    const handleAnalyze = async () => {
        if (!uploadedFile) {
            setErrorMsg("Please upload a resume (PDF) first.");
            return;
        }
        if (!jobDescription || !jobDescription.trim()) {
            setErrorMsg("Please provide a target job description.");
            return;
        }
        if (uploadedFile.type !== "application/pdf") {
            setErrorMsg("Currently, only PDF files are supported for AI Analysis. Please upload a PDF file.");
            return;
        }

        setIsAnalyzing(true);
        setErrorMsg('');

        try {
            const base64Resume = await convertFileToBase64(uploadedFile);
            
            // Initialize Gemini via Firebase
            const model = getGenerativeModel(ai, { model: 'gemini-1.5-flash', mode: 'prefer_in_cloud' });

            const prompt = `You are an expert ATS (Applicant Tracking System) and professional recruiter.

Analyze the following resume based on the given job description and provide a structured evaluation.

Target Job Description:
${jobDescription.trim()}

Instructions:
* Evaluate the resume like a real ATS system and recruiter.
* Compare the resume with the job description.
* Be realistic, strict, and practical in scoring.
* Focus on technical skills, keyword relevance, impact, and formatting.
* Provide REAL calculated scores (0-100) based on your analysis. DO NOT USE the placeholder numbers from the example format below. Identify actual matching and missing skills. Provide specific recruiter insights and improvement suggestions based ONLY on the provided resume content.
* CRITICAL: If the provided resume text is completely empty, blank, or contains no meaningful text or work experience, YOU MUST return 0 for all scores, empty arrays for matching_skills, empty arrays for optimized_bullets, and state in the recruiter_insight that the resume appears to be blank or unreadable. DO NOT hallucinate or invent skills or bullet points.

Return ONLY valid JSON in the following exact format without any markdown wrapper (The values below are just placeholders, replace them with your actual analysis results):
{
  "ATS_score": [integer 0-100],
  "analysis_overview": {
    "keyword_match": [integer 0-100],
    "impact_score": [integer 0-100],
    "readability": [integer 0-100],
    "formatting": [integer 0-100]
  },
  "matching_skills": ["Actual matching skill 1", "Actual matching skill 2", "etc"],
  "missing_skills": ["Actual missing skill 1", "Actual missing skill 2", "etc"],
  "recruiter_insight": "Actual specific paragraph explaining strengths and weaknesses found in this resume",
  "improvement_suggestions": [
    "Actual specific suggestion 1 based on the resume"
  ],
  "optimized_bullets": [
    {
      "original": "An actual bullet from the user's resume",
      "improved": "The improved version of that specific bullet"
    }
  ]
}`;

            const result = await model.generateContent({
                contents: [
                    {
                        role: 'user',
                        parts: [
                            { text: prompt },
                            {
                                inlineData: {
                                    data: base64Resume,
                                    mimeType: 'application/pdf'
                                }
                            }
                        ]
                    }
                ],
                generationConfig: {
                    responseMimeType: "application/json"
                }
            });

            const responseText = result.response.text();
            let parsedData;
            try {
                parsedData = JSON.parse(responseText.trim());
            } catch (jsonErr) {
                console.warn("AI didn't return strict JSON. Trying to clean it up...", jsonErr, responseText);
                const cleaned = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
                parsedData = JSON.parse(cleaned);
            }

            setAtsScore(parsedData.ATS_score || 0);
            setAnalysisOverview(parsedData.analysis_overview || { keyword_match: 0, impact_score: 0, readability: 0, formatting: 0 });
            setSkills({
                matching: parsedData.matching_skills || [],
                missing: parsedData.missing_skills || []
            });
            setRecruiterInsight(parsedData.recruiter_insight || 'No insights provided.');
            setImprovementSuggestions(parsedData.improvement_suggestions || []);
            setOptimizedBullets(parsedData.optimized_bullets || []);
            
            setAnalysisTriggered(true);

        } catch (error) {
            console.error("AI Logic Error:", error);
            setErrorMsg("Error generating AI analysis. " + (error.message || "Please check your network connection and try again."));
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleRecalculate = () => {
        handleAnalyze();
    };

    const onDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        handleFile(file);
    };

    const onDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const onDragLeave = () => {
        setIsDragging(false);
    };

    return (
        <div className="w-full pb-20 font-display transition-colors">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-[32px] font-[900] text-[#111827] dark:text-white mb-2 tracking-tight">Resume Analyzer</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-[15px] font-medium">Optimize your resume for your target job description using AI-powered insights.</p>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                    <button className="px-6 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-gray-700 dark:text-gray-200 font-bold text-[14px] shadow-sm hover:bg-[#F8FAFC] dark:hover:bg-gray-700 transition-all flex items-center gap-2">
                        <span className="material-symbols-outlined text-[20px]">history</span>
                        History
                    </button>
                    <button
                        onClick={handleRecalculate}
                        disabled={isAnalyzing}
                        className={`px-6 py-2.5 bg-blue-600 dark:bg-indigo-600 text-white rounded-xl font-bold text-[14px] shadow-lg hover:bg-blue-700 transition-all flex items-center gap-2 whitespace-nowrap ${isAnalyzing ? 'opacity-80' : ''}`}
                    >
                        <span className={`material-symbols-outlined text-[20px] ${isAnalyzing ? 'animate-spin' : ''}`}>sync</span>
                        {isAnalyzing ? 'Recalculating...' : 'Recalculate Score'}
                    </button>
                </div>
            </div>

            {errorMsg && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-2">
                    <span className="material-symbols-outlined text-[20px]">error</span>
                    <p className="text-[14px] font-bold">{errorMsg}</p>
                </div>
            )}

            {/* Top Cards: Upload & Job Description */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8 w-full">
                {/* Upload Card */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group w-full transition-colors">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="size-10 bg-blue-50 dark:bg-blue-500/10 rounded-xl flex items-center justify-center">
                            <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-[24px] filled">cloud_upload</span>
                        </div>
                        <h3 className="font-[900] text-[#111827] dark:text-white text-[18px]">Upload Resume (PDF only)</h3>
                    </div>
                    
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept=".pdf"
                        onChange={(e) => handleFile(e.target.files[0])}
                    />

                    <div 
                        onDrop={onDrop}
                        onDragOver={onDragOver}
                        onDragLeave={onDragLeave}
                        onClick={() => fileInputRef.current.click()}
                        className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center transition-all cursor-pointer group/upload w-full relative min-h-[280px]
                            ${isDragging ? 'border-indigo-400 bg-blue-50 dark:bg-blue-500/10 scale-[0.99]' : 'border-slate-200 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-500/50 hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10'}
                            ${uploadedFile && !isUploading ? 'bg-indigo-50/20 dark:bg-blue-500/10 border-indigo-200/50 dark:border-indigo-500/30' : ''}
                        `}
                    >
                        {isUploading ? (
                            <div className="w-full max-w-[240px]">
                                <div className="size-14 bg-indigo-100/50 dark:bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 mx-auto animate-pulse">
                                    <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-[28px] animate-spin">sync</span>
                                </div>
                                <p className="text-[#111827] dark:text-white font-black text-[15px] mb-3">Syncing System...</p>
                                <div className="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner dark:shadow-none">
                                    <div className="h-full bg-blue-600 dark:bg-blue-500 transition-all duration-300 ease-out shadow-sm dark:shadow-none" style={{ width: `${uploadProgress}%` }}></div>
                                </div>
                                <p className="text-slate-500 dark:text-slate-400 text-[11px] font-bold mt-3 font-medium">{Math.round(uploadProgress)}% Complete</p>
                            </div>
                        ) : uploadedFile ? (
                            <div className="flex flex-col items-center w-full">
                                <div className="size-16 bg-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-emerald-200 dark:shadow-none animate-in zoom-in duration-300">
                                    <span className="material-symbols-outlined text-white text-[32px] filled">check</span>
                                </div>
                                <div className="mb-8 text-center px-4">
                                    <p className="text-[#111827] dark:text-white font-[900] text-[17px] mb-1 line-clamp-1">{uploadedFile.name}</p>
                                    <p className="text-slate-500 dark:text-slate-400 text-[11px] font-black font-medium">
                                        {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB • PDF Document
                                    </p>
                                </div>
                                <div className="flex flex-col w-full max-w-[280px] gap-3">
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleAnalyze();
                                        }}
                                        disabled={isAnalyzing}
                                        className={`w-full py-3.5 bg-blue-600 dark:bg-indigo-600 text-white rounded-xl font-black text-[14px] shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2 ${isAnalyzing ? 'opacity-80 cursor-wait' : ''}`}
                                    >
                                        <span className={`material-symbols-outlined text-[20px] ${isAnalyzing ? 'animate-spin' : ''}`}>analytics</span>
                                        {isAnalyzing ? 'Analyzing...' : analysisTriggered ? 'Analysis Updated ✓' : 'Analyze Resume'}
                                    </button>
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setUploadedFile(null);
                                            setAnalysisTriggered(false);
                                            setAtsScore(0);
                                            if (fileInputRef.current) fileInputRef.current.value = '';
                                        }}
                                        className="w-full py-3 text-slate-500 dark:text-slate-400 text-[12px] font-black font-medium hover:text-red-500 dark:hover:text-red-400 transition-colors"
                                    >
                                        Remove & Change File
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="size-20 bg-[#F8FAFC] dark:bg-gray-700/50 rounded-[28px] flex items-center justify-center mb-6 group-hover/upload:scale-110 transition-all duration-300 group-hover/upload:bg-blue-50 dark:group-hover/upload:bg-indigo-900/20">
                                    <span className="material-symbols-outlined text-gray-300 dark:text-gray-600 text-[40px] group-hover/upload:text-indigo-400 transition-colors">upload_file</span>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[#111827] dark:text-white font-black text-[16px]">Drop your resume here</p>
                                    <p className="text-slate-500 dark:text-slate-400 text-[13px] font-medium italic">or click to browse from device</p>
                                </div>
                                <div className="mt-8 flex items-center gap-2 px-4 py-1.5 bg-[#F8FAFC] dark:bg-gray-800 rounded-full border border-slate-200 dark:border-slate-800">
                                    <span className="size-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                                    <p className="text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-tighter">Maximum file size: 5MB</p>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Target JD Card */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden w-full transition-colors">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="size-10 bg-blue-50 dark:bg-blue-500/10 rounded-xl flex items-center justify-center">
                                <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-[24px]">target</span>
                            </div>
                            <h3 className="font-[900] text-[#111827] dark:text-white text-[18px]">Target Job Description</h3>
                        </div>
                        <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-wider rounded-lg border border-emerald-100 dark:border-emerald-800/50">High Quality Data</span>
                    </div>
                    
                    <div className="rounded-2xl w-full">
                        <textarea
                            value={jobDescription}
                            onChange={e => setJobDescription(e.target.value)}
                            className="w-full min-h-[200px] bg-gray-50/50 dark:bg-gray-700/50 rounded-2xl p-6 text-slate-600 dark:text-slate-300 text-[14px] font-medium leading-relaxed resize-none outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
                            placeholder="Paste a job description here... (e.g. Software Engineer Intern, looking for React and Node.js)"
                        />
                    </div>
                </div>
            </div>

            {/* Middle Section: Stats Matrix */}
            <div className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-8 w-full transition-opacity duration-500 ${analysisTriggered ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                {/* Score Gauge Card */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center text-center w-full transition-colors">
                    <h4 className="text-[13px] font-black text-slate-500 dark:text-slate-400 font-medium mb-10">ATS Compatibility Score</h4>
                    
                    <div className="relative size-48 mb-10">
                        {/* Static Gauge UI */}
                        <svg className="size-full -rotate-90 transform" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-gray-100 dark:text-gray-700" />
                            <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="10" fill="transparent" strokeDasharray="251.2" strokeDashoffset={251.2 * (1 - atsScore/100)} className="text-blue-600 dark:text-indigo-500 transition-all duration-1000" />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <div className="flex items-baseline gap-0.5">
                                <span className="text-[44px] font-black text-[#111827] dark:text-white leading-none">{atsScore}</span>
                                <span className="text-slate-500 dark:text-slate-400 font-bold text-[18px]">/100</span>
                            </div>
                            {atsScore >= 75 ? (
                                <span className="mt-2 px-3 py-1 bg-emerald-500 text-white text-[10px] font-black rounded-lg uppercase tracking-wide">Good Match</span>
                            ) : atsScore >= 50 ? (
                                <span className="mt-2 px-3 py-1 bg-orange-500 text-white text-[10px] font-black rounded-lg uppercase tracking-wide">Needs Work</span>
                            ) : (
                                <span className="mt-2 px-3 py-1 bg-red-500 text-white text-[10px] font-black rounded-lg uppercase tracking-wide">Poor Match</span>
                            )}
                        </div>
                    </div>

                    <p className="text-slate-500 dark:text-slate-400 text-[14px] font-medium leading-relaxed max-w-[240px]">
                        {atsScore >= 75 ? "Your resume is well-optimized for this role." : "Your resume could benefit from more specific technical keywords aligned with the JD."}
                    </p>
                </div>

                {/* Analysis Overview Card */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm w-full transition-colors">
                    <h3 className="font-[900] text-[#111827] dark:text-white text-[18px] mb-8">Analysis Overview</h3>
                    
                    <div className="space-y-8">
                        {[
                            { label: 'Keyword Match', score: analysisOverview.keyword_match, color: 'bg-blue-600 dark:bg-blue-500' },
                            { label: 'Impact Factor', score: analysisOverview.impact_score, color: 'bg-orange-500' },
                            { label: 'Readability', score: analysisOverview.readability, color: 'bg-emerald-500' },
                            { label: 'Formatting', score: analysisOverview.formatting, color: 'bg-purple-500' }
                        ].map((stat) => (
                            <div key={stat.label}>
                                <div className="flex justify-between mb-2">
                                    <span className="text-[14px] font-black text-slate-500 dark:text-slate-400">{stat.label}</span>
                                    <span className="text-[14px] font-black text-indigo-700 dark:text-blue-400">{Math.round(stat.score)}%</span>
                                </div>
                                <div className="h-2 w-full bg-[#F8FAFC] dark:bg-gray-700 rounded-full overflow-hidden">
                                    <div className={`h-full ${stat.color} transition-all duration-1000`} style={{ width: `${stat.score}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Skill Gap Matrix Card */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-full w-full transition-colors">
                    <h3 className="font-[900] text-[#111827] dark:text-white text-[18px] mb-8">Skill Gap Matrix</h3>
                    
                    <div className="flex-1 space-y-8">
                        <div>
                            <p className="text-[11px] font-black text-slate-500 dark:text-slate-400 font-medium mb-4">Matching Skills</p>
                            <div className="flex flex-wrap gap-2.5">
                                {skills.matching.length > 0 ? skills.matching.map(skill => (
                                    <span key={skill} className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-[13px] font-black rounded-full border border-emerald-200/50 dark:border-emerald-800/50 shadow-sm shadow-sm dark:shadow-none">
                                        {skill}
                                    </span>
                                )) : <span className="text-[13px] text-slate-400">No matching skills found.</span>}
                            </div>
                        </div>

                        <div>
                            <p className="text-[11px] font-black text-slate-500 dark:text-slate-400 font-medium mb-4">Missing Keywords</p>
                            <div className="flex flex-wrap gap-2.5">
                                {skills.missing.length > 0 ? skills.missing.map(skill => (
                                    <span key={skill} className="px-3 py-1.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-[13px] font-bold rounded-full border border-red-100 dark:border-red-800/50 shadow-sm">
                                        {skill}
                                    </span>
                                )) : <span className="text-[13px] text-slate-400">No major missing skills!</span>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Insights Optimizer */}
            <div className={`flex flex-col xl:flex-row gap-8 items-stretch w-full transition-opacity duration-500 ${analysisTriggered ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                {/* Recruiter Insight Card */}
                <div className="flex-1 xl:w-[40%] bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-full w-full min-w-0 transition-colors">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="size-9 bg-blue-50 dark:bg-blue-500/10 rounded-xl flex items-center justify-center">
                            <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-[20px] filled">smart_toy</span>
                        </div>
                        <h3 className="font-[900] text-[#111827] dark:text-white text-[17px]">Recruiter Insight</h3>
                    </div>

                    <div className="flex-1">
                        <p className="text-slate-500 dark:text-slate-400 text-[14px] font-medium leading-relaxed mb-6">
                            {recruiterInsight || "Waiting for upload..."}
                        </p>

                        {improvementSuggestions.length > 0 && (
                            <div className="bg-blue-50 dark:bg-blue-500/10 rounded-2xl p-6 border-l-4 border-indigo-400 dark:border-indigo-500">
                                <p className="text-[11px] font-black text-indigo-700 dark:text-blue-400 font-medium mb-3">Improvement Suggestions</p>
                                <ul className="space-y-2">
                                    {improvementSuggestions.map((suggestion, idx) => (
                                        <li key={idx} className="text-gray-700 dark:text-gray-300 text-[13px] font-bold leading-relaxed flex gap-2">
                                            <span className="text-indigo-400">•</span>
                                            {suggestion}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                {/* AI Bullet Point Optimizer Card */}
                <div className="flex-1 xl:w-[60%] bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-full w-full min-w-0 transition-colors">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="size-9 bg-blue-50 dark:bg-blue-500/10 rounded-xl flex items-center justify-center">
                                <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-[20px]">auto_fix_high</span>
                            </div>
                            <h3 className="font-[900] text-[#111827] dark:text-white text-[17px]">AI Bullet Point Optimizer</h3>
                        </div>
                        <span className="text-slate-500 dark:text-slate-400 text-[11px] font-bold italic hidden sm:inline">Based on top-tier engineering CVs</span>
                    </div>

                    <div className="flex-1 space-y-6 mb-8 w-full overflow-x-auto">
                        {optimizedBullets.length === 0 && analysisTriggered ? (
                            <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-6">No specific bullet point improvements identified.</p>
                        ) : optimizedBullets.map((item, idx) => (
                            <div key={idx} className="flex flex-col md:flex-row gap-4 md:items-center w-full min-w-0">
                                <div className="flex-1 bg-[#F8FAFC] dark:bg-gray-700/50 rounded-xl p-5 border border-gray-50 dark:border-gray-700 min-w-0">
                                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-black font-medium mb-2">Current</p>
                                    <p className="text-slate-500 dark:text-slate-400 text-[13px] font-medium leading-relaxed italic break-words">{item.original}</p>
                                </div>
                                <div className="shrink-0 flex items-center justify-center rotate-90 md:rotate-0">
                                    <span className="material-symbols-outlined text-indigo-300 dark:text-indigo-600 text-[20px]">chevron_right</span>
                                </div>
                                <div className="flex-1 bg-blue-50 dark:bg-blue-500/10 rounded-xl p-5 border border-indigo-100/50 dark:border-indigo-800/30 min-w-0">
                                    <p className="text-[10px] text-indigo-400 dark:text-indigo-500 font-black font-medium mb-2">AI Suggested</p>
                                    <p className="text-slate-900 dark:text-slate-100 text-[13px] font-bold leading-relaxed break-words">{item.improved}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResumeAnalyzer;
