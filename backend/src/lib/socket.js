import { Server } from "socket.io";
import http from "http";
import express from "express";
import Message from "../models/message.model.js"; // ✅ import your Message model

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

// Store online users
const userSocketMap = {}; // { userId: socketId }

// Helper function to get a user’s socket ID
export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

io.on("connection", (socket) => {
  // Get the userId of the connected client
  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id;

  // Broadcast all online users
  io.emit("getOnlineUsers", Object.keys(userSocketMap));  

  // 🔹 MARK MESSAGES AS SEEN EVENT
  socket.on("markMessagesSeen", async ({ senderId, receiverId }) => {
    try {
      // Update unseen messages from sender → receiver
      await Message.updateMany(
        { senderId, receiverId, isSeen: false },
        { $set: { isSeen: true } }
      );

      // Get sender’s socket ID
      const senderSocketId = getReceiverSocketId(senderId);

      // Notify sender that messages were seen
      if (senderSocketId) {
        io.to(senderSocketId).emit("messagesSeen", { receiverId });
      }

      console.log(`✅ Messages from ${senderId} seen by ${receiverId}`);
    } catch (err) {
      console.error("Error in markMessagesSeen:", err.message);
    }
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
    console.log("🔴 A user disconnected:", socket.id);
  });
});

export { io, app, server };
