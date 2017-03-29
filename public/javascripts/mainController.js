
app.controller('mainController', function (postService, productService, $scope, $rootScope, $uibModal, $cacheFactory, localStorageService) {
    $scope.posts = postService.query();
    $scope.allProduct = $scope.products = productService.query();

    $scope.search = {
        zipcode: ''
    }
    $scope.zipcode = '';
    // if(){

    // }
    $scope.newPost = { created_by: '', text: '', created_at: '' };

    $scope.cartProducts = [];
    $scope.previousCart = localStorageService.get('cart');
    if ($scope.previousCart && $scope.previousCart.length) {
        $scope.cartProducts = $scope.previousCart;
    }


    $scope.post = function () {
        $scope.newPost.created_by = $rootScope.current_user;
        $scope.newPost.created_at = Date.now();
        postService.save($scope.newPost, function () {
            $scope.posts = postService.query();
            $scope.newPost = { created_by: '', text: '', created_at: '' };
        });
    };

    $scope.addToCart = function (product) {
        product.isAddToCart = true;
        $scope.cartProducts.push(product);
        localStorageService.set('cart', $scope.cartProducts);
        if ($rootScope.authenticated && $rootScope.user) {
            console.log('save in server');
            console.log($scope.cartProducts);
        }
    }
    $scope.goToCart = function () {

    }


    // $scope.filterByZipcode = function () {
    //     if ($scope.zipcode) {
    //         $scope.products = _.filter($scope.allProduct, { 'zipcode': $scope.zipcode });

    //         var filteredPeople = _.filter($scope.allProduct, function(person) {
    //             if(person.zipcode){
    //                 return person.zipcode.indexOf($scope.zipcode) > -1;
    //             }
               
    //         });

    //         console.log('filteredPeople', filteredPeople)
    //     }
    //     else {
    //         $scope.products = $scope.allProduct;
    //     }

    // }

    $scope.openAddProductPopup = function () {
        var modalInstance = $uibModal.open({
            templateUrl: 'javascripts/product/addproduct.html',
            controller: 'addProductController',
            size: 'lg',
            resolve: {
                // contentDetails: function () {
                //     var conentItem = {
                //         content: null,
                //         name: $scope.item.name,
                //         query: $scope.vm.isPresentFor,
                //         enumId: $scope.item.id
                //     }
                //     if (method === "edit") {
                //         conentItem.content = angular.copy($scope.vm.content);
                //     }

                //     return conentItem;
                // }
            }
        });
        modalInstance.result.then(function (selectedItem) {
            if (selectedItem) {
                console.log("modalinstanceclose:: and retun data...", selectedItem);
                $scope.products = productService.query();
                // $scope.vm.content = null;
                // $scope.vm.content = selectedItem;
            }
        });
    }

    $scope.filterFunction = function (element) {
        return element.name.match(/^Ma/) ? true : false;
    };

});
