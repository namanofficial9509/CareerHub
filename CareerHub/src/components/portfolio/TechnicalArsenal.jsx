import { useAuth } from '../../context/AuthContext';

const TechnicalArsenal = () => {
    const { userData } = useAuth();
    // Default fallback values if no skills set
    const skills = userData?.onboarding?.skills || {
        problemSolving: 50,
        technical: 30,
        communication: 70,
        analytical: 40
    };

    return (
        <div className="py-8 border-b border-gray-100">
            <h3 className="text-lg font-[900] text-gray-900 border-l-4 border-indigo-600 pl-3 mb-6 uppercase tracking-wide">Technical Arsenal</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Languages */}
                <div>
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Core Competencies</h4>
                    <div className="space-y-5">
                        <SkillBar label="Problem Solving" percent={skills.problemSolving} />
                        <SkillBar label="Technical Execution" percent={skills.technical} />
                    </div>
                </div>

                {/* Frameworks */}
                <div>
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Soft Skills</h4>
                    <div className="space-y-5">
                        <SkillBar label="Communication" percent={skills.communication} />
                        <SkillBar label="Analytical Thinking" percent={skills.analytical} />
                    </div>
                </div>
            </div>
        </div>
    );
};

const SkillBar = ({ label, percent }) => (
    <div>
        <div className="flex justify-between items-end mb-1.5">
            <span className="text-sm font-bold text-gray-900">{label}</span>
            <span className="text-xs font-bold text-gray-500">{percent}%</span>
        </div>
        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
            <div
                className="h-full bg-indigo-600 rounded-full shadow-[0_0_8px_rgba(79,70,229,0.4)] transition-all duration-1000 ease-out"
                style={{ width: `${percent}%` }}
            ></div>
        </div>
    </div>
);

export default TechnicalArsenal;
