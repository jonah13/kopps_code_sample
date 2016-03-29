/**
 * @author Dmitriy Biletskiy
 */
(function() {
    'use strict';

    angular
        .module('product.module')
        .service('ProductManager', ProductManager);

    function ProductManager(Restangular) {

        return {

            /**
             * Adds new product
             *
             * @param product
             */
            add: function(product) {
                return Restangular.all('products')
                    .withHttpConfig({ transformRequest: angular.identity })
                    .customPOST(product, '', '', { 'Content-Type': undefined });
            },

            /**
             * Update an exist product
             *
             * @param product
             */
            update: function(product) {
                return Restangular.all('products/update')
                    .withHttpConfig({ transformRequest: angular.identity })
                    .customPOST(product, '', '', { 'Content-Type': undefined });
            },

            /**
             * Gets all products
             *
             * @returns {promise} pagination/data
             */
            get: function(params) {
                return Restangular
                    .one('products')
                    .customGET('', params);
            },

            /**
             * Gets list of products with custom attributes
             *
             * @param {object} params
             * @returns {promise} pagination/data
             */
            getCustomProducts: function(params) {
                return Restangular
                    .one('products')
                    .one('custom')
                    .customGET('', params);
            },

            /**
             * Gets one product with custom attributes
             *
             * @param {object} params
             * @returns {promise} pagination/data
             */
            getOneCustomProduct: function(productId) {
                return Restangular
                    .one('products')
                    .one('custom-one', productId)
                    .get();
            },

            /**
             * Gets one product
             *
             * @param {integer} productId - product id
             * @retruns {promise}
             */
            getOneProduct: function(productId) {
                return Restangular
                    .one('products', productId)
                    .get();
            },

            /**
             * Search products by substring
             *
             * @param {string} substr
             * @returns {promise}
             */
            search: function(substr) {
                return Restangular
                    .one('products')
                    .one('search', substr)
                    .get();
            },

            /**
             * Removes product
             *
             * @param {integer} productId - product id
             * @returns {promise}
             */
            remove: function(productId) {
                return Restangular
                    .one('products', productId)
                    .remove();
            }
        };

    }
})();