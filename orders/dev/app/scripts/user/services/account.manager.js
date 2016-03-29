/**
 * @author Dmitriy Biletskiy
 */
(function() {
    'use strict';

    angular
        .module('user.module')
        .service('AccountManager', AccountManager);

    function AccountManager(Restangular) {

        return {

            /**
             * Gets accounts list
             *
             * @returns {promise}
             */
            get: function(params) {
                return Restangular
                    .one('accounts')
                    .customGET('', params || {});
            },

            /**
             * Gets one account
             *
             * @param id
             * @returns {*}
             */
            getOne: function(id) {
                return Restangular
                    .one('accounts', id)
                    .get();
            },

            /**
             * Creates a new account and related locations
             *
             * @param {object} account
             * @returns {promise}
             */
            add: function(account) {
                return Restangular
                    .all('accounts')
                    .post(account);
            },

            /**
             * Updates selected account
             *
             * @param {object} account
             * @param {array} locations
             * @returns {promise}
             */
            update: function(account, locations) {
                return Restangular
                    .all('accounts/update')
                    .post({ account: account, locations: locations });
            },

            /**
             * Removes the account
             *
             * @param {integer} accountId - account id
             * @returns {promise}
             */
            remove: function(accountId) {
                return Restangular
                    .one('accounts', accountId)
                    .remove();
            }
        };
    }

})();