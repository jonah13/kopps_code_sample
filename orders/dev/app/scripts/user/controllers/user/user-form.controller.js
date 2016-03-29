/**
 * @author Dmitriy Biletskiy
 */
(function() {
    'use strict';

    angular
        .module('user.module')
        .controller('UserFormController', UserFormController);

    function UserFormController(
        $scope,
        $interval,
        usStateList,
        LocationManager
    ) {
        var untouched = true;
        $scope.statesList = usStateList; // list of states

        var stop = $interval(function() {
            if ($scope.user.type && $scope.accounts) {
                var type = ($scope.user.type === 'customer') ? 'standard' : 'corporate';
                $scope.accounts = _.where($scope.accounts, { type: type });

                $interval.cancel(stop); // cancel interval if data are loaded
            }
        }, 200);


        // --------------------------------------------------
        // Watchers -----------------------------------------
        // --------------------------------------------------

        // sets form valid state to parent ctrl
        $scope.$watch('userCreateForm.$valid', function(isValid) {
            $scope.isValid = isValid;
        });

        // gets locations if account was changed
        $scope.$watch('user.account', function(accountId) {
            if (_.isUndefined(accountId) || _.isNull(accountId) || !~['corporate_user', 'customer'].indexOf($scope.user.type)) return;

            if (!untouched)
                $scope.user.location_id = null;

            LocationManager
                .getByAccount(accountId, { column: 'id', sort: 'asc' })
                .then(function(res) {
                    $scope.locations = res.plain();
                    untouched = false;
                });
        });
    }

})();