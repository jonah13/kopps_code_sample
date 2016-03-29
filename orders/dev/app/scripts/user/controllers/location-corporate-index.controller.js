/**
 * @author Dmitriy Biletskiy
 */
(function() {
    'use strict';

    angular
        .module('user.module')
        .controller('LocationCorporateIndexController', LocationCorporateIndexController);

    function LocationCorporateIndexController(
        $scope,
        LocationManager,
        EventDispatcher,
        AuthService
    ) {

        var params = {
            column: 'id',
            sort: 'asc'
        };

        $scope.inProgress = true;
        getLocations(); // get locations

        /* Order columns by selected value */
        $scope.order = function(parameters) {
            params = parameters;
            getLocations();
        };

        /* Event listener, runs when pagination was changed */
        EventDispatcher.onScope($scope, 'ON_PAGINATION_CHANGE', getLocations);


        // --------------------------------------------------
        // Local functions ----------------------------------
        // --------------------------------------------------

        function getLocations() {
            var accountId = AuthService.getCurrentUser().account;
            LocationManager
                .getByAccount(accountId, params)
                .then(function(res) {
                    $scope.locations = res.data;
                    $scope.inProgress = false;
                });
        }

    }

})();