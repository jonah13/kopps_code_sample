/**
 * @author Dmitriy Biletskiy
 */
(function() {
    'use strict';

    angular
        .module('main.module')
        .directive('cartHeader', cartHeader)
        .controller('CartHeaderController', CartHeaderController);

    /**
     * @ngInject
     */
    function cartHeader() {
        return {
            scope: {
                menu: '='
            },
            restrict: 'A',
            controller: 'CartHeaderController',
            templateUrl: 'views/main/cart-header.html'
        };
    }

    /**
     * @ngInject
     */
    function CartHeaderController($scope, CartService, ProductService) {
        $scope.productSvc = ProductService;
        $scope.cart = CartService;
    }

})();