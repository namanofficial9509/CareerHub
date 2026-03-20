from __future__ import annotations

import json
import os
from datetime import datetime
from pathlib import Path

from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
from werkzeug.utils import secure_filename

import pdfplumber

try:
    import google.generativeai as genai
except Exception:  # pragma: no cover
    genai = None

BASE_DIR = Path(__file__).resolve().parent
UPLOAD_DIR = BASE_DIR / "uploads"

ATS_KEYWORDS = [
    "python",
    "ai",
    "machine learning",
    "sql",
    "projects",
]


def ats_score_percentage(resume_text_lower: str) -> tuple[int, list[str]]:
    text = (resume_text_lower or "").lower()
    matched = [kw for kw in ATS_KEYWORDS if kw in text]
    score = round((len(matched) / len(ATS_KEYWORDS)) * 100) if ATS_KEYWORDS else 0
    return int(score), matched


def fallback_insights(resume_text: str, matched_keywords: list[str]) -> tuple[str, str, str]:
    lines: list[str] = []
    for raw in (resume_text or "").splitlines():
        s = raw.strip().lstrip("\ufeff")
        if not s:
            continue
        lines.append(s[:140])
        if len(lines) >= 3:
            break
    while len(lines) < 3:
        lines.append("")

    summary_text = "\n".join([ln for ln in lines if ln.strip()]).strip()

    missing = [kw for kw in ATS_KEYWORDS if kw not in set(matched_keywords or [])]
    missing_text = "\n".join(missing).strip()
    if not missing_text:
        missing_text = "None"

    suggestions: list[str] = []
    if missing:
        for kw in missing[:5]:
            suggestions.append(f"Add concrete evidence of {kw} in experience/projects (tools used + measurable impact).")
    else:
        suggestions = [
            "Quantify impact with metrics (%, $, time saved).",
            "Add a dedicated Skills section tailored to the job description keywords.",
            "Ensure each project lists tech stack + outcomes in 1–2 bullets.",
        ]

    suggestions_text = "\n".join(suggestions[:5]).strip()
    return summary_text, missing_text, suggestions_text


def _try_parse_json_object(text: str) -> dict:
    raw = (text or "").strip()
    if raw.startswith("```"):
        # Remove fenced code blocks if the model wraps JSON.
        raw = raw.strip("`")
        lines = raw.splitlines()
        # Drop optional language identifier line (e.g., json)
        if lines and lines[0].strip().lower() in {"json", "javascript"}:
            lines = lines[1:]
        raw = "\n".join(lines).strip()

    start = raw.find("{")
    end = raw.rfind("}")
    if start == -1 or end == -1 or end <= start:
        return {}

    try:
        return json.loads(raw[start : end + 1])
    except Exception:
        return {}


def gemini_resume_insights(resume_text: str) -> dict:
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key or genai is None:
        return {}

    genai.configure(api_key=api_key)
    model = genai.GenerativeModel("gemini-1.5-flash")

    prompt = (
        "You are an ATS resume reviewer.\n"
        "Given the resume text below, return STRICT JSON only (no markdown).\n"
        "Keep it short and structured.\n\n"
        "JSON schema:\n"
        "{\n"
        '  "summary": ["line1", "line2", "line3"],\n'
        '  "missing_skills": ["skill1", "skill2"],\n'
        '  "suggestions": ["suggestion1", "suggestion2", "suggestion3"]\n'
        "}\n\n"
        "Rules:\n"
        "- summary must be exactly 3 short lines\n"
        "- missing_skills: max 8 items\n"
        "- suggestions: max 5 items\n"
        "- Do not invent certifications or employers\n\n"
        "Resume text:\n"
        f"{resume_text}\n"
    )

    resp = model.generate_content(
        prompt,
        generation_config={
            "temperature": 0.2,
            "max_output_tokens": 512,
        },
    )

    data = _try_parse_json_object(getattr(resp, "text", "") or "")
    if not isinstance(data, dict):
        return {}

    summary = data.get("summary")
    missing = data.get("missing_skills")
    suggestions = data.get("suggestions")

    if not isinstance(summary, list) or not all(isinstance(x, str) for x in summary):
        summary = []
    if not isinstance(missing, list) or not all(isinstance(x, str) for x in missing):
        missing = []
    if not isinstance(suggestions, list) or not all(isinstance(x, str) for x in suggestions):
        suggestions = []

    summary = [s.strip() for s in summary][:3]
    while len(summary) < 3:
        summary.append("")

    missing = [s.strip() for s in missing if s.strip()][:8]
    suggestions = [s.strip() for s in suggestions if s.strip()][:5]

    return {
        "summary_lines": summary,
        "missing_skills": missing,
        "suggestions": suggestions,
    }


def create_app() -> Flask:
    app = Flask(__name__)
    CORS(app)

    # Load GEMINI_API_KEY from the repo root .env (if present).
    load_dotenv(BASE_DIR.parent / ".env")

    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

    @app.get("/health")
    def health():
        return jsonify({"ok": True})

    @app.post("/analyze")
    def analyze():
        # Accept common field names, fallback to the first uploaded file.
        uploaded = request.files.get("resume") or request.files.get("file")
        if uploaded is None and len(request.files) > 0:
            uploaded = next(iter(request.files.values()))

        if uploaded is None or uploaded.filename is None or uploaded.filename.strip() == "":
            return jsonify({"error": "No file uploaded."}), 400

        original_name = uploaded.filename
        safe_name = secure_filename(original_name)
        if safe_name == "":
            safe_name = "upload"

        timestamp = datetime.utcnow().strftime("%Y%m%dT%H%M%SZ")
        saved_name = f"{timestamp}_{safe_name}"
        saved_path = UPLOAD_DIR / saved_name

        uploaded.save(saved_path)

        size = saved_path.stat().st_size

        def extract_pdf_text_combined(path: Path) -> str:
            parts: list[str] = []
            with pdfplumber.open(str(path)) as pdf:
                for page in pdf.pages:
                    page_text = page.extract_text() or ""
                    parts.append(page_text)
            return "\n".join(parts)

        is_pdf = saved_path.suffix.lower() == ".pdf" or (uploaded.mimetype or "").lower() == "application/pdf"

        if is_pdf:
            text_original = extract_pdf_text_combined(saved_path)
        elif saved_path.suffix.lower() == ".txt" or (uploaded.mimetype or "").lower() == "text/plain":
            text_original = saved_path.read_text(encoding="utf-8", errors="ignore")
        else:
            return jsonify({"error": "Unsupported file type. Please upload a .pdf or .txt."}), 400

        text_lower = (text_original or "").lower()
        score, matched = ats_score_percentage(text_lower)

        insights = {}
        try:
            insights = gemini_resume_insights(text_original)
        except Exception:
            insights = {}

        summary_lines = insights.get("summary_lines") if isinstance(insights, dict) else None
        missing_skills = insights.get("missing_skills") if isinstance(insights, dict) else None
        suggestions = insights.get("suggestions") if isinstance(insights, dict) else None

        summary_text = "\n".join(summary_lines).strip() if isinstance(summary_lines, list) else ""
        missing_skills_text = "\n".join(missing_skills).strip() if isinstance(missing_skills, list) else ""
        suggestions_text = "\n".join(suggestions).strip() if isinstance(suggestions, list) else ""

        if not summary_text or not missing_skills_text or not suggestions_text:
            fb_summary, fb_missing, fb_suggestions = fallback_insights(text_original, matched)
            if not summary_text:
                summary_text = fb_summary
            if not missing_skills_text:
                missing_skills_text = fb_missing
            if not suggestions_text:
                suggestions_text = fb_suggestions

        if not (missing_skills_text or "").strip():
            missing_skills_text = "None"

        # Exact response schema requested.
        return jsonify(
            {
                "score": score,
                "summary": summary_text,
                "missing_skills": missing_skills_text,
                "suggestions": suggestions_text,
            }
        )

    return app


if __name__ == "__main__":
    port = int(os.environ.get("PORT", "5000"))
    app = create_app()
    # On Windows, the debug reloader can sometimes pick up noisy file changes
    # from the Python installation. Keep debug behavior, but disable the reloader.
    app.run(host="0.0.0.0", port=port, debug=True, use_reloader=False)
