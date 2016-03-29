/**
 * @author Dmitriy Biletskiy
 */
(function() {
    'use strict';

    angular
        .module('order.module')
        .controller('FavoriteOrdersController', FavoriteOrdersController);

    function FavoriteOrdersController(
        $scope,
        $stateParams,
        FavoriteService,
        CartService,
        ProductOrderManager,
        ProductManager,
        EventDispatcher
    ) {

        $scope.inProgress = true;
        $scope.favorite = FavoriteService;
        $scope.cart = CartService;
        var params = {
            column: 'id',
            sort: 'asc'
        };


        // --------------------------------------------------
        // Scope methods ------------------------------------
        // --------------------------------------------------

        /* Select favorite list */
        $scope.select = function(order) {
            $scope.active = order;
        };

        /* Sorts list by selected field */
        $scope.order = function(parameters) {
            params = parameters;
            getProducts();
        };

        $scope.removeProduct = function(productId, orderId, index) {
            FavoriteService
                .removeProduct(productId, orderId)
                .then(function() {
                    $scope.products.splice(index, 1);
                    $scope.favorite.getLists().forEach(function(val) {
                        if (val.id === $scope.active.id)
                          val.total_products--;
                    });
                });
        };


        // --------------------------------------------------
        // Watchers -----------------------------------------
        // --------------------------------------------------

        $scope.$watch($scope.favorite.getLists, function(newVal) {
            if (angular.isDefined(newVal) && !_.isEmpty(newVal)) {
                if ($stateParams.orderId) {
                    $scope.active = newVal.filter(function(order) {
                        return order.id == $stateParams.orderId;
                    })[0];
                } else {
                    $scope.active = $scope.active || newVal[0];
                }
            }
        });

        $scope.$watch('search', function(substring) {
            if (!_.isUndefined(substring))
                delete $scope.active;
            else
                return;

            if (substring === '') {
                $scope.active = $scope.favorite.getLists()[0];
                return;
            }

            ProductManager
                .search(substring)
                .then(function(res) {
                    $scope.products = res.plain();
                });

        });

        $scope.$watch('active', function(active) {
            if (active) {
                delete $scope.search;
                getProducts();
            }
        });

        /* Event listener, runs when pagination was changed */
        EventDispatcher.onScope($scope, 'ON_PAGINATION_CHANGE', getProducts);


        // --------------------------------------------------
        // Local functions ----------------------------------
        // --------------------------------------------------

        function getProducts() {
            _.extend(params, {
                substr: $scope.search,
                allowPaginate: false,
                customPrice: true
            });

            ProductOrderManager
                .getList($scope.active.id, params)
                .then(function(res) {
                    $scope.products = res.plain();
                    $scope.inProgress = false;
                });
        }
    }
})();