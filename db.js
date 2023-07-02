var sqlite3 = require("sqlite3").verbose();
var md5 = require("md5");

const DBSOURCE = "db.sqlite";

let db = new sqlite3.Database(DBSOURCE, (err) => {
  if (err) {
    // Cannot open database
    console.error(err.message);
    throw err;
  } else {
    console.log("Connected to the SQLite database");

    // db.run(`
    // CREATE TABLE IF NOT EXISTS users (
    // 	usr_id INTEGER PRIMARY KEY AUTOINCREMENT,
    //   	usr_name TEXT NOT NULL,
    //   	usr_password TEXT NOT NULL,
    //   	UNIQUE(usr_name)
    // )`);
    // db.run(`
    // CREATE TABLE IF NOT EXISTS musics (
    //     mus_id INTEGER PRIMARY KEY AUTOINCREMENT,
    //     mus_name TEXT NOT NULL,
    //     mus_artist TEXT NOT NULL
    // )`);

    // db.run(`
	// CREATE TABLE IF NOT EXISTS playlists (
	// 	pla_id INTEGER PRIMARY KEY AUTOINCREMENT,
	// 	pla_name TEXT NOT NULL,
	// 	usr_id INTEGER NOT NULL,
	// 	FOREIGN KEY(usr_id) REFERENCES users(usr_id)
	// )`);
    // db.run(`
	// CREATE TABLE IF NOT EXISTS contains (
	// 	mus_id INTEGER,
	// 	pla_id INTEGER,
	// 	PRIMARY KEY(mus_id, pla_id),
	// 	FOREIGN KEY(mus_id) REFERENCES musics(mus_id),
	// 	FOREIGN KEY(pla_id) REFERENCES playlists(pla_id)
	// )`);
    // db.run(`
    // CREATE TABLE IF NOT EXISTS members (
    // 	usr_id INTEGER,
    //     pla_id INTEGER,
    //     PRIMARY KEY(usr_id, pla_id),
    //     FOREIGN KEY(usr_id) REFERENCES users(usr_id),
    //     FOREIGN KEY(pla_id) REFERENCES playlists(pla_id)
    // )`);

    // db.run(`DROP TABLE IF EXISTS users`);
    // db.run(`DROP TABLE IF EXISTS musics`);
    // db.run(`DROP TABLE IF EXISTS members`);
    // db.run(`DROP TABLE IF EXISTS contains`);
    // console.log("DB - tables droped");

    // var insertUsers = "INSERT INTO users (usr_name, usr_password) VALUES (?,?)";
	// var insertMusics = "INSERT INTO musics (mus_name, mus_artist) VALUES (?,?)";
    // db.run(insertUsers, ["admin", md5("admin")]);
    // db.run(insertUsers, ["user", md5("user")]);
    // db.run(insertMusics, ["music", "moi"]);
	// db.run(insertMusics, ["music2", "moi"]);
    // console.log("DB - rows inserted");
  }
});

module.exports = db;
