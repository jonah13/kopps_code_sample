(function() {
    'use strict';

    angular
        .module('main.module')
        .directive('loading', isolateModel);

    function isolateModel() {
        return {
            restrict: 'E',
            replace: true,
            template: '<div class=\'loader\'>Loading...</div>',
            link: function(scope, elem) {

                scope.$watch('inProgress', function(inProgress) {
                    if (inProgress)
                        elem.show();
                    else
                        elem.hide();
                });
            }
        };
    }

})();