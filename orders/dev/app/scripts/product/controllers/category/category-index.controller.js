/**
 * @author Dmitriy Biletskiy
 */
(function() {
    'use strict';

    angular
        .module('product.module')
        .controller('CategoryIndexController', CategoryIndexController);

    function CategoryIndexController(
        $scope,
        CategoryManager,
        EventDispatcher,
        toastr
    ) {

        var params = {
            column: 'name',
            sort: 'asc'
        };

        $scope.inProgress = true;

        getCategories();


        function getCategories() {
            var filters = _.extend(params, { substr: $scope.substr });

            CategoryManager
                .get(filters)
                .then(function(res) {
                    $scope.categories = res.data;
                    $scope.inProgress = false;
                });
        }

        /* Order columns by selected value */
        $scope.order = function(parameters) {
            params = parameters;
            getCategories();
        };

        /**
         * Removes category if it does not belong to product
         *
         * @param {integer} categoryId
         * @param {integer} products - amount of related products
         */
        $scope.remove = function(categoryId, products) {
            if (products) {
                toastr.warning('Can\'t remove this category because it belongs to the some used product.');
            } else {
                CategoryManager
                    .remove(categoryId)
                    .then(function() {
                        toastr.success('Category is successfully removed.');
                        getCategories();
                    });

            }
        };

        /* Event listener, runs when pagination was changed */
        EventDispatcher.onScope($scope, 'ON_PAGINATION_CHANGE', getCategories);

        $scope.$watch('substr', getCategories);
    }

})();