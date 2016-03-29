(function() {
    'use strict';

    /**
     * This is a wrapper for the session storage - stores values in session storage encrypted.
     */
    angular
        .module('main.module')
        .factory('SessionSecureStorage', SessionSecureStorage);


        function SessionSecureStorage(SecureStorageManager) {

            return {

                /**
                 * Puts a new value to the session storage.
                 *
                 * @param {string} key
                 * @param {string} value
                 */
                put: function (key, value) {
                    SecureStorageManager.add(window.sessionStorage, key, value);
                },

                /**
                 * Removes a value with a given key from the session storage.
                 *
                 * @param {string} key
                 */
                remove: function (key) {
                    SecureStorageManager.remove(window.sessionStorage, key);
                },

                /**
                 * Gets a value with a given key from the session storage.
                 *
                 * @param {string} key
                 * @returns {string}
                 */
                get: function (key) {
                    return SecureStorageManager.get(window.sessionStorage, key);
                },

                /**
                 * Check if value is present with a given key from the local storage.
                 *
                 * @param {string} key
                 * @returns {string}
                 */
                has: function (key) {
                    return !!this.get(key);
                }

            };

        }

})();