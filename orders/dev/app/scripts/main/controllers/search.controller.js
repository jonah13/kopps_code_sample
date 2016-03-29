(function() {
    'use strict';

    angular
        .module('main.module')
        .controller('SearchController', SearchController);

    /**
     * @ngInject
     */
    function SearchController(
        $scope,
        $q,
        $stateParams,
        ProductManager,
        ProductOrderManager,
        FavoriteService,
        AuthService,
        CartService
    ) {
        $scope.favorite = {};
        $scope.auth = AuthService;
        $scope.cart = CartService;
        $scope.favorite = FavoriteService;
        $scope.inProgress = true;
        $scope.filters = {
            price: 'all',
            substr: ''
        };
        $scope.productPagination = { perPage: 10 };

        var promises = [];
        var params = {
            column: 'id',
            sort: 'asc'
        };

        $scope.search = function() {
            if (_.isUndefined($scope.filters)) return;

            var filters = {};
            _.extend(
                filters,
                $scope.filters,
                $scope.productPagination,
                { page: $scope.productPagination.currentPage }
            );

            var productsPromise = ProductManager
                .getCustomProducts(filters)
                .then(function(res) {
                    $scope.products = res.data;
                    $scope.productPagination.total = res.total;
                });

            promises.push(productsPromise);
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
                        .getList(val.id, _.extend({ perPage: 2 }, params))
                        .then(function(res) {
                            $scope.favorite[key].products = res.data;
                        });

                    promises.push(favoriteList);
                }
            });
        });


        /* Search if was using params already exist */
        if (!_.isEmpty($stateParams)) {
            _.extend($scope.filters, _.omit($stateParams, 'location'));
            $scope.search();
        }

        $q.all()
            .then(function() {
                $scope.inProgress = false;
            });
    }

})();
