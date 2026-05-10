import cors from "cors";
import express from "express";
import bookingsRoutes from "./routes/bookingsRoutes.js";
import expertsRoutes from "./routes/expertsRoutes.js";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN?.split(",") ?? "*"
  })
);
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/experts", expertsRoutes);
app.use("/api/bookings", bookingsRoutes);

app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
});

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(error.status || 500).json({
    message: error.message || "Internal server error"
  });
});

export default app;