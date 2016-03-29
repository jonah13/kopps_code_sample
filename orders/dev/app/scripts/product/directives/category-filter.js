/**
 * @author Soufiane Benlamalem
 */
(function() {
    'use strict';

    angular
        .module('product.module')
        .directive('categoryFilter', categoryFilter)
        .controller('CategoryFilterController', CategoryFilterController);

    /**
     * @ngInject
     */
    function categoryFilter() {
        return {
            scope: {
                category: '=',
                categoryId: '='
            },
            replace: true,
            restrict: 'E',
            controller: 'CategoryFilterController',
            templateUrl: 'views/product/category-filter.html'
        };
    }

    /**
     * @ngInject
     */
    function CategoryFilterController($scope, CategoryManager, $location, $anchorScroll) {

        CategoryManager
            .get({ allowPaginate: false })
            .then(function(res) {
                $scope.categories = res.plain();
            });

        /* Filters products by categories */
        $scope.filterByCategory = function(id) {
            $scope.category = !!id;
            $scope.categoryId = id;

            $location.hash('products-top');
            $anchorScroll();
        };
    }

})();