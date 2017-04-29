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

/* schema: get the predefined schema of how the mongoose data is going to be
 stored */
var schema = require('./models/schema');

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

/* initialization of the body-parser which reads in form data.
 the 'extended: true' part is required in order to be able
 to handle form inputs being passed as an array without using
 bracket notation. E.g. without extended: true would require
 req.body['dataname[]'][0] to acccess first element */
app.use(bodyParser.urlencoded({ extended: true })); 


/* the initial connection to our mongoose server. Tutorial is the 
 database selected for now. Will probably change */
mongoose.connect('mongodb://silo.cs.indiana.edu:32909/tutorial');

/* use the schema object we required earlier as our mongo
  model, its name is test. This will also probably change */

var user = mongoose.model('users', schema);


/* the inital entry point of the application is a get request to root.
 as of now it simply renders the main.ejs view */
app.get("/", function(req, res) {
 res.render("main");
});

app.get('/users', function(req, res){
    mongoose.model('users').find(function(err, users){
        res.send(users);
    });
});


/* load administrator page when a link to administrator is clicked */
app.get('/admin', function(req, res){
    res.render('admin');
});

/* get the post body values coming in from admin page
 the value coming in is named numPollOps and is going
 to be the number of text fields on the next page that is
 loaded numPollOps: number Polling Options */
app.post('/adminFeildFill', function(req, res){
    entries.numPollOps = req.body.numPollOps;
    console.log(entries.numPollOps);
    res.render('adminFeildFill');
});
app.post('/adminSubmitPollOps', function(req, res){
    /* req.body.pollOp is an array containing the names
     of the 'polling options' to be used for the new poll */
    entries.pollOp = req.body.pollOp;
    res.render('adminDispPollBuild');
})

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
 console.log("Voting app started on port " + port);
});
