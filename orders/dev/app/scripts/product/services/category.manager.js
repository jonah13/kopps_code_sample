/**
 * @author Dmitriy Biletskiy
 */
(function() {
    'use strict';

    angular
        .module('product.module')
        .service('CategoryManager', CategoryManager);

    function CategoryManager(Restangular) {

        return {

            /**
             * Gets a list of categories
             *
             * @param {object} params
             * @returns {promise}
             */
            get: function(params) {
                return Restangular
                    .one('categories')
                    .customGET('', params);
            },

            /**
             * Creates a new category
             *
             * @param {object} category
             * @returns {promise}
             */
            save: function(category) {
                return Restangular
                    .all('categories')
                    .post(category);
            },

            /**
             * Updates an exist ccategory
             *
             * @param {object}category
             * @returns {promise}
             */
            update: function(category) {
                return Restangular
                    .all('categories/update')
                    .post(category);
            },

            /**
             * Gets one category by the given id
             *
             * @param {integer} categoryId
             * @returns {promise}
             */
            getOne: function(categoryId) {
                return Restangular
                    .one('categories', categoryId)
                    .get();
            },

            /**
             * Removes given category
             *
             * @param {integer} categoryId
             * @returns {promise}
             */
            remove: function(categoryId) {
                return Restangular
                    .one('categories', categoryId)
                    .remove();
            }
        };
    }

})();