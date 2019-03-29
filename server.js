// Dependencies
var express = require("express");
var mongoose = require("mongoose");
var path = require("path");
var PORT = process.env.PORT || 3000;
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1/mongoNewsScraper";
var app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main", partialsDir: path.join(__dirname, "/views/layouts/partials") }));
app.set("view engine", "handlebars");

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

var routes = require("./public/routes.js");
app.use(routes);


app.listen(PORT, function () {
  console.log("App running on port " + PORT);
});
