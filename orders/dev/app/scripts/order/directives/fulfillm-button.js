/**
 * @author Dmitriy Biletskiy
 */
(function() {
    'use strict';

    angular
        .module('order.module').directive('fulfillmButton', fulfillmButton);


    function fulfillmButton($modal, OrderManager) {
        return {
            restrict: 'A',
            scope: {
                orderId: '=fulfillmButton',
                isFulfillmed: '='
            },
            link: function (scope, elem) {

                scope.$watch('isFulfillmed', function(newVal) {
                    if (newVal || _.isUndefined(newVal)) {
                        elem.hide();
                        elem.prev().removeClass('hidden-elem');
                    } else {
                        elem.show();
                        elem.prev().addClass('hidden-elem');
                    }
                });

                elem.bind('click', function() {

                    scope.texts = {
                        title: 'Confirm',
                        message: 'Are you sure you want to fulfill this order?'
                    };

                    $modal.open({
                        templateUrl: 'views/main/modal/yes-no-modal.html',
                        size: 'sm',
                        scope: scope
                    }).result.then(fullfill);
                });

                function fullfill() {
                    OrderManager
                        .update({ id: scope.orderId, fulfillmed: 1 })
                        .then(function() {
                            scope.isFulfillmed = true;
                        });
                }
            }
        };
    }

})();