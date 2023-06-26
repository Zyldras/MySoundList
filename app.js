const express = require('express');
const app = express();
const path = require('path');
const root = { root : __dirname };

const port = 3000;


app.get('/', function(req, res) {
	res.sendFile('views/index.html', root);
});

app.get("/api/users", (req, res, next) => {
	var sql = "select * from user";
	var params = [];
	db.all(sql, params, (err, rows) => {
		if (err) {
		  res.status(400).json({"error":err.message});
		  res.send('shit.html');
		  return;
		}
		res.json({
			"message":"success",
			"data":rows
		});
	});
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};
  
	// render the error page
	res.status(err.status || 500);
	res.sendFile('views/error.html', root);
});

app.listen(port, () => {
	console.log(`Server running on port ${ port }`);
});