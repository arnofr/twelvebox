app.controller('usersController', function ($scope, $http, $rootScope, $location, userService, $uibModal) {
    $scope.vm = {
        user: $rootScope.userObj,
        userList: []
    }
    $scope.vm.userList = userService.query();
    $scope.vm.deleteUser = function (user) {
        $http.delete('/api/users/' + user._id).success(function (data) {
            console.log(data);
            $scope.vm.userList = userService.query()
        }).error(function () {
            console.log('Error in deleting user');
        });
    };
    $scope.vm.editUser = function (user) {
        $location.path("/users/"+user._id);
    };
    
});