var express = require("express");
var router = express.Router();
var db = require("../db");
var md5 = require("md5");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", {session: req.session.user});
});

// Route de la page d'accueil
router.get("/home", (req, res) => {
  if (req.session.user) {
    const username = req.session.user.name;
	  console.log(username)
    res.render("home", { user: username, session: req.session.user });
  } else {
    res.render("home", {session: req.session.user});
  }
});

router.get("/about", (req, res) => {
  res.render("about", {session: req.session.user});
});

router.get('/logout', (req, res) => {
  // Détruire la session
  req.session.destroy((err) => {
    if (err) {
      console.error('Erreur lors de la destruction de la session:', err);
      // Gérer l'erreur de manière appropriée
      return;
    }
    // Rediriger vers une page de déconnexion ou une autre destination
    res.redirect('/');
  });
});

// Affiche la page de connexion
router.get("/login", (req, res) => {
  res.render("login", {session: req.session.user});
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  // Vérification des identifiants
  var sql = "SELECT usr_id, usr_name, usr_password FROM users WHERE usr_name = ?";
  var params = [username];
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      res.render("error");
      return;
    }
    if (rows.length !== 0) {
      const storedPassword = rows[0].usr_password;
      const hashedPassword = md5(password);
      if (storedPassword === hashedPassword) {
        req.session.user = {
          id: rows[0].usr_id,
          name: rows[0].usr_name
        };
        res.redirect("/home");
      } else {
        res.render("login", { message: "Mot de passe incorrect !", session: req.session.user });
      }
    } else {
      res.render("login", { message: "Le compte " + username + " n'est pas encore créé !", session: req.session.user });
    }
  });
});

// Affiche le formulaire de création de compte
router.get("/signup", (req, res) => {
  res.render("signup", {session: req.session.user});
});

// Traitement du formulaire de création de compte
router.post("/signup", (req, res) => {
  const { username, password, confirmPassword } = req.body;
  if (password !== confirmPassword) {
    res.render('signup', {message: "Les mots de passe ne correspondent pas !", session: req.session.user});
  }
  // Vérification des données de création de compte
  var sql = "select usr_name from users where usr_name = ?";
  var params = [username];
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      res.render("error");
      return;
    }
    if (rows.length !== 0) {
      res.render('signup', {message: "Le compte " + username + " existe déjà !", session: req.session.user});
    } else {
      var insert = "INSERT INTO users (usr_name, usr_password) VALUES (?,?)";
      var params = [username, md5(password)];
      db.run(insert, params);
      res.render("login", {create: true, session: req.session.user});
    }
  });
});


// API
router.get("/api/users", (req, res, next) => {
  var sql = "select * from users";
  var params = [];
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

router.get("/api/musics", (req, res, next) => {
  var sql = "select * from musics";
  var params = [];
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

router.get("/api/playlists", (req, res, next) => {
  var sql = "select * from playlists";
  var params = [];
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

router.get("/api/members", (req, res, next) => {
  var sql = "select * from members";
  var params = [];
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

router.get("/api/contains", (req, res, next) => {
  var sql = "select * from contains";
  var params = [];
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});


module.exports = router;
