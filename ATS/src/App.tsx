import { useMemo, useState } from 'react'
import './App.css'

type AnalysisResult = {
  score?: number
  summary?: string
  // New API shape (Flask): strings (newline/comma separated)
  missing_skills?: string | string[]
  suggestions?: string | string[]
  // Back-compat (older responses)
  missingSkills?: string[]
  suggestionsList?: string[]
  // Flask upload response fields
  saved?: boolean
  filename?: string
  originalFilename?: string
  bytes?: number
  message?: string
}

function splitToList(value: string | string[] | undefined): string[] {
  if (!value) return []
  if (Array.isArray(value)) return value.map((s) => String(s).trim()).filter(Boolean)
  const text = String(value).trim()
  if (!text) return []
  return text
    .split(/\r?\n|,\s*/g)
    .map((s) => s.trim())
    .filter(Boolean)
}

type UploadState = 'idle' | 'reading' | 'done' | 'error'

export default function App() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [status, setStatus] = useState<UploadState>('idle')
  const [error, setError] = useState<string | null>(null)
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)

  const canUpload = useMemo(() => status !== 'reading', [status])

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null
    setUploadedFile(file)
    setError(null)
    setAnalysis(null)
    setStatus('idle')
  }

  async function handleUpload() {
    if (!uploadedFile) {
      setError('Please select a .pdf or .txt file first.')
      setStatus('error')
      return
    }
    setStatus('reading')
    setError(null)
    setAnalysis(null)

    try {
      const form = new FormData()
      form.append('resume', uploadedFile)

      const postOnce = async (url: string) =>
        fetch(url, {
          method: 'POST',
          body: form,
        })

      let resp: Response
      try {
        resp = await postOnce('http://localhost:5000/analyze')
      } catch {
        // Windows can resolve localhost to IPv6 (::1) while Flask listens on IPv4.
        resp = await postOnce('http://127.0.0.1:5000/analyze')
      }

      const contentType = resp.headers.get('content-type') || ''
      let data: unknown = null

      if (contentType.includes('application/json')) {
        try {
          data = (await resp.json()) as unknown
        } catch {
          data = null
        }
      } else {
        // Some servers return HTML/plain-text errors; capture a short snippet.
        const text = await resp.text().catch(() => '')
        data = text
      }

      if (!resp.ok) {
        const errorFromJson =
          typeof data === 'object' && data !== null && 'error' in data && typeof (data as { error?: unknown }).error === 'string'
            ? String((data as { error: string }).error)
            : null

        const errorFromText = typeof data === 'string' && data.trim() ? data.trim().slice(0, 200) : null

        throw new Error(errorFromJson ?? errorFromText ?? `Upload failed (${resp.status}).`)
      }

      const result = (data ?? {}) as AnalysisResult
      setAnalysis(result)
      setStatus('done')
    } catch (e) {
      const raw = e instanceof Error ? e.message : 'Upload failed. Please try again.'
      const message =
        raw === 'Failed to fetch'
          ? 'Could not reach the backend. Make sure Flask is running on port 5000.'
          : raw
      setError(message)
      setStatus('error')
    }
  }

  return (
    <div className="page">
      <div className="container">
        <div className="header">
          <div>
            <h1 className="title">ATS Resume Analyzer</h1>
            <p className="subtitle">Upload a resume to get a quick, local ATS-style check.</p>
          </div>
          <div className="muted" style={{ fontSize: 12 }}>
            Supports .txt, .pdf
          </div>
        </div>

        <div className="card">
          <div className="row">
            <input
              className="input"
              type="file"
              accept=".txt,.pdf,application/pdf,text/plain"
              onChange={handleFileChange}
            />
            <button className="button" onClick={handleUpload} disabled={!canUpload}>
              {status === 'reading' ? 'Uploading…' : 'Upload'}
            </button>
            {uploadedFile ? <span className="muted">{uploadedFile.name}</span> : <span className="muted">No file selected</span>}
          </div>

          {status === 'reading' ? <div className="muted">Uploading and analyzing…</div> : null}

          {error ? <div className="error">{error}</div> : null}

          {analysis ? (
            <div className="grid">
              <div className="card" style={{ padding: 14 }}>
                <div className="score">
                  <div>
                    <p className="sectionTitle">ATS Score</p>
                    <div className="scoreValue">{typeof analysis.score === 'number' ? `${analysis.score}%` : '—'}</div>
                  </div>
                  <div className="muted" style={{ fontSize: 12 }}>
                    out of 100
                  </div>
                </div>

                <div className="barTrack" aria-label="ATS score progress">
                  <div className="barFill" style={{ width: `${typeof analysis.score === 'number' ? analysis.score : 0}%` }} />
                </div>
              </div>

              <div className="card" style={{ padding: 14 }}>
                <p className="sectionTitle">Summary</p>
                {analysis.summary ? (
                  <p className="muted" style={{ margin: 0, whiteSpace: 'pre-line' }}>{analysis.summary}</p>
                ) : (
                  <p className="muted" style={{ margin: 0 }}>
                    {analysis.saved ? `Saved ${analysis.originalFilename ?? 'file'} (${analysis.bytes ?? 0} bytes).` : 'No summary returned yet.'}
                  </p>
                )}
              </div>

              <div className="card" style={{ padding: 14 }}>
                <p className="sectionTitle">Missing Skills</p>
                {(() => {
                  let list = splitToList(analysis.missing_skills)
                  if (list.length === 0) list = splitToList(analysis.missingSkills)
                  if (list.length === 0) return <p className="muted" style={{ margin: 0 }}>None</p>
                  return (
                    <ul className="list">
                      {list.map((s) => (
                        <li key={s}>{s}</li>
                      ))}
                    </ul>
                  )
                })()}
              </div>

              <div className="card" style={{ padding: 14 }}>
                <p className="sectionTitle">Suggestions</p>
                {(() => {
                  let list = splitToList(analysis.suggestions)
                  if (list.length === 0) list = splitToList(analysis.suggestionsList)
                  if (list.length === 0) return <p className="muted" style={{ margin: 0 }}>{analysis.message ?? 'No suggestions returned yet.'}</p>
                  return (
                    <ul className="list">
                      {list.map((s) => (
                        <li key={s}>{s}</li>
                      ))}
                    </ul>
                  )
                })()}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
