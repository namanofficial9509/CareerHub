import { useAuth } from '../../context/AuthContext';

const ProjectShowcase = () => {
    const { userData } = useAuth();
    const projects = userData?.projects || [];

    // Fallback if no projects exist
    if (projects.length === 0) {
        return (
            <div className="py-8 border-b border-gray-100 opacity-50">
                <div className="flex justify-between items-baseline mb-6">
                    <h3 className="text-lg font-[900] text-gray-900 border-l-4 border-gray-300 pl-3 uppercase tracking-wide">Verified Projects</h3>
                </div>
                <div className="text-center py-8 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    <p className="text-gray-400 font-bold text-sm">No projects added yet.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="py-8 border-b border-gray-100">
            <div className="flex justify-between items-baseline mb-6">
                <h3 className="text-lg font-[900] text-gray-900 border-l-4 border-indigo-600 pl-3 uppercase tracking-wide">Verified Projects</h3>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">GitHub Synced</span>
            </div>

            <div className="space-y-6">
                {projects.map((project) => (
                    <ProjectCard
                        key={project.id || Math.random()}
                        title={project.title}
                        verified={project.status === 'verified'}
                        tags={['React', 'Firebase']} // You might want to make tags dynamic too if stored
                        desc={project.description}
                    />
                ))}
            </div>
        </div>
    );
};

const ProjectCard = ({ title, verified, tags, desc }) => (
    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 group hover:bg-white hover:shadow-lg transition-all">
        <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-2">
                <h4 className="font-[900] text-indigo-600 text-lg">{title}</h4>
                {verified ? (
                    <span className="material-symbols-outlined text-green-500 text-[18px]" title="Verified Project">verified</span>
                ) : (
                    <span className="material-symbols-outlined text-amber-500 text-[18px]" title="Pending Verification">timer</span>
                )}
            </div>
            <a href="#" className="text-gray-400 hover:text-gray-900 transition-colors">
                <span className="material-symbols-outlined text-[20px]">open_in_new</span>
            </a>
        </div>

        <div className="flex gap-2 mb-4">
            {tags.map((tag) => (
                <span key={tag} className="bg-white border border-gray-200 px-2 py-0.5 rounded text-[10px] font-bold text-gray-600 uppercase tracking-wide">{tag}</span>
            ))}
        </div>

        <p className="text-sm font-medium text-gray-600 leading-relaxed">{desc}</p>
    </div>
);

export default ProjectShowcase;
