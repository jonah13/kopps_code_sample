/**
 * @author Dmitriy Biletskiy
 */
(function() {
    'use strict';

    angular
        .module('main.module')
        .controller('AdminDashboardController', AdminDashboardController);

    function AdminDashboardController($scope, $q, OrderManager) {

        $scope.inProgress = true;

        var orderPromise = OrderManager
            .get({
                by: 'users',
                status: 'submited',
                limit: 5
            })
            .then(function(res) {
                $scope.orders = res.plain();
            });

        var statisticPromise = OrderManager
            .get({
                by: 'accounts',
                status: 'submited'
            })
            .then(function(res) {
                $scope.statistics = res.plain();
            });

        /* Hides loading animation when all requests will be executed */
        $q.all([orderPromise, statisticPromise])
            .then(function() {
                $scope.inProgress = false;
            });

    }

})();
