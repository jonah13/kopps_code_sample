/**
 * @author Dmitriy Biletskiy
 */
(function() {
    'use strict';

    angular
        .module('order.module').directive('viewActivityButton', viewActivityButton);


    function viewActivityButton($state) {
        return {
            restrict: 'A',
            link: function (scope, elem, attrs) {
                elem.bind('click', function() {
                    var param = { account: attrs.account };
                    param[attrs.by] = attrs.fieldId;

                    $state.go('order.admin-recent', param);
                });
            }
        };
    }

})();