/**
 * @author Dmitriy Biletskiy
 */
(function() {
    'use strict';

    angular
        .module('order.module')
        .service('CartService', CartService);

    function CartService(
        $q,
        ProductOrderManager,
        EventDispatcher,
        AuthService,
        toastr
    ) {

        var list = [],
            inProgress = false,
            order = AuthService.getCurrentUser().orders[0];

        // gets products list if order exists
        if (order) getShoppingCart();

        /* Gets orders by the event */
        EventDispatcher.on('GET_SHOPPING_CART', getShoppingCart);

        function getShoppingCart() {
            if (!AuthService.isCustomer()) return;

            if (order.hasOwnProperty('id')) {
                ProductOrderManager
                    .getList(order.id, {
                        allowPaginate: false,
                        column: 'id',
                        sort: 'asc'
                    })
                    .then(function(res) {
                        list = res.plain();
                    });
            } else {
                order = AuthService.getCurrentUser().orders[0];
                getShoppingCart();
            }
        }

        function softClear() {
            order.po = null;
            order.notes = null;
            list = [];
            getShoppingCart(); // reupdates order object
        }

        return {

            /**
             * Gets shopping cart list
             *
             * @returns {array} list - collection of products
             */
            getList: function() {
                return list || [];
            },

            /**
             * Gets product from the shopping cart by the product id
             *
             * @param {integer} productId - product id
             * @returns {object} Product
             */
            getProductById: function(productId) {
                return list.filter(function(product) {
                    return product.id === productId;
                })[0];
            },

            /**
             *  Adds the product into the shopping cart
             *
             * @param {object} product - Product
             * @param {integer} quantity
             */
            addProduct: function(product, quantity) {
                quantity = parseInt(quantity);

                if (product.removed) return;

                if (!inProgress) {
                    inProgress = true;

                    // if shopping cart already has product, we should update quantity
                    if (this.existInList(product.id)) {
                        quantity = this.getProductById(product.id).quantity + quantity;

                        if (!product.only_one) {
                            this.changeQuantity(product.id, quantity);
                        } else {
                            toastr.warning('You can\'t add more than one item to your cart from this product');
                            inProgress = false;
                        }

                    } else {
                        quantity = (product.only_one) ? 1 : quantity;

                        ProductOrderManager
                            .addProduct(product.id, order.id, quantity, product.price)
                            .then(function() {
                                inProgress = false;
                                list.push(_.extend(product, { quantity: quantity }));
                            });

                    }

                }
            },

            /**
             * Adds list of products to the shopping cart
             *
             * @param {integer} orderId - order id
             */
            addListToCart: function(orderId) {
                var deferred = $q.defer();

                ProductOrderManager
                    .addProductsList(order.id, orderId)
                    .then(function(res) {
                        deferred.resolve(res);
                    }, function(err) {
                        deferred.reject(err);
                    });

                return deferred.promise;
            },

            /**
             * Changes quantity of products in the order
             *
             * @param {integer} productId - product id
             * @param {integer} quantity
             */
            changeQuantity: function(productId, quantity) {
                quantity = parseInt(quantity);

                ProductOrderManager
                    .changeProductQuantity(productId, order.id, quantity)
                    .then(function() {
                        inProgress = false;

                        list.forEach(function(product, key) {
                            if (product.id === productId)
                                list[key].quantity = quantity;
                        });
                    });
            },

            /**
             * Removes product from the shopping cart
             *
             * @param {integer} productId - product id
             */
            removeProduct: function(productId) {
                ProductOrderManager
                    .removeProduct(productId, order.id)
                    .then(function() {

                        list = list.filter(function(elem) {
                            return elem.id !== productId;
                        });
                    });
            },

            /**
             * Removes all products from the shopping cart
             */
            clear: function() {
                ProductOrderManager
                    .removeAllProducts(order.id)
                    .then(function() {
                        list = [];
                        softClear();
                    });
            },

            /**
             * Gets current cart order
             *
             * @retruns {object} Order
             */
            getOrder: function() {
                return order || {};
            },

            /**
             * Checks if shopping cart already contains selected product
             *
             * @param {integer} productId - product id
             * @returns {boolean}
             */
            existInList: function(productId) {
                return !!list.filter(function(product) {
                    return product.id === productId;
                }).length;
            },

            /**
             * Removes all products from current variable
             */
            softClear: softClear

        };
    }

})();