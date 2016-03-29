/**
 * @author Dmitriy Biletskiy
 */
(function() {
    'use strict';

    angular
        .module('product.module')
        .directive('customAttributeForm', customAttributeForm)
        .controller('СustomAttributeFormController', СustomAttributeFormController);

    /**
     * @ngInject
     */
    function customAttributeForm() {
        return {
            scope: {
                attribute: '=',
                formToValidate: '=',
                attributeIndex: '@',
                isSubmitted: '='
            },
            replace: true,
            restrict: 'E',
            controller: 'СustomAttributeFormController',
            templateUrl: 'views/product/custom-attribute-form.html'
        };
    }

    /**
     * @ngInject
     */
    function СustomAttributeFormController($scope) {

        if (!$scope.attribute.type)
            $scope.attribute.type = 'input';

        // if admin updates category
        if ($scope.attribute.select_values) {
            $scope.attribute.selectValues = $scope.attribute.select_values.split(',');
            delete $scope.attribute.select_values;
        }

        $scope.types = [
            { title: 'Text box',      value: 'input' },
            { title: 'Dropdown list', value: 'select'}
        ];

        /**
         * Adds a validate flag of form to the main controller
         */
        $scope.$watch('categoryAttributeForm.$valid', function(isValid) {
            $scope.formToValidate[$scope.attributeIndex] = isValid;
        });

        /**
         * Removes a validate form flag from from to the main controller
         */
        $scope.$on('$destroy', function() {
            $scope.formToValidate.splice($scope.attributeIndex, 1);
        });

        /**
         * Sets array with select properties depend on attribute type
         */
        $scope.changeType = function() {
            $scope.attribute.selectValues = ($scope.attribute.type === 'input')
                ? null
                : [''];
        };

        $scope.addField = function() {
            $scope.attribute.selectValues.push('');
        };

        $scope.removeField = function(index) {
            $scope.attribute.selectValues.splice(index, 1);
        };
    }

})();