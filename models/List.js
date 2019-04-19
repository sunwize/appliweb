var mongoose = require('mongoose');

var listShema = new mongoose.Schema({
    name: {type: String, unique: true},
    login: String,
    tasklist: Array
});

var List = mongoose.model('List', listShema);

module.exports = List;