/**
 * @author Dmitriy Biletskiy
 */
(function() {
    'use strict';

    angular
        .module('user.module')
        .directive('corporateUserForm', corporateUserForm);

    /**
     * @ngInject
     */
    function corporateUserForm() {
        return {
            scope: {
                user: '=',
                isSubmitted: '=',
                isValid: '=',
                accounts: '='
            },
            replace: true,
            restrict: 'E',
            templateUrl: 'views/user/user-form/corporate-user.html',
            controller: 'UserFormController'
        };
    }

})();