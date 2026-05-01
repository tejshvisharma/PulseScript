## QuickPair (PulseScript)

QuickPair is a real-time collaborative code room with live presence, chat, and multi-language editing. The frontend is a Vite + React app and the backend is an Express + Socket.IO server using Yjs for conflict-free realtime sync. In production, the backend serves the built frontend as static files.

## Live Links (replace with your real URLs)

- Live app: https://YOUR-SERVICE.onrender.com
- Health check: https://YOUR-SERVICE.onrender.com/health
- Sample room: https://YOUR-SERVICE.onrender.com/?room=frontend-sprint&username=alex
- Repository: https://github.com/YOUR-USER/YOUR-REPO

## Features

- Real-time collaborative editor with Yjs + Socket.IO
- Room-based sessions with username uniqueness enforcement
- Live presence list with per-user colors
- Built-in room chat and typing indicators
- Language switcher (JS, TS, Python, Java, C/C++, etc.)
- HTML/Markdown preview panel and one-click export
- Shareable room links

## Tech Stack

- Frontend: React + Vite + Tailwind + Monaco Editor
- Realtime: Yjs + y-socket.io + Socket.IO
- Backend: Node.js + Express
- Docker: multi-stage build to serve frontend from backend

## Architecture

- Frontend builds into frontend/dist.
- Docker copies frontend/dist into backend/public.
- Express serves backend/public and exposes a /health endpoint.
- Realtime sync uses Socket.IO namespaces like /yjs|<room>.

## Local Development

### Prereqs

- Node.js 20+
- npm

### Run backend

```bash
cd backend
npm install
npm run dev
```

Backend runs on http://localhost:3001.

### Run frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on http://localhost:5173.

## Docker (local build)

```bash
docker build -t quickpair .
docker run -p 3001:3001 quickpair
```

Open http://localhost:3001.

## Deploy to Render (Docker)

1. Push this repo to GitHub.
2. In Render, create a new Web Service and select Docker.
3. Use the repo root as the build context (Dockerfile in root).
4. Set the Container Port to 3001.
5. Optional: set health check path to /health.
6. Deploy.

After deploy, replace the Live Links section with the Render URL.

## Configuration Notes

- The frontend currently connects to ws://localhost:3001.
  For production, update the frontend to use a dynamic WebSocket URL,
  for example using import.meta.env.VITE_SOCKET_URL or window.location.origin.
- The backend listens on port 3001. If you prefer using Render's PORT
  environment variable, update the server to read process.env.PORT.

## API / Endpoints

- GET /health -> OK
- Socket.IO namespace: /yjs|<room>

## Usage

1. Open the app and create or join a room.
2. Share the room link with teammates.
3. Collaborate, chat, and export code when done.

## Fill These Before Sharing

- Live app URL
- Health check URL
- Example room URL
- Repository link
