const express = require("express");
const app = express();

app.set('port', (process.env.PORT || 5000));

// Sets location to look for static files
app.use(express.static(__dirname + "/styles"));
app.use(express.static(__dirname + "/scripts"));

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/views/intervals.html");
});

app.get("/intervals", function(req, res) {
  res.sendFile(__dirname + "/views/intervals.html");
});

app.get("/quiz", function(req, res) {
  res.sendFile(__dirname + "/views/quiz.html");
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
