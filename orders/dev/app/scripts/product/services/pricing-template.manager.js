/**
 * @author Dmitriy Biletskiy
 */
(function() {
    'use strict';

    angular
        .module('product.module')
        .service('PricingTemplateManager', PricingTemplateManager);

    function PricingTemplateManager(Restangular) {

        return {

            /**
             * Gets list of pricing templates
             *
             * @param {object} params
             * @returns {promise}
             */
            get: function(params) {
                return Restangular
                    .one('pricing')
                    .customGET('', params);
            },

            /**
             * Removes one pricing template
             *
             * @param {integer} pricingTemplateId - pricing template id
             */
            remove: function(pricingTemplateId) {
                return Restangular
                    .one('pricing', pricingTemplateId)
                    .remove();
            },

            /**
             * Creates new pricing template
             *
             * @param {object} pricingTemplate
             * @param {array} products
             * @returns {promise}
             */
            create: function(pricingTemplate, products) {
                return Restangular
                    .all('pricing')
                    .post({ template: pricingTemplate, products: products });
            },

            /**
             * Updates an exist pricing template
             *
             * @param {object} pricingTemplate
             * @param {array} products
             * @returns {promise}
             */
            update: function(pricingTemplate, products) {
                return Restangular
                    .all('pricing/update')
                    .post({ template: pricingTemplate, products: products });
            },

            /**
             * Gets one pricing template
             *
             * @param {integer} pricingTemplateId - pricing template id
             * @returns {promise}
             */
            getOne: function(pricingTemplateId) {
                return Restangular
                    .one('pricing', pricingTemplateId)
                    .get();
            },

            /**
             * Gets all additions for products
             *
             * @param accountId
             */
            getAllAdditions: function(accountId) {
                return Restangular
                    .one('pricing')
                    .one('account', accountId)
                    .get();
            },

            /**
             * Saves customized items
             *
             * @param {integer} accountId - account id
             * @param {array} products
             * @returns {promise}
             */
            saveCustomItemsBunch: function(accountId, products) {
                return Restangular
                    .all('custom-items')
                    .post({ account: accountId, products: products });
            }
        };
    }

})();