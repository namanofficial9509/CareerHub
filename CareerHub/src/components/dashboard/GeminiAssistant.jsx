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
import { getGenerativeModel } from 'firebase/ai';
import { ai } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';
import { generateAiContextSummary } from '../../lib/intelligenceEngine';

const GeminiAssistant = () => {
    const { userData } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', text: "Hi! I'm your AI Career Mentor. I've been tracking your progress in the Data Hub. How can I help you grow today?" }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [error, setError] = useState(null);
    const messagesEndRef = useRef(null);

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

        try {
            // Initialize the GenerativeModel instance
            const model = getGenerativeModel(ai, { model: 'gemini-1.5-flash', mode: 'prefer_in_cloud' });
            
            // Generate full chat history for context
            const history = newMessages.map(m => `**${m.role === 'user' ? 'User' : 'Assistant'}**: ${m.text}`).join('\n\n');
            const studentContext = generateAiContextSummary(userData);
            
            const prompt = `You are an expert AI Career Mentor. 
            
Here is the student's current profile and progress:
${studentContext}

Guidelines:
1. Be encouraging and proactive.
2. Reference their specific branch, projects, or skill level in your responses.
3. If they are 'Beginner', suggest foundational projects. If 'Advanced', suggest industry-level scaling.

Conversation History:
${history}

Please respond to the student's last message. Do not output your own speaker label.`;

            // Setup temporary message in UI for the response
            setMessages(prev => [...prev, { role: 'assistant', text: '' }]);
            
            const result = await model.generateContentStream(prompt);
            let fullResponse = '';
            
            for await (const chunk of result.stream) {
                const chunkText = chunk.text();
                fullResponse += chunkText;
                
                // Update the last message text as it streams in
                setMessages(prev => {
                    const latest = [...prev];
                    latest[latest.length - 1].text = fullResponse;
                    return latest;
                });
            }
        } catch (err) {
            console.error("AI Logic Error:", err);
            setError("Hmm, I couldn't connect to my brain. Please check your setup.");
            // Remove the empty message if there was an error
            setMessages(prev => prev.slice(0, prev.length - 1));
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <>
            {/* Floating Action Button (FAB) */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(true)}
                className={`fixed bottom-8 right-8 z-[9999] p-4 rounded-full shadow-lg transition-all duration-300 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
                    } bg-blue-600 text-white`}
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
                        className="fixed bottom-8 right-8 z-[9999] w-[400px] h-[600px] bg-white rounded-[2rem] shadow-2xl border border-gray-100 flex flex-col overflow-hidden font-sans"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 flex flex-col justify-between relative overflow-hidden">
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
                                                Online
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
                            <div className="flex items-center gap-2 bg-[#F8FAFC] p-2 rounded-2xl border border-gray-100 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
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
                                        ? 'bg-blue-600 text-white shadow-lg shadow-sm'
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
