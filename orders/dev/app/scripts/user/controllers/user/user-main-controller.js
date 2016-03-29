/**
 * @author Dmitriy Biletskiy
 */
(function() {
    'use strict';

    angular
        .module('user.module')
        .controller('UserMainController', UserMainController);

    function UserMainController($scope, AccountManager, AuthService, toastr) {

        $scope.user = { type: 'customer' };
        $scope.form = { isValid: false };
        $scope.role = AuthService.getRole();
        $scope.isSubmitted = false;

        AccountManager
            .get()
            .then(function(res) {
                $scope.accounts = res.plain();
            });

        $scope.check = function(isValid) {
            $scope.isSubmitted = true;

            if (!isValid) {
                toastr.warning('Seems something went wrong, please check the form again.');
                return false;
            }
            return true;
        };

        // --------------------------------------------------
        // Watchers -----------------------------------------
        // --------------------------------------------------

        // clear some properties if admin changes user type
        $scope.$watch('user.type', function() {
            delete $scope.user.account;
            $scope.user.location_id = null;
        });

        // hides all notifications
        $scope.$watch('user', function() {
            $scope.isSubmitted = false;
        }, true);
    }

})();