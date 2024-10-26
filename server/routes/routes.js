module.exports = (app) => {
  app.get("/", (req, res) => {
    if (process.env.AVAILABILITY == "true") {
      res.render("index");
    } else {
      res.render("TechWorkCap");
    }
  });

  app.get("/master", (req, res) => {
    if (games[req.query.code]) {
      return res.redirect("/?error=alreadyInGame");
    }

    if (req.query.password == "") {
      return res.redirect("/?error=invalidPassword");
    }
    res.render("MasterScreen");
  });
  app.get("/player", (req, res) => {
    if (!games[req.query.code]) {
      return res.redirect("/?error=invalidCode");
    }
    if (
      games[req.query.code].password &&
      games[req.query.code].password != req.query.password
    ) {
      return res.redirect("/?error=invalidPassword");
    }

    if (req.query.code == "DEV") {
      res.render("DevScreen");
    } else res.render("CharacterSheet");
  });
};
