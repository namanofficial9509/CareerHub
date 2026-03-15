import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getGenerativeModel } from 'firebase/ai';
import { ai } from '../../lib/firebase';

const AiHelper = () => {
    const { user, userData } = useAuth();
    const firstName = userData?.onboarding?.displayName?.split(' ')[0] 
        || userData?.fullName?.split(' ')[0] 
        || user?.displayName?.split(' ')[0] 
        || 'User';
    const avatarSeed = firstName;
    const course = userData?.onboarding?.course || 'Computer Science';

    const [messageInput, setMessageInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    
    // Initial greeting message
    const [messages, setMessages] = useState([
        {
            role: 'ai',
            content: `I've analyzed your profile, ${firstName}. ${course ? `As a ${course} student, ` : ''}What career goals or technical skills would you like to focus on today?`,
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
            
            // Generate full chat history for context
            const historyText = newMessages.map(m => `**${m.role === 'user' ? 'User' : 'Assistant'}**: ${m.content}`).join('\n\n');
            const prompt = `You are a helpful and encouraging career mentor for a user named ${firstName}. Be concise, professional, and actionable.\n\nHere is our conversation history:\n${historyText}\n\nPlease respond to my last message. Do not output your own speaker label.`;
            
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
            <div className="w-full xl:w-[250px] shrink-0 flex flex-col gap-6 bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm overflow-y-auto hidden lg:flex transition-colors">
                <button className="h-12 w-full rounded-xl border border-gray-200 dark:border-gray-600 hover:border-primary/50 text-gray-700 dark:text-gray-200 font-bold flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm">
                    <span className="material-symbols-outlined text-[20px]">add</span>
                    New Mentorship
                </button>

                <div>
                    <h3 className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4 px-2">Recent Mentorship</h3>
                    <div className="space-y-2">
                        <button className="w-full flex items-center gap-3 px-4 py-3 bg-white dark:bg-gray-800 border border-primary/20 dark:border-indigo-500/30 text-primary dark:text-indigo-400 rounded-2xl shadow-sm transition-all shadow-primary/5 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-primary/5 dark:bg-indigo-500/10 group-hover:bg-primary/10 dark:group-hover:bg-indigo-500/20 transition-colors"></div>
                            <span className="material-symbols-outlined text-[20px] relative z-10">route</span>
                            <span className="text-sm font-bold relative z-10">Career Path Update</span>
                        </button>
                        <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-300 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all font-medium">
                            <span className="material-symbols-outlined text-[20px] text-gray-400 dark:text-gray-500">description</span>
                            <span className="text-sm">Resume Feedback</span>
                        </button>
                        <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-300 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all font-medium">
                            <span className="material-symbols-outlined text-[20px] text-gray-400 dark:text-gray-500">work</span>
                            <span className="text-sm">Internship Search</span>
                        </button>
                    </div>
                </div>

                <div className="mt-auto">
                    <button className="flex items-center gap-3 px-4 py-3 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white w-full rounded-2xl transition-colors font-medium">
                        <span className="material-symbols-outlined text-[20px]">help</span>
                        <span className="text-sm">Help Center</span>
                    </button>
                </div>
            </div>

            {/* Middle Panel: Chat Interface */}
            <div className="flex-1 flex flex-col bg-white dark:bg-gray-800 rounded-[32px] border border-gray-100 dark:border-gray-700 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.05)] overflow-hidden relative transition-colors">
                {/* Chat Header */}
                <div className="h-20 border-b border-gray-50 dark:border-gray-700 flex items-center px-8 justify-between shrink-0 bg-white/50 dark:bg-gray-800/50 backdrop-blur-md z-10">
                    <div className="flex items-center gap-4">
                        <div className="size-10 rounded-full border border-gray-100 dark:border-gray-700 overflow-hidden shrink-0 shadow-sm">
                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=CareerAI&backgroundColor=ffdfbf`} alt="Mentor" className="w-full h-full object-cover" />
                        </div>
                        <h2 className="font-[900] text-[#111827] dark:text-white text-[17px] tracking-tight">Ready to level up, {firstName}?</h2>
                    </div>
                    <div className="flex items-center gap-3 text-gray-400 dark:text-gray-500">
                        <button className="p-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white rounded-xl transition-all">
                            <span className="material-symbols-outlined text-[22px]">search</span>
                        </button>
                        <button className="p-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white rounded-xl transition-all relative">
                            <span className="material-symbols-outlined text-[22px]">notifications</span>
                            <div className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                        </button>
                    </div>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-8 space-y-10 scroll-smooth no-scrollbar">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex gap-5 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
                            {/* Avatar */}
                            {msg.role === 'ai' ? (
                                <div className="size-10 rounded-full bg-[#111827] flex items-center justify-center shrink-0 shadow-lg shadow-gray-200 text-white font-[900] text-[13px] uppercase tracking-tighter">
                                    AH
                                </div>
                            ) : (
                                <div className="size-10 rounded-full bg-gradient-to-br from-amber-200 to-orange-300 shrink-0 overflow-hidden ring-4 ring-white shadow-md">
                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}&backgroundColor=ffdfbf`} alt="You" className="w-full h-full object-cover" />
                                </div>
                            )}
                            
                            {/* Message Bubble */}
                            <div className={`space-y-1.5 ${msg.role === 'user' ? 'min-w-[40%]' : ''}`}>
                                <div className={`p-5 rounded-[24px] leading-relaxed text-[15px] font-medium shadow-sm border ${
                                    msg.role === 'ai' 
                                        ? 'bg-[#f8f9ff] dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-tl-sm border-indigo-50/50 dark:border-gray-600' 
                                        : 'bg-[#2513ec] dark:bg-indigo-600 text-white rounded-tr-sm border-[#2513ec] dark:border-indigo-600 shadow-indigo-200 dark:shadow-none'
                                }`}>
                                    {msg.content}
                                    
                                    {msg.role === 'ai' && idx === 0 && (
                                        <div className="flex flex-col gap-2 mt-6">
                                            <button onClick={() => handleActionChip('Update Roadmap')} className="flex items-center gap-3 px-5 py-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-600 rounded-2xl text-[14px] font-[900] text-gray-900 dark:text-white shadow-sm hover:shadow-md hover:border-indigo-100 dark:hover:border-indigo-500 transition-all group w-fit">
                                                <span className="material-symbols-outlined text-[18px] text-gray-400 dark:text-gray-500 group-hover:text-[#2513ec] dark:group-hover:text-indigo-400">alt_route</span>
                                                Update Roadmap
                                            </button>
                                            <button onClick={() => handleActionChip('Show Cloud Resources')} className="flex items-center gap-3 px-5 py-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-600 rounded-2xl text-[14px] font-[900] text-gray-900 dark:text-white shadow-sm hover:shadow-md hover:border-indigo-100 dark:hover:border-indigo-500 transition-all group w-fit">
                                                <span className="material-symbols-outlined text-[18px] text-gray-400 dark:text-gray-500 group-hover:text-[#2513ec] dark:group-hover:text-indigo-400">cloud</span>
                                                Show Cloud Resources
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <p className={`text-[10px] text-gray-400 dark:text-gray-500 font-[900] uppercase tracking-widest pt-1 ${
                                    msg.role === 'user' ? 'text-right pr-2' : 'pl-2'
                                }`}>
                                    {msg.timestamp === 'DELIVERED • 10:24 AM' ? msg.timestamp : `DELIVERED • ${msg.timestamp}`}
                                </p>
                            </div>
                        </div>
                    ))}

                {/* AI Typing Indicator */}
                {isTyping && (
                    <div className="flex gap-4 max-w-[85%] px-8 mb-10">
                        <div className="size-10 rounded-full bg-[#111827] flex items-center justify-center shrink-0 shadow-lg shadow-gray-200 dark:shadow-none text-white font-[900] text-[13px] uppercase tracking-tighter">
                            AH
                        </div>
                        <div className="bg-[#f8f9ff] dark:bg-gray-700 p-5 rounded-[24px] rounded-tl-sm border border-indigo-50/50 dark:border-gray-600 flex items-center gap-2 w-fit">
                            <div className="size-2 bg-indigo-200 dark:bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="size-2 bg-indigo-300 dark:bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="size-2 bg-indigo-400 dark:bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-8 pb-10 border-t border-gray-50 dark:border-gray-700 bg-white dark:bg-gray-800 transition-colors">
                <div className="flex gap-4 mb-6 px-1 overflow-x-auto pb-1 no-scrollbar shrink-0">
                    <button onClick={() => handleActionChip('Fix Resume')} className="whitespace-nowrap flex items-center gap-3 px-5 py-3 bg-[#f8f9ff] dark:bg-indigo-900/10 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-gray-900 dark:text-white rounded-[18px] text-[14px] font-[900] border border-transparent transition-all">
                        <span className="material-symbols-outlined text-[18px] text-[#2513ec] dark:text-indigo-400">edit_document</span>
                        Fix Resume
                    </button>
                    <button onClick={() => handleActionChip('Update Roadmap')} className="whitespace-nowrap flex items-center gap-3 px-5 py-3 bg-[#f8f9ff] dark:bg-indigo-900/10 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-gray-900 dark:text-white rounded-[18px] text-[14px] font-[900] border border-transparent transition-all">
                        <span className="material-symbols-outlined text-[18px] text-[#2513ec] dark:text-indigo-400">alt_route</span>
                        Update Roadmap
                    </button>
                    <button onClick={() => handleActionChip('Mock Interview')} className="whitespace-nowrap flex items-center gap-3 px-5 py-3 bg-[#f8f9ff] dark:bg-indigo-900/10 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-gray-900 dark:text-white rounded-[18px] text-[14px] font-[900] border border-transparent transition-all">
                        <span className="material-symbols-outlined text-[18px] text-[#2513ec] dark:text-indigo-400">chat_bubble</span>
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
                        className="w-full h-[64px] bg-[#f8f9ff] dark:bg-gray-700 border-none rounded-[24px] pl-16 pr-20 text-gray-900 dark:text-white text-[15px] font-bold placeholder:text-gray-400 outline-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/50 transition-all disabled:opacity-50"
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
                                ? 'bg-[#2513ec] dark:bg-indigo-600 text-white shadow-xl shadow-indigo-200 dark:shadow-none hover:scale-[1.05] hover:bg-indigo-700' 
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
        <div className="w-full xl:w-[320px] shrink-0 flex flex-col gap-8 overflow-y-auto hidden lg:flex rounded-[32px] pb-10 pt-20 pr-4 no-scrollbar">
            <div className="flex items-center justify-between shrink-0">
                <h2 className="font-[900] tracking-tight text-[#111827] dark:text-white text-[22px] whitespace-nowrap">Insights & Progress</h2>
            </div>
            
            {/* Scrollable Content Container */}
            <div className="flex flex-col gap-8">
                {/* Daily Goals */}
                <div className="bg-white dark:bg-gray-800 p-7 rounded-[32px] border border-gray-100 dark:border-gray-700 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.08)] dark:shadow-none relative group transition-colors">
                    <div className="absolute top-0 left-0 w-full h-[6px] bg-[#2513ec]/10 dark:bg-indigo-500/20"></div>
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="font-[900] text-gray-900 dark:text-white text-[15px]">Daily Goals</h3>
                        <span className="px-3 py-1 rounded-full bg-[#2513ec] dark:bg-indigo-600 text-white text-[10px] font-[900] uppercase tracking-wider shadow-lg shadow-indigo-100/50 dark:shadow-none">2/3 DONE</span>
                    </div>
                    <div className="space-y-5">
                        <div className="flex items-center gap-4">
                            <div className="size-5 bg-[#2513ec] dark:bg-indigo-600 rounded-full flex items-center justify-center shrink-0 shadow-lg shadow-indigo-100 dark:shadow-none">
                                <span className="material-symbols-outlined text-white text-[14px] font-[900]">check</span>
                            </div>
                            <span className="text-[14px] font-bold text-gray-400 dark:text-gray-500 line-through tracking-tight">Complete 1 LeetCode challenge</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="size-5 bg-[#2513ec] dark:bg-indigo-600 rounded-full flex items-center justify-center shrink-0 shadow-lg shadow-indigo-100 dark:shadow-none">
                                <span className="material-symbols-outlined text-white text-[14px] font-[900]">check</span>
                            </div>
                            <span className="text-[14px] font-bold text-gray-400 dark:text-gray-500 line-through tracking-tight">Review AWS Lambda Docs</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="size-5 rounded-full border-2 border-gray-200 dark:border-gray-600 shrink-0 bg-gray-50/50 dark:bg-gray-700"></div>
                            <span className="text-[14px] font-bold text-gray-900 dark:text-white tracking-tight">Update LinkedIn Experience</span>
                        </div>
                    </div>
                </div>

                {/* Weekly Activity */}
                <div className="bg-white dark:bg-gray-800 p-7 rounded-[32px] border border-gray-100 dark:border-gray-700 shadow-sm transition-colors">
                    <div className="flex justify-between items-center mb-10">
                        <h3 className="font-[900] text-gray-900 dark:text-white text-[15px]">Weekly Activity</h3>
                        <span className="text-emerald-500 font-[900] text-[12px] flex items-center gap-1.5 uppercase tracking-wide">
                            <span className="material-symbols-outlined text-[16px]">trending_up</span>
                            15% more
                        </span>
                    </div>
                    <div className="h-[120px] flex items-end justify-between gap-2.5 px-1">
                        <div className="flex-1 bg-gray-50 dark:bg-gray-700 rounded-t-lg h-[40%]"></div>
                        <div className="flex-1 bg-gray-50 dark:bg-gray-700 rounded-t-lg h-[60%]"></div>
                        <div className="flex-1 bg-[#2513ec] dark:bg-indigo-500 rounded-t-lg h-[100%] shadow-[0_4px_15px_rgba(37,19,236,0.2)] dark:shadow-none"></div>
                        <div className="flex-1 bg-gray-50 dark:bg-gray-700 rounded-t-lg h-[50%]"></div>
                        <div className="flex-1 bg-indigo-400 dark:bg-indigo-800 rounded-t-lg h-[75%]"></div>
                        <div className="flex-1 bg-gray-50 dark:bg-gray-700 rounded-t-lg h-[35%]"></div>
                        <div className="flex-1 bg-gray-50 dark:bg-gray-700 rounded-t-lg h-[55%]"></div>
                    </div>
                    <div className="flex justify-between mt-4 px-1">
                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                            <span key={i} className="text-[10px] font-bold text-gray-400 dark:text-gray-500 w-[14px] text-center">{day}</span>
                        ))}
                    </div>
                </div>

                {/* WhatsApp Sync Card */}
                <div className="bg-[#2513ec] rounded-[32px] p-8 shadow-xl relative overflow-hidden group shrink-0">
                    {/* Decorative Graphic in Top Right (Document with lines style) */}
                    <div className="absolute top-6 right-6 w-14 h-11 bg-white/10 rounded-xl border border-white/10 p-2 flex flex-col gap-1.5 opacity-40 group-hover:opacity-60 transition-opacity">
                        <div className="h-1.5 w-10 bg-white/40 rounded-full"></div>
                        <div className="h-1.5 w-8 bg-white/40 rounded-full"></div>
                        <div className="h-1.5 w-6 bg-white/40 rounded-full"></div>
                    </div>
                    
                    <div className="relative z-10 flex flex-col h-full">
                        <div className="flex items-center gap-3 text-white mb-8">
                            <span className="material-symbols-outlined text-[28px] font-light">sync</span>
                            <h3 className="font-bold text-[18px] tracking-tight">WhatsApp Sync</h3>
                        </div>
                        
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8 border border-white/10 min-h-[120px] flex flex-col justify-center">
                            <p className="text-[10px] text-white/50 font-bold uppercase tracking-[0.2em] mb-3">PREVIEW: MORNING BRIEFING</p>
                            <p className="text-white text-[15px] font-bold leading-relaxed italic">
                                "Good morning {firstName}! Today's goal: Review React Native Performance tips. Ready?"
                            </p>
                        </div>
                        
                        <button className="w-full py-4 bg-white text-[#2513ec] font-bold rounded-full shadow-lg hover:bg-gray-50 transition-all text-[15px] active:scale-95">
                            Sync WhatsApp
                        </button>
                    </div>
                </div>

                {/* Bottom Quote */}
                <div className="mt-4 mb-4 text-center">
                    <p className="text-gray-400 text-[12px] italic font-medium leading-relaxed opacity-60">
                        "The best way to predict the future is to create it."
                    </p>
                </div>
            </div>
        </div>
        </div>
    );
};

export default AiHelper;
