(function() {
    'use strict';

    angular
        .module('product.module')
        .directive('getCategories', getCategories)
        .controller('GetCategoriesController', GetCategoriesController);

    function getCategories() {
        return {
            restrict: 'A',
            controller: 'GetCategoriesController'
        };
    }

    function GetCategoriesController($scope, CategoryManager) {
        var params = {
            allowPaginate: false,
            column: 'name',
            sort: 'asc'
        };

        CategoryManager
            .get(params)
            .then(function (res) {
                $scope.categories = res.plain();
            });
    }

})();