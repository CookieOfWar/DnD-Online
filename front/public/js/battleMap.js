const mapStateButton = document.getElementById("openBattleMapButton");

var dragging = false;
var draggingIndex = 0; // 0 - none, 1 - map, 2 - player, 3 - rotation controls, 4 - scale controls
var draggingMasterId = null; // temp Id for master to drag all the players
var startScale = null; // scale before  = tempScale / startScale
var lastScale = null;
var startCenter = null; // center of player before scaling

var clickTime = 0; // checks whether pressing or holding is performed
var enemiesList = [];
var enemiesCount = 0;

function configureBattleMap() {
  let battleMapImage = document.getElementById("battleMapImage");

  if (Role == "master") {
    document.getElementById("battleMap").innerHTML += `
			<label for="mapInput" id="mapInputLabel" style="position: absolute; left: 0; top: 0; width: 7vw; height: 1vw; color: white; cursor: pointer; font-size: 1.5vw;">Файл</label>
			<input type="file" id="mapInput" accept="image/png, image/jpeg", image/jpg" style="position: absolute; visibility: hidden;"/>
			<div style="display: flex; flex-direction: column; position: absolute; right: 0;">
				<button id="addEnemyButton">Добавить врага</button>
				<button id="addNPCButton">Добавить НПС</button>
			</div>
		`;

    let mapInputLabel = document.getElementById("mapInputLabel");

    mapInputLabel.ondragover = mapInputLabel.ondragenter = (e) => {
      e.preventDefault();
    };
    mapInputLabel.ondrop = (e) => {
      e.preventDefault();
      socket.emit(
        "sendImageToAll",
        URL.createObjectURL(e.dataTransfer.files[0])
      );
    };

    document.getElementById("mapInput").addEventListener("change", (e) => {
      socket.emit("sendImageToAll", URL.createObjectURL(e.target.files[0]));
    });

    document.getElementById("addEnemyButton").addEventListener("click", (e) => {
      socket.emit("addEnemy", { color: "red" });
    });
    document.getElementById("addNPCButton").addEventListener("click", (e) => {
      socket.emit("addEnemy", { color: "green" });
    });
  }

  document
    .getElementById("battleMapImage")
    .addEventListener("mousedown", (e) => {
      e.preventDefault();
      dragging = true;
      draggingIndex = 1;
    });

  document.addEventListener("mouseup", (e) => {
    dragging = false;
    if (draggingIndex == 4) {
      console.log(new Date() - clickTime);
      if (new Date() - clickTime >= 200) {
        let tempId = (Role == "master" ? draggingMasterId : socket.id).replace(
          "sizeControls-",
          ""
        );
        socket.emit("endOfScaling", { id: tempId, lastScale: lastScale });
      }
    }
    draggingIndex = 0;
    draggingMasterId = null;
  });

  document.addEventListener("mousemove", (e) => {
    if (dragging) {
      let tempId;
      let center;
      switch (draggingIndex) {
        case 1:
          document.getElementById("battleMapImage").style.left =
            parseInt(
              document
                .getElementById("battleMapImage")
                .style.left.replace("px", "")
            ) +
            e.movementX +
            "px";

          document.getElementById("battleMapImage").style.top =
            parseInt(
              document
                .getElementById("battleMapImage")
                .style.top.replace("px", "")
            ) +
            e.movementY +
            "px";
          break;
        case 2:
          tempId = (Role == "master" ? draggingMasterId : socket.id).replace(
            "PlayerOnMap-",
            ""
          );

          let playerX =
            parseInt(
              document
                .getElementById(`PlayerOnMap-${tempId}`)
                .style.left.replace("px", "")
            ) +
            e.movementX +
            "px";
          let playerY =
            parseInt(
              document
                .getElementById(`PlayerOnMap-${tempId}`)
                .style.top.replace("px", "")
            ) +
            e.movementY +
            "px";

          document.getElementById(`PlayerOnMap-${tempId}`).style.left = playerX;
          document.getElementById(`PlayerOnMap-${tempId}`).style.top = playerY;

          socket.emit("playerMovement", {
            id: tempId,
            socketid: socket.id,
            move: {
              x: document.getElementById(`PlayerOnMap-${tempId}`).style.left,
              y: document.getElementById(`PlayerOnMap-${tempId}`).style.top,
            },
          });

          break;
        case 3:
          tempId = (Role == "master" ? draggingMasterId : socket.id).replace(
            "rotationControls-",
            ""
          );
          center = {
            x:
              parseInt(
                document
                  .getElementById(`PlayerOnMap-${tempId}`)
                  .getBoundingClientRect().left
              ) +
              parseInt(
                document.getElementById(`PlayerOnMap-${tempId}`).clientWidth
              ) /
                2,
            y:
              parseInt(
                document
                  .getElementById(`PlayerOnMap-${tempId}`)
                  .getBoundingClientRect().top
              ) +
              parseInt(
                document.getElementById(`PlayerOnMap-${tempId}`).clientHeight
              ) /
                2,
          };

          let rotation =
            Math.atan((e.clientY - center.y) / (e.clientX - center.x)) *
            (180 / Math.PI);

          if (e.clientX - center.x >= 0) rotation -= 90;
          else if (e.clientX - center.x < 0) rotation += 90;

          socket.emit("playerRotation", {
            id: tempId,
            rotation: rotation,
          });
          break;
        case 4:
          tempId = (Role == "master" ? draggingMasterId : socket.id).replace(
            "sizeControls-",
            ""
          );

          let controlCenter = {
            x: e.clientX,
            y: e.clientY,
          };
          console.log(
            "controlCenter",
            controlCenter,
            "startCenter",
            startCenter
          );

          let tempScale = Math.sqrt(
            Math.pow(controlCenter.x - startCenter.x, 2) +
              Math.pow(controlCenter.y - startCenter.y, 2)
          );
          let scaling = tempScale / startScale;

          // if (controlCenter.x < center.x || controlCenter.y < center.y)
          //   scaling = 1 / scaling;

          socket.emit("scalePlayer", { id: tempId, scaling: scaling });

          // startScale = Math.sqrt(
          //   (center.x - controlCenter.x) ** 2 +
          //     (center.y - controlCenter.y) ** 2
          // );
          break;
        default:
          break;
      }
    }
  });

  document.getElementById("battleMapImage").style.left = "0px";
  document.getElementById("battleMapImage").style.top = "0px";
}

mapStateButton.addEventListener("click", (e) => {
  if (
    getComputedStyle(document.getElementById("battleMap")).display == "none"
  ) {
    document.getElementById("battleMap").style.display = "flex";
  } else {
    document.getElementById("battleMap").style.display = "none";
  }
});

socket.on("setBMImage", (im) => {
  setBattleMapImage(im);
});

function setBattleMapImage(f) {
  document.getElementById("battleMapImage").style.backgroundImage = `url(${f})`;
  document.getElementById("battleMapImage").style.left = "0px";
  document.getElementById("battleMapImage").style.top = "0px";
}

socket.on("addPlayerToBM", (players) => {
  addPlayerToMap(players);
});
function addPlayerToMap(players) {
  document.getElementById("battleMapImage").innerHTML = "";
  for (let i = 0; i < Object.keys(players).length; i++) {
    console.log("Player added");
    document.getElementById("battleMapImage").innerHTML += `
		<div style='
			display: flex;
			justify-content: center;
			align-items: center;
			position: absolute;
			background-color: transparent;
			width: 3vw;
			height: 3vw;
			background-color: transparent; background-image: url("../public/img/DicesClasses/${
        players[Object.keys(players)[i]].class
      }.png"); 
			background-size: 100% 100%;
			transform: scale(1);
			'
			class="playerOnMap"
			id="PlayerOnMap-${players[Object.keys(players)[i]].id}">
			<img src="../public/img/rotateArrow.png" style="position: absolute; top: 110%; width: 60%; height: 20%; transform-origin: 50% -300%;" class="rotateArrow"/>
			<div class="playerControls" id="playerControls-${
        players[Object.keys(players)[i]].id
      }" style="position: absolute; display: none; width: 100%; height: 100%; border: 1px solid white; top: 0; left: 0;">
				<div class="rotationControls" id="rotationControls-${
          players[Object.keys(players)[i]].id
        }" style="position: absolute; width: 10%; height: 10%; border: 1px solid white; border-radius: 50%; left: 45%; top: 170%; background-color: yellow; transform-origin: 50% -1100%;">
				</div>
				<div class="sizeControls" id="sizeControls-${
          players[Object.keys(players)[i]].id
        }" style="position: absolute; width: 10%; height: 10%; border: 1px solid white; top: 110%; left: 110%;">
				</div>
				<div class="deletePlayerButton" id="deletePlayerButton-${
          players[Object.keys(players)[i]].id
        }" style="display: none; position: absolute; width: 15%; height: 15%; top: -7.5%; right: -7.5%; border-radius: 50%; background-color: red; background-image: linear-gradient(-45deg, transparent 0% 45%, white 45% 55%, transparent 55% 100%), linear-gradient(45deg, transparent 0% 45%, white 45% 55%, transparent 55% 100%);">
				</div>
			</div>
		</div>
	`;

    document.getElementById(
      `PlayerOnMap-${players[Object.keys(players)[i]].id}`
    ).style.left = "0px";
    document.getElementById(
      `PlayerOnMap-${players[Object.keys(players)[i]].id}`
    ).style.top = "0px";
    document
      .getElementById(`PlayerOnMap-${players[Object.keys(players)[i]].id}`)
      .querySelector("img").style.transform = "rotate(0deg)";
  }

  if (Role == "player") {
    setPlayerListeners();
  }

  if (Role == "master") {
    // set listeners to controll any player

    setMasterListeners();
  }
}

//upd players position
socket.on("playerMove", (data) => {
  if (data.socketid == socket.id) return;
  document.getElementById(`PlayerOnMap-${data.id}`).style.left = data.move.x;
  document.getElementById(`PlayerOnMap-${data.id}`).style.top = data.move.y;
});

//upd players rotation
socket.on("playerRotation", (data) => {
  document
    .getElementById(`PlayerOnMap-${data.id}`)
    .querySelector("img").style.transform = `rotate(${data.rotation}deg)`;
  document.getElementById(
    `rotationControls-${data.id}`
  ).style.transform = `rotate(${data.rotation}deg)`;
});

//upd players scale
socket.on("scalePlayer", (data) => {
  if (
    +document
      .getElementById(`PlayerOnMap-${data.id}`)
      .style.width.replace("vw", "") *
      data.scaling <
    0.5
  ) {
    data.scaling =
      0.5 /
      +document
        .getElementById(`PlayerOnMap-${data.id}`)
        .style.width.replace("vw", "");
  }
  if (
    +document
      .getElementById(`PlayerOnMap-${data.id}`)
      .style.width.replace("vw", "") *
      data.scaling >
    20
  ) {
    data.scaling =
      20 /
      +document
        .getElementById(`PlayerOnMap-${data.id}`)
        .style.width.replace("vw", "");
  }

  lastScale = data.scaling;

  document.getElementById(
    `PlayerOnMap-${data.id}`
  ).style.transform = `scale(${data.scaling})`;
});
socket.on("endOfScaling", (data) => {
  let player = document.getElementById(`PlayerOnMap-${data.id}`);

  let multiplier = data.lastScale < 1 ? 1 : -1;
  let lastW = +player.clientWidth;
  let lastH = +player.clientHeight;
  // console.log(lastScale);

  player.style.width =
    player.style.width.replace("vw", "") * data.lastScale + "vw";
  player.style.height =
    player.style.height.replace("vw", "") * lastScale + "vw";
  player.style.transform = `scale(1)`;

  player.style.left =
    +player.style.left.replace("px", "") +
    (Math.abs(+player.clientWidth - lastW) / 2) * multiplier +
    "px";

  player.style.top =
    +player.style.top.replace("px", "") +
    (Math.abs(+player.clientHeight - lastH) / 2) * multiplier +
    "px";
});

socket.on("addEnemy", (data) => {
  let tempEnemyString = `<div style='
			display: flex;
			justify-content: center;
			align-items: center;
			position: absolute;
			width: 2.7vw;
			height: 2.7vw;
			background-color: ${data.color};
			border-radius: 50%;
			border: 1px solid white;
			background-size: 100% 100%;
			transform: scale(1);
			'
			class="playerOnMap"
			id="PlayerOnMap-Enemy${enemiesCount}">
			<img src="../public/img/rotateArrow.png" style="position: absolute; top: 110%; width: 60%; height: 20%; transform-origin: 50% -300%;" class="rotateArrow"/>
			<div class="playerControls" id="playerControls-Enemy${enemiesCount}" style="position: absolute; display: none; width: 100%; height: 100%; border: 1px solid white; top: 0; left: 0;">
				<div class="rotationControls" id="rotationControls-Enemy${enemiesCount}" style="position: absolute; width: 10%; height: 10%; border: 1px solid white; border-radius: 50%; left: 45%; top: 170%; background-color: yellow; transform-origin: 50% -1100%;">
				</div>
				<div class="sizeControls" id="sizeControls-Enemy${enemiesCount}" style="position: absolute; width: 10%; height: 10%; border: 1px solid white; top: 110%; left: 110%;">
				</div>
				<div class="deletePlayerButton" id="deletePlayerButton-Enemy${enemiesCount}" style="display: none; position: absolute; width: 15%; height: 15%; top: -7.5%; right: -7.5%; border-radius: 50%; background-color: red; background-image: linear-gradient(-45deg, transparent 0% 45%, white 45% 55%, transparent 55% 100%), linear-gradient(45deg, transparent 0% 45%, white 45% 55%, transparent 55% 100%);">
				</div>
			</div>
		</div>
	`;
  let tempEnemyElement = document.createElement("div");
  tempEnemyElement.innerHTML = tempEnemyString;
  let tempEnemy = tempEnemyElement.firstChild;

  // document.getElementById("battleMapImage").innerHTML += tempEnemy;
  document.getElementById("battleMapImage").appendChild(tempEnemy);

  enemiesList.push(tempEnemy);
  enemiesCount++;

  document.getElementById(`PlayerOnMap-Enemy${enemiesCount - 1}`).style.left =
    "0px";
  document.getElementById(`PlayerOnMap-Enemy${enemiesCount - 1}`).style.top =
    "0px";
  document
    .getElementById(`PlayerOnMap-Enemy${enemiesCount - 1}`)
    .querySelector("img").style.transform = "rotate(0deg)";

  if (Role == "master") {
    // set listeners to controll any player
    document.getElementById(
      `deletePlayerButton-Enemy${enemiesCount - 1}`
    ).style.display = "block";
    setMasterListeners();
  }

  if (Role == "player") {
    setPlayerListeners();
  }
});

function setMasterListeners() {
  document.querySelectorAll(".playerOnMap").forEach((el) => {
    el?.addEventListener("mousedown", (e) => {
      clickTime = new Date();
      e.preventDefault();
      e.stopPropagation();
      dragging = true;
      draggingIndex = 2;
      draggingMasterId = el.id;
    });

    el?.addEventListener("click", () => {
      if (new Date() - clickTime >= 200) {
        return;
      }
      if (
        document.getElementById(
          `playerControls-${el.id.replace("PlayerOnMap-", "")}`
        ).style.display == "none"
      ) {
        document.getElementById(
          `playerControls-${el.id.replace("PlayerOnMap-", "")}`
        ).style.display = "block";
      } else {
        document.getElementById(
          `playerControls-${el.id.replace("PlayerOnMap-", "")}`
        ).style.display = "none";
      }
    });
  });

  document.querySelectorAll(".rotationControls").forEach((el) => {
    el?.addEventListener("mousedown", (e) => {
      e.preventDefault();
      e.stopPropagation();
      dragging = true;
      draggingIndex = 3;
      draggingMasterId = el.id;
    });
  });

  document.querySelectorAll(".sizeControls").forEach((el) => {
    el?.addEventListener("mousedown", (e) => {
      e.preventDefault();
      e.stopPropagation();
      dragging = true;
      draggingIndex = 4;
      draggingMasterId = el.id;
      clickTime = new Date();

      let center = {
        x:
          parseInt(
            document
              .getElementById(
                `playerControls-${el.id.replace("sizeControls-", "")}`
              )
              .getBoundingClientRect().left
          ) +
          parseInt(
            document.getElementById(
              `playerControls-${el.id.replace("sizeControls-", "")}`
            ).clientWidth
          ) /
            2,
        y:
          parseInt(
            document
              .getElementById(
                `playerControls-${el.id.replace("sizeControls-", "")}`
              )
              .getBoundingClientRect().top
          ) +
          parseInt(
            document.getElementById(
              `playerControls-${el.id.replace("sizeControls-", "")}`
            ).clientHeight
          ) /
            2,
      };
      let controlCenter = {
        x: e.clientX,
        y: e.clientY,
      };

      startCenter = center;

      startScale = Math.sqrt(
        (center.x - controlCenter.x) ** 2 + (center.y - controlCenter.y) ** 2
      );
    });
  });

  enemiesList.forEach((enemy) => {
    enemy
      .querySelector(".deletePlayerButton")
      .addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        socket.emit("removeEnemy", {
          id: enemy.querySelector(".deletePlayerButton").id,
        });
      });
  });
  // for (let i = 0; i < enemiesList; i++) {
  //   if (document.getElementById(`PlayerOnMap-Enemy${i}`) == null) continue;
  //   document
  //     .getElementById(`deletePlayerButton-Enemy${i}`)
  //     .addEventListener("click", (e) => {
  //       e.preventDefault();
  //       e.stopPropagation();
  //       socket.emit("removeEnemy", { id: `PlayerOnMap-Enemy${i}` });
  //     });
  // }
}

function setPlayerListeners() {
  document
    .getElementById(`PlayerOnMap-${socket.id}`)
    .addEventListener("mousedown", (e) => {
      clickTime = new Date();
      e.preventDefault();
      e.stopPropagation();
      dragging = true;
      draggingIndex = 2;
    });

  // click and show controls
  document
    .getElementById(`PlayerOnMap-${socket.id}`)
    .addEventListener("click", () => {
      if (new Date() - clickTime >= 200) {
        return;
      }
      if (
        document.getElementById(`playerControls-${socket.id}`).style.display ==
        "none"
      ) {
        document.getElementById(`playerControls-${socket.id}`).style.display =
          "block";
      } else {
        document.getElementById(`playerControls-${socket.id}`).style.display =
          "none";
      }
    });

  // drag rotation control
  document
    .getElementById(`rotationControls-${socket.id}`)
    .addEventListener("mousedown", (e) => {
      e.preventDefault();
      e.stopPropagation();
      dragging = true;
      draggingIndex = 3;
    });

  // drag scale control
  document
    .getElementById(`sizeControls-${socket.id}`)
    .addEventListener("mousedown", (e) => {
      e.preventDefault();
      e.stopPropagation();
      dragging = true;
      draggingIndex = 4;
      clickTime = new Date();

      let center = {
        x:
          parseInt(
            document
              .getElementById(`playerControls-${socket.id}`)
              .getBoundingClientRect().left
          ) +
          parseInt(
            document.getElementById(`playerControls-${socket.id}`).clientWidth
          ) /
            2,
        y:
          parseInt(
            document
              .getElementById(`playerControls-${socket.id}`)
              .getBoundingClientRect().top
          ) +
          parseInt(
            document.getElementById(`playerControls-${socket.id}`).clientHeight
          ) /
            2,
      };
      let controlCenter = {
        x: e.clientX,
        y: e.clientY,
      };

      startCenter = center;

      startScale = Math.sqrt(
        (center.x - controlCenter.x) ** 2 + (center.y - controlCenter.y) ** 2
      );
    });
}

socket.on("removeEnemy", (data) => {
  console.log("removing enemy", data.id);
  document
    .getElementById(`PlayerOnMap-` + data.id.replace("deletePlayerButton-", ""))
    .remove();

  enemiesList.splice(
    enemiesList.indexOf(
      document.getElementById(
        `PlayerOnMap-` + data.id.replace("deletePlayerButton-", "")
      )
    ),
    1
  );
});
