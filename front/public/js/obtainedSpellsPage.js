var currentEditingCustomSpellUl = null;

var customSpells = {
  0: [],
  1: [],
  2: [],
  3: [],
  4: [],
  5: [],
  6: [],
  7: [],
  8: [],
  9: [],
};

document.getElementById("openSpellsButton").addEventListener("click", (e) => {
  if (
    getComputedStyle(document.getElementById("spellsPage")).display == "none"
  ) {
    document.getElementById("spellsPage").style.display = "block";
  } else {
    document.getElementById("spellsPage").style.display = "none";
  }
});
document
  .getElementById("openEquipmentAndNotes")
  .addEventListener("click", (e) => {
    if (
      getComputedStyle(document.getElementById("equipmentPage")).display ==
      "none"
    ) {
      document.getElementById("equipmentPage").style.display = "block";
    } else {
      document.getElementById("equipmentPage").style.display = "none";
    }
  });

//couldn't do it with the forEach

document.getElementById("addSpell0").addEventListener("click", (e) => {
  addSpell(0);
});
document.getElementById("addSpell1").addEventListener("click", (e) => {
  addSpell(1);
});
document.getElementById("addSpell2").addEventListener("click", (e) => {
  addSpell(2);
});
document.getElementById("addSpell3").addEventListener("click", (e) => {
  addSpell(3);
});
document.getElementById("addSpell4").addEventListener("click", (e) => {
  addSpell(4);
});
document.getElementById("addSpell5").addEventListener("click", (e) => {
  addSpell(5);
});
document.getElementById("addSpell6").addEventListener("click", (e) => {
  addSpell(6);
});
document.getElementById("addSpell7").addEventListener("click", (e) => {
  addSpell(7);
});
document.getElementById("addSpell8").addEventListener("click", (e) => {
  addSpell(8);
});
document.getElementById("addSpell9").addEventListener("click", (e) => {
  addSpell(9);
});

document
  .getElementById("spellsOfCurrentLevelCloseButton")
  .addEventListener("click", (e) => {
    document.getElementById("spellsOfCurrentLevelDiv").style.display = "none";
  });

function addSpell(spellNumber) {
  let currList = document.getElementById("spellsList" + spellNumber);
  if (currList.querySelector("input") != null) {
    return;
  }
  let li = document.createElement("li");
  li.innerHTML = `
	<div class="obtainedSpell">
	<input type="text" class="spellName" autocomplete="off">
	<button class="linkSpellButton" onclick="linkSpell(this)"></button>
	<button class="addCustomSpellButton" style="display: none;"></button>
	<button class="removeSpellButton">X</button>
	</div>
	`;
  document.getElementById("spellsList" + spellNumber).appendChild(li);
  updListenersOnSkillsInputs();
}

function updListenersOnSkillsInputs() {
  [...document.getElementsByClassName("spellName")].forEach((button) => {
    button.addEventListener("input", (e) => {
      if (e.target.value == "") {
        button.parentElement.querySelector(".linkSpellButton").style.display =
          "block";
        button.parentElement.querySelector(
          ".addCustomSpellButton"
        ).style.display = "none";
      } else {
        button.parentElement.querySelector(".linkSpellButton").style.display =
          "none";
        button.parentElement.querySelector(
          ".addCustomSpellButton"
        ).style.display = "block";
      }
    });
  });

  [...document.getElementsByClassName("removeSpellButton")].forEach(
    (button) => {
      button.addEventListener("click", (e) => {
        document.getElementById("spellsOfCurrentLevelDiv").style.display =
          "none";
        document
          .getElementById("cancelCustomSpellButton")
          .dispatchEvent(new Event("click"));

        if (
          button.parentElement.innerHTML.indexOf(
            `<span class="spellName" onclick="SpellTip(null, this, false, null, true);" style="cursor: pointer; font-weight: bold; text-decoration: underline; font-size: 1vw; color: black;">`
          ) != -1
        ) {
          let filteredSpelltemp = Object.keys(customSpells).reduce(
            (acc, key) => {
              let filteredSpellstemp = customSpells[key].filter((spell) => {
                if (
                  button.parentElement
                    .querySelector("span")
                    .innerHTML.indexOf(`<dialog`) != -1
                ) {
                  let name = button.parentElement
                    .querySelector("span")
                    .innerHTML.slice(
                      0,
                      button.parentElement
                        .querySelector("span")
                        .innerHTML.indexOf(`<dialog`)
                    );
                  if (spell.name.toLowerCase() === name) {
                    return true;
                  } else {
                    return false;
                  }
                } else {
                  if (
                    spell.name.toLowerCase() ===
                    button.parentElement
                      .querySelector("span")
                      .innerText.toLowerCase()
                  ) {
                    return true;
                  }
                  return false;
                }
              });
              if (filteredSpellstemp.length) {
                acc[key] = filteredSpellstemp;
              }
              return acc;
            },
            {}
          );
          let tempIndexOfCustomSpell = customSpells[
            Object.keys(filteredSpelltemp)[0]
          ].indexOf(filteredSpelltemp[Object.keys(filteredSpelltemp)[0]][0]);
          if (tempIndexOfCustomSpell != -1) {
            customSpells[Object.keys(filteredSpelltemp)[0]].splice(
              tempIndexOfCustomSpell,
              1
            );
            // filteredSpelltemp[Object.keys(filteredSpelltemp)[0]][0].time;
          }
        }

        e.target.parentElement.remove();
      });
    }
  );

  [...document.getElementsByClassName("linkSpellButton")].forEach((button) => {
    button.addEventListener("click", (e) => linkSpell);
  });

  [...document.getElementsByClassName("addCustomSpellButton")].forEach(
    (button) => {
      button.addEventListener("click", (e) => {
        if (
          getComputedStyle(document.getElementById("customSpellsCreator"))
            .display == "none"
        ) {
          document.getElementById("customSpellsCreator").style.display =
            "block";
          document.getElementById("customSpellName").innerHTML =
            "Имя: " + button.parentElement.querySelector(".spellName").value;
          document.getElementById("customSpellLevelSelect").innerHTML =
            button.parentElement.parentElement.parentElement.id.slice(-1);

          currentEditingCustomSpellUl =
            button.parentElement.parentElement.parentElement;
        }
      });
    }
  );
}

function linkSpell(button) {
  document.getElementById("spellsOfCurrentLevelUl").innerHTML = "";
  filteredSpell = Object.keys(spells).reduce((acc, key) => {
    let filteredSpells = spells[key].filter(
      (spell) =>
        spell.classes.indexOf(
          document.getElementById("characterClass").options[
            document.getElementById("characterClass").selectedIndex
          ].text
        ) != -1
    );
    if (filteredSpells.length > 0) {
      acc[key] = filteredSpells;
    }
    return acc;
  }, {});
  if (!filteredSpell.length) {
    alert("У данного класса нет заклинаний");
    return;
  }
  filteredSpell[
    button.parentElement.parentElement.parentElement.id.slice(-1)
  ].forEach((spell) => {
    let li = document.createElement("li");
    li.innerHTML =
      `<span onclick='SpellTip(null, this, true, ${button.parentElement.parentElement.parentElement.id.slice(
        -1
      )});' style='cursor: pointer; font-weight: bold; text-decoration: underline; font-size: 1vw;'>` +
      spell.name +
      "</span>";
    document.getElementById("spellsOfCurrentLevelUl").appendChild(li);
  });
  document.getElementById("spellsOfCurrentLevelDiv").style.display = "block";
}

function createSpell(spell, linkedListId) {
  document.querySelector("#spellsList" + linkedListId).innerHTML = document
    .querySelector("#spellsList" + linkedListId)
    .innerHTML.replace(
      `<input type="text" class="spellName" autocomplete="off">`,
      `<span class="spellName" onclick="SpellTip(null, this);" style="cursor: pointer; font-weight: bold; text-decoration: underline; font-size: 1vw; color: black;">${spell}</span>`
    )
    .replace(
      `<button class="linkSpellButton" onclick="linkSpell(this)"></button>`,
      ``
    )
    .replace(
      `<button class="linkSpellButton" onclick="linkSpell(this)" style="display: block;"></button>`,
      ``
    );
  document.getElementById("spellsOfCurrentLevelDiv").style.display = "none";
  updListenersOnSkillsInputs();
}

const customSpellDamageInputs = [
  ...document.getElementsByClassName("customSpellDamageInput"),
];

customSpellDamageInputs.forEach((input) => {
  input.addEventListener("input", (e) => {
    for (
      let i = customSpellDamageInputs.indexOf(input) + 1;
      i < customSpellDamageInputs.length;
      i++
    ) {
      customSpellDamageInputs[i].value = e.target.value;
    }
  });
});

document
  .getElementById("cancelCustomSpellButton")
  .addEventListener("click", (e) => {
    document.getElementById("customSpellsCreator").style.display = "none";
    document.getElementById("customSpellDamageSelect").selectedIndex = 0;
    document.getElementsByClassName("customSpellDamageInput")[0].value = "";
    document
      .getElementsByClassName("customSpellDamageInput")[0]
      .dispatchEvent(new Event("input"), { target: { value: "" } });
    document.getElementById("customSpellDescription").value = "";
    document.getElementById("customSpellDuration").value = "";
    document.getElementById("customSpellRange").value = "";
    document.getElementById("customSpellTime").value = "";
    document.getElementById("customSpellLevelSelect").selectedIndex = 0;
  });

document
  .getElementById("confirmCustomSpellButton")
  .addEventListener("click", (e) => {
    currentEditingCustomSpellUl.innerHTML =
      currentEditingCustomSpellUl.innerHTML
        .replace(
          `<input type="text" class="spellName" autocomplete="off">`,
          `<span class="spellName" onclick="SpellTip(null, this, false, null, true);" style="cursor: pointer; font-weight: bold; text-decoration: underline; font-size: 1vw; color: black;">${document
            .getElementById("customSpellName")
            .innerHTML.replace("Имя: ", "")}</span>`
        )
        .replace(`<button class="addCustomSpellButton"></button>`, ``)
        .replace(
          `<button class="addCustomSpellButton" style="display: block;"></button>`,
          ``
        );

    let tempDamageDict = {};
    if (customSpellDamageInputs[0].value == "") {
      tempDamageDict = { 1: "" };
    } else {
      let lastDamage = customSpellDamageInputs[0].value;
      tempDamageDict[1] = lastDamage;
      for (let i = 1; i < customSpellDamageInputs.length; i++) {
        if (customSpellDamageInputs[i].value != lastDamage) {
          tempDamageDict[i + 1] = customSpellDamageInputs[i].value;
          lastDamage = customSpellDamageInputs[i].value;
        }
      }
    }

    // let csIndex = currentEditingCustomSpellUl.id.slice(-1);
    customSpells[currentEditingCustomSpellUl.id.slice(-1)].push({
      name: document
        .getElementById("customSpellName")
        .innerHTML.replace("Имя: ", ""),
      description: document.getElementById("customSpellDescription").value,
      school: "",
      concentration: false,
      duration: document.getElementById("customSpellDuration").value,
      range: document.getElementById("customSpellRange").value,
      time: document.getElementById("customSpellTime").value,
      damageType: document.getElementById("customSpellDamageSelect").value,
      damage: tempDamageDict,
      classes: [""],
    });

    document.getElementById("cancelCustomSpellButton").click();
    updListenersOnSkillsInputs();
  });
