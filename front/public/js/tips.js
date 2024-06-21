const classLevelingButton = document.getElementById("levelsInformationButton");
const levelingTip = document.getElementById("levelingTip");
const resistancesPanel = document.getElementById("resistancesPanel");
const manageResistancesButton = document.getElementById("addResistances");

const diceHP = document.getElementById("diceHP");
const diceHPAmount = document.getElementById("diceHPAmount");

const resistancesList = document.getElementById("resistancesList");
const resistanceChoise = document.getElementById("resistanceChoice");
const immunityChoise = document.getElementById("immunityChoise");
const vulnerabilityChoise = document.getElementById("vulnerabilityChoise");
const resTypesChoises = [...document.getElementsByClassName("resTypeOfDamage")];
const addResButton = document.getElementById("addResButton");
const resInfoButton = document.getElementById("resistanceInfoButton");
var resistanceType = 0;
var resDamageType = 0;

var classTable;
var lastTag = null;
var lastSpell = null;

var isLevelingOpened = false;
var isResistancesOpened = false;
var isResInfoOpened = false;

const typeColorsImages = {
  Дробящий: [
    "rgb(222, 222, 222);",
    `background-image: url('../public/img/bludgeoningDamage.png');`,
  ],
  Колющий: [
    "rgb(222, 222, 222);",
    `background-image: url('../public/img/piercingDamage.png');`,
  ],
  Режущий: [
    "rgb(222, 222, 222);",
    `background-image: url('../public/img/slashingDamage.png');`,
  ],
  Холод: [
    "rgb(136, 204, 227);",
    `background-image: url('../public/img/coldDamage.png');`,
  ],
  Огонь: [
    "rgb(234, 108, 0);",
    `background-image: url('../public/img/fireDamage.png');`,
  ],
  Электрический: [
    "rgb(76, 129, 206);",
    `background-image: url('../public/img/lightningDamage.png');`,
  ],
  Гром: [
    "rgb(136, 102, 177);",
    `background-image: url('../public/img/thunderDamage.png');`,
  ],
  Кислота: [
    "rgb(212, 222, 3);",
    `background-image: url('../public/img/acidDamage.png');`,
  ],
  Яд: [
    "rgb(161, 183, 79);",
    `background-image: url('../public/img/poisonDamage.png');`,
  ],
  Лучистый: [
    "rgb(233, 201, 118);",
    `background-image: url('../public/img/radiantDamage.png');`,
  ],
  Некротический: [
    "rgb(105, 183, 135);",
    `background-image: url('../public/img/necroticDamage.png');`,
  ],
  Сила: [
    "rgb(183, 86, 87);",
    `background-image: url('../public/img/forceDamage.png');`,
  ],
  Психический: [
    "rgb(225, 136, 201);",
    `background-image: url('../public/img/psychicDamage.png');`,
  ],
  Усиление: [
    "rgb(237, 234, 40);",
    `background-image: url('../public/img/boost.png');`,
  ],
  "": ["transparent", "background-image: none;"],
};

function updateTable() {
  getTable().then((data) => {
    classTable = data[0];
    updateHP();
    // classLevelingButton.dispatchEvent(new Event("click"));
  });
}

async function getTable() {
  const res = await Promise.allSettled([
    createFetch(
      `https://dnd-data-base.vercel.app/class/${characterClass.value.toLowerCase()}`,
      {
        method: "GET",
      }
    ),
  ]);
  return res.reduce((arr, curr) => arr.concat(curr.value), []);
}

classLevelingButton.addEventListener("click", () => {
  isLevelingOpened = !isLevelingOpened;
  if (isLevelingOpened) {
    levelingTip.style.display = "block";
    levelingTip.innerHTML =
      classTable["table"].replaceAll(
        `<span class="tableAbility">`,
        `<span class="tableAbility" onclick="AbilityTip(event, this);">`
      ) +
      "<br>" +
      classTable["additionalInfo"];
  } else {
    levelingTip.style.display = "none";
    levelingTip.innerHTML = "";
  }
});

function AbilityTip(e, tag) {
  if (tag.innerHTML.indexOf("<") != -1) {
    tag.innerHTML = tag.innerHTML.slice(0, tag.innerHTML.indexOf("<dialog"));
    lastTag = null;
  } else {
    if (
      classTable["explanations"][
        tag.innerHTML.toLowerCase().replace(/ \([0-9а-яА-Я ]+\)/, "")
      ] != undefined
    ) {
      let t =
        (100 / document.body.clientWidth) *
        (tag.getBoundingClientRect().top + 0.02 * document.body.clientWidth);
      // tag.innerHTML += classTable["explanations"][tag.innerHTML.toLowerCase()];
      if (tag.getBoundingClientRect().top > 0.55 * document.body.clientHeight) {
        t =
          (100 / document.body.clientWidth) *
          (tag.getBoundingClientRect().top - 0.24 * document.body.clientWidth);
      }

      if (lastTag == null) lastTag = tag;
      else {
        if (lastTag != tag) {
          AbilityTip(null, lastTag);
          lastTag = tag;
        }
      }

      tag.innerHTML += `<dialog open class="explanation" onclick="event.stopPropagation();" style="top:${
        t != -1 ? t : ""
      }vw;">${classTable["explanations"][
        tag.innerHTML.toLowerCase().replace(/ \([0-9а-яА-Я ]+\)/, "") !=
        undefined
          ? tag.innerHTML.toLowerCase().replace(/ \([0-9а-яА-Я ]+\)/, "")
          : tag.innerHTML.toLowerCase().replace(/ \([0-9а-яА-Я ]+\)\/½/, "")
      ].replaceAll(
        `<span class="spellTip">`,
        `<span class="spellTip" onclick="SpellTip(event, this);">`
      )}</dialog>`;
    }
  }
}

function SpellTip(
  e,
  tag,
  withAddButton = false,
  linkedListId = null,
  isCustomSpell = false
) {
  if (tag.innerHTML.indexOf("<") != -1) {
    tag.innerHTML = tag.innerHTML.slice(0, tag.innerHTML.indexOf("<dialog"));
    lastSpell = null;
  } else {
    if (!isCustomSpell) {
      filteredSpell = Object.keys(spells).reduce((acc, key) => {
        let filteredSpells = spells[key].filter(
          (spell) => spell.name.toLowerCase() === tag.innerHTML.toLowerCase()
        );
        if (filteredSpells.length) {
          acc[key] = filteredSpells;
        }
        return acc;
      }, {});
    } else {
      filteredSpell = Object.keys(customSpells).reduce((acc, key) => {
        let filteredSpells = customSpells[key].filter(
          (spell) => spell.name.toLowerCase() === tag.innerHTML.toLowerCase()
        );
        if (filteredSpells.length) {
          acc[key] = filteredSpells;
        }
        return acc;
      }, {});
    }

    if (Object.keys(filteredSpell).length > 0) {
      let lvlShift = 0;
      while (
        filteredSpell[Object.keys(filteredSpell)[0]][0].damage[
          Level - lvlShift
        ] == undefined
      ) {
        lvlShift++;
      }

      let t =
        (100 / document.body.clientWidth) *
        (tag.getBoundingClientRect().top + 0.02 * document.body.clientWidth);
      // tag.innerHTML += classTable["explanations"][tag.innerHTML.toLowerCase()];
      if (tag.getBoundingClientRect().top > 0.55 * document.body.clientHeight) {
        t =
          (100 / document.body.clientWidth) *
          (tag.getBoundingClientRect().top - 0.24 * document.body.clientWidth);
      }

      if (lastSpell == null) lastSpell = tag;
      else {
        if (lastTag != tag) {
          SpellTip(null, lastSpell);
          lastSpell = tag;
        }
      }

      let durationColor = `color: rgb(129, 129, 129)`;
      if (filteredSpell[Object.keys(filteredSpell)[0]][0].concentration) {
        durationColor = `color: rgb(196, 110, 12);`;
      }

      let damageFont = `1vw`;
      if (filteredSpell[Object.keys(filteredSpell)[0]][0].damageType == "") {
        damageFont = `0`;
      }

      let actionIcon = ``;
      switch (filteredSpell[Object.keys(filteredSpell)[0]][0].time) {
        case "Действие":
          actionIcon = `<img src="../public/img/actionIcon.png" style="aspect-ratio: 1/1; width: 1.2vw">`;
          break;
        case "Бонусное действие":
          actionIcon = `<img src="../public/img/bonusActionIcon.png" style="aspect-ratio: 1/1; width: 1.2vw">`;
          break;
        case "Реакция":
          actionIcon = `<img src="../public/img/reactionIcon.png" style="aspect-ratio: 1/1; width: 1.2vw">`;
          break;
        default:
          break;
      }

      let addButton = "";
      if (withAddButton) {
        addButton = `
				<button class="createSpellButton" onclick="createSpell('${
          filteredSpell[Object.keys(filteredSpell)[0]][0].name
        }', ${linkedListId})" style="margin:0; padding:0; width: 100%; height: 5%; font-size: 0.8vw;">+</button>
				`;
      }

      tag.innerHTML += `<dialog open class="spell" onclick="event.stopPropagation();" style="top:${t}vw; left:${
        (100 / document.body.clientWidth) *
        (tag.getBoundingClientRect().left + 0.01 * document.body.clientWidth)
      }vw; z-index: 2000;">
			<div class="spellInfo">
			<div class="spellTop">
			<span class="spellName">
			${filteredSpell[Object.keys(filteredSpell)[0]][0].name}
			</span>

			<div class="spellIcon"></div>

			<div class="spellDamage" style="font-size: ${damageFont}">
			<span class="spellDamageValue">
			${filteredSpell[Object.keys(filteredSpell)[0]][0].damage[Level - lvlShift]}
			</span>
			<span class="spellDamageType" style="color:${
        typeColorsImages[
          filteredSpell[Object.keys(filteredSpell)[0]][0].damageType
        ][0]
      }">
			${filteredSpell[Object.keys(filteredSpell)[0]][0].damageType}
			</span>
			</div>
			<span style="color: rgb(129, 129, 129)">
			Длительность: 
			</span>
			<span class="spellDuration" style="${durationColor}">
			${filteredSpell[Object.keys(filteredSpell)[0]][0].duration}
			</span>
			</div>
			<div class="spellDescriptionDiv">
			<span class="spellDescription">
			${filteredSpell[Object.keys(filteredSpell)[0]][0].description}
			</span>
			</div>
			<div class="spellBottom">
			<div class="spellRangeNclasses">
			<span class="spellRange">
			${filteredSpell[Object.keys(filteredSpell)[0]][0].range}
			</span>
			<span class="spellClasses">
			${filteredSpell[Object.keys(filteredSpell)[0]][0].classes}
			</span>
			</div>
			<div class="spellTimeLevel">
			<span class="spellTime">
			${actionIcon}
			${filteredSpell[Object.keys(filteredSpell)[0]][0].time}
			</span>
			<span class="spellCell">
			Ячейка ${Object.keys(filteredSpell)[0]}
			</span>
			</div>
			${addButton}
			</div>
			</div>
			</dialog>`;

      let spellDiv = document.querySelector(".spell");
      let iconPos =
        (100 / document.body.clientWidth) *
        (spellDiv.getBoundingClientRect().left +
          spellDiv.offsetWidth -
          0.04 * document.body.clientWidth);

      if (filteredSpell[Object.keys(filteredSpell)[0]][0].damageType == "")
        tag.innerHTML = tag.innerHTML.replace(
          `<div class="spellIcon"></div>`,
          ""
        );
      else
        tag.innerHTML = tag.innerHTML.replace(
          `<div class="spellIcon"></div>`,
          `<div class="spellIcon" style="${
            typeColorsImages[
              filteredSpell[Object.keys(filteredSpell)[0]][0].damageType
            ][1]
          } left: ${iconPos}vw; top: ${
            (100 / document.body.clientWidth) *
            (spellDiv.getBoundingClientRect().top -
              0.01 * document.body.clientWidth)
          }vw;"></div>`
        );
    }
  }
}

function updateHP() {
  var matches = [];
  classTable["additionalInfo"].replace(
    /<strong>Кость Хитов: ?<\/strong>[a-zA-Z ="<>\/]+(\d+к\d+)/,
    function () {
      matches.push([...arguments]);
    }
  );
  let dice = matches[0][1];
  diceHP.innerHTML = dice.replace("к", "d");
  diceHPAmount.innerHTML = Level;
}

manageResistancesButton.addEventListener("click", () => {
  if (isResistancesOpened) {
    resistancesPanel.style.display = "none";
    isResistancesOpened = false;
    isResInfoOpened = false;
    document.getElementById("aboutResistances").style.display = "none";
  } else {
    resistancesPanel.style.display = "block";
    isResistancesOpened = true;
    resistanceType = 0;
    resistanceChoise.style.border = "0";
    immunityChoise.style.border = "0";
    vulnerabilityChoise.style.border = "0";
    resTypesChoises.forEach((resType) => {
      resType.style.border = "0";
    });
    resDamageType = 0;
  }
});

resistanceChoise.addEventListener("click", () => {
  resistanceType = 1;
  resistanceChoise.style.border = "1px solid yellow";
  immunityChoise.style.border = "0";
  vulnerabilityChoise.style.border = "0";
});

immunityChoise.addEventListener("click", () => {
  resistanceType = 2;
  immunityChoise.style.border = "1px solid yellow";
  resistanceChoise.style.border = "0";
  vulnerabilityChoise.style.border = "0";
});

vulnerabilityChoise.addEventListener("click", () => {
  resistanceType = 3;
  vulnerabilityChoise.style.border = "1px solid yellow";
  resistanceChoise.style.border = "0";
  immunityChoise.style.border = "0";
});

resTypesChoises.forEach((resType) => {
  resType.addEventListener("click", () => {
    resTypesChoises.forEach((resType) => {
      resType.style.border = "0";
    });
    resType.style.border = "1px solid yellow";
    resDamageType = resTypesChoises.indexOf(resType) + 1;
  });
});

addResButton.addEventListener("click", () => {
  if (resistanceType == 0) {
    alert("Выберите тип защиты");
    return;
  }
  if (resDamageType == 0) {
    alert("Выберите тип урона");
    return;
  }
  let li = document.createElement("li");
  li.innerHTML = `
	<div class="resistance" style="width: 1.7vw; height: 2.7vw;">
		<button onclick="removeRes(this, 0)" style="background-color: transparent;background-image: url(../public/img/${
      [
        "fullResistanceFrame.png",
        "immunityFrame.png",
        "vulnerabilityFrame.png",
      ][resistanceType - 1]
    });width: 1.7vw;height: 2.7vw;background-size: 100% 100%;border: 0;outline: 0;">
		</button>
		<div onclick="removeRes(this, 1)" style="background-image: url(../public/img/${typeColorsImages[
      Object.keys(typeColorsImages)[resDamageType - 1]
    ][1]
      .replace("background-image: url('../img/", "")
      .replace(
        "');",
        ""
      )}); position: absolute; width: 1.2vw; height: 1.2vw; top: 0; margin-left: 0.25vw; margin-top: 0.8vw; background-size: 100% 100%;">
		</div>
	</div>
	`;
  resistancesList.appendChild(li);
});

function removeRes(element, pos) {
  let ask = confirm("Удалить сопротивление?");
  if (!ask) return;
  if (pos == 0) {
    element.parentElement.remove();
  }
  if (pos == 1) {
    element.parentElement.parentElement.remove();
  }
}

resInfoButton.addEventListener("click", () => {
  if (isResInfoOpened) {
    document.getElementById("aboutResistances").style.display = "none";
    isResInfoOpened = false;
  } else {
    document.getElementById("aboutResistances").style.display = "block";
    isResInfoOpened = true;
  }
});
