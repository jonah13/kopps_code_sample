/**
 * @author Dmitriy Biletskiy
 */
(function() {
    'use strict';

    angular
        .module('order.module')
        .service('FavoriteService', FavoriteService);

    function FavoriteService(OrderManager, ProductOrderManager, toastr) {

        var list = [],
            params = {
                withProducts: true,
                status: 'favorite',
                by: 'user',
                column: 'id',
                sort: 'asc'
            };


        // gets list of the favorite orders
        if (_.isEmpty(list)) getFavorites();

        function getFavorites() {
            OrderManager
                .get(params)
                .then(function(res) {
                    list = res.plain();
                });
        }

        return {

            /**
             * Gets list of available favorite lists
             *
             * @returns {array} list of all favorite lists
             */
            getLists: function() {
                return list || [];
            },

            /**
             * Adds new favorite list
             *
             * @param {string} title
             */
            addList: function(title) {
                OrderManager
                    .save({ name: title, status: 'favorite' })
                    .then(function(res) {
                        list.push(_.extend(res.plain(), { total_amount: 0 }));
                    });
            },

            /**
             * Renames/removes any selected lists
             *
             * @param {array/object} collection with names for removing and object with new names
             */
            renameRemoveList: function(orders) {
                // get changed lists
                var changed = orders.filter(function(order) {
                    return order.changed;
                });

                OrderManager
                    .updatePack(changed)
                    .then(function(res) {
                        list = res.plain();
                    });
            },

            /**
             * Gets length of favorite list
             *
             * @returns {integer}
             */
            getAmountLists: function() {
                return list.length || 0;
            },

            /**
             * Adds some product into favorite list
             *
             * @param {array} orders
             * @param {object} productId
             */
            addProduct: function(orders, productId) {
                orders = orders || [list[0].id]; // if user has only default favorite list
                var orderContain = this.countLists(productId);

                if (this.inList(productId) && list.length === 1) {
                    this.removeProduct(productId, orders);
                } else {
                    ProductOrderManager
                        .addProductInLists(orders, productId)
                        .then(function() {
                            if (list.length === 1) {
                                toastr.success('The product was added to your default favorite list.');
                            } else {
                                if (orderContain <= orders.length) {
                                    toastr.success('The product was added to your favorite list/s.');
                                } else {
                                    toastr.success('The product was removed from your favorite list/s.');
                                }
                            }
                            getFavorites();
                        });
                }
            },

            /**
             * Determines how many orders contain given product
             * @param {integer} productId - product id
             * @returns {integer}
             */
            countLists: function(productId) {
                var products = this.getLists().map(function(val) {
                    return val.products;
                });

                return [].concat.apply([], products).filter(function(val) {
                    return val === productId;
                }).length;
            },

            /**
             * Determines if orders exist given product
             *
             * @param {integer} productId - product id
             * @returns {boolean}
             */
            inList: function(productId) {
                return !!this.countLists(productId);
            },

            /**
             * Removes a product from some list
             *
             * @param {integer} productId - product id
             * @param {integer} orderId of active favorite list
             */
            removeProduct: function(productId, orderId) {
                return ProductOrderManager
                    .removeProduct(productId, orderId)
                    .then(function() {
                        if (list.length === 1) {
                            toastr.success('The product was removed from your default favorite list.');
                        } else {
                            toastr.success('The product was removed from your favorite list/s.');
                        }
                        getFavorites();
                    });
            }
        };
    }

})();