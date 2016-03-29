(function() {
    'use strict';

    angular
        .module('main.module')
        .directive('buttonLoading', buttonLoading);

    function buttonLoading() {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'views/main/button-loading.html',
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
