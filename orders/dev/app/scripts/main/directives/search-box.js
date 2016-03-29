(function() {
    'use strict';

    angular
        .module('user.module')
        .directive('searchBox', searchBox)
        .controller('SearchBoxController', SearchBoxController);

    /**
     * Search box on the dashboard page
     */
    function searchBox() {
        return {
            scope: {},
            restrict: 'E',
            replace: true,
            templateUrl: 'views/main/search-box.html',
            controller: 'SearchBoxController'
        };
    }

    function SearchBoxController($scope, $state) {
        $scope.filters = {};

        /**
         * Opens search page if user clicks on the enter button
         */
        $scope.search = function() {
            $state.go('main.search', $scope.filters);
        };
    }

})();