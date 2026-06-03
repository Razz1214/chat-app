const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

app.use(express.static("public"));

io.on("connection", (socket) => {
   console.log("User Connected:", socket.id);

    socket.on("chat message", (msg) => {
   console.log("Message received from", socket.id, ":", msg);

    console.log("Broadcasting:", msg);
console.log("Connected clients:", io.engine.clientsCount);

io.fetchSockets().then((sockets) => {
    console.log(
        "Socket IDs:",
        sockets.map(s => s.id)
    );
});

io.emit("chat message", msg);
});

    socket.on("disconnect", () => {
        console.log("User Disconnected");
    });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server Running on Port ${PORT}`);
});