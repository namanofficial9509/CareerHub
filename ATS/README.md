# ATS Resume Analyzer (UI)

Simple React UI that uploads a resume file and shows an ATS-style score, summary, missing skills, and suggestions.

## Setup on a new computer

Prereqs:
- Node.js 18+ and npm
- Python 3.10+ (recommended: 3.11)

Steps:
1) Clone the repo:
	- `git clone <your-repo-url>`
	- `cd ATS`
2) Create `.env` in the repo root with your Gemini key:
	- `GEMINI_API_KEY=YOUR_KEY_HERE`
3) Backend (Flask):
	- Create a virtual env (recommended):
		- Windows PowerShell: `python -m venv .venv`
		- Activate: `./.venv/Scripts/Activate.ps1`
	- Install deps: `python -m pip install -r backend/requirements.txt`
	- Run API: `python backend/app.py`
4) Frontend (Vite/React):
	- `npm install`
	- `npm run dev`

Open the UI URL printed by Vite (example: `http://localhost:5173/`).

## Run

- Install: `npm install`
- Start Flask API (in one terminal):
	- `python -m pip install -r backend/requirements.txt`
	- `python backend/app.py`
- Start UI (in another terminal): `npm run dev`
- Build: `npm run build`
- Preview: `npm run preview`

Notes:
- Supports `.txt` and `.pdf`.
- UI sends the selected file to `POST http://localhost:5000/analyze` (and falls back to `http://127.0.0.1:5000/analyze` if needed).
- API response shape:
	- `score` (0-100)
	- `summary` (string)
	- `missing_skills` (string)
	- `suggestions` (string)

## Gemini 

- Set `GEMINI_API_KEY` in `.env` at the repo root.
- When set, the backend calls the `gemini-1.5-flash` model and uses it to populate `summary`, `missing_skills`, and `suggestions`.
