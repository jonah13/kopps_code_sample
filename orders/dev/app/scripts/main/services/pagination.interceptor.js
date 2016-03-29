/**
 * @author Dmitriy Biletskiy
 */
(function() {
    'use strict';

    angular
        .module('main.module')
        .service('PaginationInterceptor', AuthInterceptor);

    function AuthInterceptor($injector, PaginationService) {

        return {

            /**
             * Attach pagination params if it's needed
             */
            request: function (config) {

                config.params = config.params || {};

                // attach pagination attributes
                if ($injector.get('$state').current.pagination && !~config.url.indexOf('.html', '.css', '.js')) {
                    var pagination = PaginationService.get();

                    _.extend(config.params, {
                        page: pagination.currentPage,
                        perPage: pagination.perPage
                    });
                }

                return config;
            },

            /**
             * Set some params to pagination
             */
            response: function(res) {
                if (_.isObject(res.data) && res.data.hasOwnProperty('current_page'))
                    PaginationService.set(res.data.total);

                return res;
            }

        };
    }

})();