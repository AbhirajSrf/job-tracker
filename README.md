# Job Application Tracker

A full stack web app for tracking job applications through the hiring pipeline — log every application, move it through Applied → Interviewing → Offer/Rejected, search, filter, and keep notes along the way.

Built as a Full Stack Internship take-home assignment.

## Project overview

This is a CRUD application with a React frontend and an Express + PostgreSQL REST API backend. Users can add, view, edit, and delete job applications, filter by status, and search by company name or job title.

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 19 (Vite) |
| Backend | Node.js, Express |
| Database | PostgreSQL |
| API style | REST (JSON) |

## Project structure

```
job-tracker/
├── backend/          Express REST API
│   ├── src/
│   │   ├── controllers/   Request handlers / query logic
│   │   ├── routes/        Route definitions
│   │   ├── middleware/    Error handling
│   │   ├── db/             Connection pool + init script runner
│   │   └── utils/          Validation
│   ├── db/init.sql        Schema, indexes, trigger, seed data
│   └── .env.example
├── frontend/         React (Vite) app
│   ├── src/
│   │   ├── components/    UI components
│   │   ├── api/            Fetch wrapper for the backend API
│   │   └── hooks/          useDebounce
│   └── .env.example
└── render.yaml        Render deployment blueprint
```

## Prerequisites

- Node.js 
- npm
- PostgreSQL 

## Installation

Clone the repo, then install dependencies for both apps:

```bash
git clone <your-repo-url>
cd job-tracker

cd backend && npm install
cd ../frontend && npm install
```

## Environment variables

### Backend (`backend/.env`)

Copy `backend/.env.example` to `backend/.env` and fill in your own values:

```
PORT=4000
DATABASE_URL=postgresql://username:password@localhost:5432/job_tracker
DB_SSL=false
CORS_ORIGIN=http://localhost:5173
```

- `DATABASE_URL` — your PostgreSQL connection string. Set `DB_SSL=true` if connecting to a hosted database that requires SSL (e.g. Render's managed Postgres).
- `CORS_ORIGIN` — the URL of the frontend that's allowed to call this API. Comma-separate multiple origins if needed.

### Frontend (`frontend/.env`)

Copy `frontend/.env.example` to `frontend/.env`:

```
VITE_API_URL=http://localhost:4000
```

- `VITE_API_URL` — the base URL of the backend API.

## Database setup

With PostgreSQL running and `DATABASE_URL` set in `backend/.env`, initialize the schema:

```bash
cd backend
npm run db:init
```

This creates the `applications` table, its enum types, indexes, the `updated_at` trigger, and a few seed rows for local development. The script is idempotent — safe to re-run.

## Running in development mode

In one terminal, start the backend:

```bash
cd backend
npm run dev
```

The API will be available at `http://localhost:4000`. Check `http://localhost:4000/health` to confirm it's running.

In a second terminal, start the frontend:

```bash
cd frontend
npm run dev
```

The app will be available at `http://localhost:5173`.

## Running in production mode (locally)

```bash
# Backend
cd backend
npm start

# Frontend
cd frontend
npm run build
npm run preview
```

## API documentation

Base URL: `http://localhost:4000` (or your deployed backend URL)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/applications` | List applications. Supports `?status=`, `?search=`, `?page=`, `?limit=` |
| GET | `/applications/:id` | Get a single application |
| POST | `/applications` | Create an application |
| PATCH | `/applications/:id` | Partially update an application |
| DELETE | `/applications/:id` | Delete an application |
| GET | `/health` | Health check |

### Application object

```json
{
  "id": "uuid",
  "company_name": "string",
  "job_title": "string",
  "job_type": "Internship | Full-time | Part-time",
  "status": "Applied | Interviewing | Offer | Rejected",
  "applied_date": "YYYY-MM-DD",
  "notes": "string | null",
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

### Example: create an application

```bash
curl -X POST http://localhost:4000/applications \
  -H "Content-Type: application/json" \
  -d '{
    "company_name": "Acme Corp",
    "job_title": "Frontend Developer Intern",
    "job_type": "Internship",
    "status": "Applied",
    "applied_date": "2026-06-01",
    "notes": "Applied via referral"
  }'
```

### Example: list applications with filters

```bash
curl "http://localhost:4000/applications?status=Interviewing&search=acme&page=1&limit=10"
```

Validation errors return `400` with a `details` object describing each invalid field. Not-found resources return `404`. Unexpected errors return `500`.

## Deployment (Render)

This repo includes a `render.yaml` blueprint covering all three pieces: a managed PostgreSQL database, the Express backend, and the static React frontend.

1. Push this repo to GitHub.
2. In the Render dashboard, choose **New > Blueprint** and point it at the repo. Render will read `render.yaml` and propose the three services.
3. Deploy. The database and backend will spin up first.
4. Two environment variables can't be auto-filled because they reference URLs Render only assigns after first deploy:
   - On the backend service, set `CORS_ORIGIN` to your frontend's Render URL (e.g. `https://job-tracker-frontend.onrender.com`).
   - On the frontend service, set `VITE_API_URL` to your backend's Render URL (e.g. `https://job-tracker-backend.onrender.com`), then trigger a redeploy of the frontend (Vite env vars are baked in at build time).
5. Run the schema init once against the deployed database. The simplest way: temporarily set `DATABASE_URL` in your local `backend/.env` to the external connection string shown in the Render database dashboard, then run `npm run db:init` from your machine.


## Screenshots / demo video
# Screenshots

## Home
![Home](./screenshots/home.png)

## Adding Application
![Adding application](./screenshots/adding.png)

## Searching Menu
![Searching application](./screenshots/search.png)

## Live Demo

🚀 Live Website: https://job-tracker-frontend-11h3.onrender.com/

Note: This project does not include user authentication. There are currently no Login, Signup, Password Reset, or User Management features. The application is intended to demonstrate full-stack CRUD operations, REST API development, PostgreSQL integration, filtering, searching, pagination, and deployment workflows.
