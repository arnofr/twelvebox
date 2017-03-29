
app.controller('authController', function ($scope, $http, $rootScope, $location, $routeParams, userService) {
	$scope.vm = {
		id: $routeParams.id,
		userid: $routeParams.userid,
		vendorid: $routeParams.vendorid
	}
	$scope.user = {};
	console.log($scope.vm);
	if (!$scope.vm.userid && !$scope.vm.vendorid) {
		$scope.user = {
			username: '',
			password: ''
		};
	} else {
		if ($scope.vm.userid) {
			$scope.user = userService.get({ id: $scope.vm.userid });
		}
		if ($scope.vm.vendorid) {
			$scope.user = userService.get({ id: $scope.vm.vendorid });
		}

		console.log('$scope.user', $scope.user);
	}

	$scope.error_message = '';

	$scope.login = function () {

		$http.post('/auth/login', $scope.user).success(function (data) {
			console.log(data);
			if (data.state == 'success') {
				$rootScope.authenticated = true;
				$rootScope.current_user = data.user.username;
				$rootScope.userObj = data.user;
				var searchObject = $location.search();
				
				if (searchObject && searchObject.url) {
					// $location.search('url', null);
					$location.path('/' + searchObject.url).search('url', null);
				} else {
					$location.path('/');
				}
			}
			else {
				$scope.error_message = data.message;
			}
		}).error(function (data) {
			console.log(data);
		})
	};

	var updateUser = function () {
		console.log('updateUser called...')
		if ($scope.vm.userid) {
			$http.put('api/users/' + $scope.vm.userid, $scope.user).success(function (data) {
				console.log('data>>>>>>>>>>>>>> updating user', data);
			});
		} else {
			$http.put('api/vendors/' + $scope.vm.vendorid, $scope.user).success(function (data) {
				console.log('data>>>>>>>>>>>>>> updating vendor', data);
			});
		}

	}
	var createUser = function () {
		$scope.user.role = "User";
		if ($scope.vm.id == 1) {
			$scope.user.role = "Vendor";
		}
		$http.post('/auth/signup', $scope.user).success(function (data) {
			if (data.state == 'success') {
				$rootScope.authenticated = true;
				$rootScope.current_user = data.user.username;
				$location.path('/');
			}
			else {
				$scope.error_message = data.message;
			}
		});
	}
	$scope.register = function () {

		if ($scope.user.cnfpassword != $scope.user.password) {
			$scope.error_message = "Password and confirm password mismatch";
			return;
		}
		if (!$scope.vm.userid && !$scope.vm.vendorid) {
			createUser();
		} else {
			updateUser();
		}
	};
});