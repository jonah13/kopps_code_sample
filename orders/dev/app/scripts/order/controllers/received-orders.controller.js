/**
 * @author Dmitriy Biletskiy
 */
(function() {
    'use strict';

    angular
        .module('order.module')
        .controller('ReceivedOrdersController', ReceivedOrdersController);

    function ReceivedOrdersController(
        $scope,
        OrderManager,
        AccountManager,
        LocationManager,
        EventDispatcher,
        orderFilterValues
    ) {
        var params = {
            column: 'id',
            sort: 'desc'
        };
        $scope.filterValues = orderFilterValues;
        $scope.filters = { status: $scope.filterValues[0].name };

        AccountManager
            .get({ allowPaginate: false })
            .then(function(res) {
                $scope.accounts = res.plain();
            });

        LocationManager
            .get({ allowPaginate: false, column: 'id', sort: 'asc' })
            .then(function(res) {
                $scope.locations = res.plain();
            });

        getOrders();

        // --------------------------------------------------
        // Scope methods ------------------------------------
        // --------------------------------------------------

        /* Orders columns by selected value */
        $scope.order = function(parameters) {
            params = parameters;
            getOrders();
        };

        /* Event listener, runs when pagination was changed */
        EventDispatcher.onScope($scope, 'ON_PAGINATION_CHANGE', getOrders);


        function getOrders() {
            $scope.filters.orderId = ($scope.filters.orderId) ? $scope.filters.orderId.replace('/0/g', '') : undefined;

            var filters = _.extend(
                params,
                $scope.filters,
                { by: 'users' }
            );

            OrderManager
                .get(filters)
                .then(function(res) {
                    $scope.orders = res.data;
                });
        }

        $scope.$watch('filters', getOrders, true);
    }

})();