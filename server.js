const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const PORT = process.env.PORT || 3001;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

const rooms = {}; // 방 정보를 저장할 객체

io.on("connection", (socket) => {
  console.log("새로운 유저가 연결되었습니다.");

  socket.on("joinRoom", (roomName, username) => {
    socket.join(roomName);
    if (!rooms[roomName]) {
      rooms[roomName] = [];
    }
    rooms[roomName].push({
      username,
      message: `${username}님이 입장했습니다.`,
    });
    io.to(roomName).emit("roomInfo", rooms[roomName]);
  });

  socket.on("leaveRoom", (roomName, username) => {
    socket.leave(roomName);
    if (rooms[roomName]) {
      rooms[roomName] = rooms[roomName].filter(
        (message) => message.username !== username
      );
      io.to(roomName).emit("roomInfo", rooms[roomName]);
    }
  });

  socket.on("sendMessage", (roomName, username, message) => {
    const newMessage = { username, message };
    if (rooms[roomName]) {
      rooms[roomName].push(newMessage);
      io.to(roomName).emit("newMessage", newMessage); // 방에 속한 클라이언트에게만 메시지 전송
    }
  });

  socket.on("disconnect", () => {
    console.log("유저가 연결을 끊었습니다.");
  });
});

server.listen(PORT, () => {
  console.log(`서버가 ${PORT}번 포트에서 실행 중입니다.`);
});
