# Copilot Instructions for Curve Coffee Collab

## Project Overview
- **Purpose:** Enhance collaboration and cross-team bonding for the KPMG Curve Team by generating random coffee pairings among team members.
- **Architecture:**
  - **Frontend:** React app (Create React App) in `curve-coffee-collab-frontend/`.
  - **Backend:** FastAPI app in `curve-coffee-collab-backend/` with SQLite and Alembic migrations.

## Key Components
- `curve-coffee-collab-frontend/`: React SPA. Use `npm start` for local dev, `npm run build` for production. Tests via `npm test`.
- `curve-coffee-collab-backend/`: FastAPI app. Use `uvicorn main:app --reload` to run. Models and CRUD endpoints in `main.py` and `models.py`. DB migrations managed with Alembic.
- `models.py`: Defines `TeamMember` (fields: name, email, role, stars_earned) and `Pair` (member1_id, member2_id, week).
- `alembic/`: Alembic migration scripts for DB schema changes. Update models, then run `alembic revision --autogenerate -m "msg"` and `alembic upgrade head`.

## Developer Workflows
- **Backend setup:**
  1. `python3 -m venv venv && source venv/bin/activate`
  2. `pip install -r requirements.txt`
  3. `alembic upgrade head` (after DB/model changes)
  4. `uvicorn main:app --reload`
- **Frontend setup:**
  1. `npm install`
  2. `npm start`
- **Testing:**
  - Frontend: `npm test`
  - Backend: Add tests as needed (none present by default)

## Patterns & Conventions
- **API endpoints:** All backend endpoints are defined in `main.py` using FastAPI. Models are SQLAlchemy ORM.
- **DB migrations:** Always use Alembic for schema changes. Do not edit the SQLite DB directly.
- **Pairing logic:** Not yet implemented—future agents should add logic to generate random pairs weekly.
- **Separation:** Keep frontend and backend code in their respective folders. No direct coupling.

## Integration Points
- **Frontend ↔ Backend:** Communicate via HTTP API (default backend: `http://localhost:8000`).
- **Database:** SQLite for local/dev. Alembic manages schema. For production, consider PostgreSQL.

## Examples
- To add a new team member: `POST /members/` with JSON body (name, email, role, stars_earned).
- To create a pair: `POST /pairs/` with member1_id, member2_id, week.

## References
- See each folder's `README.md` for more details.
- For DB/model changes, always update Alembic migrations.
