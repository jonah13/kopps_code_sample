/**
 * @author Dmitriy Biletskiy
 */
(function() {
    'use strict';

    angular
        .module('product.module')
        .directive('getCategoriesAttrs', getCategoriesAttrs)
        .controller('GetCategoriesAttrsController', GetCategoriesAttrsController);

    function getCategoriesAttrs() {
        return {
            restrict: 'A',
            require: '?ngModel',
            controller: 'GetCategoriesAttrsController'
        };
    }

    function GetCategoriesAttrsController($scope, CategoryManager) {

        $scope.$watch('$select.ngModel.$modelValue', getCategory);

        function getCategory(categoryId) {
            if (categoryId) {
                CategoryManager
                    .getOne(categoryId)
                    .then(function(res) {
                        $scope.$parent.product.attributes = [];

                        res.plain().attributes.map(function(val) {
                            var attr = val;

                            if (attr.select_values)
                                _.extend(attr, { select_values: attr.select_values.split(',') });

                            return attr;
                        });

                        $scope.$parent.categoryAttrs = res.plain().attributes;
                    });
            }
        }
    }

})();