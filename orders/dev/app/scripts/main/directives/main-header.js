/**
 * @author Dmitriy Biletskiy
 */
(function() {
    'use strict';

    angular
        .module('main.module')
        .directive('mainHeader', mainHeader)
        .controller('MainHeaderController', MainHeaderController);

    /**
     * @ngInject
     */
    function mainHeader() {
        return {
            scope: {},
            restrict: 'E',
            controller: 'MainHeaderController',
            templateUrl: 'views/main/main-header.html'
        };
    }

    /**
     * @ngInject
     */
    function MainHeaderController($scope, $state, AuthService, EventDispatcher) {

        $scope.auth = AuthService;

        $scope.search = function(query) {
          $state.go('main.search', { substr: query });
        };

        $scope.logout = function() {
            EventDispatcher.dispatch('LOGOUT');
        };
    }

})();