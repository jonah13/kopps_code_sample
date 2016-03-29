/**
 * @author Dmitriy Biletskiy
 */
(function() {
    'use strict';

    angular
        .module('order.module')
        .controller('AdminRecentOrdersController', AdminRecentOrdersController);

    function AdminRecentOrdersController(
        $scope,
        $stateParams,
        OrderManager,
        EventDispatcher
    ) {
        $scope.inProgress = true;
        var params = {
            column: 'id',
            sort: 'desc'
        };

        getOrders();


        // --------------------------------------------------
        // Scope methods ------------------------------------
        // --------------------------------------------------

        /* Order columns by selected value */
        $scope.order = function(parameters) {
            params = parameters;
            getOrders();
        };

        // --------------------------------------------------
        // Listeners ----------------------------------------
        // --------------------------------------------------

        /* Event listener, runs when pagination was changed */
        EventDispatcher.onScope($scope, 'ON_PAGINATION_CHANGE', getOrders);


        // --------------------------------------------------
        // Local functions ----------------------------------
        // --------------------------------------------------

        function getOrders() {
            OrderManager
                .get(_.extend(params, $stateParams, { status: 'submited' }))
                .then(function(res) {
                    $scope.orders = res.data;
                    $scope.inProgress = false;
                });
        }
    }

})();