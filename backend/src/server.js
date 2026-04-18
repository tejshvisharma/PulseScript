import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { YSocketIO } from "y-socket.io/dist/server";

const PORT = 3001;

const app = express();
app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).send("OK");
});

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const roomUsers = new Map();

const getRoomNameFromNamespace = (namespaceName) => {
  const raw = namespaceName.replace(/^\/yjs\|/, "");
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
};

const yjsNamespace = io.of(/^\/yjs\|.*$/);

yjsNamespace.use((socket, next) => {
  const room = getRoomNameFromNamespace(socket.nsp.name);
  const username = (socket.handshake.auth?.username || "").trim();
  const normalizedUsername = username.toLowerCase();

  if (!username) {
    next(new Error("Username is required"));
    return;
  }

  const usersInRoom = roomUsers.get(room);
  if (usersInRoom?.has(normalizedUsername)) {
    next(new Error("Username already taken in this room"));
    return;
  }

  socket.data.room = room;
  socket.data.normalizedUsername = normalizedUsername;
  next();
});

yjsNamespace.on("connection", (socket) => {
  const room = socket.data.room;
  const normalizedUsername = socket.data.normalizedUsername;

  if (!room || !normalizedUsername) {
    socket.disconnect(true);
    return;
  }

  const usersInRoom = roomUsers.get(room) || new Set();

  // Double-check at connection-time to prevent race conditions.
  if (usersInRoom.has(normalizedUsername)) {
    socket.disconnect(true);
    return;
  }

  usersInRoom.add(normalizedUsername);
  roomUsers.set(room, usersInRoom);

  socket.on("disconnect", () => {
    const activeUsers = roomUsers.get(room);
    if (!activeUsers) {
      return;
    }

    activeUsers.delete(normalizedUsername);
    if (activeUsers.size === 0) {
      roomUsers.delete(room);
    }
  });
});

const ysocketio = new YSocketIO(io);
ysocketio.initialize();

server.listen(PORT, () => {
  console.log(`QuickPair backend listening on http://localhost:${PORT}`);
});
