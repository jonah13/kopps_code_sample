/**
 * @author Dmitriy Biletskiy
 */
(function() {
    'use strict';

    angular
        .module('main.module')
        .controller('DashboardController', DashboardController);

    function DashboardController(
        $scope,
        $q,
        $state,
        OrderManager,
        ProductOrderManager,
        CartService,
        FavoriteService,
        EventDispatcher
    ) {

        var page = 1;

        var orderPromise = OrderManager
            .get({
                column: 'id',
                sort: 'desc',
                status: 'pending,rejected,submited,removed,processed',
                limit: 5,
                by: 'user'
            })
            .then(function(res) {
                $scope.orders = res.plain();
            });

        $scope.inProgress = true;
        $scope.cart = CartService;
        $scope.favorite = {};
        $scope.recentlyProducts = [];


        // --------------------------------------------------
        // Scope methods ------------------------------------
        // --------------------------------------------------

        /* Orders table by selected value */
        $scope.order = function(parameters) {
            $scope.sortings = {
                column: parameters.column,
                sort: parameters.sort !== 'desc'
            };

            $scope.$digest();
        };

        /* Moves products to the shopping cart */
        $scope.toCart = function(orderId) {
            CartService
                .addListToCart(orderId)
                .then(function() {
                    EventDispatcher.dispatch('GET_SHOPPING_CART');
                    $state.go('order.cart');
                });
        };

        /* Gets a list of recently purchased products */
        $scope.getPurchased = function() {
            return ProductOrderManager
                .get({
                    page: page,
                    column: 'id',
                    sort: 'desc'
                })
                .then(function(res) {
                    res.data.forEach(function(val) {
                        $scope.recentlyProducts.push(val);
                    });

                    page = res.last_page;
                    $scope.totalPurchased = res.total;
                });
        };


        // --------------------------------------------------
        // Watchers -----------------------------------------
        // --------------------------------------------------

        /* Gets list of products from the favorite lists */
        $scope.$watch(function() { return FavoriteService.getLists(); }, function(lists) {

            lists.forEach(function(val, key) {
                if (key <= 1) { // we need to get products by 2 favorite lists
                    $scope.favorite[key] = _.clone(val);

                    var favoriteList = ProductOrderManager
                        .getList(val.id, {
                            perPage: 2,
                            customPrice: true,
                            column: 'id',
                            sort: 'desc'
                        })
                        .then(function(res) {
                            $scope.favorite[key].products = _.clone(res.data);
                        });

                    promises.push(favoriteList);
                }
            });
        });


        /* List of promises */
        var promises = [orderPromise, $scope.getPurchased()];

        /* Hides the loading spinner when all data were loaded */
        $q.all(promises)
            .then(function() {
                $scope.inProgress = false;
            });

    }

})();
