var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    login: {type: String, unique: true},
    passwd: String
});

var User = mongoose.model('User', userSchema);

module.exports = User;