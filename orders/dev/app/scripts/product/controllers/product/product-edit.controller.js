/**
 * @author Dmitriy Biletskiy
 */
(function() {
    'use strict';

    angular
        .module('product.module')
        .controller('ProductEditController', ProductEditController);

    function ProductEditController(
        $scope,
        $state,
        $stateParams,
        ProductManager,
        ManufacturerManager,
        CategoryManager,
        uomsList,
        toastr
    ) {

        $scope.img = {};
        $scope.manufacturers = [];
        $scope.categories = [];
        $scope.uomsList = uomsList;

        ProductManager
            .getOneProduct($stateParams.productId)
            .then(function(res) {
                $scope.product = res.plain();
                $scope.img.name = $scope.product.img;

                $scope.product.attributes.forEach(function(val) {
                   $scope.product[val.name] = val.value;
                });
            });

        /* Gets list of manufacturers for selector */
        ManufacturerManager
            .get()
            .then(function(res) {
                $scope.manufacturers = res.plain();
            });

        /* Gets list of categories for selector */
        CategoryManager
            .get()
            .then(function(res) {
                $scope.categories = res.plain();
            });

        /* Updates product */
        $scope.update = function(isValid) {
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
                .update(fd)
                .then(function() {
                    toastr.success('The product was successfully updated.');
                    $state.go('products.admin-list');
                });
        };

        $scope.removeImg = function() {
            delete $scope.img;
        };


        $scope.$watch('product', function() {
            $scope.isSubmited = false;
        }, true);
    }

})();