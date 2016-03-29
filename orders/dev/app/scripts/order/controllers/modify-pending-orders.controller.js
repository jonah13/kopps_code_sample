/**
 * @author Dmitriy Biletskiy
 */
(function() {
    'use strict';

    angular
        .module('order.module')
        .controller('ModifyPendingOrdersController', ModifyPendingOrdersController);

    function ModifyPendingOrdersController(
        $scope,
        $modal,
        $state,
        $stateParams,
        ProductManager,
        ProductOrderManager,
        OrderManager,
        toastr,
        ProductService,
        PaginationService,
        CartService
    ) {

        setDefaultPaginationState('productPagination');
        setDefaultPaginationState('orderPagination');

        var isApprovedOut;

        $scope.inProgress = false;
        $scope.productSvc = ProductService;
        $scope.perPage = PaginationService.getPerPageValues();
        $scope.cart = CartService;
        $scope.filters = { price: 'all' };


        // --------------------------------------------------------
        // Scope methods ------------------------------------------
        // --------------------------------------------------------

        /* Adds product to order */
        $scope.addProduct = function(product, quantity) {
            var index = _.indexOf($scope.orderProducts, _.find($scope.orderProducts, { id: product.id }));

            if (product.only_one && ~index || product.removed) {
                toastr.warning('You can\'t add this product');
                return;
            } else {
                toastr.success('Product was added to the order');
            }

            if (!~index) {
                $scope.orderProducts.push(_.extend(product, { quantity: quantity }));
                $scope.orderPagination.total++;
            } else {
                $scope.orderProducts[index].quantity += quantity;
            }
        };

        /* Removes product from order */
        $scope.removeProduct = function(index) {
            $scope.orderProducts.splice(index, 1);
            $scope.orderPagination.total--;
        };

        /* Gets list of products */
        $scope.getProducts = function() {
            $scope.inProgress = true;
            var filters = {};

            _.extend(
                filters,
                $scope.filters,
                $scope.productPagination,
                { page: $scope.productPagination.currentPage || 1 }
            );

            ProductManager
                .getCustomProducts(filters)
                .then(function(res) {
                    $scope.products = res.data;
                    $scope.productPagination.total = res.total;
                    $scope.inProgress = false;
                });
        };

        /* Submit */
        $scope.submit = function(isApproved) {
            isApprovedOut = isApproved;

            if (!ProductService.getSumAmount($scope.orderProducts)) {

                $scope.texts = {
                    title: 'Confirm',
                    message: 'You have deleted all items in this order, confirming this action will delete the order it self.'
                };

                $modal.open({
                    templateUrl: 'views/main/modal/yes-no-modal.html',
                    size: 'sm',
                    scope: $scope
                }).result.then(removeOrder, redirect);

            } else {
                var removed = $scope.orderProducts.filter(function(val) {
                    return val.removed;
                });

                if (removed.length) {
                    toastr.warning('The product ' + removed[0].name + ' was discontinued by admin. To continue, please remove it from list.');
                } else {
                    saveOrder();
                }
            }
        };

        $scope.reject = function() {
            OrderManager
                .update({ id: $scope.order.id, status: 'rejected' })
                .then(function() {
                    toastr.success('Order was rejected');
                    $state.go('order.pending');
                });
        };

        $scope.showCatalog = function() {
            $scope.$apply(function() {
                $scope.visibleList = !$scope.visibleList;
            });
        };


        // --------------------------------------------------------
        // Local functions ----------------------------------------
        // --------------------------------------------------------

        function setDefaultPaginationState(name) {
            var defaultValues = { perPage: 10, total: 0, currentPage: 1 };

            if (_.isString(name)) {
                $scope[name] = _.clone(defaultValues);

            } else  if (_.isArray(name)) {

                name.forEach(function(val) {
                    $scope[val] = _.clone(defaultValues);
                });

            } else {
                throw 'Unknown parameter was given.';
            }
        }

        function redirect() {
            $state.go('order.pending');
        }

        function saveOrder() {
            var message,
                products = $scope.orderProducts.map(function(product) {
                    return { id: product.id, quantity: product.quantity, price: product.price };
                });

            if (isApprovedOut) {
                message = 'Order was saved and approved.';
                $scope.order.status = 'submited';
            } else {
                message = 'Changes were saved.';
            }

            ProductOrderManager
                .addProducts($scope.order.id, products)
                .then(function() {
                    OrderManager
                        .update(_.pick($scope.order, ['id', 'po', 'notes', 'status']))
                        .then(function() {
                            toastr.success(message);
                            $state.go('order.pending');
                        });
                });
        }

        function removeOrder() {
            var order = _.extend(
                _.pick($scope.order, ['id', 'po', 'notes', 'status']),
                { status: 'removed' }
            );

            OrderManager
                .update(order)
                .then(function() {
                    toastr.success('Order was removed.');
                    $state.go('order.pending');
                });
        }


        // ---------------------------------------------------------
        // Watchers ------------------------------------------------
        // ---------------------------------------------------------

        $scope.$watch('filters.categoryId', function(newVal) {
            if (!_.isUndefined(newVal)) {
                $scope.filters.category = true;
                $scope.getProducts();
            }
        });

        $scope.$watch('[filters.manufacturerId, filters.categoryId]', $scope.getProducts);


        // ---------------------------------------------------------
        // Initialization ------------------------------------------
        // ---------------------------------------------------------

        $scope.getProducts();

        ProductOrderManager
            .getList($stateParams.orderId, { column: 'id', sort: 'asc' })
            .then(function(res) {
                $scope.orderProducts = res.plain();
                $scope.orderPagination.total = res.plain().length;
            });

        OrderManager
            .getOne($stateParams.orderId)
            .then(function(res) {
                $scope.order = res.plain();
            });
    }

})();