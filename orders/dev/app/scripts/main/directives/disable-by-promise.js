(function() {
    'use strict';

    angular
        .module('main.module')
        .directive('disableByPromise', [
            function() {
                return {
                    restrict: 'A',
                    link: function(scope, element, attrs) {

                        // ---------------------------------------------------------------------
                        // Checks and access control
                        // ---------------------------------------------------------------------

                        if (!attrs.disableByPromise && !attrs.promise)
                            throw 'Promise is not set for the disable-by-promise directive';

                        // ---------------------------------------------------------------------
                        // local variables
                        // ---------------------------------------------------------------------

                        var promise = attrs.disableByPromise ? attrs.disableByPromise : attrs.promise;

                        // ---------------------------------------------------------------------
                        // Listeners
                        // ---------------------------------------------------------------------

                        scope.$watch(promise, function (newValue, oldValue) {
                            if (newValue === oldValue || !newValue) return;
                            if (!angular.isFunction(newValue.then) || !angular.isFunction(newValue.finally)) return;

                            element[0].disabled = true;
                            newValue.finally(function() { element[0].disabled = false; });
                        });
                    }
                };
            }
        ]);

})();