import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";
import { configDotenv } from "dotenv";
import { Socket } from "dgram";

configDotenv();
const port = process.env.PORT || 3000;

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("hello world!");
});

io.on("connection", (socket) => {
  console.log("user connected", socket.id);
  // socket.emit("welcome", `welcome to the server, ${socket.id}`);
  // socket.broadcast.emit("welcome", `${socket.id} joined the server`);

  socket.on("message", ({ messageSent, room, UserId }) => {
    console.log("form backend", room, messageSent, UserId);
    io.to(room).emit("recived-message", { messageSent, UserId });
  });

  socket.on("Join", (room) => {
    socket.join(room);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected ", socket.id);
  });
});

server.listen(port, () => {
  console.log(`port is active on  http://localhost:${port}`);
});
