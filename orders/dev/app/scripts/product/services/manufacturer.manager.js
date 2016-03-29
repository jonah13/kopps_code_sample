/**
 * @author Dmitriy Biletskiy
 */
(function() {
    'use strict';

    angular
        .module('product.module')
        .service('ManufacturerManager', ManufacturerManager);

    function ManufacturerManager(Restangular) {

        return {

            /**
             * Gets manufacturers list
             *
             * @returns {promise}
             */
            get: function(params) {
                return Restangular
                    .one('manufacturers')
                    .customGET('', params);
            },

            /**
             * Creates a new manufacturer
             *
             * @param {object} manufacturer
             * @returns {promise}
             */
            add: function(manufacturer) {
                return Restangular
                    .all('manufacturers')
                    .post(manufacturer);
            },

            /**
             * Updates selected manufacturer
             *
             * @param {object} manufacturer
             * @returns {promise}
             */
            update: function(manufacturer) {
                return Restangular
                    .one('manufacturers', manufacturer.id)
                    .put(manufacturer);
            },

            /**
             * Removes the manufacturer
             *
             * @param {integer} manufacturerId - manufacturers id
             * @returns {promise}
             */
            remove: function(manufacturerId) {
                return Restangular
                    .one('manufacturers', manufacturerId)
                    .remove();
            }
        };
    }

})();