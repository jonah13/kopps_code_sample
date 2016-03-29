/**
 * @author Dmitriy Biletskiy
 */
(function() {
    'use strict';

    angular
        .module('main.module')
        .directive('customTable', customTable)
        .controller('CustomTableController', CustomTableController);

    /**
     * @ngInject
     */
    function customTable() {
        return {
            scope: {
                content: '=',
                tableName: '@',
                action1: '&',
                action2: '&',
                action3: '&',
                getContent: '&'
            },
            restrict: 'E',
            controller: 'CustomTableController',
            templateUrl: 'views/main/custom-table.html'
        };
    }

    /**
     * @ngInject
     */
    function CustomTableController($scope, $state, tablesData) {
        $scope.untouched = true;
        $scope.table = tablesData[$scope.tableName];
        $scope.sorting = {};
        $scope.localSorting = {};

        var fields = $scope.table.fields.map(function(val) {
            return val.propertyName;
        });

        $scope.action = function(num, param) {
            var method = 'action' + num;
            $scope[method](param);
        };

        /**
         * Redirects to given state
         */
        $scope.redirect = function(index, id, type) {
            var redirect = $scope.table[type][index].redirect,
                params = {};

            if (redirect) {
                params[redirect.param] = id;
                $state.go(redirect.name, params);
            }
        };

        /**
         * Sorts table by selected field
         */
        $scope.sort = function(field) {
            $scope.sorting.column = field;
            $scope.sorting.sort = !$scope.sorting.sort;

            if ($scope.table.backendSorting === false) {
                angular.copy($scope.sorting, $scope.localSorting);
            } else if ($scope.table.backendSorting) {
                var sorting = {
                    column: field,
                    sort: ($scope.sorting.sort) ? 'desc' : 'asc'
                };
                $scope.getContent({ params: sorting });
            }
        };

        /**
         * Determines css class of each sort icon
         * @param {string} field
         * @returns {string}
         */
        $scope.getClass = function(field) {
            if (field === $scope.sorting.column && $scope.sorting.sort)
                return 'desc';
            else if (field === $scope.sorting.column && !$scope.sorting.sort)
                return 'asc';
            else
                return 'disabled';
        };

        $scope.$watch('content', function(newVal) {
            if (newVal) {
                $scope.tableContent = $scope.content.map(function(val) {
                    return { table: _.pick(val, fields), id: val.id };
                });

                $scope.untouched = false;
            }
        });
    }

})();
