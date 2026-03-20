import { useMemo, useState } from 'react';

const DEFAULT_API_BASES = [
  'http://localhost:8000',
  'http://127.0.0.1:8000',
  'http://localhost:5000',
  'http://127.0.0.1:5000',
];

const splitToList = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  return String(value)
    .split(/\r?\n|,\s*/g)
    .map((item) => item.trim())
    .filter(Boolean);
};

const toTitle = (value) => {
  if (!value) return '';
  return String(value)
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const toErrorMessage = (rawMessage) => {
  if (rawMessage === 'Failed to fetch') {
    return 'Could not reach the ATS backend. Start FastAPI on port 8000 (or Flask on 5000) and try again.';
  }

  return rawMessage || 'Upload failed. Please try again.';
};

const ResumeAnalyzer = () => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [analysis, setAnalysis] = useState(null);

  const canUpload = useMemo(() => status !== 'reading', [status]);

  const apiBases = useMemo(() => {
    const configuredBase = import.meta.env.VITE_ATS_API_BASE_URL;
    if (configuredBase) {
      return [configuredBase, ...DEFAULT_API_BASES.filter((item) => item !== configuredBase)];
    }

    return DEFAULT_API_BASES;
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] || null;
    setUploadedFile(file);
    setError('');
    setAnalysis(null);
    setStatus('idle');
  };

  const handleUpload = async () => {
    if (!uploadedFile) {
      setError('Please select a .pdf or .txt file first.');
      setStatus('error');
      return;
    }

    setStatus('reading');
    setError('');
    setAnalysis(null);

    try {
      const form = new FormData();
      form.append('resume', uploadedFile);
      form.append('job_description', jobDescription.trim());

      let response = null;
      let responseData = null;
      let lastError = null;

      for (const base of apiBases) {
        try {
          response = await fetch(`${base}/analyze`, {
            method: 'POST',
            body: form,
          });
        } catch (requestError) {
          lastError = requestError;
          response = null;
          continue;
        }

        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          try {
            responseData = await response.json();
          } catch {
            responseData = null;
          }
        } else {
          responseData = await response.text().catch(() => '');
        }

        if (response.ok) {
          break;
        }
      }

      if (!response) {
        throw lastError || new Error('Failed to fetch');
      }

      if (!response.ok) {
        const errorFromJson =
          responseData &&
          typeof responseData === 'object' &&
          (typeof responseData.error === 'string' || typeof responseData.detail === 'string')
            ? responseData.error || responseData.detail
            : null;

        const errorFromText =
          typeof responseData === 'string' && responseData.trim()
            ? responseData.trim().slice(0, 220)
            : null;

        throw new Error(errorFromJson || errorFromText || `Upload failed (${response.status}).`);
      }

      setAnalysis(responseData || {});
      setStatus('done');
    } catch (uploadError) {
      const rawMessage = uploadError instanceof Error ? uploadError.message : '';
      setError(toErrorMessage(rawMessage));
      setStatus('error');
    }
  };

  const score =
    typeof analysis?.overall_ats_score === 'number'
      ? analysis.overall_ats_score
      : typeof analysis?.score === 'number'
        ? analysis.score
        : 0;

  const sectionScores = analysis?.section_scores && typeof analysis.section_scores === 'object'
    ? analysis.section_scores
    : null;

  const extractedSections = analysis?.sections && typeof analysis.sections === 'object'
    ? analysis.sections
    : null;

  const weightedScores = sectionScores
    ? [
      ['skills', sectionScores.skills, 40],
      ['projects', sectionScores.projects, 30],
      ['experience', sectionScores.experience, 20],
      ['education', sectionScores.education, 10],
    ]
    : [];

  let missingSkills = splitToList(analysis?.missing_skills);
  if (missingSkills.length === 0) {
    missingSkills = splitToList(analysis?.missingSkills);
  }

  let suggestions = splitToList(analysis?.suggestions);
  if (suggestions.length === 0) {
    suggestions = splitToList(analysis?.suggestionsList);
  }

  const targetKeywords = splitToList(analysis?.target_keywords);
  const matchedKeywords = splitToList(analysis?.matched_keywords);

  const softCardClass =
    'rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900';
  const compactCardClass =
    'rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900';

  return (
    <div className="relative pb-20">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[26rem] bg-[radial-gradient(circle_at_10%_10%,rgba(34,211,238,0.22),transparent_40%),radial-gradient(circle_at_85%_0%,rgba(59,130,246,0.26),transparent_44%)]" />

      <div className="mx-auto max-w-7xl space-y-7">
        <div className="overflow-hidden rounded-[2rem] border border-cyan-500/25 bg-gradient-to-br from-[#030815] via-[#08142d] to-[#0a2640] p-8 text-white shadow-[0_24px_80px_rgba(6,182,212,0.14)] ring-1 ring-white/10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-300/90">AI Resume Intelligence</p>
          <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-3xl font-black tracking-tight lg:text-4xl">Resume Analyzer</h1>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-200">
                Section-wise ATS review with weighted scoring and resume diagnostics for Skills, Projects, Experience, and Education.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-cyan-100 backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              FastAPI ATS Engine Active
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.45fr,0.55fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm ring-1 ring-slate-100 transition duration-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:ring-slate-800/60">
            <label htmlFor="resume-jd" className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
              Target Job Description
            </label>
            <textarea
              id="resume-jd"
              value={jobDescription}
              onChange={(event) => setJobDescription(event.target.value)}
              rows={8}
              placeholder="Paste the target job description for section-wise ATS comparison."
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm leading-relaxed text-slate-700 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            />

            <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-[1fr,auto] lg:items-center">
              <input
                type="file"
                accept=".txt,.pdf,application/pdf,text/plain"
                onChange={handleFileChange}
                className="block w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-700 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-900 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:file:bg-cyan-600"
              />

              <button
                type="button"
                onClick={handleUpload}
                disabled={!canUpload}
                className="rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/30 transition duration-300 hover:-translate-y-0.5 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === 'reading' ? 'Analyzing...' : 'Run ATS Analysis'}
              </button>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
              <span>{uploadedFile ? uploadedFile.name : 'No file selected'}</span>
              <span className="hidden h-1 w-1 rounded-full bg-slate-400 sm:inline-block" />
              <span>{jobDescription.trim() ? 'JD-based matching enabled' : 'Fallback keyword mode'}</span>
            </div>

            {status === 'reading' && (
              <p className="mt-4 rounded-xl border border-cyan-200 bg-cyan-50 px-3 py-2 text-sm text-cyan-700 dark:border-cyan-900 dark:bg-cyan-900/20 dark:text-cyan-300">
                Parsing resume sections and calculating weighted ATS score...
              </p>
            )}

            {error && (
              <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-900/20 dark:text-red-300">
                {error}
              </p>
            )}
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm ring-1 ring-slate-100 transition duration-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:ring-slate-800/60">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Overall ATS Score</p>
            <div className="mt-2 flex items-end justify-between gap-2">
              <p className="text-5xl font-black tracking-tight text-slate-900 dark:text-white">{`${Math.round(score)}%`}</p>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-300">Weighted</span>
            </div>

            <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 transition-all duration-700"
                style={{ width: `${Math.max(0, Math.min(100, score))}%` }}
              />
            </div>

            <div className="mt-4 space-y-1 text-xs text-slate-500 dark:text-slate-400">
              {targetKeywords.length > 0 ? (
                <p>Matched {matchedKeywords.length} of {targetKeywords.length} target keywords</p>
              ) : (
                <p>Upload and analyze to view keyword match details</p>
              )}
            </div>
          </div>
        </div>

        {analysis && (
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
            <div className={`${softCardClass} xl:col-span-5`}>
              <p className="mb-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Section-Wise Scores</p>
              {sectionScores ? (
                <div className="space-y-4">
                  {weightedScores.map(([label, value, weight]) => {
                    const numeric = typeof value === 'number' ? value : 0;
                    return (
                      <div key={label}>
                        <div className="mb-1 flex items-center justify-between text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                          <span>{toTitle(label)}</span>
                          <span>{Math.round(numeric)}% • w{weight}</span>
                        </div>
                        <div className="h-2.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                          <div
                            className="h-full rounded-full bg-cyan-500 transition-all duration-500"
                            style={{ width: `${Math.max(0, Math.min(100, numeric))}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-slate-500 dark:text-slate-400">Section-wise scores not available for this response.</p>
              )}
            </div>

            <div className={`${softCardClass} xl:col-span-7`}>
              <p className="mb-2 text-sm font-semibold text-slate-500 dark:text-slate-400">Summary</p>
              {analysis?.summary ? (
                <p className="whitespace-pre-line text-sm leading-6 text-slate-700 dark:text-slate-200">{analysis.summary}</p>
              ) : (
                <p className="text-sm text-slate-500 dark:text-slate-400">No summary returned yet.</p>
              )}
            </div>

            <div className={`${softCardClass} xl:col-span-5`}>
              <p className="mb-3 text-sm font-semibold text-slate-500 dark:text-slate-400">Missing Skills</p>
              {missingSkills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {missingSkills.map((skill) => (
                    <span key={skill} className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700 dark:border-rose-800 dark:bg-rose-900/20 dark:text-rose-300">
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500 dark:text-slate-400">None</p>
              )}
            </div>

            <div className={`${softCardClass} xl:col-span-7`}>
              <p className="mb-3 text-sm font-semibold text-slate-500 dark:text-slate-400">Suggestions</p>
              {suggestions.length > 0 ? (
                <ul className="list-inside list-disc space-y-1 text-sm text-slate-700 dark:text-slate-200">
                  {suggestions.map((suggestion) => (
                    <li key={suggestion}>{suggestion}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-slate-500 dark:text-slate-400">No suggestions returned yet.</p>
              )}
            </div>

            <div className={`${softCardClass} xl:col-span-12`}>
              <p className="mb-3 text-sm font-semibold text-slate-500 dark:text-slate-400">Extracted Resume Sections</p>
              {extractedSections ? (
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-4">
                  {['skills', 'projects', 'experience', 'education'].map((sectionKey) => (
                    <div key={sectionKey} className={compactCardClass}>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-cyan-700 dark:text-cyan-400">
                        {toTitle(sectionKey)}
                      </p>
                      <p className="max-h-44 overflow-auto whitespace-pre-wrap text-sm leading-6 text-slate-700 dark:text-slate-200">
                        {extractedSections[sectionKey] || 'No content extracted for this section.'}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500 dark:text-slate-400">Section extraction data is not available in this response.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeAnalyzer;
