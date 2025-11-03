# Student Extracurricular Achievements

A simple web-based platform to manage and showcase student extracurricular achievements.

## Stack
- Node.js + Express
- JWT auth with roles (admin, student)
- JSON file storage (no database required)
- Minimal frontend with Tailwind CDN

## Setup
1. Install Node.js (v18+ recommended).
2. Copy `.env.example` to `.env` and adjust values as needed.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Run the server:
   ```bash
   npm run dev
   ```
5. Open http://localhost:3000

Default admin credentials come from `.env` (fallback `admin@example.com` / `Admin@123`).

## API Overview
- POST `/api/auth/login`
- Students CRUD: `/api/students`
- Activities CRUD: `/api/activities`
- Achievements CRUD: `/api/achievements`
- Reports: `/api/reports/summary`
- Student self:
  - GET `/api/me`
  - GET `/api/me/profile`
  - GET `/api/me/achievements`
  - PUT `/api/me/password`

Data is stored in `data/*.json`.
\
