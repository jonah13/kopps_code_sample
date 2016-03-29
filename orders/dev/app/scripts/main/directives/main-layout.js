/**
 * @author Dmitriy Biletskiy
 */
(function() {
    'use strict';

    angular
        .module('main.module')
        .directive('mainLayout', mainLayout)
        .controller('MainLayoutController', MainLayoutController);

    /**
     * @ngInject
     */
    function mainLayout() {
        return {
            scope: {},
            restrict: 'E',
            controller: 'MainLayoutController',
            templateUrl: 'views/main/main-layout.html'
        };
    }

    /**
     * @ngInject
     */
    function MainLayoutController() {}

})();