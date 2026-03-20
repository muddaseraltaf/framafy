# Reveal Your Photo Puzzle

A production-ready MVP web app that converts user-uploaded photos into printable black-and-white pattern puzzles.

## Project Structure
This is a monorepo containing two main parts:
- `web/`: Next.js frontend (TypeScript, Tailwind CSS)
- `engine/`: Python FastAPI backend (OpenCV, Pillow, ReportLab)

## Local Setup & Development

### 1. Backend Engine
Requirements: Python 3.9+
```bash
cd engine
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Start the server (runs on http://localhost:8000)
uvicorn main:app --reload --port 8000
```

### 2. Frontend Web App
Requirements: Node.js 18+
```bash
cd web
npm install

# Setup environment variables
# Ensure your .env contains: NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment Instructions

### Deploying the Engine (Railway or Render)
1. Commit and push this entire repository to GitHub.
2. Go to [Railway](https://railway.app/) or [Render](https://render.com/) and create a new project from your GitHub repo.
3. Set the Root Directory to `engine/` (if supported) or use a custom start command:
   ```bash
   cd engine && uvicorn main:app --host 0.0.0.0 --port $PORT
   ```
4. Configure standard Python environment.

### Deploying the Web Frontend (Vercel)
1. Go to [Vercel](https://vercel.com/) and import your GitHub repository.
2. In the Project Framework settings, **Vercel will usually auto-detect Next.js**.
3. Set the Root Directory to `web`.
4. Add the `NEXT_PUBLIC_API_BASE_URL` environment variable (e.g., `https://your-engine-production.up.railway.app`).
5. Click Deploy.
