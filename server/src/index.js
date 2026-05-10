import "dotenv/config";
import http from "http";
import { Server } from "socket.io";
import app from "./app.js";
import { connectDatabase } from "./config/db.js";
import { seedExperts } from "./seed/seedExperts.js";
import { setSocketServer } from "./socket.js";

const port = Number.parseInt(process.env.PORT || "5000", 10);

async function startServer() {
  await connectDatabase(process.env.MONGODB_URI);
  await seedExperts();

  const httpServer = http.createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_ORIGIN?.split(",") ?? "*"
    }
  });

  setSocketServer(io);

  io.on("connection", (socket) => {
    socket.emit("server-ready", { connected: true });
  });

  httpServer.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});