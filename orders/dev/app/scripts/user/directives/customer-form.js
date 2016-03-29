/**
 * @author Dmitriy Biletskiy
 */
(function() {
    'use strict';

    angular
        .module('user.module')
        .directive('customerForm', customerForm);

    /**
     * @ngInject
     */
    function customerForm() {
        return {
            scope: {
                user: '=',
                isSubmitted: '=',
                isValid: '=',
                accounts: '='
            },
            replace: true,
            restrict: 'E',
            templateUrl: 'views/user/user-form/customer.html',
            controller: 'UserFormController'
        };
    }

})();