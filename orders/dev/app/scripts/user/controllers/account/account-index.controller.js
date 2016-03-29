/**
 * @author Dmitriy Biletskiy
 */
(function() {
    'use strict';

    angular
        .module('user.module')
        .controller('AccountIndexController', AccountIndexController);

    function AccountIndexController($scope, AccountManager, EventDispatcher, toastr) {

        $scope.inProgress = true;

        getAccounts();

        /**
         *  Removes selected account if it does not have any users
         *
         *  @param {boolean} usersExist
         *  @param {integer} accountId - account id
         */
        $scope.remove = function(usersExist, accountId) {

            if (usersExist) {
                toastr.warning('Can\'t remove this account because it belongs to some user(s).');
            } else {
                AccountManager
                    .remove(accountId)
                    .then(function () {
                        getAccounts().then(function () {
                            toastr.success('Account was successfully removed.');
                        });
                    });
            }
        };

        /* Event listener, runs when pagination was changed */
        EventDispatcher.onScope($scope, 'ON_PAGINATION_CHANGE', getAccounts);
        $scope.$watch('substr', getAccounts);

        function getAccounts() {
            return AccountManager
                .get({ substr: $scope.substr })
                .then(function(res) {
                    $scope.accounts = res.data;
                    $scope.inProgress = false;
                });
        }
    }

})();