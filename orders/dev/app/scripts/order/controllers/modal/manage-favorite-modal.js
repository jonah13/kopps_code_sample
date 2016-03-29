/**
 * @author Dmitriy Biletskiy
 */
(function() {
    'use strict';

    angular
        .module('order.module')
        .controller('ManageFavoriteModalController', ManageFavoriteModalController);

    function ManageFavoriteModalController($scope, FavoriteService) {

        $scope.favoriteLists = FavoriteService.getLists();

        /* Mark list as changed */
        $scope.change = function(index) {
            $scope.favoriteLists[index].changed = true;
        };

    }

})();