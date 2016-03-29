(function() {
    'use strict';

    /**
     * Manages the data of the storage safely.
     */
    angular
        .module('main.module')
        .factory('SecureStorageManager', SecureStorageManager);

        function SecureStorageManager() {

            var CryptoKey = CryptoJS.MD5(navigator.userAgent + navigator.appVersion).toString();

            return {

                /**
                 * Adds a new value with a given key to the provided storage.
                 *
                 * @param {Storage} storage
                 * @param {string} key
                 * @param {string} value
                 */
                add: function (storage, key, value) {

                    var encryptedValue = CryptoJS.AES.encrypt(value.toString(), CryptoKey).toString();
                    storage.setItem(key, encryptedValue);
                },

                /**
                 * Removes a value with the given key from the provided storage.
                 *
                 * @param {Storage} storage
                 * @param {string} key
                 */
                remove: function (storage, key) {
                    storage.removeItem(key);
                },

                /**
                 * Gets a value with the given from the provided storage.
                 *
                 * @param {Storage} storage
                 * @param {string} key
                 * @returns {string}
                 */
                get: function (storage, key) {
                    var encryptedValue = storage.getItem(key);

                    try {
                        if (typeof encryptedValue !== 'undefined')
                            return CryptoJS.AES.decrypt(encryptedValue, CryptoKey)
                                .toString(CryptoJS.enc.Utf8);
                    } catch (e) { /* ignore it */ }

                    return null;
                }

            };
        }

})();