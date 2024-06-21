module.exports = (app) => {
  app.get("/", (req, res) => {
    res.render("index");
  });

  app.get("/master", (req, res) => {
    res.render("CharacterSheet");
  });
  app.get("/player", (req, res) => {
    if (!games[req.query.code]) {
      return res.redirect("/?error=invalidCode");
    }

    res.render("game", {
      color: "black",
    });
  });
};
