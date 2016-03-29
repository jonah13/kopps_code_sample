(function() {
    'use strict';

    /**
     * This is a wrapper for the local storage - stores values in local storage encrypted.
     */
    angular
        .module('main.module')
        .factory('LocalSecureStorage', LocalSecureStorage);

        function LocalSecureStorage(SecureStorageManager) {

            return {

                /**
                 * Puts a new value to the local storage.
                 *
                 * @param {string} key
                 * @param {string} value
                 */
                put: function (key, value) {
                    SecureStorageManager.add(window.localStorage, key, value);
                },

                /**
                 * Removes a value with a given key from the local storage.
                 *
                 * @param {string} key
                 */
                remove: function (key) {
                    SecureStorageManager.remove(window.localStorage, key);
                },

                /**
                 * Gets a value with a given key from the local storage.
                 *
                 * @param {string} key
                 * @returns {string}
                 */
                get: function (key) {
                    return SecureStorageManager.get(window.localStorage, key);
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