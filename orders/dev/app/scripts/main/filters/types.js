/**
 * @author Dmitriy Biletskiy
 */
(function() {
    'use strict';

    angular
        .module('main.module')
        .filter('types', function(AuthService) {
            return function(input, entityName) {

                var role = AuthService.getRole();

                var types = {
                    user: {
                        customer: 'Standard',
                        corporate_admin: 'Corporative Admin',
                        corporate_user: 'Corporative User',
                        admin: 'Admin'
                    },
                    account: {
                        standard: 'Standard',
                        corporate: 'Corporation'
                    },
                    order: {
                        pending: 'Pending',
                        submited: (role === 'corporate_user') ? 'Approved' : 'Submitted',
                        removed: 'Deleted by admin',
                        rejected: 'Rejected',
                        processed: 'Processed'
                    },
                    admin_order: {
                        pending: 'Pending',
                        submited: 'Pending',
                        removed: 'Deleted by admin',
                        rejected: 'Rejected',
                        processed: 'Processed'
                    }
                };

                return types[entityName][input];
            };
        });
})();