const mapStateButton = document.getElementById("openBattleMapButton");

var dragging = false;

function configureBattleMap() {
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
      document.getElementById(
        "battleMapImage"
      ).style.backgroundImage = `url(${URL.createObjectURL(
        e.dataTransfer.files[0]
      )})`;
    };

    document.getElementById("mapInput").addEventListener("change", (e) => {
      document.getElementById(
        "battleMapImage"
      ).style.backgroundImage = `url(${URL.createObjectURL(
        e.target.files[0]
      )})`;
    });
  }

  document
    .getElementById("battleMapImage")
    .addEventListener("mousedown", (e) => {
      e.preventDefault();
      dragging = true;
    });

  document.addEventListener("mouseup", (e) => {
    dragging = false;
  });

  document.addEventListener("mousemove", (e) => {
    console.log(e.movementX);
    if (dragging) {
      battleMapImage.style.left = `${
        battleMapImage.getBoundingClientRect().left + e.movementX
      }px`;
      battleMapImage.style.top = `${
        battleMapImage.getBoundingClientRect().top + e.movementY
      }px`;
    }
  });
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
