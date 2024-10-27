module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("New socket connection");

    let currentCode = null;

    socket.on("playerMovement", (data) => {
      io.to(currentCode).emit("playerMove", data);
    });
    socket.on("playerRotation", (data) => {
      io.to(currentCode).emit("playerRotation", data);
    });
    socket.on("scalePlayer", (data) => {
      io.to(currentCode).emit("scalePlayer", data);
    });
    socket.on("endOfScaling", (data) => {
      io.to(currentCode).emit("endOfScaling", data);
    });

    socket.on("joinGame", function (data) {
      currentCode = data.code;
      socket.join(currentCode);
      console.log("called joinGame");
      if (!games[currentCode]) {
        if (data.id === undefined) {
          io.to(currentCode).emit("joinGameFail");
          return;
        }
        games[currentCode] = {
          players: {},
          password: data.password,
          master: data.id,
        };
        io.to(currentCode).emit("serverCreated", {});
        console.log(
          Object.fromEntries(
            Object.entries(games).filter((k, v) => k !== "DEV")
          )
        );
        return;
      }

      games[currentCode]["players"][data.id] = {
        id: data.id,
        name: data.name,
        class: data.class,
      };
      console.log(
        Object.fromEntries(Object.entries(games).filter((k, v) => k !== "DEV"))
      );
      io.to(currentCode).emit("addPlayerToBM", games[currentCode]["players"]);
    });

    socket.on("disconnect", function () {
      console.log("socket disconnected");
      if (currentCode) {
        if (!games[currentCode]) return;
        if (games[currentCode]["master"] == socket.id) {
          delete games[currentCode];
          console.log(
            Object.fromEntries(
              Object.entries(games).filter((k, v) => k !== "DEV")
            )
          );
          return;
        } else if (
          Object.keys(games[currentCode]["players"]).indexOf(socket.id) != -1
        ) {
          delete games[currentCode]["players"][socket.id];
          io.to(currentCode).emit(
            "addPlayerToBM",
            games[currentCode]["players"]
          );
        } else console.error("Undefined player disconnected");
        console.log(
          Object.fromEntries(
            Object.entries(games).filter((k, v) => k !== "DEV")
          )
        );
      }
    });

    socket.on("sendImageToAll", (im) => {
      games[currentCode]["map"] = im;
      io.to(currentCode).emit("setBMImage", im);
    });

    socket.on("updPlayersInfos", (info) => {
      if (games[currentCode]) games[currentCode]["players"][info.id] = info;
    });

    socket.on("updMap", () => {
      if (!games[currentCode]) return;
      io.to(currentCode).emit("addPlayerToBM", games[currentCode]["players"]);

      if (games[currentCode]["map"])
        io.to(currentCode).emit("setBMImage", games[currentCode]["map"]);
    });

    socket.on("addEnemy", (data) => {
      io.to(currentCode).emit("addEnemy", data);
    });
    socket.on("removeEnemy", (data) => {
      io.to(currentCode).emit("removeEnemy", data);
    });

    socket.on("getPlayersList", () => {
      console.log("Needed players list");
      io.to(currentCode).emit("getPlayersList", games[currentCode]["players"]);
    });

    socket.on("chatMessage", (data) => {
      if (!games[currentCode]) return;
      if (data.receiver == -1) {
        io.to(currentCode).emit("chatMessage", data);
        return;
      }
      let rec = data.receiver;
      if (data.receiver == "Master") {
        rec = games[currentCode]["master"];
      }
      io.to(rec).emit("chatMessage", data);
    });

    socket.on("DevMessage", (data) => {
      io.emit("DevMessageServer", data);
    });

    socket.on("refreshLobbiesDev", () => {
      console.log("refreshing");

      io.emit("refreshLobbiesServer", { games: games });
    });
  });
};
