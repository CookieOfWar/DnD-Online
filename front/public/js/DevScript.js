const messageInput = document.getElementById("messageInput");
const messageButton = document.getElementById("messageButton");

const refreshLobbiesButton = document.getElementById("refreshLobbiesButton");
const lobbiesList = document.getElementById("lobbiesList");

var games = {};

messageButton.addEventListener("click", () => {
  socket.emit("DevMessage", { text: messageInput.value });
  messageInput.value = "";
});

refreshLobbiesButton.addEventListener("click", () => {
  if (refreshLobbiesButton.style.animationPlayState != "running") {
    refreshLobbiesButton.style.animation = "refreshing 1s 1 ease-in-out";
  }
  socket.emit("refreshLobbiesDev");
});
refreshLobbiesButton.addEventListener("animationend", () => {
  refreshLobbiesButton.style.animation = "";
});

socket.on("refreshLobbiesServer", (data) => {
  console.log("refreshed");

  games = data.games;
  showLobbies();
});

function showLobbies() {
  lobbiesList.innerHTML = "";
  Object.keys(games).forEach((key) => {
    let ul = document.createElement("ul");
    let inul = document.createElement("ul");
    let li = document.createElement("li");
    li.innerHTML = "Код: " + key;
    ul.appendChild(li);
    li = document.createElement("li");
    li.innerHTML =
      "      Игроки: " + (Object.keys(games[key].players).length + 1);
    inul.appendChild(li);
    ul.appendChild(inul);
    lobbiesList.appendChild(ul);
  });
}
