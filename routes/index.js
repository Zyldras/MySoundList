var express = require('express');
var router = express.Router();
var db = require("../db.js");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index.html');
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

module.exports = router;
