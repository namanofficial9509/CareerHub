const CertificationsList = () => {
    const certs = [
        {
            id: 1,
            title: 'AWS Cloud Practitioner',
            issuer: 'Amazon Web Services (AWS)',
            date: 'Dec 2024',
            id_code: 'AWS-P-9923-EXC',
            status: 'verified',
            icon: 'cloud'
        },
        {
            id: 2,
            title: 'Full Stack MERN Course',
            issuer: 'Udemy',
            date: 'Submitted 2 days ago',
            status: 'rejected',
            icon: 'code'
        },
        {
            id: 3,
            title: 'Basic Python Workshop',
            issuer: 'GDG Campus',
            date: 'Pending Verification',
            status: 'pending',
            icon: 'terminal'
        }
    ];

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-900">Industry Certifications</h3>
                <button className="text-xs font-bold text-primary hover:underline">View All Records</button>
            </div>

            {certs.map((cert) => (
                <div key={cert.id} className="flex items-start gap-4 p-4 rounded-2xl border border-gray-100 bg-gray-50 hover:bg-white hover:shadow-md transition-all group">
                    <div className="size-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center shadow-sm text-gray-600">
                        <span className="material-symbols-outlined">{cert.icon}</span>
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                            <h4 className="font-bold text-gray-900 truncate pr-2">{cert.title}</h4>
                            {cert.status === 'verified' && (
                                <span className="shrink-0 text-[10px] font-black bg-green-100 text-green-700 px-2 py-0.5 rounded uppercase tracking-wide flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[12px]">check_circle</span> Verified
                                </span>
                            )}
                            {cert.status === 'pending' && (
                                <span className="shrink-0 text-[10px] font-black bg-amber-100 text-amber-700 px-2 py-0.5 rounded uppercase tracking-wide flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[12px]">hourglass_empty</span> Pending
                                </span>
                            )}
                            {cert.status === 'rejected' && (
                                <span className="shrink-0 text-[10px] font-black bg-red-100 text-red-700 px-2 py-0.5 rounded uppercase tracking-wide flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[12px]">error</span> Rejected
                                </span>
                            )}
                        </div>

                        <p className="text-xs font-bold text-gray-500 mt-0.5">{cert.issuer}</p>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-xs text-gray-400 font-medium">
                            {cert.id_code && <span>ID: {cert.id_code}</span>}
                            <span>{cert.date}</span>
                            {cert.status === 'verified' && (
                                <a href="#" className="text-indigo-600 font-bold hover:underline flex items-center gap-1">
                                    View Credential <span className="material-symbols-outlined text-[12px]">open_in_new</span>
                                </a>
                            )}
                            {cert.status === 'rejected' && (
                                <button className="text-red-600 font-bold hover:underline flex items-center gap-1 bg-red-50 px-2 py-0.5 rounded">
                                    <span className="material-symbols-outlined text-[12px]">upload</span> Re-upload
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            ))}

            <button className="w-full py-3 rounded-xl border-2 border-dashed border-gray-200 text-gray-400 font-bold hover:border-primary hover:text-primary hover:bg-indigo-50 transition-all flex items-center justify-center gap-2">
                <span className="material-symbols-outlined">add_circle</span>
                Add New Certification
            </button>
        </div>
    );
};

export default CertificationsList;
