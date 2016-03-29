/**
 * @author Dmitriy Biletskiy
 */
(function() {
    'use strict';

    angular
        .module('main.module')
        .service('AuthInterceptor', AuthInterceptor);

    function AuthInterceptor($q, LocalSecureStorage, EventDispatcher) {

        return {

            /**
             * Add authorization token
             */
            request: function (config) {

                config.headers = config.headers || {};
                var token = LocalSecureStorage.get('session_token');

                if (token)
                    config.headers.Authorization = 'Bearer {' + token + '}';

                return config;
            },

            /**
             * Intercept 401s and redirect you to login page
             */
            responseError: function (res) {
                if (res.status === 401) {
                    EventDispatcher.dispatch('LOGOUT');
                    return $q.reject(res);
                }
                return $q.reject(res);
            }
        };
    }

})();