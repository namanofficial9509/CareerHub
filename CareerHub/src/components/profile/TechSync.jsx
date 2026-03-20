import { useAuth } from '../../context/AuthContext';

const TechSync = () => {
    const { user, userData } = useAuth();
    
    // Generate a placeholder handle based on the user's name
    const getUserHandle = () => {
        const name = userData?.onboarding?.displayName || userData?.fullName || user?.displayName || 'user';
        return name.toLowerCase().replace(/\s+/g, '-');
    };
    const handle = getUserHandle();

    return (
        <div className="space-y-8">
            {/* Live Stats Showcase */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#24292e] text-white p-5 rounded-2xl relative overflow-hidden group">
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-3 opacity-80">
                            <svg viewBox="0 0 24 24" className="size-5 fill-white"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.041-1.416-4.041-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"></path></svg>
                            <span className="text-xs font-bold tracking-wider uppercase">GitHub</span>
                        </div>
                        <p className="text-3xl font-[900] tracking-tight mb-0.5">342</p>
                        <p className="text-xs font-medium text-white/60">Contributions this year</p>

                        <div className="mt-4 flex gap-1">
                            {[...Array(7)].map((_, i) => (
                                <div key={i} className={`h-2 w-2 rounded-sm ${[0, 3, 4, 6].includes(i) ? 'bg-green-500' : 'bg-white/20'}`}></div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="bg-[#ffa116] text-white p-5 rounded-2xl relative overflow-hidden group">
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-3 opacity-90">
                            <span className="material-symbols-outlined text-[20px]">code</span>
                            <span className="text-xs font-black tracking-wider uppercase">LeetCode</span>
                        </div>
                        <p className="text-3xl font-[900] tracking-tight mb-0.5">542</p>
                        <p className="text-xs font-black text-white/80">Problems Solved</p>

                        <div className="mt-4 flex gap-2 text-[10px] font-bold">
                            <div className="bg-black/20 px-2 py-1 rounded">E: 200</div>
                            <div className="bg-black/20 px-2 py-1 rounded">M: 300</div>
                            <div className="bg-black/20 px-2 py-1 rounded">H: 42</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Link Inputs */}
            <div>
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-gray-400">link</span>
                    Profile Links
                </h3>
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-xl bg-[#0077b5] flex items-center justify-center text-white shrink-0">
                            <span className="font-bold text-xl">in</span>
                        </div>
                        <input type="text" value={`linkedin.com/in/${handle}`} readOnly className="flex-1 h-10 border-b border-gray-200 text-sm font-medium text-gray-600 focus:outline-none focus:border-primary bg-transparent" />
                        <button className="text-xs font-bold text-primary">Edit</button>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-xl bg-gray-900 flex items-center justify-center text-white shrink-0">
                            <svg viewBox="0 0 24 24" className="size-5 fill-white"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.041-1.416-4.041-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"></path></svg>
                        </div>
                        <input type="text" value={`github.com/${handle}`} readOnly className="flex-1 h-10 border-b border-gray-200 text-sm font-medium text-gray-600 focus:outline-none focus:border-primary bg-transparent" />
                        <div className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-0.5 rounded text-[10px] font-bold">
                            <span className="size-1.5 bg-green-500 rounded-full animate-pulse"></span>
                            Synced
                        </div>
                    </div>
                </div>
            </div>

            <button className="w-full h-12 bg-gray-900 text-white font-bold rounded-xl shadow-lg shadow-gray-900/20 hover:bg-black transition-all flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-[18px]">sync</span>
                Sync All Platforms
            </button>
        </div>
    );
};

export default TechSync;
