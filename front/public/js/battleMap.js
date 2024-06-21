const mapStateButton = document.getElementById("openBattleMapButton");

var dragging = false;
var draggingIndex = 0; // 0 - none, 1 - map, 2 - player
var draggingMasterId = null; // temp Id for master to drag all the players

var clickTime = 0; // checks whether pressing or holding is performed

function configureBattleMap() {
  let battleMapImage = document.getElementById("battleMapImage");

  if (Role == "master") {
    document.getElementById("battleMap").innerHTML += `
			<label for="mapInput" id="mapInputLabel" style="position: absolute; left: 0; top: 0; width: 7vw; height: 1vw; color: white; cursor: pointer; font-size: 1.5vw;">Файл</label>
			<input type="file" id="mapInput" accept="image/png, image/jpeg", image/jpg" style="position: absolute; visibility: hidden;"/>
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
    draggingIndex = 0;
    draggingMasterId = null;
  });

  document.addEventListener("mousemove", (e) => {
    if (dragging) {
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
          let tempId = (Role == "master" ? draggingMasterId : PlayerId).replace(
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

          socket.emit("playerMovement", {
            id: tempId,
            move: {
              x: playerX,
              y: playerY,
            },
          });
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
			position: relative;
			background-color: transparent;
			width: 3vw;
			height: 3vw;
			background-image: url("../public/img/DicesClasses/${
        players[Object.keys(players)[i]].class
      }.png");
			background-size: 100% 100%;
			'
			class="playerOnMap"
			id="PlayerOnMap-${players[Object.keys(players)[i]].id}">
			<img src="../public/img/rotateArrow.png" style="position: relative; top: 80%; width: 60%; height: 20%;" class="rotateArrow"/>
			<div class="playerControls" id="playerControls-${
        players[Object.keys(players)[i]].id
      }" style="position: absolute; display: none; width: 100%; height: 100%; border: 1px solid white; top: 0; left: 0;">
				<div class="rotationControls" id="rotationControls-${
          players[Object.keys(players)[i]].id
        }" style="position: relative; width: 10%; height: 10%; border: 1px solid white; border-radius: 50%; left: 40%; top: 150%; background-color: yellow;">
			</div>
		</div>
	`;
    document.getElementById(
      `PlayerOnMap-${players[Object.keys(players)[i]].id}`
    ).style.left = "0px";
    document.getElementById(
      `PlayerOnMap-${players[Object.keys(players)[i]].id}`
    ).style.top = "0px";
  }

  if (Role == "player") {
    document
      .getElementById(`PlayerOnMap-${PlayerId}`)
      .addEventListener("mousedown", (e) => {
        clickTime = new Date();
        e.preventDefault();
        e.stopPropagation();
        dragging = true;
        draggingIndex = 2;
      });
    document
      .getElementById(`PlayerOnMap-${PlayerId}`)
      .addEventListener("click", () => {
        if (new Date() - clickTime >= 200) {
          return;
        }
        if (
          document.getElementById(`playerControls-${PlayerId}`).style.display ==
          "none"
        ) {
          document.getElementById(`playerControls-${PlayerId}`).style.display =
            "block";
        } else {
          document.getElementById(`playerControls-${PlayerId}`).style.display =
            "none";
        }
      });
  }

  if (Role == "master") {
    [...document.getElementsByClassName("playerOnMap")].forEach((el) => {
      el?.addEventListener("mousedown", (e) => {
        e.preventDefault();
        e.stopPropagation();
        dragging = true;
        draggingIndex = 2;
        draggingMasterId = el.id;
        console.log(draggingMasterId);
      });
    });
  }
}

socket.on("playerMove", (data) => {
  document.getElementById(`PlayerOnMap-${data.id}`).style.left = data.move.x;
  document.getElementById(`PlayerOnMap-${data.id}`).style.top = data.move.y;
});
