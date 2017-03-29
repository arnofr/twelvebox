app.controller('addProductController', function ($scope, $http, $rootScope, $location, productService, $uibModalInstance, Upload) {


    $scope.vm = {
        product: {
            title: "",
            description: "",
            price: "",
            sku: "",
            vendor: "",
            visibleonlinestore: false,
            producttype: "",
            imagepath: "",
        },
        productType: [
            { name: 'Starter', id: 1 },
            { name: 'Main Course', id: 2 },
            { name: 'Desert', id: 3 }
        ],
        user: $rootScope.userObj

    }

    

    $scope.addProduct = function () {

        $scope.vm.product.zipcode = $rootScope.userObj.zipcode;
        productService.save($scope.vm.product, function () {
            $uibModalInstance.close('updated');

        });

    }

    $scope.uploadFile = function () {
       
        Upload.upload({
            url: '/api/upload',
            data: { file: $scope.file }
        }).then(function (response) {
            console.log('upload success', response);
            $scope.vm.product.imagepath = "http://localhost:3000" + response.data;
        }, function (error) {
            console.log('upload fail', error);
        }, function (error) {
            console.log('upload fail', error);
        });

    };

    // $scope.fileSelected = function (files) {
    //     if (files && files.length) {
    //         $scope.file = files[0];
    //     }

    // };

});