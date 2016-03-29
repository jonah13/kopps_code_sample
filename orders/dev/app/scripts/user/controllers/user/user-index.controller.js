/**
 * @author Dmitriy Biletskiy
 */
(function() {
    'use strict';

    angular
        .module('user.module')
        .controller('UserIndexController', UserIndexController);

    function UserIndexController(
        $scope,
        UserManager,
        AccountManager,
        EventDispatcher,
        toastr,
        AuthService,
        userTypes,
        userTypesForSuperAdmin
    ) {

        $scope.inProgress = true;
        $scope.types = (AuthService.getRole() === 'superadmin') ? userTypesForSuperAdmin : userTypes;
        $scope.filters = {
            type: 'all'
        };

        AccountManager
            .get({ allowPaginate: false })
            .then(function(res) {
                $scope.accounts = res.plain();
            });

        getUsers();

        $scope.remove = function(id) {
            UserManager
                .remove(id)
                .then(function() {
                    getUsers().then(function() {
                        toastr.success('User was successfully removed.');
                    });
                });
        };

        /* Event listener, runs when pagination was changed */
        EventDispatcher.onScope($scope, 'ON_PAGINATION_CHANGE', getUsers);
        $scope.$watch('filters', getUsers, true);

        function getUsers() {
            return UserManager
                .get($scope.filters)
                .then(function(res) {
                    $scope.users = res.data;
                    $scope.inProgress = false;
                });
        }
    }

})();