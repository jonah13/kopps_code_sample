/**
 * @author Dmitriy Biletskiy
 */
(function() {
    'use strict';

    angular
        .module('product.module')
        .controller('CustomItemsController', CustomItemsController);

    function CustomItemsController(
        $scope,
        AccountManager
    ) {

        $scope.inProgress = true;

        setDefaultPaginationState('accountPagination');


        // ---------------------------------------------------------
        // Scope methods -------------------------------------------
        // ---------------------------------------------------------

        /**
         * Gets accounts list by text filter and pagination
         *
         * @param {string} substr
         */
        $scope.getAccounts = function(substr) {
            var filters = _.extend(
                $scope.accountPagination,
                { page: $scope.accountPagination.currentPage || 1 }
            );

            if (angular.isDefined(substr))
                _.extend(filters, { substr: substr });

            AccountManager
                .get(filters)
                .then(function(res) {
                    $scope.accounts = res.data;
                    $scope.accountPagination.total = res.total;
                    $scope.inProgress = false;
                });
        };



        // ---------------------------------------------------------
        // Local functions -----------------------------------------
        // ---------------------------------------------------------

        function setDefaultPaginationState(name) {
            var defaultValues = { perPage: 10 };

            if (_.isString(name)) {
                $scope[name] = _.clone(defaultValues);

            } else  if (_.isArray(name)) {

                name.forEach(function(val) {
                   $scope[val] = _.clone(defaultValues);
                });

            } else {
                throw 'Unknown parameter was given.';
            }
        }

        $scope.getAccounts(); // loading accounts by default
    }

})();
