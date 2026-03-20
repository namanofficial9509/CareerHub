import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../lib/firebase';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { Github, ExternalLink, Globe, GraduationCap } from 'lucide-react';

const ProjectShowcase = () => {
    const { user } = useAuth();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }

        const q = query(
            collection(db, 'users', user.uid, 'projects'),
            orderBy('createdAt', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const projectsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setProjects(projectsData);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching projects:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    if (loading) {
        return (
            <div className="py-8 border-b border-gray-100">
                <div className="flex justify-between items-baseline mb-6">
                    <h3 className="text-lg font-[900] text-gray-900 border-l-4 border-indigo-600 pl-3 uppercase tracking-wide">Verified Projects</h3>
                </div>
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
            </div>
        );
    }

    // Fallback if no projects exist
    if (projects.length === 0) {
        return (
            <div className="py-8 border-b border-gray-100 opacity-50">
                <div className="flex justify-between items-baseline mb-6">
                    <h3 className="text-lg font-[900] text-gray-900 border-l-4 border-gray-300 pl-3 uppercase tracking-wide">Verified Projects</h3>
                </div>
                <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    <p className="text-gray-400 font-bold text-sm">No projects added yet.</p>
                    <p className="text-xs text-gray-400 mt-2">Add projects in your Data Hub to show them here.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="py-8 border-b border-gray-100">
            <div className="flex justify-between items-baseline mb-6">
                <h3 className="text-lg font-[900] text-gray-900 border-l-4 border-indigo-600 pl-3 uppercase tracking-wide">Verified Projects</h3>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Live from Hub</span>
            </div>

            <div className="space-y-6">
                {projects.map((project) => (
                    <ProjectCard
                        key={project.id}
                        title={project.title}
                        verified={project.status === 'verified'}
                        tags={project.techStack ? project.techStack.split(',').map(s => s.trim()) : []}
                        desc={project.description}
                        github={project.githubLink}
                        live={project.liveLink}
                        academics={project.academics}
                    />
                ))}
            </div>
        </div>
    );
};

const ProjectCard = ({ title, verified, tags, desc, github, live, academics }) => (
    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 group hover:bg-white hover:shadow-lg transition-all">
        <div className="flex justify-between items-start mb-2">
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                    <h4 className="font-[900] text-indigo-600 text-lg uppercase tracking-tight">{title}</h4>
                    {verified && (
                        <span className="material-symbols-outlined text-green-500 text-[18px]" title="Verified Project">verified</span>
                    )}
                </div>
                {academics && (
                    <div className="flex items-center gap-1.5 text-gray-400 text-[10px] font-bold uppercase tracking-wider">
                        <GraduationCap className="size-3" /> {academics}
                    </div>
                )}
            </div>
            <div className="flex gap-3">
                {github && (
                    <a href={github} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-900 transition-colors" title="View Code">
                        <Github className="size-5" />
                    </a>
                )}
                {live && (
                    <a href={live} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-indigo-600 transition-colors" title="Live Preview">
                        <ExternalLink className="size-5" />
                    </a>
                )}
            </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4 mt-3">
            {tags.map((tag) => (
                <span key={tag} className="bg-white border border-gray-200 px-2 py-0.5 rounded text-[10px] font-black text-gray-500 uppercase tracking-widest">{tag}</span>
            ))}
        </div>

        <p className="text-sm font-medium text-gray-600 leading-relaxed">{desc}</p>
    </div>
);

export default ProjectShowcase;
