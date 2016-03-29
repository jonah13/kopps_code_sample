/**
 * @author Dmitriy Biletskiy
 */
(function() {
    'use strict';

    angular
        .module('product.module')
        .service('ProductService', ProductService);

    function ProductService() {

        return {

            /**
             * Determines sum price of the products in the given list
             *
             * @param {array} products
             * @returns {integer}
             */
            getSumPrice: function(products) {
                return (products) ? products.reduce(getSumPrice, 0) : 0;
            },

            /**
             * Determines sum amount of the products in the given list
             *
             * @param {array} products
             * @returns {integer}
             */
            getSumAmount: function(products) {
                return (products) ? products.reduce(getSumAmount, 0) : 0;
            },

            /**
             * Gets list of changed products
             *
             * @param {object} products
             */
            getChangedProducts: function(products) {
                return _.map(products, getChangedProducts);
            },

            /**
             * Gets string by given field of object
             * @param {object} products
             * @param {string} field
             * @returns {string}
             */
            getStringChangedProducts: function(products, field) {
                var str = _.map(products, function(val, key) {
                    if (val[field]) return key;
                }).toString();

                // checks if array was not empty
                if (str !== ',') return str;
            }
        };


        function getSumPrice(sum, current) {
            return sum + current.price * parseInt(current.quantity);
        }

        function getSumAmount(sum, current) {
            return sum + parseInt(current.quantity);
        }

        function getChangedProducts(val, key) {
            return {
                product_id: key,
                hidden: val.hidden,
                hidden_custom_price: val.hidden_custom_price,
                custom_price: val.custom_price
            };
        }
    }

})();