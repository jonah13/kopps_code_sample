/**
 * @author Dmitriy Biletskiy
 */
(function() {
    'use strict';

    angular
        .module('order.module')
        .service('OrderManager', OrderManager);

    function OrderManager(Restangular) {

        return {

            /**
             * Creates new order
             *
             * @param {object} order - order object
             * @returns {promise}
             */
            save: function(order) {
                return Restangular
                    .all('orders')
                    .post(order);
            },

            /**
             * Updates order fields
             *
             * @param {object} order
             * @returns {promise}
             */
            update: function(order) {
                return Restangular
                    .one('orders', order.id)
                    .put(order);
            },

            /**
             * Updates/removes a pack of orders by the one time
             *
             * @param {array} orders
             * @returns {promise}
             */
            updatePack: function(orders) {
                return Restangular
                    .all('orders/pack')
                    .post(orders);
            },

            /**
             * Removes one order
             *
             * @param {integer} orderId - order id
             */
            remove: function(orderId) {
                return Restangular
                    .one('orders', orderId)
                    .remove();
            },

            /**
             * Gets all orders which relate to the account
             *
             * @param {object} params
             * @returns {promise}
             */
            get: function(params) {
                return Restangular
                    .one('orders')
                    .customGET('', params);
            },

            /**
             * Gets all orders which relate to the account
             *
             * @param {integer} orderId
             * @returns {promise}
             */
            getForAdmin: function(orderId) {
                return Restangular
                    .one('orders', orderId)
                    .one('admin')
                    .get();
            },

            /**
             * Gets one order
             *
             * @param {integer} orderId - order id
             * @returns {promise}
             */
            getOne: function(orderId) {
                return Restangular
                    .one('orders', orderId)
                    .get();
            },

            /**
             * Gets a list of removed products in the order
             *
             * @param orderId
             * @returns {*}
             */
            getRemovedProducts: function(orderId) {
                return Restangular
                    .one('orders', orderId)
                    .one('removed')
                    .get();
            }

        };

    }

})();