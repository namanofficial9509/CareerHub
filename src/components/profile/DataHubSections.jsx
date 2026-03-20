import { useState, useRef, useEffect } from 'react';
import { db, storage } from '../../lib/firebase';
import { collection, addDoc, serverTimestamp, query, onSnapshot, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { GraduationCap, Briefcase, BookOpen, CheckCircle2, ShieldCheck, Loader2, Trash2, FileText, FlaskConical, ExternalLink } from 'lucide-react';

// ─────────────────────────────────────────────
// Shared helpers
// ─────────────────────────────────────────────
const inputCls = "w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-[14px] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition";
const labelCls = "block text-[12px] font-bold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wide";

const ProofUpload = ({ value, onChange, accept = ".pdf,.jpg,.jpeg,.png", label = "Upload Proof (PDF / Image)" }) => {
    const fileRef = useRef(null);
    return (
        <div>
            <label className={labelCls}>{label}</label>
            {value ? (
                <div className="flex items-center gap-3 p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/40 rounded-xl">
                    <ShieldCheck className="size-5 text-emerald-600 shrink-0" />
                    <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-bold text-emerald-700 dark:text-emerald-400 truncate">{value.name}</p>
                        <p className="text-[11px] text-emerald-600/70">{(value.size / 1024).toFixed(1)} KB · Proof attached</p>
                    </div>
                    <button type="button" onClick={() => onChange(null)} className="text-emerald-600 hover:text-red-500 transition-colors">
                        <Trash2 className="size-4" />
                    </button>
                </div>
            ) : (
                <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="w-full border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-600 rounded-xl py-4 px-4 flex flex-col items-center gap-2 text-slate-400 hover:text-blue-500 dark:hover:border-blue-400 transition-all group"
                >
                    <FileText className="size-6 group-hover:scale-110 transition-transform" />
                    <span className="text-[13px] font-medium">Click to upload marksheet / certificate</span>
                    <span className="text-[11px] text-slate-400">PDF, JPG or PNG · Max 5MB</span>
                </button>
            )}
            <input
                ref={fileRef}
                type="file"
                accept={accept}
                className="hidden"
                onChange={(e) => {
                    const file = e.target.files[0];
                    if (file && file.size > 5 * 1024 * 1024) {
                        alert('File must be less than 5MB');
                        return;
                    }
                    onChange(file || null);
                    e.target.value = '';
                }}
            />
        </div>
    );
};

// Helper to upload file to Firebase Storage
const uploadFile = async (file, path) => {
    if (!file) return null;
    const storageRef = ref(storage, `${path}/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    return { name: file.name, url, size: file.size, type: file.type };
};

// ─────────────────────────────────────────────
// 1. ACADEMICS SECTION
// ─────────────────────────────────────────────
export const AcademicsSection = ({ user, initialOpen = false }) => {
    const [isOpen, setIsOpen] = useState(initialOpen);
    const [records, setRecords] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [saved, setSaved] = useState(false);
    const [proofFile, setProofFile] = useState(null);
    const [form, setForm] = useState({
        semester: '',
        sgpa: '',
        cgpa: '',
        totalCredits: '',
        year: '',
        notes: '',
    });

    useEffect(() => {
        if (!user) return;
        const q = query(collection(db, 'users', user.uid, 'academics'), orderBy('createdAt', 'desc'));
        const unsub = onSnapshot(q, (snap) => setRecords(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
        return unsub;
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) return;
        if (!form.semester || !form.sgpa) {
            alert('Semester and SGPA are required.');
            return;
        }
        setSubmitting(true);
        try {
            const proofData = await uploadFile(proofFile, `proofs/${user.uid}/academics`);
            await addDoc(collection(db, 'users', user.uid, 'academics'), {
                ...form,
                sgpa: parseFloat(form.sgpa),
                cgpa: form.cgpa ? parseFloat(form.cgpa) : null,
                proof: proofData,
                verified: !!proofData,
                createdAt: serverTimestamp(),
            });
            setForm({ semester: '', sgpa: '', cgpa: '', totalCredits: '', year: '', notes: '' });
            setProofFile(null);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (err) {
            console.error(err);
            alert('Failed to save: ' + err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!user || !window.confirm('Delete this semester record?')) return;
        await deleteDoc(doc(db, 'users', user.uid, 'academics', id));
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-orange-200 dark:border-orange-900/40 shadow-sm overflow-hidden mb-6">
            <div className="h-1 bg-gradient-to-r from-orange-400 to-yellow-400"></div>
            <div className="p-6 border-b border-slate-100 dark:border-slate-800/50 flex items-center justify-between bg-orange-50/30 dark:bg-orange-900/10">
                <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-orange-50 dark:bg-orange-900/30 border border-orange-100 dark:border-orange-800/30 flex items-center justify-center text-orange-600">
                        <GraduationCap className="size-5" />
                    </div>
                    <div>
                        <h3 className="text-[16px] font-bold text-slate-900 dark:text-white">Academics — Semester Records</h3>
                        <p className="text-[12px] text-slate-500 dark:text-slate-400">Log semester SGPA/CGPA with marksheet proof</p>
                    </div>
                </div>
                <button onClick={() => setIsOpen(!isOpen)} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-bold transition-all ${isOpen ? 'bg-orange-500 text-white' : 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 border border-orange-200 dark:border-orange-800/30'}`}>
                    <span className="material-symbols-outlined text-[16px]">{isOpen ? 'close' : 'add'}</span>
                    {isOpen ? 'Cancel' : 'Add Semester'}
                </button>
            </div>

            {records.length > 0 && (
                <div className="px-6 pt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {records.map((r) => (
                        <div key={r.id} className="relative bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-5 border border-slate-200 dark:border-slate-700/50 group">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <p className="text-[12px] font-bold text-slate-400">{r.year}</p>
                                    <h4 className="text-[17px] font-bold text-slate-900 dark:text-white">{r.semester}</h4>
                                </div>
                                {r.verified && <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200"><ShieldCheck className="size-3" /> Verified</span>}
                            </div>
                            <div className="flex gap-6">
                                <div><p className="text-[10px] font-bold text-slate-400 uppercase">SGPA</p><p className="text-[22px] font-[900] text-orange-500">{r.sgpa}</p></div>
                                {r.cgpa && <div><p className="text-[10px] font-bold text-slate-400 uppercase">CGPA</p><p className="text-[22px] font-[900] text-slate-900 dark:text-white">{r.cgpa}</p></div>}
                            </div>
                            {r.proof && <a href={r.proof.url} target="_blank" rel="noopener noreferrer" className="mt-3 flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 hover:underline"><FileText className="size-3.5" />{r.proof.name}</a>}
                            <button onClick={() => handleDelete(r.id)} className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition-all"><Trash2 className="size-4" /></button>
                        </div>
                    ))}
                </div>
            )}

            {isOpen && (
                <form onSubmit={handleSubmit} className="p-6 mt-4 border-t border-slate-100 space-y-5 shadow-inner">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        <div>
                            <label className={labelCls}>Semester *</label>
                            <select required value={form.semester} onChange={e => setForm(p => ({ ...p, semester: e.target.value }))} className={inputCls}>
                                <option value="">Select semester</option>
                                {[1, 2, 3, 4, 5, 6, 7, 8].map(n => <option key={n} value={`Semester ${n}`}>Semester {n}</option>)}
                            </select>
                        </div>
                        <div><label className={labelCls}>Year</label><input type="text" placeholder="e.g. 2023-24" value={form.year} onChange={e => setForm(p => ({ ...p, year: e.target.value }))} className={inputCls} /></div>
                        <div><label className={labelCls}>SGPA *</label><input type="number" step="0.01" required value={form.sgpa} onChange={e => setForm(p => ({ ...p, sgpa: e.target.value }))} className={inputCls} /></div>
                        <div><label className={labelCls}>CGPA</label><input type="number" step="0.01" value={form.cgpa} onChange={e => setForm(p => ({ ...p, cgpa: e.target.value }))} className={inputCls} /></div>
                        <div className="lg:col-span-2"><label className={labelCls}>Notes</label><input type="text" value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} className={inputCls} /></div>
                    </div>
                    <ProofUpload value={proofFile} onChange={setProofFile} label="Upload Marksheet (PDF/Image)" />
                    <div className="flex justify-end gap-3 pt-4 border-t">
                        {saved && <span className="mr-auto text-emerald-600 font-bold text-[13px] flex items-center gap-1"><CheckCircle2 className="size-4" /> Saved!</span>}
                        <button type="button" onClick={() => setIsOpen(false)} className="px-5 py-2 text-slate-500 font-medium">Cancel</button>
                        <button type="submit" disabled={submitting} className="px-6 py-2 bg-orange-500 text-white font-bold rounded-xl disabled:opacity-50 flex items-center gap-2">
                            {submitting ? <Loader2 className="size-4 animate-spin" /> : <><span className="material-symbols-outlined text-[18px]">save</span> Save</>}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

// ─────────────────────────────────────────────
// 2. EXPERIENCE SECTION
// ─────────────────────────────────────────────
export const ExperienceSection = ({ user, initialOpen = false }) => {
    const [isOpen, setIsOpen] = useState(initialOpen);
    const [records, setRecords] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [saved, setSaved] = useState(false);
    const [proofFile, setProofFile] = useState(null);
    const [form, setForm] = useState({ role: '', company: '', type: 'Internship', startDate: '', endDate: '', description: '' });

    useEffect(() => {
        if (!user) return;
        const q = query(collection(db, 'users', user.uid, 'experiences'), orderBy('createdAt', 'desc'));
        const unsub = onSnapshot(q, (snap) => setRecords(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
        return unsub;
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) return;
        setSubmitting(true);
        try {
            const proofData = await uploadFile(proofFile, `proofs/${user.uid}/experience`);
            await addDoc(collection(db, 'users', user.uid, 'experiences'), {
                ...form,
                proof: proofData,
                verified: !!proofData,
                createdAt: serverTimestamp(),
            });
            setForm({ role: '', company: '', type: 'Internship', startDate: '', endDate: '', description: '' });
            setProofFile(null);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (err) { console.error(err); alert('Failed to save'); } finally { setSubmitting(false); }
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-blue-200 dark:border-blue-900/40 shadow-sm overflow-hidden mb-6">
            <div className="h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
            <div className="p-6 border-b border-slate-100 dark:border-slate-800/50 flex items-center justify-between bg-blue-50/30 dark:bg-blue-900/10">
                <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800/30 flex items-center justify-center text-blue-600"><Briefcase className="size-5" /></div>
                    <div><h3 className="text-[16px] font-bold text-slate-900 dark:text-white">Experience — Internships & Jobs</h3><p className="text-[12px] text-slate-500 dark:text-slate-400">Log professional work experience</p></div>
                </div>
                <button onClick={() => setIsOpen(!isOpen)} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-bold transition-all ${isOpen ? 'bg-blue-600 text-white' : 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 border border-blue-200 dark:border-blue-800/30'}`}>
                    <span className="material-symbols-outlined text-[16px]">{isOpen ? 'close' : 'add'}</span>
                    {isOpen ? 'Cancel' : 'Add Experience'}
                </button>
            </div>

            {records.length > 0 && (
                <div className="px-6 pt-6 space-y-4">
                    {records.map(r => (
                        <div key={r.id} className="relative flex gap-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-5 border border-slate-200 group">
                            <div className="size-10 rounded-xl flex-shrink-0 bg-blue-100 flex items-center justify-center text-blue-600"><Briefcase className="size-5" /></div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <h4 className="text-[16px] font-bold text-slate-900 dark:text-white">{r.role}</h4>
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-200 text-blue-600">{r.type}</span>
                                    {r.verified && <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600"><ShieldCheck className="size-3" /> Verified</span>}
                                </div>
                                <p className="text-[13px] font-medium text-slate-600 dark:text-slate-300">{r.company}</p>
                                <p className="text-[12px] text-slate-400">{r.startDate} → {r.endDate || 'Ongoing'}</p>
                                {r.proof && <a href={r.proof.url} target="_blank" rel="noopener noreferrer" className="mt-2 flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 hover:underline"><FileText className="size-3.5" />{r.proof.name}</a>}
                            </div>
                            <button onClick={() => deleteDoc(doc(db, 'users', user.uid, 'experiences', r.id))} className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500"><Trash2 className="size-4" /></button>
                        </div>
                    ))}
                </div>
            )}

            {isOpen && (
                <form onSubmit={handleSubmit} className="p-6 mt-4 border-t space-y-5 shadow-inner">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div><label className={labelCls}>Role *</label><input required type="text" placeholder="e.g. Frontend Intern" value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))} className={inputCls} /></div>
                        <div><label className={labelCls}>Company *</label><input required type="text" placeholder="e.g. Google" value={form.company} onChange={e => setForm(p => ({ ...p, company: e.target.value }))} className={inputCls} /></div>
                        <div><label className={labelCls}>Type</label><select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))} className={inputCls}><option>Internship</option><option>Full-time</option><option>Contract</option></select></div>
                        <div><label className={labelCls}>Start Month/Year</label><input type="month" value={form.startDate} onChange={e => setForm(p => ({ ...p, startDate: e.target.value }))} className={inputCls} /></div>
                    </div>
                    <ProofUpload value={proofFile} onChange={setProofFile} label="Upload Offer Letter / Certificate (PDF/Image)" />
                    <div className="flex justify-end gap-3 pt-4 border-t">
                        {saved && <span className="mr-auto text-emerald-600 font-bold text-[13px] flex items-center gap-1 animate-in fade-in slide-in-from-left-2"><CheckCircle2 className="size-4" /> Saved!</span>}
                        <button type="button" onClick={() => setIsOpen(false)} className="px-5 py-2 text-slate-500">Cancel</button>
                        <button type="submit" disabled={submitting} className="px-6 py-2 bg-blue-600 text-white font-bold rounded-xl flex items-center gap-2">{submitting ? <Loader2 className="size-4 animate-spin" /> : 'Save'}</button>
                    </div>
                </form>
            )}
        </div>
    );
};

// ─────────────────────────────────────────────
// 3. RESEARCH PAPER SECTION
// ─────────────────────────────────────────────
export const ResearchPaperSection = ({ user, initialOpen = false }) => {
    const [isOpen, setIsOpen] = useState(initialOpen);
    const [records, setRecords] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [saved, setSaved] = useState(false);
    const [proofFile, setProofFile] = useState(null);
    const [form, setForm] = useState({ title: '', journal: '', status: 'Published', publishedDate: '', doi: '' });

    useEffect(() => {
        if (!user) return;
        const q = query(collection(db, 'users', user.uid, 'research_papers'), orderBy('createdAt', 'desc'));
        const unsub = onSnapshot(q, (snap) => setRecords(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
        return unsub;
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user || !form.title) return;
        setSubmitting(true);
        try {
            const proofData = await uploadFile(proofFile, `proofs/${user.uid}/research`);
            await addDoc(collection(db, 'users', user.uid, 'research_papers'), {
                ...form,
                proof: proofData,
                verified: !!proofData,
                createdAt: serverTimestamp(),
            });
            setForm({ title: '', journal: '', status: 'Published', publishedDate: '', doi: '' });
            setProofFile(null);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (err) { console.error(err); } finally { setSubmitting(false); }
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-purple-200 dark:border-purple-900/40 shadow-sm overflow-hidden mb-6">
            <div className="h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
            <div className="p-6 border-b border-slate-100 dark:border-slate-800/50 flex items-center justify-between bg-purple-50/30 dark:bg-purple-900/10">
                <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-purple-50 dark:bg-purple-900/30 border border-purple-100 dark:border-purple-800/30 flex items-center justify-center text-purple-600"><BookOpen className="size-5" /></div>
                    <div><h3 className="text-[16px] font-bold text-slate-900 dark:text-white">Research Papers</h3><p className="text-[12px] text-slate-500 dark:text-slate-400">Log your publications and journals</p></div>
                </div>
                <button onClick={() => setIsOpen(!isOpen)} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-bold transition-all ${isOpen ? 'bg-purple-600 text-white' : 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 border border-purple-200 dark:border-purple-800/30'}`}>
                    <span className="material-symbols-outlined text-[16px]">{isOpen ? 'close' : 'add'}</span>
                    {isOpen ? 'Cancel' : 'Add Paper'}
                </button>
            </div>

            {records.length > 0 && (
                <div className="px-6 pt-6 space-y-4">
                    {records.map(r => (
                        <div key={r.id} className="relative flex gap-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-5 border border-slate-200 group">
                            <div className="size-10 rounded-xl flex-shrink-0 bg-purple-100 flex items-center justify-center text-purple-600"><BookOpen className="size-5" /></div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <h4 className="text-[15px] font-bold text-slate-900 dark:text-white">{r.title}</h4>
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-purple-200 text-purple-600">{r.status}</span>
                                    {r.verified && <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600"><ShieldCheck className="size-3" /> Verified</span>}
                                </div>
                                <p className="text-[13px] font-medium text-slate-600 dark:text-slate-300">{r.journal} · {r.publishedDate}</p>
                                {r.doi && <p className="text-[12px] text-blue-500 font-medium">DOI: {r.doi}</p>}
                                {r.proof && <a href={r.proof.url} target="_blank" rel="noopener noreferrer" className="mt-2 flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 hover:underline"><FileText className="size-3.5" />{r.proof.name}</a>}
                            </div>
                            <button onClick={() => deleteDoc(doc(db, 'users', user.uid, 'research_papers', r.id))} className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500"><Trash2 className="size-4" /></button>
                        </div>
                    ))}
                </div>
            )}

            {isOpen && (
                <form onSubmit={handleSubmit} className="p-6 mt-4 border-t space-y-5 shadow-inner">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="sm:col-span-2"><label className={labelCls}>Paper Title *</label><input required type="text" placeholder="e.g. AI in Healthcare" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className={inputCls} /></div>
                        <div><label className={labelCls}>Journal / Conference</label><input type="text" placeholder="e.g. IEEE 2024" value={form.journal} onChange={e => setForm(p => ({ ...p, journal: e.target.value }))} className={inputCls} /></div>
                        <div><label className={labelCls}>Status</label><select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))} className={inputCls}><option>Published</option><option>Under Review</option><option>In Progress</option></select></div>
                    </div>
                    <ProofUpload value={proofFile} onChange={setProofFile} label="Upload Paper / Acceptance Letter (PDF/Image)" />
                    <div className="flex justify-end gap-3 pt-4 border-t">
                        {saved && <span className="mr-auto text-emerald-600 font-bold text-[13px] flex items-center gap-1 animate-in fade-in slide-in-from-left-2"><CheckCircle2 className="size-4" /> Saved!</span>}
                        <button type="button" onClick={() => setIsOpen(false)} className="px-5 py-2 text-slate-500">Cancel</button>
                        <button type="submit" disabled={submitting} className="px-6 py-2 bg-purple-600 text-white font-bold rounded-xl flex items-center gap-2">{submitting ? <Loader2 className="size-4 animate-spin" /> : 'Save Paper'}</button>
                    </div>
                </form>
            )}
        </div>
    );
};

// ─────────────────────────────────────────────
// 4. INTERNSHIP OPPORTUNITY SECTION
// ─────────────────────────────────────────────
export const InternshipOpportunitySection = ({ user, initialOpen = false }) => {
    const [isOpen, setIsOpen] = useState(initialOpen);
    const [records, setRecords] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [saved, setSaved] = useState(false);
    const [proofFile, setProofFile] = useState(null);
    const [form, setForm] = useState({ title: '', organization: '', status: 'Applied', date: '' });

    useEffect(() => {
        if (!user) return;
        const q = query(collection(db, 'users', user.uid, 'internship_opportunities'), orderBy('createdAt', 'desc'));
        const unsub = onSnapshot(q, (snap) => setRecords(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
        return unsub;
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user || !form.title) return;
        setSubmitting(true);
        try {
            const proofData = await uploadFile(proofFile, `proofs/${user.uid}/opportunities`);
            await addDoc(collection(db, 'users', user.uid, 'internship_opportunities'), {
                ...form,
                proof: proofData,
                verified: !!proofData,
                createdAt: serverTimestamp(),
            });
            setForm({ title: '', organization: '', status: 'Applied', date: '' });
            setProofFile(null);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (err) { console.error(err); } finally { setSubmitting(false); }
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-pink-200 dark:border-pink-900/40 shadow-sm overflow-hidden mb-6">
            <div className="h-1 bg-gradient-to-r from-indigo-500 to-pink-500"></div>
            <div className="p-6 border-b border-slate-100 dark:border-slate-800/50 flex items-center justify-between bg-pink-50/30 dark:bg-pink-900/10">
                <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-pink-50 dark:bg-pink-900/30 border border-pink-100 dark:border-pink-800/30 flex items-center justify-center text-pink-600"><FlaskConical className="size-5" /></div>
                    <div><h3 className="text-[16px] font-bold text-slate-900 dark:text-white">Internship Opportunities</h3><p className="text-[12px] text-slate-500 dark:text-slate-400">Track your internship applications and offers</p></div>
                </div>
                <button onClick={() => setIsOpen(!isOpen)} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-bold transition-all ${isOpen ? 'bg-pink-600 text-white' : 'bg-pink-50 dark:bg-pink-900/20 text-pink-600 border border-pink-200 dark:border-pink-800/30'}`}>
                    <span className="material-symbols-outlined text-[16px]">{isOpen ? 'close' : 'add'}</span>
                    {isOpen ? 'Cancel' : 'Add Opportunity'}
                </button>
            </div>

            {records.length > 0 && (
                <div className="px-6 pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {records.map(r => (
                        <div key={r.id} className="relative flex gap-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-200 group">
                            <div className="size-8 rounded-lg flex-shrink-0 bg-pink-100 flex items-center justify-center text-pink-600"><ExternalLink className="size-4" /></div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-0.5">
                                    <h4 className="text-[14px] font-bold text-slate-900 dark:text-white truncate">{r.title}</h4>
                                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-pink-200 text-pink-600">{r.status}</span>
                                </div>
                                <p className="text-[12px] font-medium text-slate-500">{r.organization}</p>
                                {r.proof && <a href={r.proof.url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 hover:underline"><FileText className="size-3" /> Proof Attached</a>}
                            </div>
                            <button onClick={() => deleteDoc(doc(db, 'users', user.uid, 'internship_opportunities', r.id))} className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500"><Trash2 className="size-4" /></button>
                        </div>
                    ))}
                </div>
            )}

            {isOpen && (
                <form onSubmit={handleSubmit} className="p-6 mt-4 border-t space-y-5 shadow-inner">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="sm:col-span-2"><label className={labelCls}>Programme Name *</label><input required type="text" placeholder="e.g. GSoC 2024" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className={inputCls} /></div>
                        <div><label className={labelCls}>Organization</label><input type="text" placeholder="e.g. Google" value={form.organization} onChange={e => setForm(p => ({ ...p, organization: e.target.value }))} className={inputCls} /></div>
                        <div><label className={labelCls}>Status</label><select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))} className={inputCls}><option>Applied</option><option>In Progress</option><option>Offered</option><option>Completed</option></select></div>
                    </div>
                    <ProofUpload value={proofFile} onChange={setProofFile} label="Upload Offer Letter / Selection Proof (PDF/Image)" />
                    <div className="flex justify-end gap-3 pt-4 border-t">
                        {saved && <span className="mr-auto text-emerald-600 font-bold text-[13px] flex items-center gap-1 animate-in fade-in slide-in-from-left-2"><CheckCircle2 className="size-4" /> Saved!</span>}
                        <button type="button" onClick={() => setIsOpen(false)} className="px-5 py-2 text-slate-500">Cancel</button>
                        <button type="submit" disabled={submitting} className="px-6 py-2 bg-pink-600 text-white font-bold rounded-xl">{submitting ? <Loader2 className="size-4 animate-spin" /> : 'Save'}</button>
                    </div>
                </form>
            )}
        </div>
    );
};

