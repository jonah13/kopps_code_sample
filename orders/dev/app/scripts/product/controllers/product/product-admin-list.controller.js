/**
 * @author Dmitriy Biletskiy
 */
(function() {
    'use strict';

    angular
        .module('product.module')
        .controller('ProductAdminListController', ProductAdminListController);

    function ProductAdminListController($scope, ProductManager, EventDispatcher, toastr, app_parameters) {

        $scope.inProgress = true;
        $scope.filters = {};
        var params = {
            column: 'id',
            sort: 'desc'
        };
        getProducts();

        /* Remove the product */
        $scope.remove = function(productId) {
            ProductManager
                .remove(productId)
                .then(function() {
                    toastr.success('The product was successfully updated to inactive status.');
                    getProducts();
                });
        };

        /* Order columns by selected value */
        $scope.order = function(parameters) {
            params = parameters;
            getProducts();
        };

        $scope.continue = function(productId) {
            var fd = new FormData();

            fd.append('id', productId);
            fd.append('removed', false);

            ProductManager
                .update(fd)
                .then(function() {
                    toastr.success('The product was successfully updated to active status.');
                    getProducts();
                });
        };

        $scope.getExportLink = function() {
            return app_parameters.rest_server + 'export-products';
        };


        /* Event listener, runs when pagination was changed */
        EventDispatcher.onScope($scope, 'ON_PAGINATION_CHANGE', getProducts);


        function getProducts() {
            var filter = _.extend($scope.filters, params);

            ProductManager
                .get(filter)
                .then(function(res) {
                    $scope.products = res.data;
                    $scope.inProgress = false;
                });
        }

        $scope.$watch('filters', getProducts, true);
    }

})();