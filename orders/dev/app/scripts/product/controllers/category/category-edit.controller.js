/**
 * @author Dmitriy Biletskiy
 */
(function() {
    'use strict';

    angular
        .module('product.module')
        .controller('CategoryEditController', CategoryEditController);

    function CategoryEditController($scope, $state, $stateParams, CategoryManager, toastr) {

        $scope.update = function(isValid) {
            $scope.isSubmitted = true;

            if (!$scope.check() || !isValid) {
                toastr.warning('Seems something went wrong, please check the form again.');
                return;
            }

            CategoryManager
                .update($scope.category)
                .then(function() {
                    toastr.success('Category was updated.');
                    $state.go('category.index');
                });
        };

        CategoryManager
            .getOne($stateParams.categoryId)
            .then(function(res) {
                _.extend($scope.category, res.plain());
            });

        // hides all validate notifications
        $scope.$watch('category.attributes', function() {
            $scope.isSubmitted = false;
        }, true);
    }

})();



