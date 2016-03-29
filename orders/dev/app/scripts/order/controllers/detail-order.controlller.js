/**
 * @author Dmitriy Biletskiy
 */
(function() {
    'use strict';

    angular
        .module('order.module')
        .controller('DetailOrderController', DetailOrderController);

    function DetailOrderController(
        $scope,
        $state,
        $stateParams,
        ProductService,
        ProductOrderManager,
        CartService,
        PaginationService,
        EventDispatcher
    ) {

        $scope.cart = CartService;
        $scope.productSvc = ProductService;

        /* Moves products into the shopping cart */
        $scope.toCart = function() {
            ProductOrderManager
                .addProductsList(CartService.getOrder().id, $stateParams.orderId)
                .then(function() {
                    EventDispatcher.dispatch('GET_SHOPPING_CART');
                    $state.go('order.cart');
                });
        };

        ProductOrderManager
            .getList($stateParams.orderId, {
                column: 'id',
                sort: 'asc',
                customPrice: true,
                allowPaginate: false
            })
            .then(function(res) {
                $scope.products = res.plain();
                PaginationService.set($scope.products.length);
                $scope.pagination = _.extend(
                    PaginationService.get(),
                    { currentPage: 1 }
                );
            });

        /* Event listener, runs when pagination was changed */
        EventDispatcher.onScope($scope, 'ON_PAGINATION_CHANGE', function() {
            $scope.pagination = PaginationService.get();
        });

    }

})();