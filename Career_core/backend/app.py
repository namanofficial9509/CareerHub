from __future__ import annotations

import json
import os
import re
from datetime import datetime
from pathlib import Path

from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS
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

SKILL_PATTERNS: dict[str, list[str]] = {
    "Python": [r"\bpython\b"],
    "Java": [r"\bjava\b"],
    "JavaScript": [r"\bjavascript\b", r"\bjs\b"],
    "TypeScript": [r"\btypescript\b", r"\bts\b"],
    "C++": [r"\bc\+\+\b"],
    "C#": [r"\bc#\b", r"\bcsharp\b"],
    "React": [r"\breact(?:\.js)?\b"],
    "Next.js": [r"\bnext(?:\.js)?\b"],
    "Angular": [r"\bangular\b"],
    "Vue": [r"\bvue(?:\.js)?\b"],
    "Node.js": [r"\bnode(?:\.js)?\b"],
    "Express": [r"\bexpress(?:\.js)?\b"],
    "Flask": [r"\bflask\b"],
    "Django": [r"\bdjango\b"],
    "FastAPI": [r"\bfastapi\b"],
    "REST APIs": [r"\brest(?:ful)?\b", r"\bapi(?:s)?\b"],
    "GraphQL": [r"\bgraphql\b"],
    "SQL": [r"\bsql\b"],
    "MySQL": [r"\bmysql\b"],
    "PostgreSQL": [r"\bpostgres(?:ql)?\b"],
    "MongoDB": [r"\bmongodb\b", r"\bmongo\b"],
    "Redis": [r"\bredis\b"],
    "Firebase": [r"\bfirebase\b"],
    "Docker": [r"\bdocker\b"],
    "Kubernetes": [r"\bkubernetes\b", r"\bk8s\b"],
    "AWS": [r"\baws\b", r"\bamazon web services\b"],
    "Azure": [r"\bazure\b"],
    "GCP": [r"\bgcp\b", r"\bgoogle cloud\b"],
    "Git": [r"\bgit\b", r"\bgithub\b", r"\bgitlab\b"],
    "CI/CD": [r"\bci/cd\b", r"\bcontinuous integration\b", r"\bgithub actions\b", r"\bjenkins\b"],
    "Linux": [r"\blinux\b"],
    "Machine Learning": [r"\bmachine learning\b", r"\bml\b"],
    "Deep Learning": [r"\bdeep learning\b"],
    "NLP": [r"\bnlp\b", r"\bnatural language processing\b"],
    "TensorFlow": [r"\btensorflow\b"],
    "PyTorch": [r"\bpytorch\b"],
    "Scikit-learn": [r"\bscikit[- ]learn\b", r"\bsklearn\b"],
    "Pandas": [r"\bpandas\b"],
    "NumPy": [r"\bnumpy\b"],
    "Data Analysis": [r"\bdata analysis\b", r"\bdata analytics\b"],
    "Power BI": [r"\bpower\s?bi\b"],
    "Tableau": [r"\btableau\b"],
    "Excel": [r"\bexcel\b", r"\bspreadsheets?\b"],
    "Agile": [r"\bagile\b"],
    "Scrum": [r"\bscrum\b"],
}

DEFAULT_TARGET_SKILLS = ["Python", "SQL", "Machine Learning", "Git", "Projects"]
ACTION_VERBS = {
    "built",
    "developed",
    "implemented",
    "designed",
    "delivered",
    "optimized",
    "improved",
    "led",
    "created",
    "deployed",
    "automated",
    "integrated",
    "analyzed",
}


def _contains_any_pattern(text_lower: str, patterns: list[str]) -> bool:
    return any(re.search(pattern, text_lower) for pattern in patterns)


def extract_target_skills_from_jd(job_description: str, limit: int = 14) -> list[str]:
    jd_lower = (job_description or "").lower()
    if not jd_lower.strip():
        return DEFAULT_TARGET_SKILLS

    matched: list[str] = []
    for skill, patterns in SKILL_PATTERNS.items():
        if _contains_any_pattern(jd_lower, patterns):
            matched.append(skill)

    # Prioritize concrete technical skills when many are present.
    ranked = sorted(matched, key=lambda s: ("Agile" in s or "Scrum" in s, len(s)))
    if not ranked:
        return DEFAULT_TARGET_SKILLS
    return ranked[:limit]


def match_resume_against_skills(resume_text_lower: str, target_skills: list[str]) -> list[str]:
    matched: list[str] = []
    text = resume_text_lower or ""
    for skill in target_skills:
        patterns = SKILL_PATTERNS.get(skill)
        if patterns and _contains_any_pattern(text, patterns):
            matched.append(skill)
        elif not patterns and re.search(rf"\b{re.escape(skill.lower())}\b", text):
            matched.append(skill)
    return matched


def calculate_ats_score(resume_text: str, target_skills: list[str], matched_skills: list[str]) -> int:
    text_lower = (resume_text or "").lower()

    # 75% weight: target skill match quality.
    skill_ratio = (len(matched_skills) / len(target_skills)) if target_skills else 0.0
    skill_points = skill_ratio * 75.0

    # 15% weight: resume structure signals ATS tools typically parse.
    section_hits = 0
    for section in ("experience", "projects", "skills", "education"):
        if re.search(rf"\b{section}\b", text_lower):
            section_hits += 1
    structure_points = min(15.0, section_hits * 3.75)

    # 10% weight: measurable impact and action-oriented wording.
    metric_hits = len(re.findall(r"\b\d+(?:\.\d+)?%?\b", text_lower))
    action_hits = sum(1 for verb in ACTION_VERBS if re.search(rf"\b{verb}\b", text_lower))
    impact_points = min(10.0, metric_hits * 1.2 + action_hits * 0.9)

    score = round(skill_points + structure_points + impact_points)
    return max(0, min(100, int(score)))


def fallback_insights(
    resume_text: str,
    matched_keywords: list[str],
    target_keywords: list[str],
    using_custom_jd: bool,
) -> tuple[str, str, str]:
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

    missing = [kw for kw in target_keywords if kw not in set(matched_keywords or [])]
    missing_text = "\n".join(missing).strip()
    if not missing_text:
        missing_text = "None"

    suggestions: list[str] = []
    if missing:
        for kw in missing[:4]:
            suggestions.append(
                f"Add {kw} with proof in projects/experience (tech used + measurable impact)."
            )
        suggestions.append("Include 2-3 quantified bullets (%, time saved, users served) for ATS and recruiter impact.")
    else:
        suggestions = [
            "Quantify impact with metrics (%, $, time saved).",
            "Add a dedicated Skills section tailored to the job description keywords.",
            "Ensure each project lists tech stack + outcomes in 1-2 bullets.",
        ]

    if using_custom_jd:
        suggestions.append("Mirror the exact language from the target job description where truthful and applicable.")

    suggestions_text = "\n".join(suggestions[:5]).strip()
    return summary_text, missing_text, suggestions_text


def _try_parse_json_object(text: str) -> dict:
    raw = (text or "").strip()
    if raw.startswith("```"):
        raw = raw.strip("`")
        lines = raw.splitlines()
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


def gemini_resume_insights(resume_text: str, job_description: str | None = None) -> dict:
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key or genai is None:
        return {}

    genai.configure(api_key=api_key)
    model = genai.GenerativeModel("gemini-1.5-flash")

    jd_block = f"Target job description:\n{job_description}\n\n" if (job_description or "").strip() else ""

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
        f"{jd_block}"
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

    load_dotenv(BASE_DIR.parent / ".env")
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

    @app.get("/health")
    def health():
        return jsonify({"ok": True})

    @app.post("/analyze")
    def analyze():
        job_description = (
            request.form.get("job_description")
            or request.form.get("jobDescription")
            or request.form.get("jd")
            or ""
        ).strip()

        target_keywords = extract_target_skills_from_jd(job_description)
        if not target_keywords:
            target_keywords = DEFAULT_TARGET_SKILLS

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

        is_pdf = saved_path.suffix.lower() == ".pdf" or (uploaded.mimetype or "").lower() == "application/pdf"

        if is_pdf:
            text_parts: list[str] = []
            with pdfplumber.open(str(saved_path)) as pdf:
                for page in pdf.pages:
                    text_parts.append(page.extract_text() or "")
            text_original = "\n".join(text_parts)
        elif saved_path.suffix.lower() == ".txt" or (uploaded.mimetype or "").lower() == "text/plain":
            text_original = saved_path.read_text(encoding="utf-8", errors="ignore")
        else:
            return jsonify({"error": "Unsupported file type. Please upload a .pdf or .txt."}), 400

        text_lower = (text_original or "").lower()
        matched = match_resume_against_skills(text_lower, target_keywords)
        score = calculate_ats_score(text_original, target_keywords, matched)

        insights = {}
        try:
            insights = gemini_resume_insights(text_original, job_description or None)
        except Exception:
            insights = {}

        summary_lines = insights.get("summary_lines") if isinstance(insights, dict) else None
        missing_skills = insights.get("missing_skills") if isinstance(insights, dict) else None
        suggestions = insights.get("suggestions") if isinstance(insights, dict) else None

        summary_text = "\n".join(summary_lines).strip() if isinstance(summary_lines, list) else ""

        # Keep missing skills grounded in JD-targeted skills to avoid noisy word-level output.
        deterministic_missing = [kw for kw in target_keywords if kw not in set(matched)]

        missing_from_ai = [s.strip() for s in (missing_skills or []) if isinstance(s, str) and s.strip()]
        normalized_targets = {kw.lower(): kw for kw in target_keywords}
        filtered_ai_missing = []
        for item in missing_from_ai:
            normalized = item.lower()
            if normalized in normalized_targets:
                filtered_ai_missing.append(normalized_targets[normalized])

        final_missing = filtered_ai_missing or deterministic_missing
        missing_skills_text = "\n".join(final_missing[:8]).strip()
        suggestions_text = "\n".join(suggestions).strip() if isinstance(suggestions, list) else ""

        if not summary_text or not missing_skills_text or not suggestions_text:
            fb_summary, fb_missing, fb_suggestions = fallback_insights(
                text_original,
                matched,
                target_keywords,
                using_custom_jd=bool(job_description),
            )
            if not summary_text:
                summary_text = fb_summary
            if not missing_skills_text:
                missing_skills_text = fb_missing
            if not suggestions_text:
                suggestions_text = fb_suggestions

        if not (missing_skills_text or "").strip():
            missing_skills_text = "None"

        return jsonify(
            {
                "score": score,
                "summary": summary_text,
                "missing_skills": missing_skills_text,
                "suggestions": suggestions_text,
                "matched_keywords": matched,
                "target_keywords": target_keywords,
                "used_job_description": bool(job_description),
            }
        )

    return app


if __name__ == "__main__":
    port = int(os.environ.get("PORT", "5000"))
    app = create_app()
    app.run(host="0.0.0.0", port=port, debug=True, use_reloader=False)
