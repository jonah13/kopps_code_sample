/**
 * @author Dmitriy Biletskiy
 */
(function() {
    'use strict';

    angular
        .module('main.module')
        .directive('sortings', sortings);

    /**
     * @ngInject
     */
    function sortings() {
        return {
            scope: {
                sortings: '@',
                onChange: '&'
            },
            restrict: 'A',
            link: sortingsLink,
            template: '<span class="arrows-sorts pull-right disabled"></span>'
        };
    }

    function sortingsLink(scope, elem) {

        var predicate;


        $(elem).on('click', sort);
        $(elem.prev()).on('click', sort);

        function sort() {
            var prev = predicate;

            predicate = (predicate === 'desc') ? 'asc' : 'desc';

            // add/remove classes from current elem
            elem.find('span').removeClass('disabled ' + prev);
            elem.find('span').addClass(predicate);

            // adds/removes classes from another elems
            elem.parent().parent().find('td > span, label > span').each(function(key, val) {
                if (val.getAttribute('sortings') !== scope.sortings) {
                    $(val).children('span').removeClass('asc desc');
                    $(val).children('span').addClass('disabled');
                }
            });

            // callback for parent scope
            scope.onChange({ params: {
                column: scope.sortings,
                sort: predicate
            } });
        }
    }

})();