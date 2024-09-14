var Role;
var urlParams;
const PlayerId = socket.id;

const portrait = document.getElementById("portrait");
const characterClass = document.getElementById("characterClass");
const characterName = document.getElementById("characterName");
const characterRace = document.getElementById("characterRace");

const PB = document.getElementById("PB"); // Proficiency Bonus / Бонус Мастерства
const AC = document.getElementById("AC"); // Armor Class / Класс брони
const Speed = document.getElementById("Speed");
const Initiative = document.getElementById("Initiative");

const STR = document.getElementById("strVal");
const DEX = document.getElementById("dexVal");
const CON = document.getElementById("conVal");
const INT = document.getElementById("intVal");
const WIS = document.getElementById("wisVal");
const CHA = document.getElementById("chaVal");

var Level = 1;
const sexChanger = document.getElementById("sexChanger");
var Sex = "male";

const addWeaponButton = document.getElementById("addToWeaponTableButton");
const chatButton = document.getElementById("openChatButton");
const chatList = document.getElementById("chatList");
const chatNotify = document.getElementById("ChatNotify");

const skillList = document.querySelectorAll(".skillVals");
/*[
  STstr,
  athletics,
  STdex,
  acrobatics,
  sleightOfHand,
  stealth,
  STcon,
  STint,
  arcana,
  history,
  investigation,
  religion,
  STwis,
  animalHandling,
  insight,
  medicine,
  perception,
  survival,
	STcha,
	deception,
	intimidation,
	performance,
	persuasion
]*/

const skillCBList = document.querySelectorAll(".skillCB");
/*[
  STstrCB,
  athleticsCB,
  STdexCB,
  acrobaticsCB,
  sleightOfHandCB,
  stealthCB,
  STconCB,
  STintCB,
  arcanaCB,
  historyCB,
  investigationCB,
  religionCB,
  STwisCB,
  animalHandlingCB,
  insightCB,
  medicineCB,
  perceptionCB,
  survivalCB,
	STchaCB,
	deceptionCB,
	intimidationCB,
	performanceCB,
	persuasionCB
]*/

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
      class: characterClass.value.toLowerCase(),
      name: characterName.value,
      password: urlParams.get("password"),
    });
  }
  Role = window.location.pathname.replace("/", "");

  configureElements(data[0], data[1]);

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

function configureElements(classes, races) {
  for (let i = 0; i < classes["ClassesRu"].length; i++) {
    characterClass.innerHTML += `<option value="${classes["ClassesEn"][i]}">${classes["ClassesRu"][i]}</option>`;
  }
  for (let i = 0; i < races["RacesRu"].length; i++) {
    characterRace.innerHTML += `<option value="${races["RacesEn"][i]}">${races["RacesRu"][i]}</option>`;
  }

  characterRace.addEventListener("change", (event) => {
    changePortrait();
    document.getElementById("Speed").value =
      racesDetails[`${characterRace.value.toLowerCase()}`][0]["speed"];
  });
  characterClass.addEventListener("change", (event) => {
    changePortrait();
    characterClass.style.backgroundImage = `url("../public/img/DicesClasses/${event.target.value.toLowerCase()}.png")`;
    document.getElementById("Speed").value =
      racesDetails[`${characterRace.value.toLowerCase()}`][0]["speed"];
    updateTable();

    if (Role == "player") {
      socket.emit("updPlayersInfos", {
        code: urlParams.get("code"),
        id: socket.id,
        class: characterClass.value.toLowerCase(),
        name: characterName.value,
      });
      socket.emit("updMap");
    }
  });
  characterName.addEventListener("change", () => {
    socket.emit("updPlayersInfos", {
      code: urlParams.get("code"),
      id: socket.id,
      class: characterClass.value.toLowerCase(),
      name: characterName.value,
    });
  });

  characterRace.value = "Human";
  characterRace.dispatchEvent(new Event("change"));

  characterClass.value = "Bard";
  characterClass.dispatchEvent(new Event("change"));

  [STR, DEX, CON, INT, WIS, CHA].forEach((item) => {
    item.value = 8;
  });
  updatePB();
  updateCharacteristicMods();
  updateSkillVals();
  document.getElementById("Speed").value =
    racesDetails[`${characterRace.value.toLowerCase()}`][0]["speed"];

  document.getElementById("level").value = 1;
}
sexChanger.addEventListener("click", (event) => {
  Sex = Sex == "male" ? "female" : "male";
  sexChanger.innerHTML = Sex == "male" ? "М" : "Ж";
  changePortrait();
});

function changePortrait() {
  portrait.style.backgroundImage = `url("https://dnd-data-base.vercel.app/portrait/${characterRace.value.toLowerCase()}-${characterClass.value.toLowerCase()}-${Sex}")`;
}

skillCBList.forEach((item) => addEventListener("change", updateSkillVals));

document.getElementById("level").addEventListener("input", (e) => {
  if (e.target.value > 20) {
    e.target.value = 20;
  }
  if (e.target.value < 1) {
    e.target.value = 1;
  }
  Level = e.target.value;
  updatePB();
  updateSkillVals();
  updateHP();
});

[STR, DEX, CON, INT, WIS, CHA].forEach((item) =>
  item.addEventListener("input", (e) => {
    if (e.target.value > 30) {
      e.target.value = 30;
    }
    if (e.target.value < 1) {
      e.target.value = 1;
    }
    updateCharacteristicMods();
    updateSkillVals();
  })
);

function updatePB() {
  PB.innerHTML = "+" + getPB(Level).toString();
}

function updateCharacteristicMods() {
  document.getElementById("strMod").innerHTML =
    getValueModifier(+STR.value) > 0
      ? `+${getValueModifier(+STR.value)}`
      : `${getValueModifier(+STR.value)}`;

  document.getElementById("Initiative").innerHTML = document.getElementById(
    "dexMod"
  ).innerHTML =
    getValueModifier(+DEX.value) > 0
      ? `+${getValueModifier(+DEX.value)}`
      : `${getValueModifier(+DEX.value)}`;

  document.getElementById("conMod").innerHTML =
    getValueModifier(+CON.value) > 0
      ? `+${getValueModifier(+CON.value)}`
      : `${getValueModifier(+CON.value)}`;

  document.getElementById("intMod").innerHTML =
    getValueModifier(+INT.value) > 0
      ? `+${getValueModifier(+INT.value)}`
      : `${getValueModifier(+INT.value)}`;

  document.getElementById("wisMod").innerHTML =
    getValueModifier(+WIS.value) > 0
      ? `+${getValueModifier(+WIS.value)}`
      : `${getValueModifier(+WIS.value)}`;

  document.getElementById("chaMod").innerHTML =
    getValueModifier(+CHA.value) > 0
      ? `+${getValueModifier(+CHA.value)}`
      : `${getValueModifier(+CHA.value)}`;
}

function updateSkillVals() {
  for (let i = 0; i < skillList.length; i++) {
    let val =
      getValueModifier(parseInt(getSkillCharacteristic(i).value)) +
      (skillCBList[i].checked ? getPB(Level) : 0);
    skillList[i].innerHTML = val > 0 ? `+${val}` : `${val}`;
  }
}

function getValueModifier(value) {
  return Math.floor(value / 2) - 5;
}
function getPB(level) {
  return Math.ceil(level / 4) + 1;
}

function getSkillCharacteristic(numberInList) {
  if ([0, 1].indexOf(numberInList) !== -1) return STR;
  if ([2, 3, 4, 5].indexOf(numberInList) !== -1) return DEX;
  if (numberInList == 6) return CON;
  if ([7, 8, 9, 10, 11, 12].indexOf(numberInList) !== -1) return INT;
  if ([13, 14, 15, 16, 17, 18].indexOf(numberInList) !== -1) return WIS;
  if ([19, 20, 21, 22, 23].indexOf(numberInList) !== -1) return CHA;
}

addWeaponButton.addEventListener("click", (event) => {
  let weapon = document.createElement("tr");

  weapon.innerHTML = `
		<td><input type="text" class="weaponName" autocomplete="off"></td>
		<td><input type="text" class="attackBonus"></td>
		<td><input type="text" class="weaponDamage" autocomplete="off"></td>
		<td><input type="text" class="weaponDamageType" autocomplete="off"></td>
		<td><button class="removeWeaponButton" onclick="removeWeaponFromTable(this)">X</button></td>
		`;
  document
    .getElementById("quickAccessWeapons")
    .getElementsByTagName("tbody")[0]
    .appendChild(weapon);
});

function removeWeaponFromTable(weapon) {
  document
    .getElementById("quickAccessWeapons")
    .getElementsByTagName("tbody")[0]
    .removeChild(weapon.parentElement.parentElement);
}

socket.on("joinGameFail", () => {
  window.location.replace("/?error=idNotExist");
});

chatButton.addEventListener("click", () => {
  if (chatDiv.style.display === "none") {
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
      "Master",
      characterName.value
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
    receiver: receiver,
    from: from,
  });

  let li = document.createElement("li");
  li.innerText = `to[Master]: ${message}`;
  chatList.appendChild(li);
}

socket.on("chatMessage", (message) => {
  let li = document.createElement("li");
  li.innerText = "Master: " + message.message;
  chatList.appendChild(li);

  if (chatNotify.style.display == "none") chatNotify.style.display = "block";
});

function sendEmail() {
  location.href =
    "mailto:dndonline.supp@gmail.com?subject=Ошибка в работе сайта";
  alert("Вы будете перенаправлены на почту, спасибо за фидбэк!");
}
