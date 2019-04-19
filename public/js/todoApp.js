var todoApp = angular.module('todoApp', []);

todoApp.factory('todoServices', ['$http', $http => {

    var services = {
        addTask: (login, description, listName, cb) => {
            var req = {
                listName: listName,
                login: login,
                description: description
            };
            $http.post('/addTask', req)
                .then(res => {
                    cb(res);
                });
        },

        addList: (list, cb) => {
            var req = {
                name: list.name,
                login: list.login,
                tasklist: list.tasklist
            };
            $http.post('/addList', req)
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

        deleteList: (name, cb) => {
            var req = {
                name: name
            };
            $http.post('/deleteList', req)
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

        updateList: (list, name, cb) => {
            var req = {
                origin: name,
                name: list.name,
                login: list.login,
                tasklist: list.tasklist
            };
            $http.post('/updateList', req)
                .then(res => {
                    cb(res);
                });
        },

        updateTaskSetFromList: (list, cb) => {
            var req = {
                list: list
            };
            $http.post('/updateTaskSetFromList', req)
                .then(res => {
                    cb(res);
                });
        },

        getListTaskSet: (list, cb) => {
            var req = {
                taskIds: list.tasklist
            };
            $http.post('/getListTaskSet', req)
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

        getListSet: (login, cb) => {
            $http.post('/getListSet/' + login)
                .then(res => {
                    if(res.data.success)
                        cb(res.data.listSet)
                    else
                        cb([])
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
    $scope.editionMode = [];
    $scope.editionModeList = [];
    $scope.listSet = [];
    $scope.taskSets = [];
    $scope.modalListFocused = null;

    $scope.addTask = (listIndex) => {
        var connectedUser = window.sessionStorage.getItem('login');
        var taskDesc = document.getElementById('modal-task').value;
        console.log('index liste : ' + listIndex);
        if(taskDesc == "" || taskDesc == undefined || connectedUser == null || connectedUser == 'null')
            return;
        
        todoServices.addTask(connectedUser, taskDesc, $scope.listSet[listIndex].name, res => {
            console.log(res);
            if(res) {
                console.log('Task : ' + $scope.task + " added!");
                $scope.reload();
            }
        });
        
        $scope.task = "";
    };

    $scope.addList= () => {
        var connectedUser = window.sessionStorage.getItem('login');
        if($scope.listDescription == "" || $scope.listDescription == undefined || connectedUser == null || connectedUser == 'null')
            return;
        var list = {
            name: $scope.listDescription,
            login: connectedUser,
            tasklist: []
        };
        todoServices.addList(list, res => {
            if(res.data.success)
                console.log('List successfuly added!');
            else
                console.log('Failure while adding list');
            $scope.listDescription = "";
            $scope.reload();
        });
    };
    
    $scope.deleteTask = id => {
        todoServices.deleteTask(id, res => {
            $scope.reload();
        });
    };

    $scope.deleteList = index => {
        var listToDelete = $scope.listSet[index];
        var tasksToDelete = listToDelete.tasklist;

        for(var i = 0; i < tasksToDelete.length; i++) {
            console.log(tasksToDelete[i]);
            $scope.deleteTask(tasksToDelete[i]);
        }
        
        todoServices.deleteList(listToDelete.name, res => {
            if(res.data.success)
                console.log(listToDelete.name + ' deleted!');
            else
                console.log('Failure while deleting list')
            $scope.reload();
        });
    };

    $scope.check = (listIndex, taskIndex) => {
        var taskToCheck = $scope.taskSets[listIndex][taskIndex];
        if(taskToCheck == null)
            return;
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

    $scope.updateTask = (listIndex, taskIndex) => {
        $scope.taskSets[listIndex][taskIndex].editMode = false;
        var taskToUpdate = $scope.taskSets[listIndex][taskIndex];
        taskToUpdate.description = document.getElementById('desc-field'+listIndex+'-'+taskIndex).value;
        todoServices.updateTask(taskToUpdate, res => {
            console.log(res);
            $scope.reload();
        });
    };

    $scope.updateList = index => {
        var areas = document.getElementsByClassName('liste-area');
        var origin = areas[index].textContent;
        var listToUpdate = $scope.listSet[index];
        var elements = document.getElementsByClassName('desc-field-list');
        listToUpdate.name = elements[index].value;
        console.log(origin);
        todoServices.updateList(listToUpdate, origin, res => {
            console.log(res);
            $scope.reload();
        });
    };

    $scope.updateTaskSetFromList = (list, index) => {
        todoServices.updateTaskSetFromList(list, res => {
            if(res.data.success) {
                $scope.taskSets[index] = res.data.taskSet;
                for(var i = 0; i < $scope.taskSets[index].length; i++) {
                    $scope.taskSets[index][i].editMode = false;
                }
            }
            else
                console.log(res.data.err);
        });
    };

    $scope.edit = (listIndex, taskIndex) => {
        $scope.taskSets[listIndex][taskIndex].editMode = true;
        setTimeout( () => {
            var element = document.getElementById('desc-field'+listIndex+'-'+taskIndex);
            element.select();
        }, 10);
    };

    $scope.editList = index => {
        for(var i = 0; i < $scope.editionModeList.length; i++)
            $scope.editionModeList[i] = false;
        $scope.editionModeList[index] = true;
        setTimeout( () => {
            var elements = document.getElementsByClassName('desc-field-list');
            elements[index].select();
        }, 10);
    };

    $scope.setModalFocus = index => {
        $scope.modalListFocused = index;
    };

    $scope.reload = () => {
        todoServices.getListSet(window.sessionStorage.getItem('login'), listSet => {
            $scope.listSet = listSet;
            $scope.editionModeList = [];
            
            for(var i = 0; i < listSet.length; i++) {
                $scope.updateTaskSetFromList(listSet[i], i);
                $scope.editionModeList.push(false);
            }
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
                window.location.href = '/todolist';
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
                    window.location.href = '/todolist';
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