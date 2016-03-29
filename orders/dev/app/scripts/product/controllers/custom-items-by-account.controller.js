/**
 * @author Dmitriy Biletskiy
 */
(function() {
    'use strict';

    angular
        .module('product.module')
        .controller('CustomItemsByAccountController', CustomItemsByAccountController);

    function CustomItemsByAccountController(
        $scope,
        $q,
        $state,
        $stateParams,
        toastr,
        ProductManager,
        PricingTemplateManager,
        AccountManager,
        ProductService,
        PaginationService,
        filtersValuesList
    ) {

        var productsIsShown = false,
            params = {
                column: 'id',
                sort: 'desc'
            };

        /* Order columns by selected value */

        setDefaultPaginationState('productPagination');

        $scope.inProgress = true;
        $scope.filters = { filter: '' };
        $scope.changedProducts = {};
        $scope.perPage = PaginationService.getPerPageValues();
        $scope.options = filtersValuesList;

        var accountPromise = AccountManager
            .getOne($stateParams.accountId)
            .then(function(res) {
                $scope.account = res.plain();
            });


        // ---------------------------------------------------------
        // Scope methods -------------------------------------------
        // ---------------------------------------------------------

        $scope.order = function(parameters) {
            params = parameters;
            $scope.getProducts();
        };

        /**
         * Gets products list by text/selectors filter and pagination
         */
        $scope.getProducts = function() {
            if (_.isUndefined($scope.filters)) return;

            var filters = {};

            _.extend(
                filters,
                params,
                $scope.filters,
                $scope.productPagination,
                { page: $scope.productPagination.currentPage || 1 }
            );

            if ($scope.filters.filter || $scope.filters.category || $scope.filters.manufacturerId)
                _.extend(
                    filters,
                    {
                        custom_price: ProductService.getStringChangedProducts($scope.changedProducts, 'custom_price'),
                        hidden: ProductService.getStringChangedProducts($scope.changedProducts, 'hidden')
                    }
                );

            ProductManager
                .get(filters)
                .then(function(res) {
                    $scope.products = res.data;
                    $scope.productPagination.total = res.total;
                });
        };

        PricingTemplateManager
            .getAllAdditions($stateParams.accountId)
            .then(function(res) {
                $scope.changedProducts = {};
                res.plain().forEach(saveChangedProducts);

                if (!productsIsShown) $scope.getProducts();
            });

        /**
         * Adds flag which means that products was changed
         *
         * @param {integer} productId - product id
         */
        $scope.changeProduct = function(productId) {
            $scope.changedProducts[productId].changed = true;
        };

        /**
         * Saves items customization for the account
         */
        $scope.save = function() {
            var products = [];
            // Converts object to array of objects
            _.forEach($scope.changedProducts, function(val, key) {
                if (val.changed)
                    products.push({
                        product_id: key,
                        hidden: val.hidden,
                        hidden_custom_price: val.hidden_custom_price,
                        custom_price: val.custom_price
                    });
            });

            PricingTemplateManager
                .saveCustomItemsBunch($stateParams.accountId, products)
                .then(function() {
                    toastr.success('Products were customized successfully.');

                    $state.go('products.custom-items');
                });
        };


        // ---------------------------------------------------------
        // Local functions -----------------------------------------
        // ---------------------------------------------------------

        function setDefaultPaginationState(name) {
            var defaultValues = { perPage: 10 };

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

        function saveChangedProducts(val) {
            if (!_.has($scope.changedProducts, val.product_id) || (_.has($scope.changedProducts, val.product_id) && !_.isNull(val.account_id))) {
                $scope.changedProducts[val.product_id] = {
                    custom_price: val.custom_price,
                    hidden_custom_price: !!val.hidden_custom_price,
                    hidden: !!val.hidden
                };
            }
        }

        $scope.$watch('[filters.filter, filters.category, filters.manufacturerId]', $scope.getProducts);

        $q.all([accountPromise, $scope.getProducts()])
            .then(function() {
                $scope.inProgress = false;
            });
    }

})();
