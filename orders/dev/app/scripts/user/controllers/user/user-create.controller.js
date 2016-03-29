/**
 * @author Dmitriy Biletskiy
 */
(function() {
    'use strict';

    angular
        .module('user.module')
        .controller('UserCreateController', UserCreateController);

    function UserCreateController(
        $scope,
        $state,
        UserManager,
        toastr
    ) {

        /* Saves user account */
        $scope.save = function() {
           if (!$scope.check($scope.form.isValid)) return;

            UserManager
                .add($scope.user)
                .then(function() {
                    $state.go('user.index');
                    toastr.success('User was created successfully');
                });
        };
    }

})();
