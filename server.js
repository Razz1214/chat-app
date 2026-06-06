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

io.on("connection", (socket) => {

    console.log("User Connected:", socket.id);

    // Send online users count
    io.emit(
        "online users",
        io.engine.clientsCount
    );

    console.log(
        "Actual Clients:",
        io.engine.clientsCount
    );

    // Chat Messages
    socket.on("chat message", (msg) => {

        console.log(
            "Message received from",
            socket.id,
            ":",
            msg
        );

        io.emit("chat message", msg);
    });

    // Typing Indicator
    socket.on("typing", (username) => {

        socket.broadcast.emit(
            "typing",
            username
        );

    });

    // Disconnect
    socket.on("disconnect", () => {

        console.log(
            "User Disconnected:",
            socket.id
        );

        io.emit(
            "online users",
            io.engine.clientsCount
        );

        console.log(
            "Actual Clients After Disconnect:",
            io.engine.clientsCount
        );

    });

});

const PORT = process.env.PORT || 3000;

server.listen(PORT, "0.0.0.0", () => {

    console.log(
        `Server Running on Port ${PORT}`
    );

});