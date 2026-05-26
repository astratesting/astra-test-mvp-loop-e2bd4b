# HabitPulse MVP

HabitPulse is a lean habit tracker SaaS for busy professionals. Users can create daily habits, log check-ins, monitor streaks, and preview weekly email summary data.

## Stack

- Frontend: Next.js 14, TypeScript, Tailwind CSS, Clerk auth, Supabase client placeholder
- Backend: FastAPI, SQLAlchemy, JWT auth, SQLite by default with Postgres-ready config
- Infrastructure: Docker Compose for API, frontend, and Postgres

## Quick start

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

API runs at `http://localhost:8000`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

App runs at `http://localhost:3000`.

### Docker

```bash
docker compose up --build
```

## Environment

Copy `.env.example` and set real values for production.

Required frontend values:

- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`

Required backend values:

- `DATABASE_URL`
- `SECRET_KEY`
- `CORS_ORIGINS`

## Core API

- `POST /auth/register` — create account and return JWT
- `POST /auth/login` — return JWT
- `GET /auth/me` — current user
- `GET /api/habits` — list habits with streak metrics
- `POST /api/habits` — create habit
- `PATCH /api/habits/{habit_id}` — update habit
- `DELETE /api/habits/{habit_id}` — delete habit
- `POST /api/habits/{habit_id}/logs` — log habit completion
- `GET /api/weekly-summary` — weekly summary data for email content

## MVP scope

This build includes functional auth endpoints, habit CRUD, daily logs, streak calculations, weekly summary data, Clerk-protected dashboard routes, and a polished landing/dashboard UI. Email sending and subscription billing are production follow-ups after first-user validation.
