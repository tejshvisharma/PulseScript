## QuickPair (PulseScript)

QuickPair is a real-time collaborative code room with live presence, chat, and multi-language editing. The frontend is a Vite + React app and the backend is an Express + Socket.IO server using Yjs for conflict-free realtime sync. In production, the backend serves the built frontend as static files.

## Live Links (replace with your real URLs)

- Live app: https://pulsescript.onrender.com/
- Health check: https://pulsescript.onrender.com//health
- Sample room: https://pulsescript.onrender.com/?room=frontend-sprint&username=alex
- Repository: https://github.com/tejshvisharma/PulseScript

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

## Deployed to Render (Docker)
- Live app: https://pulsescript.onrender.com/

## API / Endpoints

- GET /health -> OK
- Socket.IO namespace: /yjs|<room>

## Usage

1. Open the app and create or join a room.
2. Share the room link with teammates.
3. Collaborate, chat, and export code when done.

