app.controller('shoppingCartController', function ($scope, $http, $rootScope, $location, localStorageService) {
    $scope.grossTotal = 0;
    $scope.deliveryCharge = 10;
    $scope.cartObj = [];

    $scope.removeData = function (item) {
        var index = $scope.cartObj.indexOf(item);
        $scope.cartObj.splice(index, 1);
        $scope.updateGrandTotal();

    }
    $scope.updateGrandTotal = function () {
        $scope.grossTotal = 0;
        angular.forEach($scope.cartObj, function (obj, key) {
            $scope.grossTotal += (obj.numberOfItem * obj.price);
        });
    }
    $scope.updateModel = function (model, type) {
        if (type == 'plus') {
            model.numberOfItem++;
        } else {
            if (model.numberOfItem > 1) {
                model.numberOfItem--;
            }
        }
        $scope.updateGrandTotal();
    }

    $scope.clearCart = function () {
        $scope.cartObj = [];
        $scope.grossTotal = 0;
        localStorageService.clearAll();
        //$scope.updateGrandTotal();
    }

    $scope.checkOut = function () {
        if ($rootScope.authenticated) {
            var myObj = {
                userid: $rootScope.userObj._id,
                username:$rootScope.userObj.username,
                products: $scope.cartObj,
                totalprice:($scope.grossTotal+$scope.deliveryCharge)
            }
            $http.post('/api/orders', myObj).success(function (data) {
               $scope.clearCart();
               $location.path('/checkout');
            }).error(function (data) {
                console.log(data);
            })

        }
        else {
            $location.path('/login').search('url', 'cart');
        }
    }

$scope.redicrectToShop = function(){
     $location.path('/');
}

    var init = function(){
        $scope.cartObj = localStorageService.get('cart');
        
        if ($scope.cartObj) {
            angular.forEach($scope.cartObj, function (obj, key) {
                obj.numberOfItem = 1;
                $scope.grossTotal += (obj.numberOfItem * obj.price);
            });
        }
    }
    init();
});