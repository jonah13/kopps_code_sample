/**
 * @author Dmitriy Biletskiy
 */
(function() {
    'use strict';

    angular
        .module('user.module')
        .controller('UserEditController', UserEditController);

    function UserEditController(
        $scope,
        $state,
        $stateParams,
        UserManager,
        toastr
    ) {

        UserManager 
            .getOne($stateParams.userId)
            .then(function(res) {
                $scope.user = res.plain();
            });


        // --------------------------------------------------
        // Scope methods ------------------------------------
        // --------------------------------------------------

        /* Saves user account */
        $scope.save = function() {
            if (!$scope.check($scope.form.isValid)) return;

            UserManager
                .update($scope.user)
                .then(function() {
                    $state.go('user.index');
                    toastr.success('User was updated successfully');
                });
        };
    }

})();
