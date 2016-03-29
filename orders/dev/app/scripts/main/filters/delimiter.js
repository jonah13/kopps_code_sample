/**
 * @author Dmitriy Biletskiy
 */
(function() {
    'use strict';

    angular
        .module('main.module')
        .filter('delimiter', function() {
            return function(arr) {
                var str;

                if (arr.length > 1) {
                    str = arr.map(function (val) {
                        return val.name;
                    }).join(', ');
                } else if (!arr.length){
                    str = '';
                } else {
                    str = arr[0].name;
                }

                return str;
            };
        });

})();