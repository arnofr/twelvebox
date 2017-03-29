
app.controller('vendorController', function ($scope, $http, $rootScope, $location, $routeParams, vendorService) {
	$scope.vm= {
		verndorList:vendorService.query()
	}
	$scope.vm.deleteVendor = function (vendor) {
        $http.delete('/api/vendors/' + vendor._id).success(function (data) {
            console.log(data);
            $scope.vm.verndorList = vendorService.query()
        }).error(function () {
            console.log('Error in deleting user');
        });
    };
    $scope.vm.editVendor = function (user) {
        $location.path("/vendors/"+user._id);
    };
});