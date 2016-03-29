/**
 * @author Dmitriy Biletskiy
 */
(function() {
    'use strict';

    angular
        .module('user.module')
        .controller('AccountCreateController', AccountCreateController);

    function AccountCreateController($scope, $state, toastr, AccountManager, PricingTemplateManager) {

        $scope.account = {};
        $scope.addNew = true;

        PricingTemplateManager
            .get({ column: 'id', sort: 'asc'})
            .then(function(res) {
                $scope.templates = res.plain();
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
            return $scope.account.allow_pricing_template;
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
                .add({ locations: $scope.locations, account: $scope.account })
                .then(function() {
                    toastr.success('Account was added successfully.');
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
            if (!newVal)
                $scope.account.pricing_template_id = null;
        });
    }

})();