/**
 * @author Dmitriy Biletskiy
 */
(function() {
    'use strict';

    angular
        .module('main.module')
        .directive('customScroll', customScroll);

    /**
     * @ngInject
     */
    function customScroll($document) {
        return {
            scope: {
                onStart: '&',
                onFinish: '&'
            },
            restrict: 'A',
            link: function(scope, elem, attrs) {
                elem.bind('click', function() {
                    if (scope.onStart)
                        scope.onStart();

                    setTimeout(function() {
                        $document.scrollTo(angular.element('#' + attrs.customScroll)[0], null, 500);

                        if (scope.onFinish)
                            scope.onFinish();
                    }, 200);
                });
            }
        };
    }

})();