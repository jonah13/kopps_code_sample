/**
 * @author Dmitriy Biletskiy
 */
(function() {
    'use strict';

    angular
        .module('order.module')
        .controller('RecentOrdersController', RecentOrdersController);

    function RecentOrdersController(
        $scope,
        $state,
        OrderManager,
        EventDispatcher,
        CartService
    ) {

        $scope.inProgress = true;
        var params = {
                column: 'id',
                sort: 'desc'
            };

        // --------------------------------------------------
        // Scope methods ------------------------------------
        // --------------------------------------------------

        /* Moves products into the shopping cart */
        $scope.toCart = function(orderId) {
            CartService
                .addListToCart(orderId)
                .then(function() {
                    EventDispatcher.dispatch('GET_SHOPPING_CART');
                    $state.go('order.cart');
                });
        };

        $scope.getOrders = function(sorting) {
            if (sorting && sorting.hasOwnProperty('sort'))
                params = sorting;

            OrderManager
                .get(_.extend(params, { status: 'pending,rejected,submited,removed,processed', by: 'location' }))
                .then(function(res) {
                    $scope.orders = res.data;
                    $scope.inProgress = false;
                });
        };

        $scope.getOrders();


        // --------------------------------------------------
        // Listeners ----------------------------------------
        // --------------------------------------------------

        /* Event listener, runs when pagination was changed */
        EventDispatcher.onScope($scope, 'ON_PAGINATION_CHANGE', $scope.getOrders);
    }

})();