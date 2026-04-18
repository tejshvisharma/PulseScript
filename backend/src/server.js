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

const ysocketio = new YSocketIO(io);
ysocketio.initialize();

server.listen(PORT, () => {
  console.log(`QuickPair backend listening on http://localhost:${PORT}`);
});
