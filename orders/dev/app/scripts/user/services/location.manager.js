/**
 * @author Dmitriy Biletskiy
 */
(function() {
    'use strict';

    angular
        .module('user.module')
        .service('LocationManager', LocationManager);

    function LocationManager(Restangular) {

        return {

            /**
             * Get list of locations
             *
             * @param {object} params
             * @returns {promise}
             */
            get: function(params) {
                return Restangular
                    .one('locations')
                    .customGET('', params);
            },

            /**
             * Get list of locations which related to an account
             *
             * $param {integer} accountId
             * @param {object} params
             * @returns {promise}
             */
            getByAccount: function(accountId, params) {
                return Restangular
                    .one('locations')
                    .one('account', accountId)
                    .customGET('', params);
            },

            /**
             * Create a new location
             *
             * @param {object} location
             * @returns {promise}
             */
            add: function(location) {
                return Restangular
                    .all('locations')
                    .post(location);
            },

            /**
             * Update selected location
             *
             * @param {object} location
             * @returns {promise}
             */
            update: function(location) {
                return Restangular
                    .one('locations', location.id)
                    .put(location);
            },

            /**
             * Check if location is used
             *
             * @param {integer} locationId - location id
             * @returns {*}
             */
            checkIfUsed: function(locationId) {
                return Restangular
                    .one('locations', locationId)
                    .one('check')
                    .get();
            },

            /**
             * Remove the location
             *
             * @param {integer} id
             * @returns {*}
             */
            remove: function(id) {
                return Restangular
                    .one('locations', id)
                    .remove();
            }
        };

    }

})();