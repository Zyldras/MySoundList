var express = require('express');
var router = express.Router();
var db = require('../db');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// Affiche la page de connexion
router.get('/login', (req, res) => {
  res.render('login');
});

// Affiche le formulaire de création de compte
router.get('/signup', (req, res) => {
  res.render('signup');
});

router.get("/api/users", (req, res, next) => {
	var sql = "select * from user";
	var params = [];
	db.all(sql, params, (err, rows) => {
		if (err) {
		  res.status(400).json({"error":err.message});
		  res.render('shit.html');
		  return;
		}
		res.json({
			"message":"success",
			"data":rows
		});
	});
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Vérification des identifiants
  // (Vous pouvez ajouter ici votre logique d'authentification)
	var sql = "select name, password from user where name = ? and password = ?";
	var params = [ username, password ];
  db.all(sql, params, (err, rows) => {
		if (err) {
		  res.status(400).json({"error":err.message});
		  res.render('error');
		  return;
		}
    if (rows.length != 0) {
      res.send(`Bienvenue ${username}`);
    }
		else {
      res.send('Identifiants invalides');
    }
	});
});

// Traitement du formulaire de création de compte
router.post('/signup', (req, res) => {
  const { username, password, confirmPassword } = req.body;
  if (password !== confirmPassword) {
    // Les mots de passe ne correspondent pas
    res.send('Les mots de passe ne correspondent pas');
  }
  // Vérification des données de création de compte
  // (Vous pouvez ajouter ici votre logique de validation des données)
	var sql = "select name from user where name = ?";
	var params = [ username ];
  db.all(sql, params, (err, rows) => {
		if (err) {
		  res.status(400).json({"error":err.message});
		  res.render('error');
		  return;
		}
    if (rows.length != 0) {
      res.send(`un compte est déjà créée avec le login ${username}`);
    }
		else {
      var insert = 'INSERT INTO user (name, password) VALUES (?,?)'
      db.run(insert, [username, password]);
      res.send('Compte créé avec succès');
    }
	});
});

module.exports = router;
