const chatButton = document.getElementById("openChatButton");
const chatDiv = document.getElementById("chatDiv");
const chatNotify = document.getElementById("ChatNotify");

var Role;
var urlParams;
const PlayerId = socket.id;

var isserverCreated = false;
var isdataBaseGot = false;

var PlayersList = [];

var classes, races, racesDetails, spells;

var isdraggingSheet = false;
var draggingSheetEl;

async function createFetch(api, options) {
  return fetch(api, options).then((res) => {
    return res.json();
  });
}

socket.on("serverCreated", (data) => {
  isserverCreated = true;
  if (isdataBaseGot) {
    document
      .getElementById("loadingDiv")
      .parentElement.removeChild(document.getElementById("loadingDiv"));
    alert("Сервер создан!");
  }
});

GetDataBase().then((data) => {
  classes = data[0];
  races = data[1];
  racesDetails = data[2];
  spells = data[3];

  isdataBaseGot = true;
  if (isserverCreated) {
    document
      .getElementById("loadingDiv")
      .parentElement.removeChild(document.getElementById("loadingDiv"));
    alert("Сервер создан!");
  }

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
    if (data[keys[i]].name != "Master")
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

    if (chatNotify.style.display == "block") chatNotify.style.display = "none";

    chatDiv.querySelector("#chatMessageText").focus();
  } else {
    chatDiv.style.display = "none";
  }
});

chatDiv
  .querySelector("#sendChatMessageButton")
  .addEventListener("click", () => {
    sendMessage(
      chatDiv.querySelector("#chatMessageText").value,
      chatDiv.querySelector("#chatMessageReceiver").selectedIndex,
      "Master"
    );
    chatDiv.querySelector("#chatMessageText").value = "";
  });
chatDiv
  .querySelector("#chatMessageText")
  .addEventListener("keyup", function (e) {
    if (e.key === "Enter" || e.keyCode === 13) {
      chatDiv.querySelector("#sendChatMessageButton").click();
    }

    if (e.key == "Escape" || e.keyCode == 27) {
      chatButton.dispatchEvent(new Event("click"));
    }
  });

function sendMessage(message, receiver, from) {
  socket.emit("chatMessage", {
    message: message,
    receiver: receiver == 0 ? -1 : PlayersList[receiver - 1][1],
    from: from,
  });

  let li = document.createElement("li");
  li.innerText = `to[${
    receiver == 0 ? "All" : PlayersList[receiver - 1][0]
  }]: ${message}`;
  chatList.appendChild(li);
}

socket.on("chatMessage", (message) => {
  if (message.receiver == -1) return;
  let li = document.createElement("li");
  li.innerText = `from[${message.from}]: ` + message.message;
  chatList.appendChild(li);

  if (chatNotify.style.display == "none") chatNotify.style.display = "block";
});

document.getElementById("masterSheetsInput").addEventListener("change", (e) => {
  for (let f = 0; f < e.target.files.length; f++) {
    let file = e.target.files[f];
    add_sheet(URL.createObjectURL(file));
  }
});

function add_sheet(image) {
  let div = document.createElement("div");
  div.innerHTML = `
		<div class="sheetDragPlace" style="width: 100%; height: 5%; background-color: rgba(45, 45, 45, 1); display: flex; flex-direction: row; justify-content: flex-end;">
			<div style="height: 100%; aspect-ratio: 1/1; background-color: red;" onclick="remove_sheet(this)"></div>
		</div>
		<img src="${image}" style="width: 100%; height: 95%;"/>
	`;
  div.style.position = "absolute";
  div.style.top = "100px";
  div.style.left = "100px";
  div.style.width = "20vw";
  div.style.height = "31vw";
  div.style.overflow = "hidden";
  div.style.display = "flex";
  div.style.flexDirection = "column";
  div.style.justifyContent = "center";
  div.style.resize = "both";

  document.querySelector("body").appendChild(div);

  document.querySelectorAll(".sheetDragPlace").forEach((el) => {
    el?.addEventListener("mousedown", (e) => {
      //clickTime = new Date();
      e.preventDefault();
      e.stopPropagation();
      draggingSheetEl = el.parentElement;
      isdraggingSheet = true;
    });

    //el?.addEventListener("click", () => {
    //	clickTime = new Date();
    //	if (new Date() - clickTime >= 200) {
    //		remove_sheet(el);
    //	}
    //});

    //el?.addEventListener("dblclick", () => {
    //	remove_sheet(el);
    //});

    el?.addEventListener("mouseup", () => {
      isdraggingSheet = false;
    });
  });
}

document.addEventListener("mousemove", (e) => {
  if (isdraggingSheet) {
    draggingSheetEl.style.left =
      parseInt(draggingSheetEl.style.left.replace("px", "")) +
      e.movementX +
      "px";
    draggingSheetEl.style.top =
      parseInt(draggingSheetEl.style.top.replace("px", "")) +
      e.movementY +
      "px";
  }
});
function remove_sheet(closeButton) {
  closeButton.parentNode.parentNode.remove();
}

function sendEmail() {
  location.href =
    "mailto:dndonline.supp@gmail.com?subject=Ошибка в работе сайта";
  alert("Вы будете перенаправлены на почту, спасибо за фидбэк!");
}

document.getElementById("catCap").addEventListener("click", () => {
  if (document.getElementById("catCap").checked) {
    document.getElementById("cat").style.display = "block";
  } else {
    document.getElementById("cat").style.display = "none";
  }
});
