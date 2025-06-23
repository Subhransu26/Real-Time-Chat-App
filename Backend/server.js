const express = require("express");
const http = require("http");
const dotenv = require("dotenv");
const colors = require("colors");
const connectDB = require("./config/connectDB");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const path = require("path");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
app.use(express.json()); // To accept JSON data

// API routes
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

// ------------------ Deployment ----------------------------

const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "../Frontend/dist")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname1, "../Frontend", "dist", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running..");
  });
}

// ------------------ Deployment ----------------------------

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

// Create HTTP server
const server = http.createServer(app);

// Attach socket.io to the server
const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: [
      "http://localhost:5173", // for local dev
      "https://real-time-chat-app-m814.onrender.com", // your deployed frontend
    ],
    credentials: true,
  },
});

// ------------------ Socket.io Events ----------------------------

io.on("connection", (socket) => {
  console.log("✅ Connected to socket.io");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room:", room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageReceived) => {
    const chat = newMessageReceived.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id === newMessageReceived.sender._id) return;
      socket.in(user._id).emit("message received", newMessageReceived);
    });
  });

  socket.on("disconnect", () => {
    console.log("❌ USER DISCONNECTED");
  });
});

// ------------------ Start Server ----------------------------

const PORT = process.env.PORT || 5000;

server.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`.yellow.bold)
);
