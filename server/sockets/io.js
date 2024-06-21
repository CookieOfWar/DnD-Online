module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("New socket connection");

    let currentCode = null;

    socket.on("playerMovement", (data) => {
      io.to(currentCode).emit("playerMove", data);
    });

    socket.on("joinGame", function (data) {
      currentCode = data.code;
      socket.join(currentCode);
      if (!games[currentCode]) {
        games[currentCode] = { players: {} };
        console.log(games);
        return;
      }

      games[currentCode]["players"][data.id] = {
        id: data.id,
        name: data.name,
        class: data.class,
      };
      console.log(games);
      io.to(currentCode).emit("addPlayerToBM", games[currentCode]["players"]);
    });

    socket.on("disconnect", function () {
      console.log("socket disconnected");
      if (currentCode) {
        io.to(currentCode).emit("gameOverDisconnect");
        delete games[currentCode];
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
      io.to(currentCode).emit("addPlayerToBM", games[currentCode]["players"]);

      if (games[currentCode]["map"])
        io.to(currentCode).emit("setBMImage", games[currentCode]["map"]);
    });
  });
};
