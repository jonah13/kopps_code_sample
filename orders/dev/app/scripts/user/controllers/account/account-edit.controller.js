/**
 * @author Dmitriy Biletskiy
 */
(function() {
    'use strict';

    angular
        .module('user.module')
        .controller('AccountEditController', AccountEditController);

    function AccountEditController(
        $scope,
        $q,
        $state,
        $stateParams,
        toastr,
        AccountManager,
        PricingTemplateManager
    ) {

        $scope.inProgress = true;

        var accountPromise = AccountManager
            .getOne($stateParams.accountId)
            .then(function(res) {
                $scope.account = res.plain();
                $scope.locations = res.locations;
            });

        var pricingPromise = PricingTemplateManager
            .get({ column: 'id', sort: 'asc'})
            .then(function(res) {
                $scope.templates = res.plain();
            });

        $q.all([accountPromise, pricingPromise])
            .then(function() {
                $scope.inProgress = false;
            });

        // --------------------------------------------------
        // Scope methods ------------------------------------
        // --------------------------------------------------

        /* Add new location */
        $scope.addLocation = function(location) {
            if (!$scope.locations)
                $scope.locations = [];

            $scope.locations.push(location);
            $scope.addNew = false;
        };

        /** Allows or disallow to clear pricing template selector */
        $scope.allowClear = function() {
            return !!$scope.account.allow_pricing_template && !$scope.account.users.length;
        };

        /* Change location */
        $scope.changeLocation = function(location, index) {
            $scope.locations.splice(index, 1, location);
            $scope.activeEditLocation = null;
        };

        /* Remove one location */
        $scope.removeLocation = function(index) {
            $scope.locations.splice(index, 1);

            if (!$scope.locations.length) {
                delete $scope.locations;
                $scope.addNew = true;
            }
        };

        /* Show form for adding new location */
        $scope.showAddForm = function() {
            $scope.addNew = true;
        };

        /* Close edit/add location forms */
        $scope.closeForm = function() {
            if ($scope.locations)
                $scope.addNew = false;

            $scope.activeEditLocation = null;
        };

        /* Show edit location form */
        $scope.showEditForm = function(index) {
            $scope.activeEditLocation = index;
        };

        /* Save account and related locations */
        $scope.save = function(isValid) {
            $scope.isSubmited = true;

            if (!isValid) {
                toastr.warning('Seems something went wrong, please check the form again.');
                return;
            }

            AccountManager
                .update(_.omit($scope.account, ['locations', 'users']), $scope.locations)
                .then(function() {
                    toastr.success('Account was updated successfully.');
                    $state.go('account.index');
                });
        };


        // --------------------------------------------------
        // Watchers -----------------------------------------
        // --------------------------------------------------

        $scope.$watch('account.type', function(newType) {
            if (newType === 'standard' &&  !_.isUndefined($scope.locations) && $scope.locations.length > 1)
                $scope.locations.splice(1);
        });

        $scope.$watch('account.allow_pricing_template', function(newVal) {
            if (!$scope.inProgress && !newVal)
                $scope.account.pricing_template_id = null;
        });
    }

})();
