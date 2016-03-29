/**
 * @author Dmitriy Biletskiy
 */
(function() {
    'use strict';

    angular
        .module('user.module')
        .controller('UserLoginController', UserLoginController);

    function UserLoginController($scope, $window, $sessionStorage, $state, AuthService, toastr) {

        $scope.user = {};

        $scope.login = function(user, isInvalid) {
            if (isInvalid) {
                toastr.warning('Please enter your username / password (at least 6 characters for both).');
                return;
            }

            AuthService
                .login(user)
                .then(function(res) {
                    if ($sessionStorage.urlBeforeLogin) {
                        $window.location.href = $window.location.href.split('#')[0] + '#' + $sessionStorage.urlBeforeLogin;
                        delete $sessionStorage.urlBeforeLogin;
                    }

                    if (~['corporate_user', 'customer'].indexOf(res.type))
                        $state.go('main.dashboard');
                    else if (res.type === 'corporate_admin')
                        $state.go('main.corporate_admin_dashboard');
                    else
                        $state.go('main.admin_dashboard');
                }, function(err) {
                    toastr.error(err.data.msg);
                });
        };
    }

})();
