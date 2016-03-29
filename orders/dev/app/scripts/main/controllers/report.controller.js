(function() {
    'use strict';

    angular
        .module('main.module')
        .controller('ReportController', ReportController);

    /**
     * @ngInject
     */
    function ReportController(
        $scope,
        $q,
        $filter,
        LocationManager,
        OrderManager,
        UserManager,
        AuthService,
        app_parameters,
        EventDispatcher
    ) {

        var params = {
            column: 'id',
            sort: 'desc'
        };
        var promises = [];

        $scope.inProgress = true;
        $scope.auth = AuthService;
        $scope.datepickers = {};
        $scope.filters = {
            status: 'submited,processed',
            by: (AuthService.isCustomer()) ? 'location' : 'account',
            location: (AuthService.isCustomer()) ? AuthService.getCurrentUser().location_id : undefined,
            account: AuthService.getCurrentUser().account
        };
        $scope.format = 'yyyy-dd-MM';
        $scope.locations = [{ name: 'All locations' }];
        $scope.users = [{ first_name: 'All users' }];

        if (!AuthService.isCustomer()) {
            var locationsPromise = LocationManager
                .getByAccount(AuthService.getCurrentUser().account, _.extend({ allowPaginate: false }, params))
                .then(function(res) {
                    $scope.locations = $scope.locations.concat(res.plain());
                });

            promises.push(locationsPromise);
        }

        var usersPromise = UserManager
            .getCustomers($scope.filters.location)
            .then(function(res) {
                $scope.users = $scope.users.concat(res.plain());
            });

        promises.push(usersPromise);


        // --------------------------------------------------
        // Scope methods ------------------------------------
        // --------------------------------------------------

        /* Order columns by selected value */
        $scope.order = function(parameters) {
            params = parameters;
            $scope.getOrders();
        };

        $scope.getOrders = function() {
            var filters = {};

            _.extend(
                filters,
                params,
                _.omit($scope.filters, ['from', 'to'])
            );

            return OrderManager
                .get(filters)
                .then(function(res) {
                    $scope.orders = res.data;
                });
        };

        $scope.openDatePicker = function(field) {
            $scope.datepickers[field] = true;
        };

        $scope.getExportLink = function(type) {
            var url = app_parameters.rest_server + 'export-orders/' + type;
            var filters = _.extend($scope.filters, params);
            var counter = 0;

            _.forEach(_.omit(filters, ['from', 'to']), function(val, key) {
                if (!counter) {
                    url += '?' + key + '=' + val;
                } else {
                    if (val)
                        url += '&' + key + '=' + val;
                }

                counter++;
            });

            return url;
        };

        /* Event listener, runs when pagination was changed */
        EventDispatcher.onScope($scope, 'ON_PAGINATION_CHANGE', $scope.getOrders);

        $scope.$watch('[filters.from, filters.to, filters.location, filters.user]', function(filters) {
            if (filters[0]) {
                $scope.filters.convertFrom = $filter('date')(filters[0], 'yyyy/MM/dd') + ' 00:00:00';
            }

            if (filters[1])
                $scope.filters.convertTo = $filter('date')(filters[1], 'yyyy/MM/dd') + ' 23:59:59';

            $scope.getOrders();
        });

        promises.push($scope.getOrders());

        $q.all(promises)
            .then(function() {
                $scope.inProgress = false;
            });
    }

})();
