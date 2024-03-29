var express = require("express");
var router = express.Router();
var db = require("../db");
var md5 = require("md5");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { session: req.session.user });
});

router.get("/home", (req, res) => {
  if (req.session.user) {
    const userId = req.session.user.id;
    const username = req.session.user.name;
    // Récupérer les playlists de l'utilisateur depuis la table "members"
    var sql =
      "SELECT DISTINCT playlists.pla_id, playlists.pla_name FROM playlists JOIN members ON playlists.pla_id = members.pla_id WHERE members.usr_id = ? OR playlists.usr_id = ?";
    var params = [userId, userId];
    db.all(sql, params, (err, playlists) => {
      if (err) {
        res.status(500).render("error", { error: err.message });
        return;
      }
      console.log(playlists);
      db.all(
        "SELECT usr_id, usr_name from users where usr_id != ?",
        [userId],
        (err, users) => {
          if (err) {
            res.status(500).render("error", { error: err.message });
            return;
          }
          res.render("home", {
            user: username,
            session: req.session.user,
            playlists,
            users,
          });
        }
      );
    });
  } else {
    res.render("home", { session: req.session.user });
  }
});

router.post("/playlist/create", (req, res) => {
  const { playlistName, members } = req.body;
  const userId = req.session.user.id;
  // Insérer la nouvelle playlist dans la table "playlists"
  var insertPlaylist = "INSERT INTO playlists (pla_name, usr_id) VALUES (?, ?)";
  var playlistParams = [playlistName, userId];
  var lastPlaylistId;

  db.run(insertPlaylist, playlistParams, function (err) {
    if (err) {
      res.status(500).render("error", { error: err.message });
      return;
    }
    lastPlaylistId = this.lastID;

    // Insérer les membres de la playlist dans la table "members"
    var insertMembers = "INSERT INTO members (usr_id, pla_id) VALUES (?, ?)";
    for (let i = 0; i < members.length; i++) {
      var memberId = members[i];
      var memberParams = [memberId, lastPlaylistId];
      db.run(insertMembers, memberParams, function (err) {
        if (err) {
          res.status(500).render("error", { error: err.message });
          return;
        }
      });
    }
    res.redirect("/home");
  });
});

router.get("/about", (req, res) => {
  res.render("about", { session: req.session.user });
});

router.get("/logout", (req, res) => {
  // Détruire la session
  req.session.destroy((err) => {
    if (err) {
      console.error("Erreur lors de la destruction de la session:", err);
      // Gérer l'erreur de manière appropriée
      return;
    }
    // Rediriger vers une page de déconnexion ou une autre destination
    res.redirect("/");
  });
});

// Affiche la page de connexion
router.get("/login", (req, res) => {
  res.render("login", { session: req.session.user });
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  // Vérification des identifiants
  var sql =
    "SELECT usr_id, usr_name, usr_password FROM users WHERE usr_name = ?";
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
          name: rows[0].usr_name,
        };
        res.redirect("/home");
      } else {
        res.render("login", {
          message: "Mot de passe incorrect !",
          session: req.session.user,
        });
      }
    } else {
      res.render("login", {
        message: "Le compte " + username + " n'est pas encore créé !",
        session: req.session.user,
      });
    }
  });
});

// Affiche le formulaire de création de compte
router.get("/signup", (req, res) => {
  res.render("signup", { session: req.session.user });
});

// Traitement du formulaire de création de compte
router.post("/signup", (req, res) => {
  const { username, password, confirmPassword } = req.body;
  if (password !== confirmPassword) {
    res.render("signup", {
      message: "Les mots de passe ne correspondent pas !",
      session: req.session.user,
    });
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
      res.render("signup", {
        message: "Le compte " + username + " existe déjà !",
        session: req.session.user,
      });
    } else {
      var insert = "INSERT INTO users (usr_name, usr_password) VALUES (?,?)";
      var params = [username, md5(password)];
      db.run(insert, params);
      res.render("login", { create: true, session: req.session.user });
    }
  });
});

router.get("/playlist/:id", (req, res) => {
  const playlistId = req.params.id;

  // Récupérer les détails de la playlist depuis la base de données
  var selectPlaylist = "SELECT * FROM playlists WHERE pla_id = ?";
  db.get(selectPlaylist, [playlistId], (err, playlist) => {
    if (err) {
      res.status(500).render("error", { error: err.message });
      return;
    }

    if (!playlist) {
      res.status(404).render("error", { error: "Playlist not found" });
      return;
    }

    // Récupérer les musiques associées à la playlist
    var selectMusics = "SELECT * FROM musics INNER JOIN contains ON musics.mus_id = contains.mus_id WHERE contains.pla_id = ?";
    db.all(selectMusics, [playlistId], (err, musics) => {
      if (err) {
        res.status(500).render("error", { error: err.message });
        return;
      }

      res.render("playlist", { playlist: playlist, musics: musics, session: req.session.user });
    });
  });
});

router.post("/playlist/add-music/:id", (req, res) => {
  const playlistId = req.params.id;
  const { musicName, musicArtist } = req.body;

  // Insérer la nouvelle musique dans la table "musics"
  var insertMusic = "INSERT INTO musics (mus_name, mus_artist) VALUES (?, ?)";
  var musicParams = [musicName, musicArtist];
  db.run(insertMusic, musicParams, function(err) {
    if (err) {
      res.status(500).render("error", { error: err.message });
      return;
    }
    const musicId = this.lastID;

    // Insérer la relation entre la musique et la playlist dans la table "contains"
    var insertContains = "INSERT INTO contains (mus_id, pla_id) VALUES (?, ?)";
    var containsParams = [musicId, playlistId];
    db.run(insertContains, containsParams, function(err) {
      if (err) {
        res.status(500).render("error", { error: err.message });
        return;
      }

      res.redirect("/playlist/" + playlistId);
    });
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
