const express = require("express");
const path = require('path');
const tinylr = require('tiny-lr');
const bodyParser = require('body-parser');

const app = express();

app.set('port', (process.env.PORT || 5000));

/** Attempting to set up live reload with tiny-lr

app.use(bodyParser())
  .use(tinylr.middleware({ app: app }))
  .use(express.static(__dirname + "/styles"))
  .use(express.static(__dirname + "/scripts"))
  .listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
  });

*/

app.use(express.static(__dirname + "/styles"))
  .use(express.static(__dirname + "/scripts"))
  .listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
  });

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
