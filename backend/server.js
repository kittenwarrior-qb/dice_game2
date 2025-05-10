const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Phục vụ file tĩnh từ thư mục public
app.use(express.static(path.join(__dirname, "../public")));

let players = [];

io.on("connection", (socket) => {
  console.log("🔌 New client connected");

  socket.on("addPlayer", (playerName) => {
    if (!players.includes(playerName)) {
      players.push(playerName);
      io.emit("updatePlayerList", players);
    }
  });

  socket.on("startGame", () => {
    io.emit("updatePlayerList", players);
  });

  socket.on("rollDice", (playerName) => {
    const roll = Math.floor(Math.random() * 6) + 1;
    io.emit("diceRolled", { player: playerName, roll });
  });

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected");
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});
