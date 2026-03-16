import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getGenerativeModel } from 'firebase/ai';
import { ai } from '../../lib/firebase';
import { generateAiContextSummary, calculateSkillLevel } from '../../lib/intelligenceEngine';

const AiHelper = () => {
    const { user, userData } = useAuth();
    const firstName = userData?.identity?.name?.split(' ')[0]
        || userData?.basicProfile?.name?.split(' ')[0] 
        || userData?.onboarding?.displayName?.split(' ')[0] 
        || user?.displayName?.split(' ')[0] 
        || 'Student';
    const avatarSeed = firstName;
    const skillLevel = calculateSkillLevel(userData?.metrics);

    const [messageInput, setMessageInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    
    // Initial greeting message
    const [messages, setMessages] = useState([
        {
            role: 'ai',
            content: `I've started analyzing your profile data. You can add more details in the Profile → Data Hub section to get better insights!`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
    ]);

    // Auto-scroll to bottom of messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    const handleSendMessage = async (customMessage = null) => {
        const textToSend = customMessage || messageInput;
        if (!textToSend.trim()) return;

        // Add user message to UI immediately
        const userMsg = {
            role: 'user',
            content: textToSend,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        
        const newMessages = [...messages, userMsg];
        setMessages(newMessages);
        if (!customMessage) setMessageInput('');
        setIsTyping(true);

        try {
            // Initialize the GenerativeModel instance
            const model = getGenerativeModel(ai, { model: 'gemini-1.5-flash', mode: 'prefer_in_cloud' });
            
            // Build a REAL personalized prompt with the student's profile
            const studentContext = generateAiContextSummary(userData);
            const historyText = newMessages.map(m => `**${m.role === 'user' ? 'User' : 'Assistant'}**: ${m.content}`).join('\n\n');

            console.log("🔥 [DEBUG] AI Context Payload:", studentContext);

            const prompt = `You are an expert AI Career Mentor embedded in a student development platform.
You are NOT a general chatbot. You MUST refer to the student's actual data before answering.

=== STUDENT PROFILE (REAL DATA) ===
${studentContext}
Skill Level: ${skillLevel}

=== STRICT RULES ===
1. Always refer to the student profile above when generating responses.
2. Address the student by their first name: ${firstName}.
3. NEVER ask for information (like year, branch, or skills) that already exists in the profile.
4. If skill level is Beginner, suggest simple foundational projects. If Intermediate, suggest integration projects. If Advanced, suggest industry-scale challenges.
5. Be encouraging, specific, and actionable — avoid generic advice.
6. Keep responses under 200 words unless asked for detail.

=== CONVERSATION HISTORY ===
${historyText}

Respond to the student's last message. Do not output your own speaker label.`;
            
            // Setup an empty AI message to stream into.
            setMessages(prev => [...prev, {
                role: 'ai',
                content: '',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);

            const result = await model.generateContentStream(prompt);
            let fullResponse = '';
            
            for await (const chunk of result.stream) {
                const chunkText = chunk.text();
                fullResponse += chunkText;
                
                // Update the last message text as it streams in
                setMessages(prev => {
                    const latest = [...prev];
                    latest[latest.length - 1].content = fullResponse;
                    return latest;
                });
            }
        } catch (err) {
            console.error("AI Logic Error:", err);
            // Append an error message if the call fails
            setMessages(prev => [...prev.slice(0, prev.length - 1), {
                role: 'ai',
                content: "I'm sorry, I couldn't reach my AI brain right now. Please try again later.",
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleActionChip = (action) => {
        const prompts = {
            'Fix Resume': "Can you give me 3 quick tips to improve my resume for software engineering roles?",
            'Update Roadmap': "I want to update my learning roadmap. What are the most important skills right now?",
            'Mock Interview': "Let's do a quick mock interview. Ask me one behavioral question."
        };
        handleSendMessage(prompts[action]);
    };

    return (
        <div className="flex flex-col xl:flex-row h-[calc(100vh-140px)] gap-6 overflow-hidden">
            {/* Left Panel: Recent Mentorship */}
            <div className="w-full xl:w-[250px] shrink-0 flex flex-col gap-6 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm overflow-y-auto hidden lg:flex transition-colors">
                <button className="h-12 w-full rounded-xl border border-gray-200 dark:border-gray-600 hover:border-primary/50 text-gray-700 dark:text-gray-200 font-bold flex items-center justify-center gap-2 hover:bg-[#F8FAFC] dark:hover:bg-gray-700 transition-colors shadow-sm">
                    <span className="material-symbols-outlined text-[20px]">add</span>
                    New Mentorship
                </button>

                <div>
                    <h3 className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 px-2">Recent Mentorship</h3>
                    <div className="space-y-2">
                        <button className="w-full flex flex-col items-start gap-1 px-4 py-3 bg-white dark:bg-slate-900 border border-primary/20 dark:border-indigo-500/30 text-blue-600 dark:text-blue-400 rounded-2xl shadow-sm transition-all shadow-primary/5 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-blue-600/5 dark:bg-blue-500/10 group-hover:bg-blue-600/10 dark:group-hover:bg-blue-500/20 transition-colors"></div>
                            <div className="flex items-center gap-3 relative z-10">
                                <span className="material-symbols-outlined text-[20px]">route</span>
                                <span className="text-sm font-bold">Career Path Update</span>
                            </div>
                            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 pl-8 relative z-10">Last updated: 2 days ago</span>
                        </button>
                        
                        <button className="w-full flex flex-col items-start gap-1 px-4 py-3 text-slate-500 dark:text-slate-400 rounded-2xl hover:bg-[#F8FAFC] dark:hover:bg-gray-700 transition-all font-medium group">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-[20px]">description</span>
                                <span className="text-sm">Resume Feedback</span>
                            </div>
                            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 pl-8">ATS Score: 78%</span>
                        </button>

                        <button className="w-full flex flex-col items-start gap-1 px-4 py-3 text-slate-500 dark:text-slate-400 rounded-2xl hover:bg-[#F8FAFC] dark:hover:bg-gray-700 transition-all font-medium group">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-[20px]">work</span>
                                <span className="text-sm">Internship Search</span>
                            </div>
                            <span className="text-[11px] font-bold text-blue-600 pl-8">12 opportunities found</span>
                        </button>
                    </div>
                </div>

                {/* Career Alerts Section */}
                <div>
                    <h3 className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 px-2 flex items-center gap-2">
                        Career Alerts
                        <span className="size-2 rounded-full bg-red-500 animate-ping"></span>
                    </h3>
                    <div className="p-4 bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-800/30 rounded-2xl">
                        <div className="flex gap-3 items-start">
                            <span className="material-symbols-outlined text-orange-600 text-[18px]">verified</span>
                            <div>
                                <h4 className="text-[12px] font-bold text-slate-900 dark:text-white mb-1">New Match Found</h4>
                                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-tight">Backend Internship at Microsoft matches your profile.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-auto">
                    <button className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white w-full rounded-2xl transition-colors font-medium">
                        <span className="material-symbols-outlined text-[20px]">help</span>
                        <span className="text-sm">Help Center</span>
                    </button>
                </div>
            </div>

            {/* Middle Panel: Chat Interface */}
            <div className="flex-1 flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden relative transition-colors">
                {/* Chat Header */}
                <div className="h-20 border-b border-gray-50 dark:border-gray-700 flex items-center px-8 justify-between shrink-0 bg-white/50 dark:bg-gray-800/50 backdrop-blur-md z-10">
                    <div className="flex items-center gap-4">
                        <div className="size-10 rounded-full border border-slate-200 dark:border-slate-800 overflow-hidden shrink-0 shadow-sm">
                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=CareerAI&backgroundColor=ffdfbf`} alt="Mentor" className="w-full h-full object-cover" />
                        </div>
                        <h2 className="font-[900] text-[#111827] dark:text-white text-[17px] tracking-tight">Ready to level up, {firstName}?</h2>
                    </div>
                    <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
                        <button className="p-2.5 hover:bg-[#F8FAFC] dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white rounded-xl transition-all">
                            <span className="material-symbols-outlined text-[22px]">search</span>
                        </button>
                        <button className="p-2.5 hover:bg-[#F8FAFC] dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white rounded-xl transition-all relative">
                            <span className="material-symbols-outlined text-[22px]">notifications</span>
                            <div className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                        </button>
                    </div>
                </div>

                {/* Command Center Dashboard (Interactive Progress & Planning) */}
                <div className="flex-1 overflow-y-auto no-scrollbar scroll-smooth bg-gray-50/30 dark:bg-slate-900/10">
                    <div className="p-8 pb-4 grid grid-cols-1 md:grid-cols-2 gap-6 transition-colors">
                        {/* Career Health Score */}
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-[14px] font-[900] text-slate-900 dark:text-white uppercase tracking-tight">Career Health</h3>
                                <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-600 rounded-full">
                                    <span className="text-white font-bold text-[14px]">72%</span>
                                </div>
                            </div>
                            <div className="space-y-3">
                                {[
                                    { label: 'Skills', val: 72, color: 'bg-emerald-500' },
                                    { label: 'Projects', val: 65, color: 'bg-blue-500' },
                                    { label: 'Experience', val: 40, color: 'bg-orange-500' },
                                    { label: 'Networking', val: 30, color: 'bg-purple-500' }
                                ].map(item => (
                                    <div key={item.label}>
                                        <div className="flex justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                                            <span>{item.label}</span>
                                            <span>{item.val}%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                            <div className={`${item.color} h-full rounded-full transition-all duration-1000`} style={{ width: `${item.val}%` }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Career Plan Builder */}
                        <div className="bg-[#111827] dark:bg-[#0B0F19] p-6 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 blur-3xl rounded-full -mr-16 -mt-16"></div>
                            <div className="relative z-10 flex flex-col h-full">
                                <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Your Career Plan</h3>
                                <h2 className="text-[20px] font-black text-white mb-2 tracking-tight">Backend Engineer</h2>
                                
                                <div className="mt-auto pt-4 border-t border-slate-800">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-[10px] font-bold text-slate-500 uppercase">Current Progress</span>
                                        <span className="text-[10px] font-bold text-blue-400">6/12 Milestones</span>
                                    </div>
                                    <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                                        <p className="text-[10px] text-slate-400 mb-1 font-bold">NEXT TARGET:</p>
                                        <p className="text-[13px] text-white font-medium flex items-center gap-2">
                                            <span className="material-symbols-outlined text-[16px] text-blue-500">flag</span>
                                            Learn Docker & deploy a project
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Tools Row */}
                    <div className="px-8 mb-8">
                        <h3 className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 px-1">Quick Career Tools</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { icon: 'description', label: 'Resume Analyzer', color: 'text-blue-600', bg: 'bg-blue-50' },
                                { icon: 'record_voice_over', label: 'Mock Interview', color: 'text-purple-600', bg: 'bg-purple-50' },
                                { icon: 'lightbulb', label: 'Project Ideas', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                                { icon: 'track_changes', label: 'DSA Planner', color: 'text-orange-600', bg: 'bg-orange-50' }
                            ].map(tool => (
                                <button key={tool.label} className="flex flex-col items-center justify-center p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl hover:shadow-md hover:border-blue-200 dark:hover:border-blue-500 transition-all group">
                                    <div className={`size-10 ${tool.bg} dark:bg-opacity-10 rounded-xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                                        <span className={`material-symbols-outlined ${tool.color}`}>{tool.icon}</span>
                                    </div>
                                    <span className="text-[12px] font-bold text-slate-700 dark:text-slate-300 text-center">{tool.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Mentorship Session Title */}
                    <div className="px-8 mb-4 border-b border-gray-100 dark:border-gray-800 pb-4">
                        <h3 className="text-[14px] font-[900] text-slate-900 dark:text-white flex items-center gap-2">
                            <span className="size-2 rounded-full bg-blue-600"></span> Active Mentorship Chat
                        </h3>
                    </div>

                    {/* Chat Messages */}
                    <div className="p-8 pt-0 space-y-10 scroll-smooth">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex gap-5 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
                            {/* Avatar */}
                            {msg.role === 'ai' ? (
                                <div className="size-10 rounded-full bg-blue-600 flex items-center justify-center shrink-0 shadow-lg shadow-blue-100 text-white font-[900] text-[13px] uppercase tracking-tighter">
                                    AH
                                </div>
                            ) : (
                                <div className="size-10 rounded-full shrink-0 overflow-hidden ring-4 ring-white shadow-md">
                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}&backgroundColor=ffdfbf`} alt="You" className="w-full h-full object-cover" />
                                </div>
                            )}
                            
                            {/* Message / Mentor Card */}
                            <div className={`space-y-1.5 ${msg.role === 'user' ? 'min-w-[40%]' : ''}`}>
                                {msg.role === 'ai' && msg.content.includes("profile shows") ? (
                                    /* Mentor Card Variant */
                                    <div className="bg-white dark:bg-slate-800 border-l-4 border-blue-600 rounded-2xl p-6 shadow-md shadow-blue-100/20 dark:shadow-none animate-in slide-in-from-left-4 duration-500">
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="material-symbols-outlined text-blue-600 text-[20px]">psychology</span>
                                            <h4 className="text-[13px] font-black text-slate-900 dark:text-white uppercase tracking-wider">AI Career Insight</h4>
                                        </div>
                                        <p className="text-[15px] text-slate-700 dark:text-slate-300 font-medium leading-relaxed mb-6">
                                            {msg.content}
                                        </p>
                                        <div className="flex flex-wrap gap-3">
                                            <button onClick={() => handleActionChip('Update Roadmap')} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-[12px] font-bold rounded-xl transition-all shadow-sm flex items-center gap-2">
                                                <span className="material-symbols-outlined text-[16px]">trending_up</span> See Project Ideas
                                            </button>
                                            <button className="px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-[12px] font-bold rounded-xl transition-all">
                                                Not now
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    /* Standard Bubble */
                                    <div className={`p-5 rounded-3xl leading-relaxed text-[15px] font-medium shadow-sm border ${
                                        msg.role === 'ai' 
                                            ? 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-tl-sm border-slate-100 dark:border-slate-700' 
                                            : 'bg-blue-600 dark:bg-indigo-600 text-white rounded-tr-sm border-blue-700 dark:border-indigo-700'
                                    }`}>
                                        {msg.content}
                                    </div>
                                )}
                                <p className={`text-[10px] text-slate-500 dark:text-slate-400 font-black uppercase tracking-widest pt-1 ${
                                    msg.role === 'user' ? 'text-right pr-2' : 'pl-2'
                                }`}>
                                    {msg.timestamp}
                                </p>
                            </div>
                        </div>
                    ))}

                    </div>
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area (Pinned to Bottom) */}
                <div className="p-8 pb-10 border-t border-gray-50 dark:border-gray-700 bg-white dark:bg-slate-900 transition-colors shrink-0">
                    <div className="flex gap-4 mb-6 px-1 overflow-x-auto pb-1 no-scrollbar shrink-0">
                        <button onClick={() => handleActionChip('Fix Resume')} className="whitespace-nowrap flex items-center gap-3 px-5 py-3 bg-[#f8f9ff] dark:bg-blue-500/10 hover:bg-blue-50 dark:hover:bg-indigo-900/30 text-slate-900 dark:text-slate-100 rounded-[18px] text-[14px] font-[900] border border-transparent transition-all">
                            <span className="material-symbols-outlined text-[18px] text-blue-600 dark:text-blue-400">edit_document</span>
                            Fix Resume
                        </button>
                        <button onClick={() => handleActionChip('Update Roadmap')} className="whitespace-nowrap flex items-center gap-3 px-5 py-3 bg-[#f8f9ff] dark:bg-blue-500/10 hover:bg-blue-50 dark:hover:bg-indigo-900/30 text-slate-900 dark:text-slate-100 rounded-[18px] text-[14px] font-[900] border border-transparent transition-all">
                            <span className="material-symbols-outlined text-[18px] text-blue-600 dark:text-blue-400">alt_route</span>
                            Update Roadmap
                        </button>
                        <button onClick={() => handleActionChip('Mock Interview')} className="whitespace-nowrap flex items-center gap-3 px-5 py-3 bg-[#f8f9ff] dark:bg-blue-500/10 hover:bg-blue-50 dark:hover:bg-indigo-900/30 text-slate-900 dark:text-slate-100 rounded-[18px] text-[14px] font-[900] border border-transparent transition-all">
                            <span className="material-symbols-outlined text-[18px] text-blue-600 dark:text-blue-400">chat_bubble</span>
                            Mock Interview
                        </button>
                    </div>
                    <div className="relative flex items-center">
                        <button className="absolute left-4 p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                            <span className="material-symbols-outlined text-[24px]">attachment</span>
                        </button>
                        <input
                            type="text"
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                            placeholder={`Ask anything to your career mentor, ${firstName}`}
                            className="w-full h-[64px] bg-[#f8f9ff] dark:bg-gray-700 border-none rounded-xl pl-16 pr-20 text-slate-900 dark:text-slate-100 text-[15px] font-bold placeholder:text-gray-400 outline-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/50 transition-all disabled:opacity-50"
                            disabled={isTyping}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && messageInput.trim() && !isTyping) {
                                    handleSendMessage(null);
                                }
                            }}
                        />
                        <button 
                            className={`absolute right-3 p-3.5 rounded-2xl transition-all flex items-center justify-center ${
                                messageInput.trim() && !isTyping
                                    ? 'bg-blue-600 dark:bg-indigo-600 text-white shadow-sm shadow-indigo-200 dark:shadow-none hover:scale-[1.05] hover:bg-blue-700' 
                                    : 'bg-gray-200 dark:bg-gray-600 text-white dark:text-gray-400 cursor-not-allowed'
                            }`}
                            disabled={isTyping || !messageInput.trim()}
                            onClick={() => handleSendMessage(null)}
                        >
                            <span className="material-symbols-outlined text-[24px]">send</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Right Panel: Insights & Progress */}
        <div className="w-full xl:w-[320px] shrink-0 flex flex-col gap-8 overflow-y-auto hidden lg:flex rounded-2xl pb-10 pt-20 pr-4 no-scrollbar">
            <div className="flex items-center justify-between shrink-0">
                <h2 className="font-[900] tracking-tight text-[#111827] dark:text-white text-[22px] whitespace-nowrap">Insights & Progress</h2>
            </div>
            
            {/* Scrollable Content Container */}
            <div className="flex flex-col gap-8">
                {/* Daily Goals */}
                <div className="bg-white dark:bg-slate-900 p-7 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="font-black text-slate-900 dark:text-white text-[15px] uppercase tracking-tight">Daily Career Tasks</h3>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black text-blue-600 bg-blue-50 dark:bg-blue-500/10 px-2 py-0.5 rounded">2/3 DONE</span>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 group">
                            <div className="size-5 bg-blue-600 rounded-full flex items-center justify-center shrink-0 shadow-sm">
                                <span className="material-symbols-outlined text-white text-[14px] font-black">check</span>
                            </div>
                            <div className="flex-1">
                                <span className="text-[13px] font-bold text-slate-400 line-through tracking-tight">Solve 2 DSA problems</span>
                                <span className="text-[9px] font-black text-blue-500 ml-2 uppercase tracking-widest">+5 XP</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 group">
                            <div className="size-5 bg-blue-600 rounded-full flex items-center justify-center shrink-0 shadow-sm">
                                <span className="material-symbols-outlined text-white text-[14px] font-black">check</span>
                            </div>
                            <div className="flex-1">
                                <span className="text-[13px] font-bold text-slate-400 line-through tracking-tight">Read system design article</span>
                                <span className="text-[9px] font-black text-blue-500 ml-2 uppercase tracking-widest">+3 XP</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 group cursor-pointer hover:translate-x-1 transition-transform">
                            <div className="size-5 rounded-full border-2 border-slate-200 dark:border-slate-700 shrink-0 bg-white dark:bg-slate-900 group-hover:border-blue-500 transition-colors"></div>
                            <div className="flex-1">
                                <span className="text-[13px] font-bold text-slate-900 dark:text-white tracking-tight">Update resume project section</span>
                                <span className="text-[9px] font-black text-orange-500 ml-2 uppercase tracking-widest">+10 XP</span>
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 pt-6 border-t border-slate-50 dark:border-slate-800 flex justify-between items-center">
                        <span className="text-[11px] font-bold text-slate-500 uppercase">Total Rewards</span>
                        <div className="flex items-center gap-1.5 text-blue-600 font-black text-[14px]">
                            <span className="material-symbols-outlined text-[18px]">workspace_premium</span>
                            1,240 pts
                        </div>
                    </div>
                </div>

                {/* Weekly Activity (Categorized) */}
                <div className="bg-white dark:bg-slate-900 p-7 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
                    <div className="mb-8">
                        <h3 className="font-black text-slate-900 dark:text-white text-[15px] uppercase mb-1">Weekly Activity</h3>
                        <p className="text-[11px] text-slate-500 font-medium">Growth balanced across 4 categories</p>
                    </div>
                    <div className="h-[120px] flex items-end justify-between gap-1.5 px-1">
                        <div className="flex-1 bg-emerald-500/80 rounded-t-lg h-[40%] transition-all hover:h-[45%] relative group/bar" title="Coding">
                            <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[9px] px-2 py-1 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity">Coding</span>
                        </div>
                        <div className="flex-1 bg-blue-500/80 rounded-t-lg h-[60%] transition-all hover:h-[65%] relative group/bar" title="Projects">
                            <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[9px] px-2 py-1 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity">Projects</span>
                        </div>
                        <div className="flex-1 bg-blue-600 rounded-t-lg h-[100%] transition-all hover:h-[105%] relative group/bar" title="Learning">
                            <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[9px] px-2 py-1 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity">Learning</span>
                        </div>
                        <div className="flex-1 bg-purple-500/80 rounded-t-lg h-[50%] transition-all hover:h-[55%] relative group/bar" title="Applications">
                            <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[9px] px-2 py-1 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity">Apps</span>
                        </div>
                        <div className="flex-1 bg-blue-500/20 rounded-t-lg h-[75%] transition-all hover:h-[80%]"></div>
                        <div className="flex-1 bg-blue-500/10 rounded-t-lg h-[35%] transition-all hover:h-[40%]"></div>
                        <div className="flex-1 bg-blue-500/20 rounded-t-lg h-[55%] transition-all hover:h-[60%]"></div>
                    </div>
                    <div className="flex justify-between mt-4 px-1 pb-4 mb-4 border-b border-slate-50 dark:border-slate-800">
                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                            <span key={i} className="text-[10px] font-bold text-slate-500 dark:text-slate-400 w-[14px] text-center">{day}</span>
                        ))}
                    </div>
                    <div className="grid grid-cols-2 gap-y-2">
                        {[
                            { color: 'bg-emerald-500', label: 'Coding' },
                            { color: 'bg-blue-500', label: 'Projects' },
                            { color: 'bg-indigo-500', label: 'Learning' },
                            { color: 'bg-purple-500', label: 'Applications' }
                        ].map(cat => (
                            <div key={cat.label} className="flex items-center gap-2">
                                <div className={`size-2 rounded-full ${cat.color}`}></div>
                                <span className="text-[10px] font-bold text-slate-500">{cat.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* WhatsApp Sync Card (Value-Driven) */}
                <div className="bg-indigo-600 rounded-3xl p-8 shadow-xl relative overflow-hidden group shrink-0">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full -mr-16 -mt-16"></div>
                    
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 text-white mb-6">
                            <span className="material-symbols-outlined text-[28px] font-light">chat</span>
                            <h3 className="font-bold text-[18px] tracking-tight">AI 24/7 Companion</h3>
                        </div>
                        
                        <ul className="space-y-3 mb-8">
                            {[
                                'Daily career growth tasks',
                                'Real-time internship alerts',
                                'Instant resume optimization tips'
                            ].map(benefit => (
                                <li key={benefit} className="flex items-start gap-2 text-white/80 text-[13px] font-medium">
                                    <span className="material-symbols-outlined text-[16px] text-emerald-400 mt-0.5">check_circle</span>
                                    {benefit}
                                </li>
                            ))}
                        </ul>
                        
                        <button className="w-full py-4 bg-white text-indigo-600 font-black rounded-2xl shadow-lg hover:bg-indigo-50 transition-all text-[15px] flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined">sync</span>
                            Connect WhatsApp
                        </button>
                    </div>
                </div>

                {/* Bottom Quote */}
                <div className="mt-4 mb-4 text-center pb-10">
                    <p className="text-slate-400 dark:text-slate-600 text-[12px] italic font-medium leading-relaxed opacity-60">
                        "The best way to predict the future is to create it."
                    </p>
                </div>
            </div>
        </div>
    </div>
);
};

export default AiHelper;
