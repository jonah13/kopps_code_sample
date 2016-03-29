(function() {
    'use strict';

    angular
        .module('product.module')
        .directive('getManufacturers', getManufacturers)
        .controller('GetManufacturersController', GetManufacturersController);

    function getManufacturers() {
        return {
            restrict: 'A',
            controller: 'GetManufacturersController'
        };
    }

    function GetManufacturersController($scope, ManufacturerManager) {
        var params = {
            allowPaginate: false,
            column: 'name',
            sort: 'asc'
        };

        ManufacturerManager
            .get(params)
            .then(function (res) {
                $scope.manfs = res.plain();
            });
    }

})();