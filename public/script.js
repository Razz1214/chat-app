console.log("VERSION 4");

const socket = io({
    transports: ["websocket"]
});

let myUsername = "";

console.log("Script loaded");

socket.on("connect", () => {
    console.log("Connected:", socket.id);
});

// Send Message
function sendMessage() {

    const input =
        document.getElementById("messageInput");

    const message =
        input.value.trim();

    if (!message) return;

    const username =
        document.getElementById("username").value ||
        "Anonymous";

    myUsername = username;

    const time =
        new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        });

    socket.emit("chat message", {
        username,
        message,
        time
    });

    input.value = "";

    document.getElementById("typing")
        .textContent = "";
}

// Receive Message
socket.on("chat message", (data) => {

    const messages =
        document.getElementById("messages");

    const li =
        document.createElement("li");

    // Right side for my messages
    if (data.username === myUsername) {
        li.classList.add("my-message");
    }
    // Left side for others
    else {
        li.classList.add("other-message");
    }

    // Show username only when sender changes
    const lastMessage =
        messages.lastElementChild;

    let showUsername = true;

    if (
        lastMessage &&
        lastMessage.dataset.username === data.username
    ) {
        showUsername = false;
    }

    li.dataset.username = data.username;

    li.innerHTML = `
        ${showUsername
            ? `<strong>${data.username}</strong>`
            : ""
        }

        <div>${data.message}</div>

        <small>${data.time}</small>
    `;

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