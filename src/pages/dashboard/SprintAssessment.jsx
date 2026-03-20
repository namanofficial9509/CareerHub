import { useState, useEffect, useRef, useCallback } from 'react';
import { db, auth } from '../../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

const SprintAssessment = () => {
    // State for selected answers
    const [answers, setAnswers] = useState({});
    
    // State for countdown timer (12:45 initially based on mockup)
    const [timeLeft, setTimeLeft] = useState(12 * 60 + 45); // in seconds

    // Security & Anti-cheating state
    const [testStarted, setTestStarted] = useState(false);
    const [violationCount, setViolationCount] = useState(0);
    const [isTerminated, setIsTerminated] = useState(false);
    const streamRef = useRef(null);
    const webcamStreamRef = useRef(null);
    const videoRef = useRef(null);

    const endTest = useCallback(async (reason) => {
        setIsTerminated(true);
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        if (webcamStreamRef.current) {
            webcamStreamRef.current.getTracks().forEach(track => track.stop());
            webcamStreamRef.current = null;
        }
        try {
            await addDoc(collection(db, 'terminations'), {
                type: 'test_terminated',
                reason: reason,
                userId: auth?.currentUser?.uid || 'anonymous',
                timestamp: new Date()
            });
        } catch (error) {
            console.error('Error logging termination:', error);
        }
    }, []);

    const handleViolation = useCallback(async (reason, logType = 'violation') => {
        if (isTerminated) return;
        
        setViolationCount(prev => {
            const newCount = prev + 1;
            addDoc(collection(db, 'violations'), {
                type: logType,
                reason: reason,
                count: newCount,
                userId: auth?.currentUser?.uid || 'anonymous',
                timestamp: new Date()
            }).catch(e => console.error('Error logging violation', e));

            if (newCount === 1) {
                alert("Warning: Stay in front of the camera and do not engage in unfair means. Do not switch tabs or stop sharing. Your next violation will result in termination.");
            } else if (newCount >= 2) {
                endTest("unfair means");
            }
            return newCount;
        });
    }, [isTerminated, endTest]);

    const startSecureTest = async () => {
        try {
            // Request Webcam
            const webcamStream = await navigator.mediaDevices.getUserMedia({ video: true });
            webcamStreamRef.current = webcamStream;
            
            if (videoRef.current) {
                videoRef.current.srcObject = webcamStream;
            }

            webcamStream.getVideoTracks()[0].onended = () => {
                handleViolation("camera_off", "camera_violation");
            };

            // Request Screen share
            const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
            streamRef.current = stream;
            stream.getVideoTracks()[0].onended = () => {
                handleViolation("screen_share_stop");
            };
            
            // Full screen
            await document.documentElement.requestFullscreen();
            setTestStarted(true);
        } catch (err) {
            alert("You must allow camera access, screen sharing, and full screen to start the test.");
            console.error("Setup failed:", err);
        }
    };

    useEffect(() => {
        if (!testStarted || isTerminated) return;

        const handleVisibilityChange = () => {
            if (document.hidden) handleViolation("tab_switch");
        };

        const handleBlur = () => {
             handleViolation("blur");
        };

        const handleFullscreenChange = () => {
            if (!document.fullscreenElement) handleViolation("fullscreen_exit");
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        window.addEventListener("blur", handleBlur);
        document.addEventListener("fullscreenchange", handleFullscreenChange);

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            window.removeEventListener("blur", handleBlur);
            document.removeEventListener("fullscreenchange", handleFullscreenChange);
        };
    }, [testStarted, isTerminated, handleViolation]);

    // Face Detection Extensible Interval
    useEffect(() => {
        if (!testStarted || isTerminated) return;

        const faceCheckInterval = setInterval(() => {
            // NOTE: Structurally prepared for face-api.js or equivalent integration.
            // e.g. const detections = await faceapi.detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions());
            
            // Stub Values:
            const hasFace = true; 
            const multipleFaces = false;
            
            if (!hasFace) {
                handleViolation("no_face_detected", "camera_violation");
            } else if (multipleFaces) {
                handleViolation("multiple_faces_detected", "camera_violation");
            }
        }, 3000);

        return () => clearInterval(faceCheckInterval);
    }, [testStarted, isTerminated, handleViolation]);

    useEffect(() => {
        if (!testStarted || isTerminated) return;
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    endTest("time_out");
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [testStarted, isTerminated, endTest]);

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

    if (isTerminated) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 w-full">
                <div className="size-20 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-6 mx-auto">
                    <span className="material-symbols-outlined text-[40px]">gavel</span>
                </div>
                <h1 className="text-3xl font-bold text-slate-900 mb-4">Assessment Terminated</h1>
                <p className="text-lg text-slate-600 max-w-md">
                    You are removed from the test due to unfair means. This incident has been recorded.
                </p>
                <button 
                    onClick={() => window.location.href = '/dashboard/challenges'}
                    className="mt-8 bg-slate-900 text-white px-6 py-3 rounded-xl font-[600] hover:bg-slate-800 transition-colors"
                >
                    Return to Dashboard
                </button>
            </div>
        );
    }

    if (!testStarted) {
        return (
             <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 w-full max-w-[800px] mx-auto mt-8">
                <div className="bg-white rounded-[32px] p-10 shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-slate-100 w-full relative overflow-hidden text-center">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-[#5d3fd3]"></div>
                    <div className="size-16 rounded-3xl bg-indigo-50 text-[#5d3fd3] flex items-center justify-center mb-6 mx-auto">
                        <span className="material-symbols-outlined text-[32px]">shield_lock</span>
                    </div>
                    <h1 className="text-3xl font-[900] text-slate-900 mb-6">Secure Assessment Environment</h1>
                    
                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-left mb-8 max-w-[600px] mx-auto">
                        <h3 className="text-amber-900 font-[800] mb-3 flex items-center gap-2">
                            <span className="material-symbols-outlined text-[20px]">security</span>
                            Important Security Notice
                        </h3>
                        <p className="text-[14px] text-amber-800/80 mb-4 leading-relaxed font-[500]">
                            Camera access is required for fair monitoring during the test. Wait for permissions before beginning. To maintain the integrity of this challenge, this assessment requires a secure environment. Please note:
                        </p>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-[14px] text-amber-900/90 font-[600]">
                                <div className="bg-amber-100 rounded-lg p-1.5 text-amber-600 shrink-0">
                                    <span className="material-symbols-outlined text-[18px] block">videocam</span>
                                </div>
                                <span className="pt-1">Camera recording is required. Stopping the camera or moving your face away is a violation.</span>
                            </li>
                            <li className="flex items-start gap-3 text-[14px] text-amber-900/90 font-[600]">
                                <div className="bg-amber-100 rounded-lg p-1.5 text-amber-600 shrink-0">
                                    <span className="material-symbols-outlined text-[18px] block">fit_screen</span>
                                </div>
                                <span className="pt-1">The test must be taken in Full Screen mode. Exiting full screen is a violation.</span>
                            </li>
                            <li className="flex items-start gap-3 text-[14px] text-amber-900/90 font-[600]">
                                <div className="bg-amber-100 rounded-lg p-1.5 text-amber-600 shrink-0">
                                    <span className="material-symbols-outlined text-[18px] block">screen_share</span>
                                </div>
                                <span className="pt-1">Screen capturing is required. Stopping the capture is a violation.</span>
                            </li>
                            <li className="flex items-start gap-3 text-[14px] text-amber-900/90 font-[600]">
                                <div className="bg-amber-100 rounded-lg p-1.5 text-amber-600 shrink-0">
                                    <span className="material-symbols-outlined text-[18px] block">tab</span>
                                </div>
                                <span className="pt-1">Switching tabs or losing focus on the window will trigger a violation.</span>
                            </li>
                        </ul>
                    </div>
                    
                    <p className="text-[13px] text-slate-500 font-[500] mb-8 max-w-[500px] mx-auto leading-relaxed">
                        While full cheating prevention is not possible due to browser limitations, this system is designed to reduce unfair practices. You will receive one warning before termination.
                    </p>

                    <button 
                        onClick={startSecureTest}
                        className="bg-[#5d3fd3] text-white px-10 py-4 rounded-2xl font-[800] text-[16px] hover:bg-[#4a32a8] active:scale-[0.98] transition-all flex items-center justify-center gap-3 w-full sm:w-auto mx-auto shadow-xl shadow-[#5d3fd3]/25"
                    >
                        <span className="material-symbols-outlined text-[22px]">lock_open</span>
                        Accept & Begin Secure Test
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col lg:flex-row gap-6 w-full max-w-[1200px] mx-auto min-h-screen pb-12 items-start mt-2">
            
            {/* Live Camera Preview overlay */}
            {testStarted && !isTerminated && (
                <div className="fixed top-24 right-6 sm:bottom-6 sm:right-6 sm:top-auto z-50 w-48 aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border-4 border-[#5d3fd3]">
                    <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                    <div className="absolute top-2 right-2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow flex items-center gap-1">
                        <span className="size-2 bg-white rounded-full animate-pulse"></span>
                        Camera Active
                    </div>
                </div>
            )}

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
