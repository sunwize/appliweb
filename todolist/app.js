var express = require('express');
var bodyParser = require('body-parser');
var dataTaskLayer = require('./routes/dataTaskLayer');
var uuidv4 = require("uuid/v4");

require('./models/Task');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/public');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.get('/', (req, res) => {
    res.render('todolist.html');
});

app.get('/creation', (req, res) => {
    res.render('creation.html');
});

app.get('/identification', (req, res) => {
    res.render('identification.html');
});

app.post('/addAccount', (req, res) => {
    var user = {
        login: req.body.login,
        passwd: req.body.passwd
    };
    dataTaskLayer.addAccount(user, err => {
        if(err)
            res.send({success: false, login: user.login, err: err})
        else {
            res.send({success: true, login: user.login});
        }
    });
});

app.post('/findAccount', (req, res) => {
    if(!req.body.login || !req.body.passwd) {
        res.send({
            success: false,
            err: "Login or password empty"
        });
    }
    else {
        var user = {
            login: req.body.login,
            passwd: req.body.passwd
        };
        dataTaskLayer.findAccount(user, (err, success) => {
            if(success)
                res.send({success: true});
            else
                res.send({success: false, err: err});
        });
    }
});

app.post('/addTask', (req, res) => {
    var task = {
        _id: uuidv4(),
        description: req.body.description,
        done: false,
        login: req.body.login
    };
    dataTaskLayer.addTask(task, err => {
        if(err)
            res.send({success: false, task: task, err: err});
        else
            res.send({success: true, task: task});
    });
});

app.post('/deleteTask', (req, res) => {
    if(!req.body._id) {
        res.send({success: false, err: "ID empty"});
    }
    else {
        dataTaskLayer.findTaskById(req.body._id, () => {
            dataTaskLayer.deleteTaskById(req.body._id, () => {
                res.send({success: true});
            });
        });
    }
});

app.post('/getTaskSet/:login', (req, res) => {
    dataTaskLayer.getTaskSet(req.params.login, (err, taskSet) => {
        if(err)
            res.send({success: false, err: err});
        else
            res.send({success: true, taskSet: taskSet});
    });
});

app.post('/updateTask', (req, res) => {
    if(!req.body.description || !req.body._id) {
        res.send({success: false, err: "One field is empty"});
    }
    else {
        var task = {
            _id: req.body._id,
            description: req.body.description,
            done: req.body.done
        };
        dataTaskLayer.updateTask(task, () => {
            res.send({success: true, task: task});
        });
    }
});

app.listen(3000);