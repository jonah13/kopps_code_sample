(function() {
    'use strict';

    angular
        .module('kopp')
        .constant('app_parameters', {

            /* Backend connection url */
            rest_server: 'http://kopps.curotec.net/public/api/'
            //rest_server: 'http://localhost:8000/api/'
        });

})();
