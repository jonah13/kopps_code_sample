/**
 * @author Dmitriy Biletskiy
 */
(function(){
    'use strict';

    angular
        .module('main.module')
        .factory('AuthService', AuthService);

    function AuthService (
        $q,
        Restangular,
        LocalSecureStorage,
        UserManager,
        EventDispatcher
    ) {

        if (LocalSecureStorage.get('session_token') && !LocalSecureStorage.get('current_user')) setUser();

        function setUser() {
            var deferred = $q.defer();

            UserManager.getUser().then(function(res) {
                LocalSecureStorage.put('current_user', angular.toJson(res.plain()));
                EventDispatcher.dispatch('GET_SHOPPING_CART');
                deferred.resolve(res);
            });

            return deferred.promise;
        }

        return {

            /**
             * Authenticates user and saves token
             *
             * @param  {Object}   user - login info
             * @return {Promise}
             */
            login: function(user) {

                var deferred = $q.defer();

                Restangular
                    .all('authenticate')
                    .post(user)
                    .then(
                        function(res) {
                            LocalSecureStorage.put('session_token', res.token);
                            deferred.resolve(setUser());
                        }, function(err) {
                            deferred.reject(err);
                });

                return deferred.promise;
            },

            /**
             * Removes access token and user info
             */
            logout: function() {
                LocalSecureStorage.remove('session_token');
                LocalSecureStorage.remove('current_user');
            },

            /**
             * Gets all available info on authenticated user
             *
             * @return {Object} user
             */
            getCurrentUser: function() {
                return angular.fromJson(LocalSecureStorage.get('current_user')) || {};
            },

            /**
             * Gets role of authenticated user
             *
             * @return {string} user
             */
            getRole: function() {
                return this.getCurrentUser().type;
            },

            /**
             * Checks if the logged in user is customer
             *
             * @returns {boolean}
             */
            isCustomer: function() {
                return !!~['customer', 'corporate_user'].indexOf(this.getRole());
            },

            /**
             * Checks if the logged in user is system admin
             *
             * @returns {boolean}
             */
            isAdmin: function() {
                return !!~['admin', 'superadmin'].indexOf(this.getRole());
            },

            /**
             * Checks if a user is not logged in
             *
             * @return {boolean}
             */
            isNotLoggedIn: function(authorized) {
                return (authorized) ? (!LocalSecureStorage.has('session_token') && !LocalSecureStorage.has('current_user')) : false;
            },

            /**
             * Checks if user has not permission on page
             *
             * @returns {boolean}
             */
            isNotPermitted: function(role) {
                if (_.isArray(role))
                    return (LocalSecureStorage.has('current_user') && role) ? !~role.indexOf(this.getRole()) : false;
                else
                    return (LocalSecureStorage.has('current_user') && role) ? this.getRole() !== role : false;
            },

            /**
             * Gets auth token
             */
            getToken: function () {
                return LocalSecureStorage.get('session_token');
            }

        };
    }

})();