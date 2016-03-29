/**
 * @author Dmitriy Biletskiy
 */
(function() {
    'use strict';

    angular
        .module('product.module')
        .controller('PricingTemplateCreateController', PricingTemplateCreateController);

    function PricingTemplateCreateController(
        $scope,
        $state,
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

        getProducts();


        // --------------------------------------------------
        // Scope methods ------------------------------------
        // --------------------------------------------------

        $scope.search = getProducts;

        $scope.order = function(parameters) {
            params = parameters;
            getProducts();
        };

        /* Save created template */
        $scope.save = function(isValid) {
            $scope.isSubmited = true;

            if (!isValid) {
                toastr.warning('Seems something went wrong, please check the form again.');
                return;
            }

            // Convert object to array of objects
            var products = ProductService.getChangedProducts($scope.changedProducts);

            PricingTemplateManager
                .create($scope.template, products)
                .then(function() {
                    toastr.success('Pricing template was created successfully.');
                    $state.go('pricing-template.index');
                });
        };


        // --------------------------------------------------
        // Watchers -----------------------------------------
        // --------------------------------------------------

        $scope.$watch('[filters.filter, filters.category, filters.manufacturerId]', getProducts);


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
                        custom_price: ProductService.getStringChangedProducts($scope.changedProducts,'custom_price'),
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
    }

})();