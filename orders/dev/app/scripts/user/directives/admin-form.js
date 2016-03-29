/**
 * @author Dmitriy Biletskiy
 */
(function() {
    'use strict';

    angular
        .module('user.module')
        .directive('adminForm', adminForm);

    /**
     * @ngInject
     */
    function adminForm() {
        return {
            scope: {
                user: '=',
                isSubmitted: '=',
                isValid: '='
            },
            replace: true,
            restrict: 'E',
            templateUrl: 'views/user/user-form/admin.html',
            controller: 'UserFormController'
        };
    }

})();