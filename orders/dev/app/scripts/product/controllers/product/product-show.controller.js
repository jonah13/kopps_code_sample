/**
 * @author Dmitriy Biletskiy
 */
(function() {
    'use strict';

    angular
        .module('product.module')
        .controller('ProductShowController', ProductShowController);

    function ProductShowController(
        $scope,
        $stateParams,
        Lightbox,
        ProductManager,
        CartService,
        FavoriteService,
        AuthService
    ) {

        $scope.cart = CartService;
        $scope.favorite = FavoriteService;
        $scope.auth = AuthService;

        ProductManager
            .getOneCustomProduct($stateParams.productId)
            .then(function(res) {
                $scope.products = res.plain();
            });

        /* Open modal with full size image */
        $scope.openLightboxModal = function () {
            var url = 'orders/assets/images/';
            url += $scope.products[0].img || 'default.png';
            Lightbox.openModal([{ url: url }], 0);
        };
    }

})();