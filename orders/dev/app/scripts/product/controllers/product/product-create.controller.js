/**
 * @author Dmitriy Biletskiy
 */
(function() {
    'use strict';

    angular
        .module('product.module')
        .controller('ProductCreateController', ProductCreateController);

    function ProductCreateController(
        $scope,
        $state,
        ProductManager,
        ManufacturerManager,
        CategoryManager,
        uomsList,
        toastr
    ) {

        $scope.product = {};
        $scope.manufacturers = [];
        $scope.categories = [];
        $scope.uomsList = uomsList;

        /* Get list of manufacturers for selector */
        ManufacturerManager
            .get()
            .then(function(res) {
                $scope.manufacturers = res.plain();
            });

        /* Get list of categories for selector */
        CategoryManager
            .get()
            .then(function(res) {
                $scope.categories = res.plain();
            });

        /* Saves a product */
        $scope.save = function(isValid) {
            $scope.isSubmited = true;

            if (!isValid) {
                toastr.warning('Seems something went wrong, please check the form again.');
                return;
            }

            var fd = new FormData();
            _.forEach($scope.product, function(val, key) {
                fd.append(key, val);
            });
            fd.append('img', $scope.img);
            fd.append('imgPath', ($scope.img) ? $scope.img.name : undefined);

            ProductManager
                .add(fd)
                .then(function() {
                    toastr.success('Product was saved.');
                    $state.go('products.admin-list');
                });
        };


        $scope.$watch('product', function() {
            $scope.isSubmited = false;
        }, true);
    }

})();
