const express = require("express");
const app = express();

app.use(express.static(__dirname + "/views"));

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

app.get("/", function(request, response) {
  response.sendFile("intervals.html");
});

app.get("/intervals", function(req, res) {
  res.sendFile("intervals.html");
});

app.get("/quiz", function(req, res) {
  res.sendFile("quiz.html");
});

app.listen((process.env.PORT || 5000));
