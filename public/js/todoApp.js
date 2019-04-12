var todoApp = angular.module('todoApp', []);

todoApp.factory('todoServices', ['$http', $http => {

    var services = {
        addTask: (login, description, cb) => {
            var req = {
                login: login,
                description: description
            };
            $http.post('/addTask', req)
                .then(res => {
                    cb(res);
                });
        },

        deleteTask: (id, cb) => {
            var req = {
                _id: id
            };
            $http.post('/deleteTask', req)
                .then(res => {
                    cb(res);
                });
        },

        updateTask: (task, cb) => {
            var req = {
                _id: task._id,
                description: task.description,
                done: task.done
            };
            $http.post('/updateTask', req)
                .then(res => {
                    cb(res);
                });
        },

        getTaskSet: (login, cb) => {
            $http.post('/getTaskSet/' + login)
                .then(res => {
                    if(res.data.success)
                        cb(res.data.taskSet);
                    else
                        cb([]);
                });
        },

        addAccount: (login, passwd, cb) => {
            var req = {
                login: login,
                passwd: passwd
            };
            $http.post('/addAccount', req)
                .then(res => {
                    cb(res.data);
                });
        },

        findAccount: (login, passwd, cb) => {
            var req = {
                login: login,
                passwd: passwd
            };
            $http.post('/findAccount', req)
                .then(res => {
                    console.log(res);
                    cb(res.data.success);
                });
        }
    };

    return services;

}]);

//------------------------------- CONTROLLERS -------------------------------//

todoApp.controller('TodoCtrl', ['$scope', 'todoServices', ($scope, todoServices) => {
    $scope.taskList = [];
    $scope.editionMode = [];

    $scope.tasksDone = () => {
        var cpt = 0;
        for(var i = 0; i < $scope.taskList.length; i++) {
            if($scope.taskList[i].done)
                cpt++;
        }
        return cpt;
    };

    $scope.addTask = () => {
        var connectedUser = window.sessionStorage.getItem('login');
        if($scope.task == "" || $scope.task == undefined || connectedUser == null || connectedUser == 'null')
            return;
        
        todoServices.addTask(connectedUser, $scope.task, res => {
            console.log(res);
            if(res) {
                console.log('Task : ' + $scope.task + " added!");
                $scope.reload();
            }
        });
        
        $scope.task = "";
    };
    
    $scope.deleteTask = index => {
        var taskToDelete = $scope.taskList[index];
        
        todoServices.deleteTask(taskToDelete._id, res => {
            console.log(taskToDelete.description + ' deleted!');
            $scope.reload();
        });
    };

    $scope.check = index => {
        var taskToCheck = $scope.taskList[index];
        taskToCheck.done = !taskToCheck.done;
        todoServices.updateTask(taskToCheck, res => {
            console.log(res);
            if(taskToCheck.done)
                console.log(taskToCheck.description + ' checked!');
            else
                console.log(taskToCheck.description + ' unchecked!');
            $scope.reload();
        });
    };

    $scope.updateTask = index => {
        var taskToUpdate = $scope.taskList[index];
        var elements = document.getElementsByClassName('desc-field');
        taskToUpdate.description = elements[index].value;
        todoServices.updateTask(taskToUpdate, res => {
            console.log(res);
            $scope.reload();
        });
    };

    $scope.somethingToDo = () => {
        return $scope.taskList.length > 0;
    };

    $scope.edit = index => {
        for(var i = 0; i < $scope.editionMode.length; i++)
            $scope.editionMode[i] = false;
        $scope.editionMode[index] = true;
        setTimeout( () => {
            var elements = document.getElementsByClassName('desc-field');
            elements[index].select();
        }, 10);
    };

    $scope.reload = () => {
        todoServices.getTaskSet(window.sessionStorage.getItem('login'), res => {
            $scope.taskList = res;
            $scope.editionMode = [];
            for(var i = 0; i < $scope.taskList.length; i++)
                $scope.editionMode.push(false);
        });
    };

    $scope.reload();
}]);

todoApp.controller('AccountCtrl', ['$scope', '$http', 'todoServices', ($scope, $http, todoServices) => {
    $scope.account = window.sessionStorage.getItem('login');

    $scope.connect = () => {
        var login = $scope.login;
        var passwd = $scope.passwd;
        todoServices.findAccount(login, passwd, success => {
            if(success) {
                window.sessionStorage.setItem('login', $scope.login);
                console.log(window.sessionStorage.getItem('login') + ' is connected!');
                $scope.identificationErrorField = "";
                window.location.href = '/';
            }
            else {
                console.log('Impossible de se connecter !')
                $scope.identificationErrorField = "Email ou mot de passe incorrect";
            }
        });
    };

    $scope.disconnect = () => {
        console.log(window.sessionStorage.getItem('login') + ' disconnected!');
        window.sessionStorage.setItem('login', null);
        $scope.account = null;
        window.location.href = '/';
    };

    $scope.addAccount = () => {
        todoServices.addAccount($scope.login, $scope.passwd, res => {
            if(res) {
                if(res.success) {
                    console.log($scope.login + ' has been added!');
                    window.sessionStorage.setItem('login', $scope.login);
                    $scope.creationErrorField = "";
                    window.location.href = '/';
                }
                else {
                    console.log('Account creation failure');
                    console.log(res.err);
                    if(res.err.code == 11000) // Email already used
                        $scope.creationErrorField = "Ce email est déjà utilisé pour un autre compte";
                }
            }
        });
    };
}]);