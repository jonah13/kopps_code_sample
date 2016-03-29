/**
 * @author Dmitriy Biletskiy
 */
(function() {
    'use strict';

    angular
        .module('main.module')
        .filter('orderId', function() {
            return function(orderId) {
                if (orderId)
                    return new Array(8 - orderId.toString().length).join('0') + orderId;
                else
                    return '';
            };
        });

})();