(function() {
    'use strict';

    /**
     * Clones given model and puts into isolate scope.
     */
    angular
        .module('main.module')
        .directive('isolateModel', isolateModel);

        function isolateModel($parse) {
            return {
                scope: true,
                link: function (scope, element, attrs) {

                    var modelName = attrs.isolateModel;

                    scope.$parent.$watch(modelName, function(newValue, oldValue) {
                        if (newValue === oldValue) return;
                        scope[modelName] = angular.copy(newValue);
                    });

                    scope[modelName] = angular.copy($parse(modelName)(scope));
                }
            };
        }

})();