angular.module('todo', ['ionic'])

.controller('TodoCtrl', function($scope, $http, $ionicModal) {
  $scope.tasks = {};
  $scope.new = {};

  $http.get('/getTaskSet')
      .success(function(data) {
          $scope.tasks = data;
      })
      .error(function(data) {
          console.log('Error: ' + data);
      });

  // Create and load the Modal
  $ionicModal.fromTemplateUrl('new-task.html', function(modal) {
    $scope.taskModal = modal;
  }, {
    scope: $scope,
    animation: 'slide-in-up'
  });

$scope.createTodo = function() {
        $http.post('/addTask', $scope.formData)
            .success(function(data) {
                $scope.formData = {}; 
                $scope.laliste = data;
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };


  // Called when the form is submitted
  $scope.createTask = function(task) {
    $scope.new.name = task.name;

    $http.post('/addTask', $scope.new)
            .success(function(data) {
                $scope.tasks = data;
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });

    $scope.taskModal.hide();
    task.name = "";
  };

  $scope.deleteTask = function(id) {
      console.log(id);

        $http.delete('/deleteTask/' + id)
            .success(function(data) {
                $scope.tasks = data;
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

  // Open our new task modal
  $scope.newTask = function() {
    $scope.taskModal.show();
  };

  // Close the new task modal
  $scope.closeNewTask = function() {
    $scope.taskModal.hide();
  };
})
