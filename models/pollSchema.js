var mongoose = require('mongoose');
var pollSchema = new mongoose.Schema({
    title: String,
    displayQuestion: String,
    options: Array,
    votes: Array
});
module.exports = pollSchema;
