var app = angular.module('chirpApp', ['ngRoute', 'ngResource', 'ui.bootstrap', 'ngBootbox', 'LocalStorageModule', 'ngFileUpload']).run(function ($rootScope, $http) {
	$rootScope.authenticated = false;
	$rootScope.current_user = '';
	$rootScope.userObj = {};
	$rootScope.signout = function () {
		$http.get('auth/signout');
		$rootScope.authenticated = false;
		$rootScope.current_user = '';
		$rootScope.userObj = {};
	};
});

app.config(function (localStorageServiceProvider) {
	localStorageServiceProvider
		.setPrefix('choyou')
		.setStorageType('sessionStorage')
		.setNotify(true, true);
});

app.config(function ($routeProvider) {
	$routeProvider
		//the timeline display
		.when('/', {
			templateUrl: 'main.html',
			controller: 'mainController'
		})
		//the login display
		.when('/login', {
			templateUrl: 'login.html',
			controller: 'authController'
		})
		//the signup display
		.when('/register', {
			templateUrl: 'register.html',
			controller: 'authController'
		})
		.when('/signup/:id', {
			templateUrl: 'register.html',
			controller: 'authController'
		})
		.when('/cart', {
			templateUrl: 'shoppingcart.html',
			controller: 'shoppingCartController'
		})
		.when('/cart/:id', {
			templateUrl: 'shoppingcartbyId.html',
			controller: 'shoppingCartSingleController'
		})
		.when('/checkout', {
			templateUrl: 'checkout.html',
			controller: 'checkoutController'
		})

		.when('/users', {
			templateUrl: 'user.html',
			controller: 'usersController'
		})
		.when('/users/:userid', {
			templateUrl: 'register.html',
			controller: 'authController'
		})

		.when('/vendors', {
			templateUrl: 'vendor.html',
			controller: 'vendorController'
		})
		.when('/vendors/:vendorid', {
			templateUrl: 'register.html',
			controller: 'authController'
		})
		.when('/orders', {
			templateUrl: 'order.html',
			controller: 'orderController'
		});
});

app.directive('numbersOnly', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attr, ngModelCtrl) {
            function fromUser(text) {
                if (text) {
                    var transformedInput = text.replace(/[^0-9]/g, '');

                    if (transformedInput !== text) {
                        ngModelCtrl.$setViewValue(transformedInput);
                        ngModelCtrl.$render();
                    }
                    return transformedInput;
                }
                return undefined;
            }            
            ngModelCtrl.$parsers.push(fromUser);
        }
    };
});