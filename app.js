const express = require('express')
const app = express()

const port = 3000

/* GET home page. */
app.get('/', function(req, res, next) {
	res.sendFile(__dirname, 'index.html');
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
	res.send('error.html', { code: "test" });
  });

app.listen(port, () => {
	console.log(`Server running on port ${ port }`);
});