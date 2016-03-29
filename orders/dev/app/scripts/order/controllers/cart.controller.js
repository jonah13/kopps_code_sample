/**
 * @author Dmitriy Biletskiy
 */
(function() {
    'use strict';

    angular
        .module('order.module')
        .controller('CartController', CartController);

    function CartController(
        $scope,
        $state,
        CartService,
        AuthService,
        ProductService,
        ProductOrderManager,
        OrderManager,
        toastr
    ) {

        $scope.cart = CartService;
        $scope.productSvc = ProductService;
        var role = AuthService.getRole();

        /* Submits shopping cart or saves as list as draft */
        $scope.save = function(status) {
            if (!status)
                status = (role === 'customer') ? 'submited' : 'pending';

            var order = CartService.getOrder();
            $scope.inProgress = true;

            OrderManager
                .getRemovedProducts(order.id)
                .then(function(res) {
                    var products = res.plain();

                    if (products.length) {
                        toastr.warning("Product '" + products[0] + "' was discontinued. To continue, please remove it from the shopping cart.");
                        $scope.inProgress = false;
                    } else {
                        var orderToSave = {
                            po: order.po,
                            notes: order.notes,
                            status: status,
                            orderId: order.id
                        };

                        OrderManager
                            .save(orderToSave)
                            .then(function(res) {
                                ProductOrderManager
                                    .updateProductOrder(order.id, res.plain().id)
                                    .then(function() {
                                        if (status === 'draft') {
                                            toastr.success('The order was successfully saved as draft.');
                                            $state.go('order.drafts');
                                        } else {
                                            toastr.success('The order was successfully submitted.');
                                        }
                                        $scope.inProgress = false;
                                        CartService.softClear();
                                    });
                            });
                    }
                });
        };
    }

})();
