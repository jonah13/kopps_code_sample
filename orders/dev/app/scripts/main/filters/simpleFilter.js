/**
 * @author Dmitriy Biletskiy
 */
(function() {
    'use strict';

    angular
        .module('product.module')
        .filter('simpleFilter', function() {
            return function(items, subst) {
                if (_.isArray(items)) {
                    return items.filter(function(val) {
                        return ~val.indexOf(subst);
                    });
                }

                return [];
            };
        });

})();