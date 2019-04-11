var mongoose = require('mongoose');
var taskModel = require('./../models/Task');
var userModel = require('./../models/User');

var url = 'mongodb+srv://admin:admin@todolist-bs0vy.mongodb.net/todolist?retryWrites=true';

mongoose.connect(url, {useNewUrlParser: true}, err => {
    if(err)
        throw err;
    else
        console.log('mongo connected');
});
mongoose.set('useCreateIndex', true);

module.exports = {
    getTaskSet: (login, cb) => {
        taskModel.find({'login': login}, (err, taskSet) => {
            cb(err, taskSet);
        });
    },

    findTaskById: (id, cb) => {
        taskModel.findById(id, (err, task) => {
            if(err)
                throw err;
            else {
                if(task != null)
                    cb();
            }
        });
    },

    addTask: (task, cb) => {
        var taskToAdd = new taskModel({
            _id: task._id,
            description: task.description,
            done: task.done,
            login: task.login
        });
        taskToAdd.save(err => {
            cb(err);
        });
    },

    updateTask: (task, cb) => {
        taskModel.findByIdAndUpdate(task.id, task, (err, task) => {
            if(err)
                throw err;
            else
                cb();
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

    updateTask: (task, cb) => {
        taskModel.findByIdAndUpdate(task._id, task, (err, task) => {
            if(err)
                throw err;
            else
                cb();
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
            login:user.login,
            passwd:user.passwd
        };
        userModel.findOne(userToFind, (err, userSet) => {
            if(err)
                cb(err, false);
            else {
                if(userSet == null)
                    cb(err, false);
                else
                    cb(err, true);
            }
        });
    }
};