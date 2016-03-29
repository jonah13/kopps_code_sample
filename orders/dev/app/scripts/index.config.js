(function() {
    'use strict';

    angular
        .module('kopp')
        .config(html5modeConfig)
        .config(routerConfig)
        .config(mainConfig);

    function html5modeConfig($locationProvider) {
        // Uncomment code in this section for production

        //$locationProvider.html5Mode(true);
        /* For browsers that don't support html5 mode */
        //$locationProvider.hashPrefix('#');
    }

    /**
     * @ngInject
     */
    function mainConfig(RestangularProvider, $httpProvider, app_parameters) {
        $httpProvider.interceptors.push('AuthInterceptor');
        $httpProvider.interceptors.push('PaginationInterceptor');
        RestangularProvider.setBaseUrl(app_parameters.rest_server);
    }

    /**
     * @ngInject
     */
    function routerConfig($urlRouterProvider) {
        $urlRouterProvider.otherwise('/login');
    }


})();
