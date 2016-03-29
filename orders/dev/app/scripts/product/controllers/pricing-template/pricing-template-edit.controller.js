/**
 * @author Dmitriy Biletskiy
 */
(function() {
    'use strict';

    angular
        .module('product.module')
        .controller('PricingTemplateEditController', PricingTemplateEditController);

    function PricingTemplateEditController(
        $scope,
        $state,
        $stateParams,
        ProductManager,
        PricingTemplateManager,
        filtersValuesList,
        ProductService,
        PaginationService,
        toastr
    ) {
        // --------------------------------------------------
        // Initialization -----------------------------------
        // --------------------------------------------------

        setDefaultPaginationState('productPagination');

        var params = {
            column: 'id',
            sort: 'desc'
        };

        $scope.changedProducts = {};
        $scope.filters = { filter: '' };
        $scope.options = filtersValuesList;
        $scope.perPage = PaginationService.getPerPageValues();

        PricingTemplateManager
            .getOne($stateParams.templateId)
            .then(function(res) {
                $scope.template = res.pricing_template;
                res.customized_products.forEach(saveChangedProducts);
            });

        getProducts();


        // --------------------------------------------------
        // Scope methods ------------------------------------
        // --------------------------------------------------

        $scope.search = getProducts;

        $scope.order = function(parameters) {
            params = parameters;
            getProducts();
        };

        /* Save screated template */
        $scope.update = function() {
            // Convert object to array of objects
            var products = ProductService.getChangedProducts($scope.changedProducts);

            PricingTemplateManager
                .update(_.omit($scope.template, 'products'), products)
                .then(function() {
                    toastr.success('Pricing template was updated successfully.');
                    $state.go('pricing-template.index');
                });
        };


        // --------------------------------------------------
        // Watchers -----------------------------------------
        // --------------------------------------------------

        $scope.$watch('[filters.filter, filters.category, filters.manufacturerId]', getProducts);


        // --------------------------------------------------
        // Local functions ----------------------------------
        // --------------------------------------------------

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

        function getProducts() {
            if (_.isEmpty($scope.filters) || _.isUndefined($scope.filters)) return;

            var filters = {};

            _.extend(
                filters,
                params,
                $scope.productPagination,
                { page: $scope.productPagination.currentPage || 1 }
            );

            if ($scope.filters.filter || $scope.filters.category || $scope.filters.substr || $scope.filters.manufacturerId) {
                _.extend(
                    filters,
                    $scope.filters, {
                        custom_price: ProductService.getStringChangedProducts($scope.changedProducts, 'custom_price'),
                        hidden: ProductService.getStringChangedProducts($scope.changedProducts, 'hidden')
                    }
                );
            }

            ProductManager
                .get(filters)
                .then(function(res) {
                    $scope.products = res.data;
                    $scope.productPagination.total = res.total;
                });
        }

        function saveChangedProducts(product) {
            if (!_.has($scope.changedProducts, product.product_id) || (_.has($scope.changedProducts, product.product_id))) {
                $scope.changedProducts[product.product_id] = {
                    custom_price: product.custom_price,
                    hidden_custom_price: !!product.hidden_custom_price,
                    hidden: !!product.hidden
                };
            }
        }
    }

})();