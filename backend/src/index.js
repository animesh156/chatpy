import dotenv from "dotenv";
dotenv.config(); // must be before any other env usage
import express from "express";
import mongoose from "mongoose"; 

import cookieParser from "cookie-parser";
import cors from "cors";

import path from "path";

import { connectDB } from "./lib/db.js";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { app, server } from "./lib/socket.js";

const PORT = process.env.PORT;
const __dirname = path.resolve();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

function formatUptime(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  return `${hrs}h ${mins}m ${secs}s`;
}

function getISTTimestamp() {
  return new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
  });
}


app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);


// Health check endpoint
app.get("/health", (req, res) => {
  const dbState = mongoose.connection.readyState;
  const status = dbState === 1 ? "healthy" : "unhealthy";

  const uptimeInSeconds = process.uptime();

  res.status(status === "healthy" ? 200 : 500).json({
    status,
    timestampIST: getISTTimestamp(),
    uptime: formatUptime(uptimeInSeconds),
    database: {
      state: dbState,
      description: dbState === 1 ? "Connected" : "Not Connected ❌",
    },
  });
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

server.listen(PORT, () => {
  console.log("server is running on PORT:" + PORT);
  connectDB();
});
