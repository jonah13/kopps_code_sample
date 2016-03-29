/**
 * @author Dmitriy Biletskiy
 */
(function() {
    'use strict';

    angular
        .module('user.module')
        .controller('MyAccountController', MyAccountController);

    function MyAccountController($scope, AuthService) {

        $scope.user = AuthService.getCurrentUser();
    }

})();