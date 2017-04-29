var mongoose = require('mongoose');
var schema = mongoose.Schema({
    vote: String,
    userID: String
});
//var schema = 12;
module.exports = schema;
