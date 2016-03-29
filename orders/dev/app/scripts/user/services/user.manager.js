/**
 * @author Dmitriy Biletskiy
 */
(function() {
    'use strict';

    angular
        .module('user.module')
        .service('UserManager', UserManager);

    function UserManager(Restangular, userFields) {

        // validation before saving
        function validate(user) {
            var validatedUser = _.pick(user, userFields[user.type]);

            return _.isEmpty(validatedUser) ? user : validatedUser;
        }

        return {

            /**
             * Gets an authorized user by token in the headers
             *
             * @returns {promise}
             */
            getUser: function() {
                return Restangular
                    .one('get-authorized')
                    .get();
            },

            /**
             * Gets a list of customers/corporate users
             *
             * @returns {promise}
             */
            get: function(params) {
                return Restangular
                    .one('users')
                    .customGET('', params);
            },

            /**
             * Gets one user
             *
             * @param {integer} userId - user id
             * @returns {promise}
             */
            getOne: function(userId) {
                return Restangular
                    .one('users', userId)
                    .get();
            },

            /**
             * Gets a list of users who has submitted order
             *
             * @param {integer} locationId
             */
            getCustomers: function(locationId) {
                return Restangular
                    .one('users')
                    .one('get-customers')
                    .one('location', locationId || 'NaN')
                    .get();
            },

            /**
             * Restores users password
             *
             * @param {string} email
             * @returns {promise}
             */
            restorePassword: function(email) {
                return Restangular
                    .one('restore-password', email)
                    .get();
            },

            /**
             * Creates a new user account
             *
             * @param {object} user
             */
            add: function(user) {
                return Restangular
                    .all('users')
                    .post(validate(user));
            },

            /**
             * Updates an exist user account
             *
             * @param {object} user
             */
            update: function(user) {
                return Restangular
                    .one('users', user.id)
                    .put(validate(user));
            },

            /**
             * Removes the user account
             *
             * @param {integer} id
             * @returns {promise}
             */
            remove: function(id) {
                return Restangular
                    .one('users', id)
                    .remove();
            }
        };

    }
})();