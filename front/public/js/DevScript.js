const messageInput = document.getElementById("messageInput");
const messageButton = document.getElementById("messageButton");

messageButton.addEventListener("click", () => {
  socket.emit("DevMessage", messageInput.value);
});
