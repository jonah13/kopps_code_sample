/**
 * @author Dmitriy Biletskiy
 */
(function() {
    'use strict';

    angular
        .module('product.module', ['ui.router'])
        .config(configStates);

    function configStates($stateProvider) {

        var states = [
            {
                name: 'products',
                url: '/products',
                templateUrl: 'views/main/layout.html',
                abstract: true
            },
            {
                name: 'products.index',
                url: '/catalog',
                controller: 'ProductIndexController',
                templateUrl: 'views/product/product/product-index.html',
                params: {
                    customPrice: undefined,
                    categoryId: undefined
                },
                pagination: true
            },
            {
                name: 'products.show',
                url: '/show/:productId',
                controller: 'ProductShowController',
                templateUrl: 'views/product/product/product-show.html'
            },
            {
                name: 'products.create',
                url: '/create',
                controller: 'ProductCreateController',
                templateUrl: 'views/product/product/product-create.html',
                role: ['admin', 'superadmin']
            },
            {
                name: 'products.edit',
                url: '/edit/:productId',
                controller: 'ProductEditController',
                templateUrl: 'views/product/product/product-edit.html',
                role: ['admin', 'superadmin']
            },
            {
                name: 'products.admin-list',
                url: '/list',
                controller: 'ProductAdminListController',
                templateUrl: 'views/product/product/product-admin-list.html',
                pagination: true,
                role: ['admin', 'superadmin']
            },
            {
                name: 'products.custom-items',
                url: '/custom-items',
                controller: 'CustomItemsController',
                templateUrl: 'views/product/custom-items.html',
                role: ['admin', 'superadmin']
            },
            {
                name: 'products.custom-items-by-account',
                url: '/custom-items/:accountId',
                controller: 'CustomItemsByAccountController',
                templateUrl: 'views/product/custom-items-by-account.html',
                role: ['admin', 'superadmin']
            },
            {
                name: 'pricing-template',
                url: '/pricing',
                templateUrl: 'views/main/layout.html',
                abstract: true
            },
            {
                name: 'pricing-template.index',
                url: '/list',
                controller: 'PricingTemplateIndexController',
                templateUrl: 'views/product/pricing-template/pricing-template-index.html',
                pagination: true,
                role: ['admin', 'superadmin']
            },
            {
                name: 'pricing-template.edit',
                url: '/edit/:templateId',
                controller: 'PricingTemplateEditController',
                templateUrl: 'views/product/pricing-template/pricing-template-edit.html',
                role: ['admin', 'superadmin']
            },
            {
                name: 'pricing-template.create',
                url: '/create',
                controller: 'PricingTemplateCreateController',
                templateUrl: 'views/product/pricing-template/pricing-template-create.html',
                role: ['admin', 'superadmin']

            },
            {
                name: 'category',
                url: '/category',
                templateUrl: 'views/main/layout.html',
                abstract: true
            },
            {
                name: 'category.main',
                controller: 'CategoryMainCtrl',
                template: '<ui-view>',
                abstract: true
            },
            {
                name: 'category.index',
                url: '/list',
                controller: 'CategoryIndexController',
                templateUrl: 'views/product/category/category-index.html',
                pagination: true,
                role: ['admin', 'superadmin']
            },
            {
                name: 'category.main.create',
                url: '/create',
                controller: 'CategoryCreateController',
                templateUrl: 'views/product/category/category-create.html',
                role: ['admin', 'superadmin']
            },
            {
                name: 'category.main.edit',
                url: '/edit/:categoryId',
                controller: 'CategoryEditController',
                templateUrl: 'views/product/category/category-edit.html',
                role: ['admin', 'superadmin']
            },
            {
                name: 'manufacturer',
                url: '/manufacturer',
                templateUrl: 'views/main/layout.html',
                abstract: true
            },
            {
                name: 'manufacturer.index',
                url: '/list',
                controller: 'ManufacturerController',
                templateUrl: 'views/product/manufacturer.html',
                pagination: true,
                role: ['admin', 'superadmin']
            }
        ];

        states.forEach(function (state) {
            // For each state in this module we should be authorized
            angular.extend(state, { authenticate: true });

            $stateProvider.state(state);
        });
    }

})();
