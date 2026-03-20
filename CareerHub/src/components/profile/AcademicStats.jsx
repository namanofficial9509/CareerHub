const AcademicStats = () => {
    const semesters = [
        { sem: 'Sem 1', sgpa: 8.2, color: 'bg-indigo-300' },
        { sem: 'Sem 2', sgpa: 7.8, color: 'bg-indigo-300' },
        { sem: 'Sem 3', sgpa: 9.0, color: 'bg-indigo-500' },
        { sem: 'Sem 4', sgpa: 8.5, color: 'bg-indigo-400' },
        { sem: 'Sem 5', sgpa: 9.4, color: 'bg-indigo-600' },
        { sem: 'Sem 6', sgpa: 0, color: 'bg-gray-100', upcoming: true },
    ];

    return (
        <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-xl shadow-gray-200/40 hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-300">
            <h2 className="text-xl font-[900] text-gray-900 tracking-tight mb-8 flex items-center gap-3">
                <div className="size-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <span className="material-symbols-outlined text-[24px]">school</span>
                </div>
                Academic Excellence
            </h2>

            <div className="flex flex-col xl:flex-row gap-10">
                {/* CGPA Display */}
                <div className="flex-shrink-0 flex flex-col justify-between min-w-[140px]">
                    <div>
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-[11px] mb-2">Current CGPA</p>
                        <div className="flex items-baseline gap-1">
                            <span className="text-6xl md:text-7xl font-[900] text-gray-900 tracking-tighter">9.42</span>
                        </div>
                        <div className="inline-flex items-center gap-1.5 mt-2 bg-green-50 text-green-700 px-2.5 py-1 rounded-lg border border-green-100 mb-6">
                            <span className="material-symbols-outlined text-[16px] font-bold">trending_up</span>
                            <span className="text-xs font-bold">+0.12 increase</span>
                        </div>

                        {/* Additional Info */}
                        <div className="space-y-3 border-t border-gray-100 pt-4">
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">JEE Advanced Rank</p>
                                <p className="font-bold text-gray-900 text-sm">AIR 412 (Top 0.1%)</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Electives</p>
                                <p className="font-bold text-gray-900 text-sm">Deep Learning, OS</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Vertical Separator */}
                <div className="hidden xl:block w-px bg-gray-100"></div>

                {/* Semester Chart */}
                <div className="flex-1">
                    <div className="flex justify-between items-end mb-6">
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-[11px]">Performance Trend</p>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-1.5">
                                <span className="size-2 rounded-full bg-indigo-600"></span>
                                <span className="text-[10px] font-bold text-gray-400">Achieved</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="size-2 rounded-full bg-gray-200"></span>
                                <span className="text-[10px] font-bold text-gray-400">Projected</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-end gap-3 h-40 w-full px-2">
                        {semesters.map((sem, index) => (
                            <div key={index} className="flex-1 flex flex-col items-center gap-3 group cursor-pointer">
                                <div className="w-full relative flex items-end h-full bg-gray-50 rounded-xl overflow-hidden">
                                    <div
                                        className={`w-full rounded-xl transition-all duration-700 ease-out group-hover:bg-indigo-600 ${sem.color} relative`}
                                        style={{ height: sem.upcoming ? '4px' : `${(sem.sgpa / 10) * 100}%` }}
                                    ></div>
                                    {/* Tooltip */}
                                    {!sem.upcoming && (
                                        <div className="absolute bottom-full mb-2 bg-gray-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all -translate-y-2 group-hover:translate-y-0 shadow-xl z-10 whitespace-nowrap">
                                            SGPA: {sem.sgpa}
                                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                                        </div>
                                    )}
                                </div>
                                <p className={`text-[10px] font-bold uppercase tracking-wide transition-colors ${sem.upcoming ? 'text-gray-300' : 'text-gray-500 group-hover:text-indigo-600'}`}>{sem.sem}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AcademicStats;
