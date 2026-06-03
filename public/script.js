const socket = io({
    transports: ["websocket"]
});

console.log("Script loaded");

socket.on("connect", () => {
    alert("Connected: " + socket.id);
    console.log("Connected:", socket.id);
});

function sendMessage() {
    const input = document.getElementById("messageInput");
    const message = input.value;

    if (!message.trim()) return;

    console.log("Sending:", message);

    socket.emit("chat message", message);

    input.value = "";
}

socket.on("chat message", (msg) => {
    alert("Received: " + msg);
    console.log("Received:", msg);

    const li = document.createElement("li");
    li.textContent = msg;

    document.getElementById("messages").appendChild(li);
});