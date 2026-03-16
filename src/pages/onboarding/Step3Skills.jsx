import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

const Step3Skills = () => {
    const navigate = useNavigate();
    const { user, userData } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const [skills, setSkills] = useState({
        problemSolving: 50,
        technical: 30,
        communication: 70,
        analytical: 40
    });

    const [showPuzzle, setShowPuzzle] = useState(false);
    const [puzzleSolved, setPuzzleSolved] = useState(false);
    const [puzzleError, setPuzzleError] = useState(false);
    const [puzzleAnswer, setPuzzleAnswer] = useState('');
    const [github, setGithub] = useState('');
    const [leetcode, setLeetcode] = useState('');

    // Load existing data
    useEffect(() => {
        if (userData?.onboarding?.skills) {
            setSkills(userData.onboarding.skills);
        }
        if (userData?.social_links?.github) setGithub(userData.social_links.github);
        if (userData?.social_links?.leetcode) setLeetcode(userData.social_links.leetcode);
    }, [userData]);

    const handleSliderChange = (skill, value) => {
        setSkills(prev => ({ ...prev, [skill]: value }));
    };

    const handlePuzzleSubmit = () => {
        // Simple logic puzzle: Sequence 2, 5, 10, 17, ? 
        // Logic: +3, +5, +7, +9. Next is 17+9 = 26.
        if (puzzleAnswer === '26') {
            setPuzzleSolved(true);
            setSkills(prev => ({ ...prev, problemSolving: 85 })); // Boost score
            setShowPuzzle(false);
            setPuzzleError(false);
        } else {
            setPuzzleError(true);
        }
    };

    const handleContinue = async () => {
        if (!user) return;
        setIsLoading(true);
        try {
            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, {
                "onboarding.skills": skills,
                "onboarding.verifiedProblemSolver": puzzleSolved,
                "social_links.github": github,
                "social_links.leetcode": leetcode
            });
            navigate('/onboarding/step-4');
        } catch (error) {
            console.error("Error saving step 3:", error);
            alert("Failed to save. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-8 relative w-full max-w-lg mx-auto md:max-w-none">
            <div className="text-center">
                <h2 className="text-2xl md:text-3xl font-[800] tracking-tight text-gray-900 mb-2">Showcase your skills</h2>
                <p className="text-gray-500 text-base md:text-lg">Rate yourself honestly. Solve challenges to verify your level.</p>
            </div>

            <div className="space-y-8">
                {/* Skill Interactives */}
                <div className="space-y-6">
                    <SkillInteractive
                        label="Problem Solving"
                        value={skills.problemSolving}
                        onChange={(v) => handleSliderChange('problemSolving', v)}
                        onVerify={() => setShowPuzzle(true)}
                        isVerified={puzzleSolved}
                        icon="psychology"
                    />
                    <SkillInteractive
                        label="Coding / Technical Skills"
                        value={skills.technical}
                        onChange={(v) => handleSliderChange('technical', v)}
                        icon="code"
                    />
                    <SkillInteractive
                        label="Communication"
                        value={skills.communication}
                        onChange={(v) => handleSliderChange('communication', v)}
                        icon="campaign"
                    />
                    <SkillInteractive
                        label="Analytical Thinking"
                        value={skills.analytical}
                        onChange={(v) => handleSliderChange('analytical', v)}
                        icon="analytics"
                    />
                </div>

                {/* Social Platforms Connection */}
                <div className="pt-4 space-y-4 border-t border-gray-100">
                    <label className="text-sm font-black text-gray-900 block uppercase tracking-wide">Connect Your Platforms</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-500 flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-[14px]">code</span> GitHub Username
                            </label>
                            <input 
                                type="text"
                                value={github}
                                onChange={(e) => setGithub(e.target.value)}
                                placeholder="e.g. yashsharma"
                                className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 text-sm font-medium focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-500 flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-[14px]">terminal</span> LeetCode ID
                            </label>
                            <input 
                                type="text"
                                value={leetcode}
                                onChange={(e) => setLeetcode(e.target.value)}
                                placeholder="e.g. yash_01"
                                className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 text-sm font-medium focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
                            />
                        </div>
                    </div>
                    <p className="text-[11px] text-gray-400 italic">We use these to sync your projects and coding stats automatically.</p>
                </div>
            </div>

            <div className="pt-4 flex gap-4">
                <button
                    onClick={() => navigate('/onboarding/step-2')}
                    disabled={isLoading}
                    className="h-14 px-8 bg-gray-100 text-gray-600 text-lg font-bold rounded-2xl hover:bg-gray-200 transition-all disabled:opacity-70"
                >
                    Back
                </button>
                <button
                    onClick={handleContinue}
                    disabled={isLoading}
                    className="flex-1 h-14 bg-primary text-white text-lg font-bold rounded-2xl shadow-xl shadow-primary/30 hover:bg-indigo-600 hover:scale-[1.01] hover:shadow-2xl hover:shadow-primary/40 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Saving...' : 'Continue'}
                    {!isLoading && <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>}
                </button>
            </div>

            {/* Logic Puzzle Modal */}
            {showPuzzle && (
                <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-3xl" onClick={() => setShowPuzzle(false)}></div>
                    <div className="bg-white border border-gray-200 shadow-2xl rounded-2xl p-6 w-full max-w-sm relative z-10 animate-in fade-in zoom-in duration-200">
                        <button onClick={() => setShowPuzzle(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                            <span className="material-symbols-outlined">close</span>
                        </button>

                        <div className="flex items-center gap-3 mb-4">
                            <div className="size-10 bg-indigo-100 text-primary rounded-full flex items-center justify-center">
                                <span className="material-symbols-outlined">lightbulb</span>
                            </div>
                            <h3 className="text-xl font-black text-gray-900">Quick Logic Check</h3>
                        </div>

                        <p className="text-gray-600 font-medium mb-4">
                            What comes next in this sequence?
                            <br />
                            <span className="text-2xl font-black text-gray-900 block mt-2 tracking-widest">2, 5, 10, 17, ?</span>
                        </p>

                        <div className="mb-4">
                            <input
                                type="number"
                                value={puzzleAnswer}
                                onChange={(e) => setPuzzleAnswer(e.target.value)}
                                placeholder="Your answer"
                                className={`w-full h-12 border rounded-xl px-4 font-bold text-lg outline-none transition-all ${puzzleError ? 'border-red-500 bg-red-50 text-red-600' : 'border-gray-200 focus:border-primary'
                                    }`}
                                onKeyDown={(e) => e.key === 'Enter' && handlePuzzleSubmit()}
                            />
                            {puzzleError && <p className="text-red-500 text-xs font-bold mt-1">Incorrect, try again!</p>}
                        </div>

                        <button
                            onClick={handlePuzzleSubmit}
                            className="w-full h-12 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-colors"
                        >
                            Verify Ability
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const SkillInteractive = ({ label, value, onChange, onVerify, isVerified, icon }) => {
    // Determine level text based on value
    const getLevelInfo = (val) => {
        if (val < 20) return { title: 'Novice', color: 'text-gray-500', desc: 'Just starting out' };
        if (val < 45) return { title: 'Beginner', color: 'text-blue-500', desc: 'Understand basics' };
        if (val < 70) return { title: 'Intermediate', color: 'text-indigo-500', desc: 'Can build independent projects' };
        if (val < 90) return { title: 'Advanced', color: 'text-purple-600', desc: 'Strong conceptual grasp' };
        return { title: 'Expert', color: 'text-pink-600', desc: 'Mastery level' };
    };

    const level = getLevelInfo(value);

    return (
        <div className={`p-4 rounded-2xl border transition-all duration-300 ${isVerified ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-100 hover:border-gray-200 hover:bg-white hover:shadow-sm'
            }`}>
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className={`size-10 rounded-xl flex items-center justify-center ${isVerified ? 'bg-green-100 text-green-600' : 'bg-white text-gray-500 border border-gray-100'
                        }`}>
                        <span className="material-symbols-outlined">{icon}</span>
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <label className="text-sm font-bold text-gray-900">{label}</label>
                            {isVerified && (
                                <span className="text-[10px] font-black bg-green-100 text-green-700 px-1.5 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[10px]">check_circle</span> Verified
                                </span>
                            )}
                        </div>
                        <p className={`text-xs font-bold transition-colors ${level.color}`}>{level.title} · <span className="text-gray-400 font-medium">{level.desc}</span></p>
                    </div>
                </div>

                {onVerify && !isVerified && (
                    <button
                        onClick={onVerify}
                        className="text-white text-[10px] font-bold bg-gray-900 px-3 py-1.5 rounded-lg hover:bg-primary transition-colors flex items-center gap-1"
                    >
                        <span className="material-symbols-outlined text-[12px]">bolt</span>
                        Verify
                    </button>
                )}
            </div>

            <div className="relative h-6 flex items-center">
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={value}
                    onChange={(e) => onChange(Number(e.target.value))}
                    disabled={isVerified}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary relative z-10 disabled:cursor-not-allowed disabled:opacity-50"
                />

                {/* Visual markers for the slider */}
                <div className="absolute inset-0 flex justify-between px-1 pointer-events-none">
                    {[0, 25, 50, 75, 100].map((mk) => (
                        <div key={mk} className="w-0.5 h-1 bg-gray-300 mt-0.5"></div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Step3Skills;
