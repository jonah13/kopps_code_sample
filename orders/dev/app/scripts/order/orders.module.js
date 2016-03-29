/**
 * @author Dmitriy Biletskiy
 */
(function() {
    'use strict';

    angular
        .module('order.module', ['ui.router'])
        .config(configStates);

    function configStates($stateProvider) {

        var states = [
            {
                name: 'order',
                url: '/orders',
                abstract: true,
                templateUrl: 'views/main/layout.html'
            },
            {
                name: 'order.cart',
                url: '/cart',
                controller: 'CartController',
                templateUrl: 'views/order/cart.html'
            },
            {
                name: 'order.favorite',
                url: '/favorite',
                controller: 'FavoriteOrdersController',
                templateUrl: 'views/order/favorite-orders.html',
                pagination: true
            },
            {
                name: 'order.favorite-one',
                url: '/favorite/:orderId',
                controller: 'FavoriteOrdersController',
                templateUrl: 'views/order/favorite-orders.html',
                pagination: true
            },
            {
                name: 'order.pending',
                url: '/pending',
                controller: 'PendingOrdersController',
                templateUrl: 'views/order/pending-orders.html',
                pagination: true,
                role: 'corporate_admin'
            },
            {
                name: 'order.detail',
                url: '/detail/:orderId',
                controller: 'DetailOrderController',
                templateUrl: 'views/order/detail-order.html',
                pagination: true
            },
            {
                name: 'order.admin-detail',
                url: '/a/detail/:orderId?account?location?user',
                controller: 'AdminDetailOrderController',
                templateUrl: 'views/order/admin-detail-order.html',
                params: {
                    received: undefined
                },
                role: ['admin', 'superadmin']
            },
            {
                name: 'order.corporate-detail',
                url: '/detail/ca/:orderId',
                controller: 'DetailOrderController',
                templateUrl: 'views/order/corporate-detail-order.html',
                pagination: true,
                role: 'corporate_admin'
            },
            {
                name: 'order.modify-pending',
                url: '/pending/:orderId',
                controller: 'ModifyPendingOrdersController',
                templateUrl: 'views/order/modify-pending-orders.html',
                role: 'corporate_admin'
            },
            {
                name: 'order.recent',
                url: '/recent',
                controller: 'RecentOrdersController',
                templateUrl: 'views/order/recent-orders.html',
                pagination: true
            },
            {
                name: 'order.received',
                url: '/received',
                controller: 'ReceivedOrdersController',
                templateUrl: 'views/order/received-orders.html',
                pagination: true,
                role: ['admin', 'superadmin']
            },
            {
                name: 'order.admin-recent',
                url: '/a/recent?account?location?user',
                controller: 'AdminRecentOrdersController',
                templateUrl: 'views/order/admin-recent-orders.html',
                pagination: true,
                role: ['admin', 'superadmin']
            },
            {
                name: 'order.drafts',
                url: '/drafts',
                controller: 'DraftsOrdersController',
                templateUrl: 'views/order/drafts-orders.html',
                pagination: true
            },
            {
                name: 'order.draft-view',
                url: '/draft/:orderId',
                controller: 'DraftViewController',
                templateUrl: 'views/order/draft-view.html'
            }
        ];

        states.forEach(function (state) {

            // For each state in this module we should be authorized
            angular.extend(state, { authenticate: true });

            $stateProvider.state(state);
        });
    }

})();
