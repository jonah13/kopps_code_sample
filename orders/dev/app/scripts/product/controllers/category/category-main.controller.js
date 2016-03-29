(function() {
    'use strict';

    /**
     * Parent category controller for handling main functions
     */
    angular
        .module('product.module')
        .controller('CategoryMainCtrl', CategoryMainCtrl);

        function CategoryMainCtrl($scope) {
            $scope.forms = [];
            $scope.category = { attributes: [] };

            /**
             * Adds new attribute to the queue
             */
            $scope.addAttribute = function() {
                $scope.category.attributes.push({});
            };

            /**
             * Removes given attribute from the queue
             *
             * @param {integer} index
             */
            $scope.removeAttribute = function(index) {
                $scope.category.attributes.splice(index, 1);
            };

            /**
             * Checks if all custom attribute forms are valid
             *
             * @returns {boolean}
             */
            $scope.check = function() {
                if ($scope.forms.length) {
                    return $scope.forms.reduce(function (sum, current) {
                        return (sum && current);
                    });
                }

                return true;
            };

            // hides all validate notifications
            $scope.$watch('category.attributes', function() {
                $scope.isSubmitted = false;
            }, true);
        }

})();