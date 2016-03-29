/**
 * @author Dmitriy Biletskiy
 */
(function() {
    'use strict';

    angular
        .module('product.module')
        .service('ProductOrderManager', ProductOrderManager);

    function ProductOrderManager(Restangular) {
        
        return {

            // --------------------------------------------------
            // Get ----------------------------------------------
            // --------------------------------------------------


            /**
             * Gets list of products from the recently purchased orders
             *
             * @param {object} params
             * @returns {promise}
             */
            get: function(params) {
                return Restangular
                    .one('product')
                    .one('order')
                    .customGET('', params);
            },

            /**
             * Gets collection of the products by order
             *
             * @param {integer} orderId - order id
             * @param {object} params
             * @returns {promise}
             */
            getList: function(orderId, params) {
                return Restangular
                    .one('product')
                    .one('order', orderId)
                    .customGET('', params);
            },

            /**
             * Get list of orders by product
             *
             * @param {integer} productId - product id
             * @returns {promise}
             */
            getOrdersByProduct: function(productId) {
                return Restangular
                    .one('product', productId)
                    .one('order')
                    .get();
            },


            // --------------------------------------------------
            // Add ----------------------------------------------
            // --------------------------------------------------

            /**
             * Adds product into the shopping cart
             *
             * @param {integer} productId - product id
             * @param {integer} orderId - order id
             * @param {integer} quantity - quantity of the products which user wants to add
             * @param {integer} price - product price
             * @returns {promise}
             */
            addProduct: function(productId, orderId, quantity, price) {
                return Restangular
                    .all('product/order')
                    .post({
                        order: orderId,
                        product: productId,
                        quantity: quantity,
                        price: price
                    });
            },

            /**
             * Adds pack of products into the order
             *
             * @param {integer} orderId - order id
             * @param {array} products
             * @returns {promise}
             */
            addProducts: function(orderId, products) {
                return Restangular
                    .all('/product/order/pack')
                    .post({
                        order: orderId,
                        products: products
                    });
            },

            /**
             * Adds products from the selected list
             *
             * @param {integer} orderId - order id
             * @param {integer} draftId - draft id
             * @returns {promise}
             */
            addProductsList: function(orderId, draftId) {
                return Restangular
                    .one('product')
                    .one('order', orderId)
                    .one('draft', draftId)
                    .put();
            },

            /**
             * Add/remove product into/from lists
             *
             * @param {array} orders ids
             * @param {integer} product id
             */
            addProductInLists: function(orders, product) {
                return Restangular
                    .all('product/order/multiple')
                    .post({ orders: orders, product: product });
            },


            // --------------------------------------------------
            // Remove -------------------------------------------
            // --------------------------------------------------

            /**
             * Removes product from the order
             *
             * @param {integer} productId - product id
             * @param {integer} orderId - order id
             * @returns {promise}
             */
            removeProduct: function(productId, orderId) {
                return Restangular
                    .one('product', productId)
                    .one('order', orderId)
                    .remove();
            },

            /**
             * Removes all products from the order
             *
             * @param {integer} orderId - order id
             * @returns {promise}
             */
            removeAllProducts: function(orderId) {
                return Restangular
                    .one('product')
                    .one('order', orderId)
                    .remove();
            },


            // --------------------------------------------------
            // Update -------------------------------------------
            // --------------------------------------------------

            /**
             * Updates a product order
             *
             * @param {integer} orderId
             * @param {integer} newOrderId
             * @returns {promise}
             */
            updateProductOrder: function(orderId, newOrderId) {
                return Restangular
                    .one('product')
                    .one('order', orderId)
                    .one('new-order', newOrderId)
                    .put();
            },

            /**
             * Updates pack of products into the order
             *
             * @param {integer} orderId - order id
             * @param {array} products
             * @returns {promise}
             */
            updateProducts: function(orderId, products) {
                return Restangular
                    .all('/product/order/pack/update')
                    .post({
                        order: orderId,
                        products: products
                    });
            },

            /**
             * Changes quantity of the given product in the some order
             *
             * @param {integer} productId - product id
             * @param {integer} orderId - order id
             * @param {integer} quantity - quantity of the products which user wants to set
             * @returns {promise}
             */
            changeProductQuantity: function(productId, orderId, quantity) {
                return Restangular
                    .one('product')
                    .one('order', orderId)
                    .put({ product: productId, quantity: quantity });
            }

        };

    }

})();