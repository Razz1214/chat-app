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

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

// Online users counter
let onlineUsers = 0;

io.on("connection", (socket) => {

    onlineUsers++;

    io.emit("online users", onlineUsers);

    console.log("User Connected:", socket.id);
    console.log("Online Users:", onlineUsers);

    socket.on("chat message", (msg) => {

        console.log(
            "Message received from",
            socket.id,
            ":",
            msg
        );

        io.emit("chat message", msg);
    });
    socket.on("typing", (username) => {

    socket.broadcast.emit(
        "typing",
        username
    );

});

    socket.on("disconnect", () => {

        onlineUsers--;

        io.emit("online users", onlineUsers);

        console.log("User Disconnected:", socket.id);
        console.log("Online Users:", onlineUsers);
    });

});

const PORT = process.env.PORT || 3000;

server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server Running on Port ${PORT}`);
});