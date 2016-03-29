/**
 * @author Dmitriy Biletskiy
 */
(function() {
    'use strict';

    angular
        .module('order.module')
        .controller('DraftsOrdersController', DraftsOrdersController);

    function DraftsOrdersController(
        $scope,
        OrderManager,
        EventDispatcher,
        toastr
    ) {

        $scope.inProgress = true;
        var params = {
                column: 'id',
                sort: 'asc'
            };


        // --------------------------------------------------
        // Scope methods ------------------------------------
        // --------------------------------------------------

        /* Removes a draft order */
        $scope.remove = function(draftId) {
            OrderManager
                .remove(draftId)
                .then(function() {
                    toastr.success('Order was removed successfully.');
                    $scope.getOrders();
                });
        };

        $scope.getOrders = function(sorting) {
            if (sorting && sorting.hasOwnProperty('sort'))
                params = sorting;

            OrderManager
                .get(_.extend(params, { status: 'draft' , by: 'location'}))
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