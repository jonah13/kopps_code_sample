/**
 * @author Dmitriy Biletskiy
 */
(function() {
    'use strict';

    angular
        .module('user.module', ['ui.router'])
        .config(configStates);

    function configStates($stateProvider) {

        var states = [
            {
                name: 'unauthorized',
                template: '<div class="fade-in-right-big smooth unauthorized" ui-view></div>',
                abstract: true
            },
            {
                name: 'unauthorized.login',
                url: '/login',
                controller: 'UserLoginController',
                templateUrl: 'views/user/user/user-login.html'
            },
            {
                name: 'unauthorized.forgot-password',
                url: '/forgot-password',
                controller: 'ForgotPasswordController',
                templateUrl: 'views/user/user/forgot-password.html'
            },

            {
                name: 'user',
                url: '/user',
                abstract: true,
                templateUrl: 'views/main/layout.html'
            },
            {
                name: 'user.me',
                url: '/me',
                controller: 'MyAccountController',
                templateUrl: 'views/user/user/my-account.html',
                authenticate: true
            },
            {
                name: 'user.main',
                controller: 'UserMainController',
                template: '<ui-view>',
                abstract: true
            },
            {
                name: 'user.index',
                url: '/',
                controller: 'UserIndexController',
                templateUrl: 'views/user/user/user-index.html',
                pagination: true,
                authenticate: true,
                role: ['admin', 'superadmin']
            },
            {
                name: 'user.main.create',
                url: '/create',
                controller: 'UserCreateController',
                templateUrl: 'views/user/user/user-create.html',
                authenticate: true,
                role: ['admin', 'superadmin']
            },
            {
                name: 'user.main.edit',
                url: '/:userId',
                controller: 'UserEditController',
                templateUrl: 'views/user/user/user-edit.html',
                authenticate: true,
                role: ['admin', 'superadmin']
            },
            {
                name: 'account',
                url: '/account',
                templateUrl: 'views/main/layout.html',
                abstract: true
            },
            {
                name: 'account.index',
                url: '/',
                controller: 'AccountIndexController',
                templateUrl: 'views/user/account/account-index.html',
                pagination: true,
                authenticate: true,
                role: ['admin', 'superadmin']
            },
            {
                name: 'account.create',
                url: '/create',
                controller: 'AccountCreateController',
                templateUrl: 'views/user/account/account-create.html',
                authenticate: true,
                role: ['admin', 'superadmin']
            },
            {
                name: 'account.edit',
                url: '/:accountId',
                controller: 'AccountEditController',
                templateUrl: 'views/user/account/account-edit.html',
                authenticate: true,
                role: ['admin', 'superadmin']
            },
            {
                name: 'location',
                url: '/location',
                templateUrl: 'views/main/layout.html',
                abstract: true
            },
            {
                name: 'location.corp-admin-index',
                url: '/ca',
                controller: 'LocationCorporateIndexController',
                templateUrl: 'views/user/location/location-corporate-index.html',
                pagination: true,
                authenticate: true,
                role: 'corporate_admin'
            },
            {
                name: 'location.admin-index',
                url: '/',
                controller: 'LocationAdminIndexController',
                templateUrl: 'views/user/location/location-admin-index.html',
                pagination: true,
                authenticate: true,
                role: ['admin', 'superadmin']
            }
        ];

        states.forEach(function (state) {
            $stateProvider.state(state);
        });
    }

})();
