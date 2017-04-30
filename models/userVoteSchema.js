var mongoose = require('mongoose');
var userVoteSchema = mongoose.Schema({
    vote: String,
    pollID: String,
});
//var schema = 12;
module.exports = userVoteSchema;
