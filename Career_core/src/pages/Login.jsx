import { useNavigate } from 'react-router-dom';

import { signInWithPopup, getAdditionalUserInfo } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';

const Login = () => {
    const navigate = useNavigate();

    const handleGoogleAuth = async (isSignUp) => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const { isNewUser } = getAdditionalUserInfo(result);
            const user = result.user;
            console.log(`User signed in: `, user);

            if (isSignUp || isNewUser) {
                navigate('/onboarding/step-1');
            } else {
                navigate('/dashboard');
            }
        } catch (error) {
            console.error("Error signing in with Google: ", error);
            alert("Failed to sign in. Please check your configuration.");
        }
    };

    return (
        <div className="bg-background-dark text-white min-h-screen flex flex-col relative overflow-hidden font-display antialiased selection:bg-primary/30 selection:text-white">
            {/* Background Elements */}
            <div className="absolute inset-0 z-0 mesh-gradient"></div>
            <div className="absolute top-[40%] left-[50%] -translate-x-1/2 -translate-y-1/2 size-[800px] bg-primary/10 rounded-full blur-[140px] pointer-events-none z-0"></div>

            {/* Floating Elements with slightly different animations/positions for variety */}
            <div className="absolute inset-0 z-20 pointer-events-none">
                <FloatingBadge
                    icon="school"
                    text="Academic"
                    delay="0.5s"
                    position="top-[12%] left-[20%]"
                />
                <FloatingBadge
                    icon="lightbulb"
                    text="Innovation"
                    delay="2.5s"
                    position="top-[28%] right-[18%]"
                />
                <FloatingBadge
                    icon="book"
                    text="Knowledge"
                    delay="1.8s"
                    position="bottom-[25%] left-[15%]"
                />
                <FloatingBadge
                    icon="trophy"
                    text="Milestones"
                    delay="4.2s"
                    position="bottom-[35%] right-[12%]"
                />
                <FloatingBadge
                    icon="star"
                    text="Excellence"
                    delay="5.5s"
                    position="top-[55%] left-[8%]"
                />
            </div>

            {/* Main Layout */}
            <div className="layout-container flex h-full grow flex-col relative z-30">
                {/* Header */}
                <header className="flex items-center justify-between whitespace-nowrap px-6 md:px-10 py-8 w-full">
                    <div className="flex items-center gap-3 text-white">
                        <div className="size-10 md:size-11 bg-primary rounded-xl flex items-center justify-center shadow-xl shadow-primary/30 ring-1 ring-white/10">
                            <span className="material-symbols-outlined text-white text-[24px] md:text-[26px]">hub</span>
                        </div>
                        <h2 className="text-white text-xl md:text-2xl font-black leading-tight tracking-tighter font-display uppercase drop-shadow-lg">CareerHub</h2>
                    </div>
                    <div className="hidden md:flex gap-4">
                        <button className="flex min-w-[120px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-11 px-6 bg-white/5 border border-white/10 text-white text-sm font-bold hover:bg-white/10 transition-all backdrop-blur-md">
                            <span>Universities</span>
                        </button>
                        <button className="flex min-w-[120px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-11 px-6 bg-white text-background-dark text-sm font-black hover:bg-indigo-50 transition-all shadow-xl shadow-white/5">
                            <span>About Hub</span>
                        </button>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 flex flex-col items-center justify-center px-4 relative">
                    {/* Concentric Circles Background */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] aspect-square rounded-full border border-indigo-500/10 pointer-events-none"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[760px] aspect-square rounded-full border border-cyan-500/15 pointer-events-none"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] aspect-square rounded-full border border-indigo-500/20 pointer-events-none"></div>

                    {/* Central Glass Portal Card */}
                    <div className="glass-portal rounded-full w-full max-w-[680px] aspect-square flex flex-col items-center justify-center text-center px-8 md:px-16 py-16 relative group transition-all duration-500 hover:shadow-[0_0_120px_rgba(37,19,236,0.3)]">
                        <div className="absolute inset-4 rounded-full border border-white/5 pointer-events-none"></div>

                        <div className="mb-8 md:mb-10 relative z-10">
                            <h1 className="text-white tracking-tighter text-[40px] md:text-[56px] font-[900] leading-[1.05] mb-6 drop-shadow-xl bg-gradient-to-b from-white to-white/90 bg-clip-text text-transparent">
                                Build your future with<br />students like you.
                            </h1>
                            <div className="flex justify-center">
                                <div className="flex h-9 items-center gap-x-3 rounded-full bg-primary/40 px-6 border border-primary/60 backdrop-blur-md shadow-lg shadow-primary/20 hover:bg-primary/50 transition-colors cursor-default">
                                    <span className="material-symbols-outlined text-white text-[20px] fill-[1]">verified</span>
                                    <p className="text-white text-[11px] uppercase tracking-[0.25em] font-black">All Domains Navigator</p>
                                </div>
                            </div>
                        </div>

                        {/* Stats Section */}
                        <div className="w-full max-w-[380px] mb-10 text-left relative z-10">
                            <div className="flex flex-col gap-3.5 group/stats">
                                <div className="flex justify-between items-end px-1">
                                    <div>
                                        <p className="text-white/70 text-[11px] font-black uppercase tracking-[0.2em] mb-1 group-hover/stats:text-white/90 transition-colors">Global Achievement Index</p>
                                        <p className="text-white text-xs font-bold opacity-80">Rising across all student domains</p>
                                    </div>
                                    <p className="text-indigo-400 text-3xl font-[900] drop-shadow-[0_0_15px_rgba(129,140,248,0.6)]">94%</p>
                                </div>
                                <div className="h-4 w-full bg-black/40 rounded-full overflow-hidden p-[3px] shadow-inner ring-1 ring-white/10">
                                    <div className="h-full bg-gradient-to-r from-primary via-indigo-500 to-cyan-400 rounded-full shadow-[0_0_20px_rgba(37,19,236,1)] relative w-[94%]">
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-full -translate-x-full animate-[shimmer_2s_infinite]"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-4 w-full max-w-[400px] relative z-50">
                            <button
                                onClick={() => handleGoogleAuth(true)}
                                className="group flex items-center justify-center gap-4 w-full h-14 rounded-2xl bg-white text-background-dark text-lg font-[800] hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all transform hover:-translate-y-1 active:scale-[0.98] cursor-pointer relative"
                            >
                                <svg className="size-5 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path>
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                                </svg>
                                <span>Sign Up with Google</span>
                            </button>
                            <button
                                onClick={() => handleGoogleAuth(false)}
                                className="group flex items-center justify-center gap-4 w-full h-14 rounded-2xl bg-white/10 text-white text-lg font-[800] border border-white/20 hover:bg-white/20 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] transition-all transform hover:-translate-y-1 active:scale-[0.98] cursor-pointer relative"
                            >
                                <svg className="size-5 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path>
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                                </svg>
                                <span>Login with Google</span>
                            </button>
                        </div>

                        {/* Social Proof */}
                        <div className="mt-12 flex flex-col items-center gap-3 relative z-10">
                            <div className="flex -space-x-4">
                                {[1, 2, 3].map((_, i) => (
                                    <div key={i} className="h-10 w-10 rounded-full ring-2 ring-background-dark bg-white/10 backdrop-blur-sm flex items-center justify-center overflow-hidden">
                                        {/* Placeholders for avatars - using colored gradients for now */}
                                        <div className={`w-full h-full bg-gradient-to-tr ${i === 0 ? 'from-purple-500 to-indigo-500' : i === 1 ? 'from-blue-500 to-cyan-500' : 'from-pink-500 to-rose-500'}`}></div>
                                    </div>
                                ))}
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 ring-2 ring-background-dark text-[10px] font-black tracking-tighter text-white shadow-lg shadow-indigo-500/50">
                                    +24k
                                </div>
                            </div>
                            <p className="text-white/60 text-sm font-bold tracking-tight">Empowering 24,000+ students globally</p>
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="p-6 md:p-10 flex flex-col md:flex-row justify-between items-center max-w-[1440px] mx-auto w-full gap-6">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-white/30 text-[20px]">hub</span>
                        <div className="text-white/40 text-[10px] tracking-[0.3em] uppercase font-black">
                            © 2024 Universal Student Hub
                        </div>
                    </div>
                    <div className="flex gap-6 md:gap-8 flex-wrap justify-center">
                        {['Privacy Portal', 'Terms of Hub', 'Community Ethics'].map((item) => (
                            <a key={item} className="text-white/40 text-[10px] md:text-[11px] tracking-widest uppercase font-black hover:text-white transition-colors relative group" href="#">
                                {item}
                                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-white transition-all group-hover:w-full"></span>
                            </a>
                        ))}
                    </div>
                </footer>
            </div>

            {/* Ambient Background Glows */}
            <div className="absolute -bottom-[10%] -left-[10%] size-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none z-0 mix-blend-screen"></div>
            <div className="absolute -top-[15%] -right-[15%] size-[600px] bg-cyan-500/5 rounded-full blur-[150px] pointer-events-none z-0 mix-blend-screen"></div>
        </div>
    );
};

// Helper Component for Floating Badges
const FloatingBadge = ({ icon, text, delay, position }) => (
    <div className={`absolute ${position} floating z-20`} style={{ animationDelay: delay }}>
        <div className="flex h-12 shrink-0 items-center justify-center gap-x-3 rounded-full bg-white/5 backdrop-blur-xl px-6 border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] hover:bg-white/10 transition-colors cursor-default group">
            <span className="material-symbols-outlined text-white/90 text-[22px] group-hover:text-primary transition-colors duration-300">{icon}</span>
            <p className="text-white/90 text-sm font-bold tracking-wide group-hover:text-white transition-colors">{text}</p>
        </div>
    </div>
);

export default Login;
