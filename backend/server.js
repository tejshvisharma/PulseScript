import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import { createClient } from "redis";
import { YSocketIO } from "y-socket.io/dist/server";
import path from "node:path";

const PORT = Number(process.env.PORT) || 3001;
const STATIC_DIR = path.resolve("./public");
const INDEX_FILE = path.join(STATIC_DIR, "index.html");
const CORS_ORIGIN = process.env.CORS_ORIGIN || "*";
const REDIS_URL = process.env.REDIS_URL || "";

const app = express();
app.use(express.json());
app.use(express.static(STATIC_DIR));
app.get("/", (_req, res) => {
  res.sendFile(INDEX_FILE);
});
app.get("/health", (_req, res) => {
  res.status(200).send("OK");
});

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: CORS_ORIGIN,
    methods: ["GET", "POST"],
  },
  transports: ["websocket"],
  pingInterval: 20000,
  pingTimeout: 40000,
});

// roomUsers: room -> username -> active socket/client identity
const roomUsers = new Map();

app.get("/api/username-available", (req, res) => {
  const room = String(req.query.room || "").trim();
  const username = String(req.query.username || "")
    .trim()
    .toLowerCase();
  if (!room || !username) {
    return res.json({ available: false, reason: "missing" });
  }
  const existing = roomUsers.get(room)?.has(username) ?? false;
  res.json({ available: !existing, reason: existing ? "taken" : "ok" });
});

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
  const clientId = (socket.handshake.auth?.clientId || "").trim();

  if (!username) {
    next(new Error("Username is required"));
    return;
  }

  const usersInRoom = roomUsers.get(room);
  const existingUser = usersInRoom?.get(normalizedUsername);
  if (existingUser && (!clientId || existingUser.clientId !== clientId)) {
    next(new Error("Username already taken in this room"));
    return;
  }

  socket.data.room = room;
  socket.data.normalizedUsername = normalizedUsername;
  socket.data.clientId = clientId;
  next();
});

yjsNamespace.on("connection", (socket) => {
  const room = socket.data.room;
  const normalizedUsername = socket.data.normalizedUsername;
  const clientId = socket.data.clientId || "";

  if (!room || !normalizedUsername) {
    socket.disconnect(true);
    return;
  }

  const usersInRoom = roomUsers.get(room) || new Map();
  const existingUser = usersInRoom.get(normalizedUsername);

  // Double-check at connection-time to prevent race conditions.
  if (existingUser && existingUser.clientId !== clientId) {
    socket.disconnect(true);
    return;
  }

  // Same tab refreshed: disconnect the stale previous socket and replace it.
  if (existingUser?.socketId && existingUser.socketId !== socket.id) {
    const previousSocket = yjsNamespace.sockets.get(existingUser.socketId);
    if (previousSocket?.connected) {
      previousSocket.disconnect(true);
    }
  }

  usersInRoom.set(normalizedUsername, {
    socketId: socket.id,
    clientId,
  });
  roomUsers.set(room, usersInRoom);

  socket.on("disconnect", () => {
    const activeUsers = roomUsers.get(room);
    if (!activeUsers) {
      return;
    }

    const currentUser = activeUsers.get(normalizedUsername);
    if (!currentUser || currentUser.socketId !== socket.id) {
      return;
    }

    activeUsers.delete(normalizedUsername);
    if (activeUsers.size === 0) {
      roomUsers.delete(room);
    }
  });
});

const startServer = async () => {
  if (REDIS_URL) {
    const pubClient = createClient({ url: REDIS_URL });
    const subClient = pubClient.duplicate();
    await Promise.all([pubClient.connect(), subClient.connect()]);
    io.adapter(createAdapter(pubClient, subClient));
  } else {
    console.warn(
      "REDIS_URL not set. Realtime sync will not work across multiple server instances.",
    );
  }

  const ysocketio = new YSocketIO(io);
  ysocketio.initialize();

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`QuickPair backend listening on http://localhost:${PORT}`);
  });
};

startServer().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
