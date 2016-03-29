/**
 * @author Dmitriy Biletskiy
 */
(function() {
    'use strict';

    angular
        .module('main.module', ['ui.router'])
        .config(configStates);

    function configStates($stateProvider) {

        var states = [
            {
                name: 'main',
                templateUrl: 'views/main/layout.html',
                abstract: true
            },
            {
                name: 'main.dashboard',
                url: '/dashboard',
                controller: 'DashboardController',
                templateUrl: 'views/main/dashboards/dashboard.html',
                authenticate: true
            },
            {
                name: 'main.corporate_admin_dashboard',
                url: '/ca/dashboard',
                controller: 'CorpAdminDashboardController',
                templateUrl: 'views/main/dashboards/corp-admin-dashboard.html',
                authenticate: true,
                role: 'corporate_admin'
            },
            {
                name: 'main.admin_dashboard',
                url: '/a/dashboard',
                controller: 'AdminDashboardController',
                templateUrl: 'views/main/dashboards/admin-dashboard.html',
                authenticate: true,
                role: ['admin', 'superadmin']
            },
            {
                name: 'main.search',
                url: '/search?substr&categoryId&manufacturerId',
                controller: 'SearchController',
                templateUrl: 'views/main/search.html',
                authenticate: true
            },
            {
                name: 'main.report',
                url: '/report',
                controller: 'ReportController',
                templateUrl: 'views/main/report.html',
                authenticate: true,
                pagination: true
            }
        ];

        states.forEach(function (state) {
            $stateProvider.state(state);
        });
    }

})();
