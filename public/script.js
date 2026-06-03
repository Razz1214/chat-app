console.log("VERSION 2");
const socket = io({
    transports: ["websocket"]
});

console.log("Script loaded");

socket.on("connect", () => {
   
    console.log("Connected:", socket.id);
});

function sendMessage() {
    const input = document.getElementById("messageInput");
    const message = input.value;

    if (!message.trim()) return;

    console.log("Sending:", message);

   const username =
    document.getElementById("username").value || "Anonymous";

socket.emit("chat message", {
    username,
    message
});

    input.value = "";
}

socket.on("chat message", (data) => {

    const li = document.createElement("li");

    li.innerHTML =
        `<strong>${data.username}</strong><br>${data.message}`;

    const messages =
        document.getElementById("messages");

    messages.appendChild(li);

    // Auto scroll
    messages.scrollTop =
        messages.scrollHeight;

});
document
.getElementById("messageInput")
.addEventListener("keypress", (e) => {

    if (e.key === "Enter") {
        sendMessage();
    }

});