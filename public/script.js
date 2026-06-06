console.log("VERSION 6");

const socket = io({
    transports: ["websocket"]
});

let myUsername = "";
let onlineCount = 0;

console.log("Script loaded");

socket.on("connect", () => {
    console.log("Connected:", socket.id);
});

// Join Chat
function joinChat() {

    const username =
        document.getElementById("username")
        .value
        .trim();

    if (!username) {
        alert("Please enter your name");
        return;
    }

    myUsername = username;

    document
        .getElementById("usernameBox")
        .style.display = "none";

    document
        .getElementById("userInfo")
        .textContent =
        `👤 ${myUsername} • 👥 ${onlineCount} Online`;

    console.log("Joined as:", myUsername);
}

// Send Message
function sendMessage() {

    if (!myUsername) {
        alert("Please join chat first");
        return;
    }

    const input =
        document.getElementById("messageInput");

    const message =
        input.value.trim();

    if (!message) return;

    const time =
        new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        });

    socket.emit("chat message", {
        username: myUsername,
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

    if (data.username === myUsername) {
        li.classList.add("my-message");
    } else {
        li.classList.add("other-message");
    }

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

    messages.scrollTop =
        messages.scrollHeight;
});

// Online Users Count
socket.on("online users", (count) => {

    onlineCount = count;

    console.log(
        "ONLINE USERS RECEIVED:",
        onlineCount
    );

    document
        .getElementById("userInfo")
        .textContent =
        `👤 ${myUsername || "Guest"} • 👥 ${onlineCount} Online`;

});

// Typing Event Send
document
    .getElementById("messageInput")
    .addEventListener("input", () => {

        if (!myUsername) return;

        socket.emit(
            "typing",
            myUsername
        );

    });

// Typing Event Receive
socket.on("typing", (username) => {

    if (username === myUsername) return;

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