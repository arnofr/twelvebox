
app.controller('orderController', function ($scope, $http, $rootScope, $location, $routeParams, $filter,orderService) {
	$scope.vm= {
		orderList:orderService.query(),
        orderStatus:["ordered", "preparing","delivering","delivered"],

        fromDate: '',
        toDate: '',
        dateOptions: {
            dateDisabled: false,
            formatYear: 'yy',
            maxDate: new Date(),
            minDate: new Date(1900, 1, 1),
            startingDay: 1
        },
        opened: true,
	}
    $scope.filters = {
        status:$scope.vm.orderStatus[0]
    };

        $scope.formats = ['yyyy/MM/dd'];
        $scope.format = $scope.formats[1];


        $scope.popup1 = {
            opened: false
        };

        $scope.popup2 = {
            opened: false
        };


        $scope.open1 = function () {
            $scope.popup1.opened = true;
        };


        $scope.open2 = function () {
            $scope.popup2.opened = true;
        };


      
    $scope.updateOrderStatus = function(order){
        $http.put('api/orders/' + order._id, order).success(function (data) {
            console.log('data>>>>>>>>>>>>>> updating order', data);
        });
    }
	

    var adjustedDate = function(dateToFix){
         var localDate= new Date(dateToFix);
        var localTime= localDate.getTime();
        var localOffset = localDate.getTimezoneOffset() * 60000;
        var adjustedDate = new Date(localTime - localOffset);
        return adjustedDate;
    }
    $scope.OrderSeachByDate = function(){



        var toDate = new Date($scope.vm.toDate);//.toISOString();
        toDate.setHours(23,59,59,999);
        var fromDate = new Date($scope.vm.fromDate);//.toISOString();
        
      console.log('toDate', toDate);
       console.log('fromDate', fromDate);
       $http.get('/api/orders?from='+fromDate+"&to="+toDate).success(function (data) {
           console.log(data);
           if(data){
               $scope.vm.orderList = data;
           }
		});

    }
});