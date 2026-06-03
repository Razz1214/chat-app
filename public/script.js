console.log("VERSION 2");

const socket = io({
    transports: ["websocket"]
});

console.log("Script loaded");

socket.on("connect", () => {
    console.log("Connected:", socket.id);
});

// Send Message
function sendMessage() {

    const input =
        document.getElementById("messageInput");

    const message =
        input.value;

    if (!message.trim()) return;

    const username =
        document.getElementById("username").value ||
        "Anonymous";

    console.log("Sending:", {
        username,
        message
    });

    socket.emit("chat message", {
        username,
        message
    });

    input.value = "";
}

// Receive Message
socket.on("chat message", (data) => {

    const li =
        document.createElement("li");

    li.innerHTML =
        `<strong>${data.username}</strong><br>${data.message}`;

    const messages =
        document.getElementById("messages");

    messages.appendChild(li);

    // Auto Scroll
    messages.scrollTop =
        messages.scrollHeight;

});

// Online Users Count
socket.on("online users", (count) => {

    document
        .getElementById("onlineUsers")
        .textContent =
        `👥 ${count} Online`;

});

// Enter Key Support
document
    .getElementById("messageInput")
    .addEventListener("keypress", (e) => {

        if (e.key === "Enter") {
            sendMessage();
        }

    });