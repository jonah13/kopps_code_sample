/**
 * @author Dmitriy Biletskiy
 */
(function() {
    'use strict';

    /**
     * Gets order's owner name
     */
    angular
        .module('main.module')
        .filter('getOwner', function(AuthService) {

            var user = AuthService.getCurrentUser();

            return function(userName) {
                return (user.first_name === userName) ? 'You' : userName;
            };
        });

})();