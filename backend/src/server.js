import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { YSocketIO } from "y-socket.io/dist/server";
import ApiResponse from "./utils/ApiResponse.js";
import healthcheckRouter from "./routes/healthcheck.routes.js";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { 
    cors: { 
        origin: "*",
        methods: ["GET", "POST"]
        }
    });

const yio = new YSocketIO(io);
yio.initialize();


app.use("api/v1/healthcheck", healthcheckRouter);


httpServer.listen(3000, () => {
    console.log("Server listening on port 3000");
});