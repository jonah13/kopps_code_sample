/**
 * @author Dmitriy Biletskiy
 */
(function() {
    'use strict';

    angular
        .module('main.module')
        .service('PaginationService', PaginationService);

    function PaginationService() {

        var perPage = [10, 20, 50];

        var pagination = {
            perPage: perPage[0]
        };

        return {

            /**
             * Get pagination container
             *
             * @return {object}
             */
            get: function() {
                return pagination;
            },

            /** Set total & current values
             *
             * @param {integer} total
             */
            set: function(total) {
                pagination.total = total;
            },

            /**
             * Remove fields
             */
            unset: function() {
                delete pagination.total;
                delete pagination.currentPage;
            },

            /**
             * Returns array with values for selector
             *
             * @return {array}
             */
            getPerPageValues: function() {
                return perPage;
            }

        };

    }
})();