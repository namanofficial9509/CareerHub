from __future__ import annotations

import re
from datetime import datetime
from pathlib import Path
from typing import Any

import pdfplumber
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="ATS Resume Analyzer API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = Path(__file__).resolve().parent
UPLOAD_DIR = BASE_DIR / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

WEIGHTS = {
    "skills": 0.40,
    "projects": 0.30,
    "experience": 0.20,
    "education": 0.10,
}

DEGREE_PATTERNS: dict[str, list[str]] = {
    "Bachelors": [r"\bb\.?tech\b", r"\bb\.?e\b", r"\bbachelor'?s?\b", r"\bundergraduate\b"],
    "Masters": [r"\bm\.?tech\b", r"\bmaster'?s?\b", r"\bpostgraduate\b"],
    "PhD": [r"\bph\.?d\b", r"\bdoctorate\b"],
}

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
}

SKILL_PATTERNS: dict[str, list[str]] = {
    "Python": [r"\bpython\b"],
    "Java": [r"\bjava\b"],
    "JavaScript": [r"\bjavascript\b", r"\bjs\b"],
    "TypeScript": [r"\btypescript\b", r"\bts\b"],
    "C++": [r"\bc\+\+\b"],
    "React": [r"\breact(?:\.js)?\b"],
    "Node.js": [r"\bnode(?:\.js)?\b"],
    "Express": [r"\bexpress(?:\.js)?\b"],
    "Flask": [r"\bflask\b"],
    "Django": [r"\bdjango\b"],
    "FastAPI": [r"\bfastapi\b"],
    "REST APIs": [r"\brest(?:ful)?\b", r"\bapi(?:s)?\b"],
    "SQL": [r"\bsql\b"],
    "MySQL": [r"\bmysql\b"],
    "PostgreSQL": [r"\bpostgres(?:ql)?\b"],
    "MongoDB": [r"\bmongodb\b", r"\bmongo\b"],
    "Docker": [r"\bdocker\b"],
    "Kubernetes": [r"\bkubernetes\b", r"\bk8s\b"],
    "AWS": [r"\baws\b", r"\bamazon web services\b"],
    "Azure": [r"\bazure\b"],
    "GCP": [r"\bgcp\b", r"\bgoogle cloud\b"],
    "Git": [r"\bgit\b", r"\bgithub\b", r"\bgitlab\b"],
    "CI/CD": [r"\bci/cd\b", r"\bcontinuous integration\b", r"\bgithub actions\b", r"\bjenkins\b"],
    "Machine Learning": [r"\bmachine learning\b", r"\bml\b"],
    "Deep Learning": [r"\bdeep learning\b"],
    "NLP": [r"\bnlp\b", r"\bnatural language processing\b"],
    "TensorFlow": [r"\btensorflow\b"],
    "PyTorch": [r"\bpytorch\b"],
    "Pandas": [r"\bpandas\b"],
    "NumPy": [r"\bnumpy\b"],
}

PROJECT_TERMS = {
    "project",
    "projects",
    "built",
    "developed",
    "implemented",
    "deployed",
    "architecture",
    "microservices",
    "api",
    "apis",
    "full stack",
    "frontend",
    "backend",
    "integration",
    "testing",
}

EXPERIENCE_TERMS = {
    "experience",
    "internship",
    "production",
    "ownership",
    "collaborated",
    "team",
    "agile",
    "scrum",
    "stakeholders",
    "delivery",
    "lead",
}

EDUCATION_TERMS = {
    "b.tech",
    "btech",
    "b.e",
    "be",
    "bachelor",
    "master",
    "m.tech",
    "mtech",
    "degree",
    "cgpa",
    "gpa",
    "university",
    "college",
    "computer science",
    "information technology",
}

SECTION_HEADER_PATTERNS = {
    "skills": ["skills", "technical skills", "core skills", "key skills", "competencies"],
    "projects": ["projects", "academic projects", "personal projects", "project experience"],
    "experience": ["experience", "work experience", "professional experience", "internship", "internships"],
    "education": ["education", "academics", "academic", "qualifications", "education details"],
}


def normalize_text(text: str) -> str:
    return re.sub(r"\s+", " ", (text or "")).strip().lower()


def extract_pdf_text(path: Path) -> str:
    parts: list[str] = []
    with pdfplumber.open(str(path)) as pdf:
        for page in pdf.pages:
            parts.append(page.extract_text() or "")
    return "\n".join(parts)


def extract_resume_text(uploaded_file: UploadFile, save_path: Path) -> str:
    suffix = save_path.suffix.lower()
    if suffix == ".pdf" or (uploaded_file.content_type or "").lower() == "application/pdf":
        return extract_pdf_text(save_path)

    if suffix == ".txt" or (uploaded_file.content_type or "").lower() == "text/plain":
        return save_path.read_text(encoding="utf-8", errors="ignore")

    raise HTTPException(status_code=400, detail="Unsupported file type. Upload .pdf or .txt")


def canonical_skills_in_text(text: str) -> list[str]:
    text_lower = normalize_text(text)
    matched: list[str] = []
    for skill, patterns in SKILL_PATTERNS.items():
        if any(re.search(p, text_lower) for p in patterns):
            matched.append(skill)
    return matched


def extract_terms_by_vocab(text: str, vocab: set[str]) -> list[str]:
    text_lower = normalize_text(text)
    found: list[str] = []
    for term in vocab:
        if term in text_lower:
            found.append(term)
    return sorted(set(found))


def unique_keep_order(items: list[str]) -> list[str]:
    seen: set[str] = set()
    out: list[str] = []
    for item in items:
        key = item.strip().lower()
        if not key or key in seen:
            continue
        seen.add(key)
        out.append(item)
    return out


def extract_min_years_requirement(text: str) -> int | None:
    text_lower = normalize_text(text)
    patterns = [
        r"(\d{1,2})\+?\s*(?:years|year|yrs)\s+of\s+experience",
        r"(\d{1,2})\+?\s*(?:years|year|yrs)\s+experience",
        r"minimum\s+of\s+(\d{1,2})\+?\s*(?:years|year|yrs)",
        r"at\s+least\s+(\d{1,2})\+?\s*(?:years|year|yrs)",
    ]
    values: list[int] = []
    for pattern in patterns:
        for match in re.finditer(pattern, text_lower):
            try:
                values.append(int(match.group(1)))
            except Exception:
                continue
    return max(values) if values else None


def extract_resume_years(text: str) -> float | None:
    text_lower = normalize_text(text)
    values: list[float] = []

    for match in re.finditer(r"(\d{1,2}(?:\.\d+)?)\+?\s*(?:years|year|yrs)", text_lower):
        try:
            values.append(float(match.group(1)))
        except Exception:
            continue

    # Parse month-based experience such as "6 months" and convert to years.
    for match in re.finditer(r"(\d{1,2})\+?\s*(?:months|month|mos)", text_lower):
        try:
            months = int(match.group(1))
            values.append(round(months / 12.0, 2))
        except Exception:
            continue

    # Parse ranges like "2022-2024" as rough experience hints.
    for match in re.finditer(r"\b(19\d{2}|20\d{2})\s*[-–]\s*(19\d{2}|20\d{2}|present|current)\b", text_lower):
        try:
            start = int(match.group(1))
            end_raw = match.group(2)
            if end_raw in {"present", "current"}:
                # Keep estimate conservative for ATS checks.
                continue
            end = int(end_raw)
            if end > start:
                values.append(float(end - start))
        except Exception:
            continue

    month_map = {
        "jan": 1,
        "january": 1,
        "feb": 2,
        "february": 2,
        "mar": 3,
        "march": 3,
        "apr": 4,
        "april": 4,
        "may": 5,
        "jun": 6,
        "june": 6,
        "jul": 7,
        "july": 7,
        "aug": 8,
        "august": 8,
        "sep": 9,
        "sept": 9,
        "september": 9,
        "oct": 10,
        "october": 10,
        "nov": 11,
        "november": 11,
        "dec": 12,
        "december": 12,
    }

    current = datetime.utcnow()
    current_month_index = current.year * 12 + current.month

    # Examples: Jan 2023 - Jun 2024, March 2022 to Present
    month_year_ranges = re.finditer(
        r"\b(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t|tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\s+(19\d{2}|20\d{2})\s*(?:-|–|to)\s*(present|current|jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t|tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\s*(?:(19\d{2}|20\d{2}))?\b",
        text_lower,
    )
    for match in month_year_ranges:
        try:
            start_month = month_map.get(match.group(1), 0)
            start_year = int(match.group(2))
            end_token = match.group(3)
            end_year_token = match.group(4)

            if end_token in {"present", "current"}:
                end_month = current.month
                end_year = current.year
            else:
                end_month = month_map.get(end_token, 0)
                end_year = int(end_year_token) if end_year_token else start_year

            if start_month and end_month:
                start_index = start_year * 12 + start_month
                end_index = end_year * 12 + end_month
                if end_index >= start_index:
                    months = min(end_index, current_month_index) - start_index + 1
                    values.append(round(months / 12.0, 2))
        except Exception:
            continue

    # Examples: 03/2022 - 11/2023, 7/2021 to present
    numeric_month_ranges = re.finditer(
        r"\b(0?[1-9]|1[0-2])\/(19\d{2}|20\d{2})\s*(?:-|–|to)\s*(present|current|(0?[1-9]|1[0-2])\/(19\d{2}|20\d{2}))\b",
        text_lower,
    )
    for match in numeric_month_ranges:
        try:
            start_month = int(match.group(1))
            start_year = int(match.group(2))
            end_token = match.group(3)

            if end_token in {"present", "current"}:
                end_month = current.month
                end_year = current.year
            else:
                end_month = int(match.group(4))
                end_year = int(match.group(5))

            start_index = start_year * 12 + start_month
            end_index = end_year * 12 + end_month
            if end_index >= start_index:
                months = min(end_index, current_month_index) - start_index + 1
                values.append(round(months / 12.0, 2))
        except Exception:
            continue

    return max(values) if values else None


def detect_required_degrees(jd_text: str) -> list[str]:
    jd_lower = normalize_text(jd_text)
    required: list[str] = []
    for degree, patterns in DEGREE_PATTERNS.items():
        if any(re.search(pattern, jd_lower) for pattern in patterns):
            required.append(degree)
    return required


def has_degree(text: str, degree: str) -> bool:
    patterns = DEGREE_PATTERNS.get(degree, [])
    text_lower = normalize_text(text)
    return any(re.search(pattern, text_lower) for pattern in patterns)


def _alias_to_pattern(alias: str) -> str:
    return re.escape(alias).replace(r"\ ", r"\s+")


def _prepare_text_for_section_parsing(resume_text: str) -> str:
    text = (resume_text or "").replace("\r\n", "\n").replace("\r", "\n")

    # Insert a line break before known headings when they appear inline as "Heading:".
    for aliases in SECTION_HEADER_PATTERNS.values():
        for alias in aliases:
            alias_pattern = _alias_to_pattern(alias)
            text = re.sub(
                rf"(?<!\n)(?P<h>\b{alias_pattern}\b\s*[:\-])",
                r"\n\g<h>",
                text,
                flags=re.IGNORECASE,
            )
    return text


def detect_section_header(line: str) -> tuple[str | None, str]:
    candidate = re.sub(r"^[\s\-\*#\d\.)]+", "", line.strip())
    if not candidate:
        return None, ""

    for section, aliases in SECTION_HEADER_PATTERNS.items():
        for alias in aliases:
            alias_pattern = _alias_to_pattern(alias)

            # Heading only: "Skills", "SKILLS:", "Work Experience -"
            if re.match(rf"^(?:{alias_pattern})\s*[:\-]?\s*$", candidate, flags=re.IGNORECASE):
                return section, ""

            # Inline content: "Skills: Python, SQL"
            inline = re.match(rf"^(?:{alias_pattern})\s*[:\-]\s*(.+)$", candidate, flags=re.IGNORECASE)
            if inline:
                return section, inline.group(1).strip()

    return None, ""


def split_resume_sections(resume_text: str) -> dict[str, str]:
    text = _prepare_text_for_section_parsing(resume_text)

    blocks: dict[str, list[str]] = {
        "skills": [],
        "projects": [],
        "experience": [],
        "education": [],
    }

    current_section: str | None = None

    for raw_line in text.split("\n"):
        line = raw_line.strip()
        if not line:
            continue

        detected_section, inline_text = detect_section_header(line)
        if detected_section:
            current_section = detected_section
            if inline_text:
                blocks[current_section].append(inline_text)
            continue

        if current_section:
            blocks[current_section].append(line)

    return {
        "skills": "\n".join(blocks["skills"]).strip(),
        "projects": "\n".join(blocks["projects"]).strip(),
        "experience": "\n".join(blocks["experience"]).strip(),
        "education": "\n".join(blocks["education"]).strip(),
    }


def _score_with_section_fallback(jd_terms: list[str], section_text: str, full_resume_text: str) -> float:
    if section_text.strip():
        return section_match_score(jd_terms, section_text)

    # If section is missing in plain text resumes, use whole resume with mild penalty.
    return round(section_match_score(jd_terms, full_resume_text) * 0.70, 2)


def section_match_score(jd_terms: list[str], section_text: str) -> float:
    if not jd_terms:
        return 100.0
    if not section_text.strip():
        return 0.0

    section_lower = normalize_text(section_text)

    def term_matches(term: str) -> bool:
        if term in SKILL_PATTERNS:
            return any(re.search(pattern, section_lower) for pattern in SKILL_PATTERNS[term])

        normalized_term = normalize_text(term)
        if not normalized_term:
            return False
        return bool(re.search(rf"\b{re.escape(normalized_term)}\b", section_lower))

    matched = [term for term in jd_terms if term_matches(term)]
    return round((len(matched) / len(jd_terms)) * 100, 2)


def section_match_detail(jd_terms: list[str], section_text: str) -> tuple[float, list[str], list[str]]:
    if not jd_terms:
        return 100.0, [], []
    if not section_text.strip():
        return 0.0, [], list(jd_terms)

    section_lower = normalize_text(section_text)

    def term_matches(term: str) -> bool:
        if term in SKILL_PATTERNS:
            return any(re.search(pattern, section_lower) for pattern in SKILL_PATTERNS[term])

        normalized_term = normalize_text(term)
        if not normalized_term:
            return False
        return bool(re.search(rf"\b{re.escape(normalized_term)}\b", section_lower))

    matched = [term for term in jd_terms if term_matches(term)]
    missing = [term for term in jd_terms if term not in set(matched)]
    score = round((len(matched) / len(jd_terms)) * 100, 2)
    return score, matched, missing


def generate_suggestions(
    section_scores: dict[str, float],
    missing_skills: list[str],
    sections: dict[str, str],
    min_years_required: int | None,
    resume_years: int | None,
) -> list[str]:
    suggestions: list[str] = []

    if missing_skills:
        skills_preview = ", ".join(missing_skills[:6])
        suggestions.append(f"Add missing JD skills with proof in projects/experience: {skills_preview}.")

    if section_scores.get("projects", 0) < 65:
        suggestions.append("Strengthen Projects section with 2-3 bullets per project: tech stack, your role, and measurable outcomes.")

    if section_scores.get("experience", 0) < 65:
        suggestions.append("Rewrite Experience bullets using action verbs and quantified impact (%, time saved, users served).")

    if section_scores.get("education", 0) < 65:
        suggestions.append("Clarify Education details: degree, specialization, institute, graduation year, and CGPA/GPA.")

    resume_text = "\n".join(sections.values()).lower()
    has_metrics = bool(re.search(r"\b\d+(?:\.\d+)?%?\b", resume_text))
    if not has_metrics:
        suggestions.append("Include quantified achievements in projects/experience to improve ATS and recruiter readability.")

    has_action_verbs = any(re.search(rf"\b{verb}\b", resume_text) for verb in ACTION_VERBS)
    if not has_action_verbs:
        suggestions.append("Start bullet points with strong action verbs like Built, Designed, Optimized, Implemented.")

    if min_years_required is not None and (resume_years is None or resume_years < min_years_required):
        suggestions.append("If applicable, clearly mention total relevant experience duration to satisfy JD experience requirements.")

    if not suggestions:
        suggestions.append("Good ATS alignment. Tailor keywords per job and keep quantified impact in each section.")

    return suggestions[:6]


def compute_ats_score(resume_text: str, job_description: str) -> dict[str, Any]:
    sections = split_resume_sections(resume_text)

    jd_skill_terms = canonical_skills_in_text(job_description)
    jd_project_terms_raw = extract_terms_by_vocab(job_description, PROJECT_TERMS)
    jd_project_terms = [term for term in jd_project_terms_raw if term not in {"project", "projects"}]

    jd_experience_terms_raw = extract_terms_by_vocab(job_description, EXPERIENCE_TERMS)
    jd_experience_terms = [term for term in jd_experience_terms_raw if term not in {"experience"}]

    jd_education_terms = extract_terms_by_vocab(job_description, EDUCATION_TERMS)
    jd_degrees = detect_required_degrees(job_description)
    min_years_required = extract_min_years_requirement(job_description)
    resume_years = extract_resume_years(resume_text)

    skills_score, skills_matched, skills_missing = section_match_detail(jd_skill_terms, sections["skills"])
    if not sections["skills"].strip():
        skills_score = round(section_match_score(jd_skill_terms, resume_text) * 0.70, 2)
        _, skills_matched, skills_missing = section_match_detail(jd_skill_terms, resume_text)

    # Projects are often judged by both project vocabulary and required skills used in projects.
    project_requirements = unique_keep_order(jd_project_terms + jd_skill_terms[:6])
    projects_score, projects_matched, projects_missing = section_match_detail(project_requirements, sections["projects"])
    if not sections["projects"].strip():
        projects_score = round(section_match_score(project_requirements, resume_text) * 0.70, 2)
        _, projects_matched, projects_missing = section_match_detail(project_requirements, resume_text)

    experience_score, experience_matched, experience_missing = section_match_detail(
        jd_experience_terms,
        sections["experience"],
    )
    if not sections["experience"].strip():
        experience_score = round(section_match_score(jd_experience_terms, resume_text) * 0.70, 2)
        _, experience_matched, experience_missing = section_match_detail(jd_experience_terms, resume_text)

    if min_years_required is not None:
        if resume_years is None:
            years_score = 0.0
        else:
            years_score = min(100.0, round((resume_years / min_years_required) * 100, 2))
        experience_score = round(experience_score * 0.70 + years_score * 0.30, 2)

    education_score, education_matched, education_missing = section_match_detail(jd_education_terms, sections["education"])
    if not sections["education"].strip():
        education_score = round(section_match_score(jd_education_terms, resume_text) * 0.70, 2)
        _, education_matched, education_missing = section_match_detail(jd_education_terms, resume_text)

    if jd_degrees:
        degree_hits = [degree for degree in jd_degrees if has_degree(sections["education"] or resume_text, degree)]
        degree_score = round((len(degree_hits) / len(jd_degrees)) * 100, 2)
        education_score = round(education_score * 0.60 + degree_score * 0.40, 2)

    overall_score = round(
        skills_score * WEIGHTS["skills"]
        + projects_score * WEIGHTS["projects"]
        + experience_score * WEIGHTS["experience"]
        + education_score * WEIGHTS["education"],
        2,
    )

    missing_skills = skills_missing

    section_scores = {
        "skills": skills_score,
        "projects": projects_score,
        "experience": experience_score,
        "education": education_score,
    }

    suggestions = generate_suggestions(
        section_scores=section_scores,
        missing_skills=missing_skills,
        sections=sections,
        min_years_required=min_years_required,
        resume_years=resume_years,
    )

    return {
        "ats_score": overall_score,
        "sections": sections,
        "section_scores": section_scores,
        "missing_skills": missing_skills,
        "suggestions": suggestions,
        "debug": {
            "section_match": {
                "skills": {"matched": skills_matched, "missing": skills_missing},
                "projects": {"matched": projects_matched, "missing": projects_missing},
                "experience": {"matched": experience_matched, "missing": experience_missing},
                "education": {"matched": education_matched, "missing": education_missing},
            },
            "jd_requirements": {
                "skills": jd_skill_terms,
                "projects": jd_project_terms,
                "experience": jd_experience_terms,
                "education": jd_education_terms,
                "degrees": jd_degrees,
                "min_years": min_years_required,
                "resume_years_estimate": resume_years,
            }
        },
    }


@app.get("/health")
def health() -> dict[str, bool]:
    return {"ok": True}


@app.post("/analyze")
async def analyze_resume(
    job_description: str = Form(...),
    resume: UploadFile = File(...),
) -> dict[str, Any]:
    if not job_description.strip():
        raise HTTPException(status_code=400, detail="job_description is required")

    safe_name = re.sub(r"[^a-zA-Z0-9_.-]", "_", resume.filename or "resume.txt")
    save_path = UPLOAD_DIR / safe_name

    contents = await resume.read()
    save_path.write_bytes(contents)

    resume_text = extract_resume_text(resume, save_path)
    if not resume_text.strip():
        raise HTTPException(status_code=400, detail="Could not extract resume text")

    result = compute_ats_score(resume_text=resume_text, job_description=job_description)

    return {
        "message": "Analysis completed",
        "overall_ats_score": result["ats_score"],
        "sections": result["sections"],
        "section_scores": result["section_scores"],
        "missing_skills": result["missing_skills"],
        "suggestions": result["suggestions"],
        "debug": result["debug"],
    }


# Run with:
# uvicorn backend.fastapi_app:app --reload --port 8000
