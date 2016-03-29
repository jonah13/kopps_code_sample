/**
 * @author Dmitriy Biletskiy
 */
(function() {
    'use strict';

    angular
        .module('user.module')
        .controller('LocationAdminIndexController', LocationAdminIndexController);

    function LocationAdminIndexController(
        $scope,
        toastr,
        usStateList,
        LocationManager,
        EventDispatcher
    ) {

        var params = {
            column: 'id',
            order: 'asc'
        };

        getLocations(); // get locations
        $scope.inProgress = true;
        $scope.statesList = usStateList; // list of states


        /* Event listener, runs when pagination was changed */
        EventDispatcher.onScope($scope, 'ON_PAGINATION_CHANGE', getLocations);
        $scope.$watch('substr', getLocations);


        // --------------------------------------------------
        // Scope methods ------------------------------------
        // --------------------------------------------------

        /**
         *  Removes empty location if user cancel editing
         *
         * @param {integer} index - number of element in the array
         */
        $scope.cancel = function(index) {
            if (_.isUndefined($scope.locations[index].id))
                $scope.locations.shift();
        };

        /**
         * Saves if user save editing/creating
         *
         * @param {object} location
         */
        $scope.update = function(location) {
            LocationManager
                .update(_.omit(location, ['account_name', 'account_id']))
                .then(function() {
                    toastr.success('Location was updated.');
                });
        };

        /**
         * Removes the location
         *
         * @param {boolean} accountExist
         * @param {integer} locationId - location id
         */
        $scope.remove = function(accountExist, locationId) {
            if (accountExist) {
                toastr.warning('Can\'t remove this location because it belongs to an account.');
            } else {
                LocationManager
                    .remove(locationId)
                    .then(function() {
                        getLocations();
                        toastr.success('Location was removed successfully.');
                    });
            }
        };

        /**
         *  Sorts table by the selected column
         *
         * @param {object} parameters {column/sort}
         */
        $scope.order = function(parameters) {
            params = parameters;
            getLocations();
        };


        // --------------------------------------------------
        // Local functions ----------------------------------
        // --------------------------------------------------

        function getLocations() {
            var filters = _.extend(
                params,
                { substr: $scope.substr }
            );

            LocationManager
                .get(filters)
                .then(function(res) {
                    $scope.locations = res.data;
                    $scope.inProgress = false;
                });
        }
    }

})();