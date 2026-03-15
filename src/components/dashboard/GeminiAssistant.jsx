import { useState, useRef, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'motion/react';
import {
    Sparkles,
    X,
    Send,
    Mic,
    Bot,
    User,
    ChevronDown,
    Zap,
    AlertCircle
} from 'lucide-react';

const GeminiAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', text: "Hi! I'm your AI Career Mentor. I can help with study plans, project ideas, or quiz you on topics. How can I assist you today?" }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [error, setError] = useState(null);
    const messagesEndRef = useRef(null);

    // Mock response logic
    const generateResponse = (text) => {
        const lowerText = text.toLowerCase();
        if (lowerText.includes('resume')) return "I can certainly help with that! Upload your resume in the 'Resume Optimizer' tab, and I'll analyze it for ATS compatibility and suggest improvements.";
        if (lowerText.includes('project')) return "How about building a 'Task Management App' with drag-and-drop features, or a 'Weather Dashboard' using a public API? Both are great for your portfolio!";
        if (lowerText.includes('react')) return "React is all about components. Try explaining 'Props vs State' or 'useEffect' hooks to me to test your knowledge!";
        if (lowerText.includes('quiz')) return "Sure! Question 1: What is the virtual DOM in React and how does it improve performance?";
        return "That's an interesting topic! I'm currently in demo mode, but I can help you navigate the Student Hub or give general advice on your career path.";
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = input.trim();
        setInput('');
        setError(null);

        // Add user message to UI
        const newMessages = [...messages, { role: 'user', text: userMessage }];
        setMessages(newMessages);
        setIsTyping(true);

        // Simulate network delay
        setTimeout(() => {
            const responseText = generateResponse(userMessage);
            setMessages(prev => [...prev, { role: 'assistant', text: responseText }]);
            setIsTyping(false);
        }, 1500);
    };

    return (
        <>
            {/* Floating Action Button (FAB) */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(true)}
                className={`fixed bottom-8 right-8 z-50 p-4 rounded-full shadow-2xl transition-all duration-300 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
                    } bg-gradient-to-r from-blue-600 to-indigo-600 text-white`}
            >
                <Sparkles className="size-8 animate-pulse" />
                <div className="absolute top-0 right-0 size-3 bg-red-500 rounded-full border-2 border-white"></div>
            </motion.button>

            {/* Chat Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 100, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 100, scale: 0.9 }}
                        className="fixed bottom-8 right-8 z-50 w-[400px] h-[600px] bg-white rounded-[2rem] shadow-2xl border border-gray-100 flex flex-col overflow-hidden font-sans"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 flex flex-col justify-between relative overflow-hidden">
                            {/* Decor */}
                            <div className="absolute top-[-50%] right-[-10%] size-32 bg-white/10 blur-2xl rounded-full"></div>

                            <div className="flex justify-between items-start z-10">
                                <div className="flex items-center gap-3">
                                    <div className="size-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20">
                                        <Bot className="size-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-white">Gemini Mentor</h3>
                                        <div className="flex items-center gap-1.5">
                                            <span className="size-2 rounded-full bg-emerald-400 animate-pulse"></span>
                                            <span className="text-xs font-medium text-blue-100">
                                                Online • Demo Mode
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-colors">
                                    <X className="size-6" />
                                </button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50">
                            {messages.map((msg, idx) => (
                                <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                    <div className={`size-8 rounded-full shrink-0 flex items-center justify-center ${msg.role === 'user' ? 'bg-gray-200' : 'bg-blue-100 text-blue-600'}`}>
                                        {msg.role === 'user' ? <User className="size-4 text-gray-500" /> : <Sparkles className="size-4" />}
                                    </div>
                                    <div className={`max-w-[80%] rounded-2xl p-4 text-sm font-medium leading-relaxed ${msg.role === 'user'
                                        ? 'bg-gray-900 text-white rounded-tr-none'
                                        : 'bg-white border border-gray-100 text-gray-700 shadow-sm rounded-tl-none'
                                        }`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}

                            {isTyping && (
                                <div className="flex gap-3">
                                    <div className="size-8 rounded-full shrink-0 bg-blue-100 text-blue-600 flex items-center justify-center">
                                        <Sparkles className="size-4" />
                                    </div>
                                    <div className="bg-white border border-gray-100 rounded-2xl p-4 rounded-tl-none shadow-sm flex gap-1">
                                        <span className="size-2 bg-gray-400 rounded-full animate-bounce"></span>
                                        <span className="size-2 bg-gray-400 rounded-full animate-bounce delay-75"></span>
                                        <span className="size-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                                    </div>
                                </div>
                            )}

                            {error && (
                                <div className="flex justify-center px-6">
                                    <div className="bg-red-50 text-red-600 text-xs px-3 py-2 rounded-xl flex items-start gap-2 border border-red-100 max-w-full overflow-hidden text-left">
                                        <AlertCircle size={14} className="shrink-0 mt-0.5" />
                                        <span className="break-all">{error}</span>
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Suggestions Chips */}
                        <div className="px-6 py-2 flex gap-2 overflow-x-auto no-scrollbar">
                            {['Improve my resume', 'React Project Ideas', 'Quiz me on JS'].map((chip, i) => (
                                <button
                                    key={i}
                                    onClick={() => setInput(chip)}
                                    // Hack to trigger send immediately after state update would require useEffect or ref, 
                                    // keeping it simple for now: user taps, it populates input, then they tap send.
                                    // Or better: call handleSend with the chip text directly if we refactor.
                                    // For now just populate:
                                    className="whitespace-nowrap px-3 py-1.5 bg-white border border-blue-100 text-blue-600 text-xs font-bold rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-1 shadow-sm"
                                >
                                    <Zap className="size-3" /> {chip}
                                </button>
                            ))}
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-white border-t border-gray-100">
                            <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-2xl border border-gray-100 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
                                <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                                    <Mic className="size-5" />
                                </button>
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Ask Gemini about your roadmap..."
                                    className="flex-1 bg-transparent border-none outline-none text-sm font-medium text-gray-800 placeholder:text-gray-400"
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={isTyping || !input.trim()}
                                    className={`p-2 rounded-xl transition-all ${input.trim() && !isTyping
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                        }`}
                                >
                                    <Send className="size-4" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default GeminiAssistant;
