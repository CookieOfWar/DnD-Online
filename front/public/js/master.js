var Role;
var urlParams;
const PlayerId = socket.id;

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
