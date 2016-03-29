/**
 * @author Dmitriy Biletskiy
 */
(function() {
    'use strict';

    angular
        .module('user.module')
        .directive('corporateAdminForm', corporateAdminForm);

    /**
     * @ngInject
     */
    function corporateAdminForm() {
        return {
            scope: {
                user: '=',
                isSubmitted: '=',
                isValid: '=',
                accounts: '='
            },
            replace: true,
            restrict: 'E',
            templateUrl: 'views/user/user-form/corporate-admin.html',
            controller: 'UserFormController'
        };
    }

})();