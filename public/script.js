console.log("VERSION 3");

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

    socket.emit("chat message", {
        username,
        message
    });

    input.value = "";

    document.getElementById("typing")
            .textContent = "";
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

// Typing Event Send
document
    .getElementById("messageInput")
    .addEventListener("input", () => {

        const username =
            document
            .getElementById("username")
            .value || "Anonymous";

        socket.emit(
            "typing",
            username
        );

    });

// Typing Event Receive
socket.on("typing", (username) => {

    const typing =
        document.getElementById("typing");

    typing.textContent =
        `${username} is typing...`;

    clearTimeout(window.typingTimeout);

    window.typingTimeout =
        setTimeout(() => {

            typing.textContent = "";

        }, 1000);

});

// Enter Key Support
document
    .getElementById("messageInput")
    .addEventListener("keypress", (e) => {

        if (e.key === "Enter") {
            sendMessage();
        }

    });