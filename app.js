// required to start http server
var http = require("http");

//nodes built in path module. Used for cross platform
//path construction
var path = require("path");

/* express is the framework that this application is built on
 chances are that the functions you see in this application are 
 express functions*/
var express = require("express");

/* mongoose, the thing that lets me talk to mongoDB */
var mongoose = require('mongoose');

/* bodyParser is a module used for processessing the inputs comming in from
 html. */
var bodyParser = require("body-parser"); 

/* creation of the actual application. function express() returns an object */
var app = express();


/* sets the default path of the view engine */
app.set("views", path.resolve(__dirname, "views"));

/* sets the default view engine */
app.set("view engine", "ejs");

/* entries is where the data for the application is stored.
 As of now its a non-dynamic object, but I plan to build it based
 on the choices of the user from the admin panel. It may very well change
 to an array rather than an object. Additionally the names of the keys will
 likely have to become much more generic */
var entries = {
    tea: 0,
    coffee: 0
};

/* app.locals is an object which keeps state for the application as
 long as the node server is running. This will probably have to either be
 switched to a mongo json object, or mirror one. As of now it is simply a refrence
 to the object entries created above */
app.locals.entries = entries;

/* initialization of the body-parser */
app.use(bodyParser.urlencoded({ extended: false })); 


/* the inital entry point of the application is a get request to root.
 as of now it simply renders the main.ejs view */
app.get("/", function(req, res) {
 res.render("main");
});


/* load administrator page when a link to administrator is clicked */
app.get('/admin', function(req, res){
    res.render('admin');
});

app.post('/', function(req, res){
    switch(req.body.vote){
        case 'tea':
            entries.tea++;
            break;
        case 'coffee':
            entries.coffee++;
            break;
    }
    /* after the submission has been added to the entries object
    render the thank you screen */
    res.render('thanks');
    return;
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
