/**
 * @author Dmitriy Biletskiy
 */
(function() {
    'use strict';

    angular
        .module('product.module')
        .controller('ManufacturerController', ManufacturerController);

    function ManufacturerController(
        $scope,
        toastr,
        ManufacturerManager,
        EventDispatcher
    ) {
        $scope.inProgress = true;

        var params = { column: 'name', sort: 'asc' };

        getManufacturers(); // get manufacturers

        /* Event listener, runs when pagination was changed */
        EventDispatcher.onScope($scope, 'ON_PAGINATION_CHANGE', getManufacturers);

        $scope.$watch('substr', getManufacturers);


        // --------------------------------------------------
        // Scope methods ------------------------------------
        // --------------------------------------------------

        /* Adds an empty manufacturer into the list */
        $scope.add = function() {
            $scope.inserted = {
                name: ''
            };

            $scope.manufacturers.unshift($scope.inserted);
        };

        /* Order columns by selected value */
        $scope.order = function(parameters) {
            params = parameters;
            getManufacturers();
        };

        /* Removes empty manufacturer if user cancels editing */
        $scope.cancel = function(index) {
            if (_.isUndefined($scope.manufacturers[index].id))
                $scope.manufacturers.shift();
        };

        /* Saves if user saves editing/creating */
        $scope.save = function(manufacturer, id, index) {
            if (_.isUndefined(id)) {
                ManufacturerManager
                    .add(manufacturer)
                    .then(function (res) {
                        $scope.manufacturers.splice(index, 1, res.plain());
                    });
            } else {
                ManufacturerManager
                    .update(manufacturer)
                    .then(function () {
                        toastr.success('Manufacturer is successfully updated.');
                    });
            }
        };

        /* Removes the manufacturer */
        $scope.remove = function(manufacturerId, products) {
            if (products) {
                toastr.warning('Can\'t remove this manufacturer because it belongs to the some account.');
            } else {
                ManufacturerManager
                    .remove(manufacturerId)
                    .then(function() {
                        getManufacturers();
                        toastr.success('Manufacturer is successfully removed.');
                    });
            }
        };

        /* Checks if field is not empty */
        $scope.checkName = function(data) {
            if(!data)
                return 'Name is required';
        };


        // --------------------------------------------------
        // Local functions ----------------------------------
        // --------------------------------------------------

        function getManufacturers() {
            var filters = _.extend(params, { substr: $scope.substr });

            ManufacturerManager
                .get(filters)
                .then(function(res) {
                    $scope.manufacturers = res.data;
                    $scope.inProgress = false;
                });
        }
    }

})();
