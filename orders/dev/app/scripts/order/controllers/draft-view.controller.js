/**
 * @author Dmitriy Biletskiy
 */
(function() {
    'use strict';

    angular
        .module('order.module')
        .controller('DraftViewController', DraftViewController);

    function DraftViewController(
        $scope,
        $modal,
        $state,
        $stateParams,
        ProductService,
        PaginationService,
        AuthService,
        ProductManager,
        OrderManager,
        ProductOrderManager,
        toastr
    ) {

        setDefaultPaginationState('productPagination');
        setDefaultPaginationState('orderPagination');

        $scope.inProgress = false;
        $scope.productSvc = ProductService;
        $scope.perPage = PaginationService.getPerPageValues();
        $scope.filters = { price: 'all' };
        var role = AuthService.getRole();

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

        $scope.showCatalog = function() {
            $scope.$apply(function() {
                $scope.visibleList = !$scope.visibleList;
            });
        };

        /* Submit */
        $scope.submit = function(isSubmitted) {
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
                if (isSubmitted)
                    $scope.order.status = (role === 'customer') ? 'submited' : 'pending';

                var removed = $scope.orderProducts.filter(function(val) {
                    return val.removed;
                });

                if (removed.length) {
                    toastr.warning("The product '" + removed[0].name + "' was discontinued. To continue, please remove it from the order.");
                } else {

                    var products = $scope.orderProducts.map(function(product) {
                        return { id: product.id, quantity: parseInt(product.quantity), price: product.price };
                    });

                    ProductOrderManager
                        .addProducts($scope.order.id, products)
                        .then(function() {
                            OrderManager
                                .update(_.pick($scope.order, ['id', 'po', 'notes', 'status']))
                                .then(function() {
                                    toastr.success('Order was successfully submitted.');
                                    $state.go('order.drafts');
                                });
                        });
                }
            }

        };

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

        function removeOrder() {
            OrderManager
                .remove($stateParams.orderId)
                .then(function() {
                    toastr.success('Order was removed.');
                    $state.go('order.drafts');
                });
        }

        function redirect() {
            $state.go('order.drafts');
        }


        // ---------------------------------------------------------
        // Watchers ------------------------------------------------
        // ---------------------------------------------------------

        $scope.$watch('[filters.manufacturerId, filters.categoryId]', $scope.getProducts);


        // ---------------------------------------------------------
        // Initialization ------------------------------------------
        // ---------------------------------------------------------

        $scope.getProducts();

        ProductOrderManager
            .getList($stateParams.orderId, { column: 'id', sort: 'asc', customPrice: true })
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