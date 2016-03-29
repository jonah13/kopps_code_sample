/**
 * @author Dmitriy Biletskiy
 */
(function() {
    'use strict';

    angular
        .module('product.module')
        .controller('PricingTemplateIndexController', PricingTemplateIndexController);

    function PricingTemplateIndexController(
        $scope,
        PricingTemplateManager, 
        EventDispatcher, 
        toastr
    ) {

        var params = {
            column: 'id',
            sort: 'asc'
        };

        $scope.inProgress = true;

        getTemplates();


        // --------------------------------------------------
        // Scope methods ------------------------------------
        // --------------------------------------------------

        /**
         *  Sorts table by the selected column
         *
         * @param {object} parameters {column/sort}
         */
        $scope.order = function(parameters) {
            params = parameters;
            getTemplates();
        };

        /** 
         * Removes some pricing template if it is not used
         *
         * @param {boolean} accountsExist - give true if at least one account has selected pricing template
         * @param {integer} pricingTemplateId - pricing template id
         */
        $scope.remove = function(accountsExist, pricingTemplateId) {

            if (parseInt(accountsExist)) {
                toastr.warning('Can\'t remove this template because it belongs to the some account');
            } else {
                PricingTemplateManager
                    .remove(pricingTemplateId)
                    .then(function() {
                        toastr.success('Pricing template was successfully removed.');
                        getTemplates();
                    });
            }
        };


        /* Event listener, runs when pagination was changed */
        EventDispatcher.onScope($scope, 'ON_PAGINATION_CHANGE', getTemplates);


        // --------------------------------------------------
        // Local functions ----------------------------------
        // --------------------------------------------------

        function getTemplates() {
            PricingTemplateManager
                .get(params)
                .then(function(res) {
                    $scope.templates = res.data;
                    $scope.inProgress = false;
                });
        }
    }

})();