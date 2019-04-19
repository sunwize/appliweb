var mongoose = require('mongoose');
var taskModel = require('../models/Task');
var userModel = require('../models/User');
var listModel = require('../models/List');

var url = 'mongodb+srv://admin:admin@todolist-bs0vy.mongodb.net/todolist?retryWrites=true';

mongoose.connect(url, { useNewUrlParser: true }, err => {
    if (err)
        throw err;
    else
        console.log('mongo connected');
});
mongoose.set('useCreateIndex', true);

module.exports = {
    getTaskSet: (login, cb) => {
        taskModel.find({ 'login': login }, (err, taskSet) => {
            cb(err, taskSet);
        });
    },

    getListSet: (login, cb) => {
        listModel.find({ 'login': login }, (err, listSet) => {
            if (err)
                cb(err, []);
            else {
                cb(err, listSet);
            }
        });
    },

    findTaskById: (id, cb) => {
        taskModel.findById(id, (err, task) => {
            if (err)
                throw err;
            else {
                if (task != null)
                    cb();
            }
        });
    },

    addTask: (task, listName, cb) => {
        var taskToAdd = new taskModel({
            _id: task._id,
            description: task.description,
            done: task.done,
            login: task.login
        });
        taskToAdd.save(err => {
            if (!err) {
                listModel.findOne({ 'name': listName }, (err, list) => {
                    if (err)
                        cb(err);
                    else {
                        var listToUpdate = list;
                        listToUpdate.tasklist.push(task._id);
                        listModel.findOneAndUpdate({ 'name': listName }, listToUpdate, (err, doc) => {
                            cb(err);
                        });
                    }
                });
            }
        });
    },

    addList: (list, cb) => {
        var listToAdd = new listModel({
            name: list.name,
            login: list.login,
            tasklist: list.tasklist
        });
        listToAdd.save(err => {
            cb(err);
        });
    },

    updateTask: (task, cb) => {
        taskModel.findByIdAndUpdate(task.id, task, (err, task) => {
            if (err)
                throw err;
            else
                cb();
        });
    },

    updateTaskSetFromList: (list, cb) => {
        taskModel.find({ 'login': list.login }, (err, taskSet) => {
            var ts = [];
            for (var i = 0; i < taskSet.length; i++) {
                if (list.tasklist.includes(taskSet[i]._id)) {
                    ts.push(taskSet[i]);
                }
            }
            cb(ts);
        });
    },

    deleteTaskById: (id, cb) => {
        taskModel.findByIdAndRemove(id, (err, todo) => {
            if (err)
                throw err;
            else
                cb(todo);
        });
    },

    deleteListByName: (name, cb) => {
        listModel.findOneAndRemove({ 'name': name }, (err, doc) => {
            cb(err, doc);
        });
    },

    updateTask: (task, cb) => {
        taskModel.findByIdAndUpdate(task._id, task, (err, task) => {
            if (err)
                throw err;
            else
                cb();
        });
    },

    updateList: (list, name, cb) => {
        listModel.findOneAndUpdate({ 'name': name }, list, (err, doc) => {
            cb(err, doc);
        });
    },

    addAccount: (user, cb) => {
        var newUser = new userModel({
            login: user.login,
            passwd: user.passwd
        });
        newUser.save(err => {
            cb(err);
        });
    },

    findAccount: (user, cb) => {
        var userToFind = {
            login: user.login,
            passwd: user.passwd
        };
        userModel.findOne(userToFind, (err, userSet) => {
            if (err)
                cb(err, false);
            else {
                if (userSet == null)
                    cb(err, false);
                else
                    cb(err, true);
            }
        });
    }
};