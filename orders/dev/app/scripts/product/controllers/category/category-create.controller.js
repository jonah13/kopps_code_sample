/**
 * @author Dmitriy Biletskiy
 */
(function() {
    'use strict';

    angular
        .module('product.module')
        .controller('CategoryCreateController', CategoryCreateController);

    function CategoryCreateController($scope, $state, CategoryManager, toastr) {

        /**
         * Creates a new category
         */
        $scope.save = function(isValid) {
            $scope.isSubmitted = true;

            if (!$scope.check() || !isValid) {
                toastr.warning('Seems something went wrong, please check the form again.');
                return;
            }

            CategoryManager
                .save($scope.category)
                .then(function() {
                    toastr.success('Category was saved.');
                    $state.go('category.index');
                });
        };
    }

})();