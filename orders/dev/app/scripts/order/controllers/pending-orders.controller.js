/**
 * @author Dmitriy Biletskiy
 */
(function() {
    'use strict';

    angular
        .module('order.module')
        .controller('PendingOrdersController', PendingOrdersController);

    function PendingOrdersController(
        $scope,
        OrderManager,
        EventDispatcher,
        AuthService,
        toastr
    ) {

        $scope.inProgress = true;

        var params = {
            column: 'id',
            sort: 'asc'
        };

        getOrders();

        /**
         * Sorts by some column
         *
         * @param {object} parameters
         */
        $scope.order = function(parameters) {
            params = parameters;
            getOrders();
        };

        /**
         * Updates status of the order
         *
         * @param {integer} orderId - order id
         * @param {string} status - order status {rejected/submitted}
         */
        $scope.changeStatus = function(orderId, status) {
            if (status === 'submited') {
                OrderManager
                    .getRemovedProducts(orderId)
                    .then(function(res) {
                        var products = res.plain();
                        if (products.length) {
                            toastr.warning('Product ' + products[0] + ' from the list was discontinued by admin. To continue, please remove it from list.');
                            $scope.inProgress = false;
                        } else {
                            updateOrder(orderId, status);
                        }
                    });
            } else {
                updateOrder(orderId, status);
            }
        };


        /* Event listener, runs when pagination was changed */
        EventDispatcher.onScope($scope, 'ON_PAGINATION_CHANGE', getOrders);

        function getOrders() {
            OrderManager
                .get(_.extend(params, { status: 'pending', by: 'account' }))
                .then(function(res) {
                    $scope.orders = res.data;
                    $scope.inProgress = false;
                });
        }

        function updateOrder(orderId, status) {
            var user = AuthService.getCurrentUser();

            OrderManager
                .update({ id: orderId, status: status, submitted_by: user.id })
                .then(function() {
                    var str = (status === 'submited') ? 'submited' : 'rejected';
                    toastr.success('The order was successfully ' + str + '.');
                    getOrders();
                });
        }
    }

})();