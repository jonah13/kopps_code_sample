/**
 * @author Dmitriy Biletskiy
 */
(function() {
    'use strict';

    /**
     * Applies given filter on the string
     */
    angular
        .module('main.module')
        .filter('applyFilter', function($filter) {
            return function(str, filter) {
                return $filter(filter.name)(str, filter.param);
            };
        });

})();