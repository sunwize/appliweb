var mongoose = require('mongoose');

var taskShema = new mongoose.Schema({
    _id: String,
    description: String,
    done: Boolean,
    login: String
});

var Task = mongoose.model('Task', taskShema);

module.exports = Task;