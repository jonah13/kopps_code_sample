/**
 * @author Dmitriy Biletskiy
 */
(function() {
    'use strict';

    angular
        .module('order.module')
        .controller('AdminDetailOrderController', AdminDetailOrderController);

    function AdminDetailOrderController(
        $scope,
        $stateParams,
        $modal,
        OrderManager,
        ProductService,
        app_parameters
    ) {

        $scope.productSvc = ProductService;

        OrderManager
            .getForAdmin($stateParams.orderId)
            .then(function(res) {
                $scope.order = res.order;
                $scope.products = res.products;
            });

        $scope.getExportLink = function(type) {
            return app_parameters.rest_server + 'export-order/' + type + '/' + $stateParams.orderId;
        };

        $scope.changeStatus = function() {
            var status, str;

            if ($scope.order.status === 'processed') {
                status = 'submited';
                str = 'pending';
            } else {
                status = 'processed';
                str = 'processed';
            }

            $scope.texts = {
                title: 'Confirm',
                message: 'Are you sure you want to change status of this order to ' + str + ' ?'
            };

            $modal.open({
                templateUrl: 'views/main/modal/yes-no-modal.html',
                size: 'sm',
                scope: $scope
            }).result.then(function() {


                OrderManager
                    .update({ id: $stateParams.orderId, status: status })
                    .then(function() {
                        $scope.order.status = ($scope.order.status === 'processed') ? 'submited' : 'processed';
                    });
            });
        };
    }

})();