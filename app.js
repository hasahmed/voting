var http = require("http");
var path = require("path");
var express = require("express");
var bodyParser = require("body-parser"); 

var app = express();
app.set("views", path.resolve(__dirname, "views"));
app.set("view engine", "ejs");
var entries = [];
app.locals.entries = entries;
app.use(bodyParser.urlencoded({ extended: false })); 


app.get("/", function(req, res) {
 res.render("main");
});
app.get("/new-entry", function(req, res) {
 res.render("new-entry");
});
app.get('results', function(req, res){
    res.render('results');
});

app.post('/', function(req, res){
    entries.push({
        vote: req.body.vote,
        submitted: new Date()
    })
    console.log(entries[0].vote);
    res.render('thanks');
    return;
    //test for vim
});


/* this is called when the form is submitted from main.ejs */
app.post("/new-entry", function(req, res) {
    console.log("taco", req.body);
    res.render('main');
    return;
 if (!req.body.vote) {
 res.status(400).send("Error: Page not found.");
 return;
 }
 entries.push({
 vote: req.body.vote,
 submitted: new Date()
 });
 res.redirect("/results");
});
app.use(function(req, res) {
 res.status(404).render("404");
});
var port = 32908;
http.createServer(app).listen(port, function() {
 console.log("Guestbook app started on port " + port);
});
