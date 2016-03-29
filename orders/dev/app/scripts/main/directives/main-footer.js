/**
 * @author Dmitriy Biletskiy
 */
(function() {
    'use strict';

    angular
        .module('main.module')
        .directive('mainFooter', mainFooter)
        .controller('MainFooterController', MainFooterController);

    /**
     * @ngInject
     */
    function mainFooter() {
        return {
            scope: {},
            restrict: 'E',
            controller: 'MainFooterController',
            templateUrl: 'views/main/main-footer.html'
        };
    }

    /**
     * @ngInject
     */
    function MainFooterController($scope, $state, PaginationService, EventDispatcher) {

        $scope.perPage = PaginationService.getPerPageValues();
        $scope.pagination = PaginationService.get();

        /* Dispatch an event */
        $scope.change = function() {
            EventDispatcher.dispatch('ON_PAGINATION_CHANGE');
        };

        /* Show pagination on pages where it's needed */
        $scope.isVisible = function() {
            return $state.current.pagination;
        };
    }

})();