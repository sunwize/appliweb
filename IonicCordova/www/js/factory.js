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
