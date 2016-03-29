(function() {
    'use strict';

    /**
     * Gets full usa state name by the given abbr
     */
    angular
        .module('main.module')
        .filter('fullStateName', function(usStateList) {
            return function(stateAbbr) {
                var state = usStateList.filter(function(state) {
                    return state.value === stateAbbr;
                })[0];

                return state.name;
            };
        });

})();