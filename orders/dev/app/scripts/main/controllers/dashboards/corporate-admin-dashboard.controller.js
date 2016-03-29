/**
 * @author Dmitriy Biletskiy
 */
(function() {
    'use strict';

    angular
        .module('main.module')
        .controller('CorpAdminDashboardController', CorpAdminDashboardController);

    function CorpAdminDashboardController(
        $scope,
        $window,
        $q,
        OrderManager,
        LocationManager,
        AuthService,
        toastr
    ) {

        setDefaultSortingState(['pendingParams', 'statisticParams']);

        $scope.inProgress = true;
        $scope.favorite = {};
        $scope.filters = {};
        var user = AuthService.getCurrentUser();

        /* Gets locations */
        var locationPromise = LocationManager
            .getByAccount(user.account, { column: 'id', sort: 'asc' })
            .then(function(res) {
                $scope.locations = res.plain();
            });


        // --------------------------------------------------
        // Scope methods ------------------------------------
        // --------------------------------------------------

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

        /**
         *  Get purchase statistics by location
         */
        $scope.getStatistic = function() {
            return OrderManager
                .get(_.extend({ by: 'locationStatistic'}, $window.statisticParams))
                .then(function(res) {
                    $scope.statistics = res.plain();
                });
        };

        /**
         *  Get pending orders
         */
        $scope.getPendingOrders = function() {
            return OrderManager
                .get(_.extend($window.pendingParams, {
                    status: 'pending' ,
                    limit: 5,
                    by: 'account',
                    location: $scope.filters.location
                }))
                .then(function (res) {
                    $scope.pendingOrders = res.plain();
                });
        };

        /**
         * Orders table by selected value
         *
         * @param {object} parameters
         * @param {string} name
         * @param {string} getter
         */
        $scope.order = function (parameters, name, getter) {
            $window[name] = parameters;
            $scope[getter]();
        };


        // --------------------------------------------------
        // Local functions ----------------------------------
        // --------------------------------------------------

        function setDefaultSortingState(name) {
            var defaultValues = { column: 'id', sort: 'asc' };

            if (_.isString(name)) {

                $window[name] = _.clone(defaultValues);

            } else if (_.isArray(name)) {

                name.forEach(function(val) {
                   $window[val] = _.clone(defaultValues);
                });

            } else {
                throw 'Unknown parameter was given.';
            }
        }

        function updateOrder(orderId, status) {
            OrderManager
                .update({ id: orderId, status: status, submitted_by: user.id })
                .then(function() {
                    var str = (status === 'submited') ? 'submited' : 'rejected';
                    toastr.success('The order was successfully ' + str + '.');
                    $scope.getPendingOrders();
                    $scope.getStatistic();
                });
        }

        $scope.$watch('filters.location', $scope.getPendingOrders);

        /* Hides loading spinner when all data were loaded */
        $q.all([locationPromise, $scope.getPendingOrders(), $scope.getStatistic()])
            .then(function () {
                $scope.inProgress = false;
            });
    }

})();