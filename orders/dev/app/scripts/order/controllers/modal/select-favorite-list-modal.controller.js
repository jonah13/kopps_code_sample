/**
 * @author Dmitriy Biletskiy
 */
(function() {
    'use strict';

    angular
        .module('order.module')
        .controller('SelectFavoriteListModalController', SelectFavoriteListModalController);

    function SelectFavoriteListModalController($scope, FavoriteService, ProductOrderManager, params) {

        $scope.active = [];
        $scope.favoriteLists = FavoriteService.getLists();

        ProductOrderManager
            .getOrdersByProduct(params.id)
            .then(function(res) {
                $scope.active = res.plain();
            });

        /* Check if list is selected */
        $scope.isActive = function(id) {
            return ~$scope.active.indexOf(id);
        };

        /* Select list */
        $scope.change = function(id) {
            if (!~$scope.active.indexOf(id))
                $scope.active.push(id);
            else
                $scope.active = $scope.active.filter(function(val) { return val !==  id; });

        };

    }

})();