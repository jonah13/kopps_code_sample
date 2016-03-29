/**
 * @author Dmitriy Biletskiy
 */
(function() {
    'use strict';

    angular
        .module('product.module')
        .controller('ProductIndexController', ProductIndexController);

    function ProductIndexController(
        $scope,
        $stateParams,
        ProductManager,
        CartService,
        FavoriteService,
        AuthService,
        EventDispatcher
    ) {

        $scope.inProgress = true;
        $scope.cart = CartService;
        $scope.auth = AuthService;
        $scope.favorite = FavoriteService;

        $scope.filters = {
            categoryId: ($stateParams.categoryId) ? $stateParams.categoryId : undefined,
            price: ($stateParams.customPrice) ? 'custom' : 'all',
            manufacturer: false
        };

        getProducts();

        function getProducts() {
            ProductManager
                .getCustomProducts($scope.filters)
                .then(function(res) {
                    $scope.products = res.data;
                    $scope.inProgress = false;
                });
        }

        /* Event listener, runs when pagination was changed */
        EventDispatcher.onScope($scope, 'ON_PAGINATION_CHANGE', getProducts);

        /* If user wants to filter by some filter */
        $scope.$watch('filters', getProducts, true);
    }

})();