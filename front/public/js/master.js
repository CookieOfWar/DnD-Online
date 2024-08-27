const chatButton = document.getElementById("openChatButton");
const chatDiv = document.getElementById("chatDiv");

var Role;
var urlParams;
const PlayerId = socket.id;

var PlayersList = [];

var classes, races, racesDetails, spells;

async function createFetch(api, options) {
  return fetch(api, options).then((res) => {
    return res.json();
  });
}

GetDataBase().then((data) => {
  classes = data[0];
  races = data[1];
  racesDetails = data[2];
  spells = data[3];

  document
    .getElementById("loadingDiv")
    .parentElement.removeChild(document.getElementById("loadingDiv"));

  urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get("code")) {
    socket.emit("joinGame", {
      code: urlParams.get("code"),
      id: socket.id,
      class: NaN,
      name: "Master",
      password: urlParams.get("password"),
    });
  }
  Role = window.location.pathname.replace("/", "");

  //configureElements(data[0], data[1]);

  configureBattleMap();
});

async function GetDataBase() {
  const res = await Promise.allSettled([
    createFetch("https://dnd-data-base.vercel.app/classes", {
      method: "GET",
    }),
    createFetch("https://dnd-data-base.vercel.app/races", {
      method: "GET",
    }),
    createFetch("https://dnd-data-base.vercel.app/race", { method: "GET" }),
    createFetch("https://dnd-data-base.vercel.app/spells", {
      method: "GET",
    }),
  ]);
  return res.reduce((arr, curr) => arr.concat(curr.value), []);
}

function GetPlayersList() {
  socket.emit("getPlayersList", {});
}
socket.on("getPlayersList", (data) => {
  PlayersList = [];
  let keys = Object.keys(data);
  for (let i = 0; i < keys.length; i++) {
    PlayersList.push([data[keys[i]].name, data[keys[i]].id]);
  }

  console.log(PlayersList);
  updChatReceivers();
});

function updChatReceivers() {
  chatDiv.querySelector("#chatMessageReceiver").innerHTML = "";

  chatDiv.querySelector(
    "#chatMessageReceiver"
  ).innerHTML = `<option selected value="All">Все</option>`;
  for (let i = 0; i < PlayersList.length; i++) {
    chatDiv.querySelector(
      "#chatMessageReceiver"
    ).innerHTML += `<option value="${PlayersList[i][1]}">${PlayersList[i][0]}</option>`;
  }
}

chatButton.addEventListener("click", () => {
  if (chatDiv.style.display === "none") {
    GetPlayersList();
    chatDiv.style.display = "flex";
  } else {
    chatDiv.style.display = "none";
  }
});

chatDiv
  .querySelector("#sendChatMessageButton")
  .addEventListener(
    "click",
    sendMessage(
      chatDiv.querySelector("#chatMessageText").value,
      chatDiv.querySelector("#chatMessageReceiver").selectedIndex,
      "Master"
    )
  );

function sendMessage(message, receiver, from) {
  socket.emit("chatMessage", {
    message: message,
    receiver: receiver,
    from: from,
  });
}
