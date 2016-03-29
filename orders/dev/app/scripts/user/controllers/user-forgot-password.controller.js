/**
 * @author Dmitriy Biletskiy
 */
(function() {
    'use strict';

    angular
        .module('user.module')
        .controller('ForgotPasswordController', ForgotPasswordController);

    function ForgotPasswordController($scope, UserManager, toastr, $state) {

        $scope.restorePass = function(email) {
            $scope.inProgress = true;

            UserManager
                .restorePassword(email)
                .then(function(res) {
                        toastr.success(res.msg);
                        $state.go('unauthorized.login');
                    }, function(err) {
                        toastr.error(err.data.msg);
                    }
                ).finally(function() {
                    $scope.inProgress = false;
                });
        };
    }

})();