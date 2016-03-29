(function() {
    'use strict';

    angular
        .module('kopp')
        .value('modalsConfigs', {

            'ADD_TO_CART': {
                title: 'Go to cart',
                message: 'Do you want go to shopping cart page?',
                notificationType: 'success',
                notificationText: 'The product was successfully added.'
            },

            'CLEAR_CART': {
                title: 'Confirm',
                message: 'Are you sure you want to remove this product(s)?',
                notificationType: 'success',
                notificationText: 'The shopping cart is empty.'
            },

            'REMOVE_ACCOUNT': {
                title: 'Confirm',
                message: 'Are you sure you want to remove this account?'
            },

            'REMOVE_PRODUCT': {
                title: 'Confirm',
                message: 'Are you sure you want to deactivate this product?'
            },

            'APPROVE_ORDER': {
                title: 'Confirm',
                message: 'Are you sure you want to approve this order?'
            },

            'REJECT_ORDER': {
                title: 'Confirm',
                message: 'Are you sure you want to reject this order?'
            },

            'REMOVE_USER': {
                title: 'Confirm',
                message: 'Are you sure you want to remove this user?'
            },

            'REMOVE_PRODUCT_FROM_CART': {
                title: 'Confirm',
                message: 'Are you sure you want to remove this product(s)?',
                notificationType: 'success',
                notificationText: 'The product was successfully removed.'
            },

            'ADD_FAVORITE_LIST': {
                templateUrl: 'views/main/modal/add-favorite-modal.html',
                notificationType: 'success',
                notificationText: 'The list was successfully added.'
            },

            'ADD_PRODUCT_FAVORITE_LIST': {
                templateUrl: 'views/main/modal/select-favorite-modal.html',
                controller: 'SelectFavoriteListModalController'
            },

            'MANAGE_FAVORITE_LIST': {
                templateUrl: 'views/main/modal/manage-favorite-modal.html',
                controller: 'ManageFavoriteModalController'
            },

            'DUPLICATE_THE_ORDER': {
                templateUrl: 'views/main/modal/duplication-order-modal.html'
            }
        })

        .value('filtersValuesList', [
            { name: 'All products', val: ''},
            { name: 'Custom Price Items', val: 'custom_price' },
            { name: 'Shown Items', val: 'shown' },
            { name: 'Hidden Items', val: 'hidden' }
        ])

        .value('orderFilterValues', [
            { name: 'submited,processed', title: 'All' },
            { name: 'submited', title: 'Pending' },
            { name: 'processed', title: 'Processed' }
        ])

        .value('userTypes', [
            { name: 'all', title: 'All' },
            { name: 'corporate_user', title: 'Corporative User' },
            { name: 'corporate_admin', title: 'Corporative Admin' },
            { name: 'customer', title: 'Standard User' }
        ])

        .value('userTypesForSuperAdmin', [
            { name: 'all', title: 'All' },
            { name: 'corporate_user', title: 'Corporative User' },
            { name: 'corporate_admin', title: 'Corporative Admin' },
            { name: 'customer', title: 'Standard User' },
            { name: 'admin', title: 'Admin' }
        ])

        .value('userFields', {
            corporate_admin: ['first_name', 'username', 'email', 'phone', 'password', 'type', 'account', 'as_location'],
            corporate_user: ['first_name', 'username', 'email', 'phone', 'password', 'type', 'account', 'location_id', 'as_location'],
            admin: ['first_name', 'username', 'email', 'phone', 'password', 'type']
        })

        .value('uomsList', [
            { id: 1, name: 'Case(s)', abbr: 'CA'},
            { id: 2, name: 'Bottle(s)', abbr: 'BT'},
            { id: 3, name: '', abbr: ''},
            { id: 4, name: 'Package(s)', abbr: 'PK'},
            { id: 5, name: 'Box(es)', abbr: 'BX'},
            { id: 6, name: 'Tube(s)', abbr: 'TB'},
            { id: 7, name: 'Bag(s)', abbr: 'BG'},
            { id: 8, name: 'Jar(s)', abbr: 'JR'},
            { id: 9, name: 'Pack(s)', abbr: 'PH'},
            { id: 10, name: 'Dozen(s)', abbr: 'DZ'},
            { id: 11, name: 'Pair(s)', abbr: 'PR'},
            { id: 12, name: 'Roll(s)', abbr: 'RL'},
            { id: 13, name: 'Set(s)', abbr: 'ST'},
            { id: 14, name: 'Bucket(s)', abbr: 'BC'},
            { id: 15, name: 'Spray(s)', abbr: 'SPRA'},
            { id: 16, name: 'Tub(s)', abbr: 'Y4'},
            { id: 17, name: 'Vial(s)', abbr: 'VL'},
            { id: 18, name: 'Sheet(s)', abbr: 'SH'},
            { id: 19, name: 'Kit(s)', abbr: 'KT'},
            { id: 20, name: 'Sleeve(s)', abbr: 'SL'},
            { id: 21, name: 'Packet(s)', abbr: 'PAC'},
            { id: 22, name: 'Carton(s)', abbr: 'CT'},
            { id: 23, name: 'Tub. Unit(s)', abbr: 'TU'},
            { id: 24, name: 'Each(es)', abbr: 'EA'}
        ])

        .value('usStateList', [
            { name: 'Alabama', value: 'AL' },
            { name: 'Alaska', value: 'AK' },
            { name: 'American Samoa', value: 'AS' },
            { name: 'Arizona', value: 'AZ' },
            { name: 'Arkansas', value: 'AR' },
            { name: 'California', value: 'CA' },
            { name: 'Colorado', value: 'CO' },
            { name: 'Connecticut', value: 'CT' },
            { name: 'Delaware', value: 'DE' },
            { name: 'District Of Columbia', value: 'DC' },
            { name: 'Federated States Of Micronesia', value: 'FM' },
            { name: 'Florida', value: 'FL' },
            { name: 'Georgia', value: 'GA' },
            { name: 'Guam', value: 'GU' },
            { name: 'Hawaii', value: 'HI' },
            { name: 'Idaho', value: 'ID' },
            { name: 'Illinois', value: 'IL' },
            { name: 'Indiana', value: 'IN' },
            { name: 'Iowa', value: 'IA' },
            { name: 'Kansas', value: 'KS' },
            { name: 'Kentucky', value: 'KY' },
            { name: 'Louisiana', value: 'LA' },
            { name: 'Maine', value: 'ME' },
            { name: 'Marshall Islands', value: 'MH' },
            { name: 'Maryland', value: 'MD' },
            { name: 'Massachusetts', value: 'MA' },
            { name: 'Michigan', value: 'MI' },
            { name: 'Minnesota', value: 'MN' },
            { name: 'Mississippi', value: 'MS' },
            { name: 'Missouri', value: 'MO' },
            { name: 'Montana', value: 'MT' },
            { name: 'Nebraska', value: 'NE' },
            { name: 'Nevada', value: 'NV' },
            { name: 'New Hampshire', value: 'NH' },
            { name: 'New Jersey', value: 'NJ' },
            { name: 'New Mexico', value: 'NM' },
            { name: 'New York', value: 'NY' },
            { name: 'North Carolina', value: 'NC' },
            { name: 'North Dakota', value: 'ND' },
            { name: 'Northern Mariana Islands', value: 'MP' },
            { name: 'Ohio', value: 'OH' },
            { name: 'Oklahoma', value: 'OK' },
            { name: 'Oregon', value: 'OR' },
            { name: 'Palau', value: 'PW' },
            { name: 'Pennsylvania', value: 'PA' },
            { name: 'Puerto Rico', value: 'PR' },
            { name: 'Rhode Island', value: 'RI' },
            { name: 'South Carolina', value: 'SC' },
            { name: 'South Dakota', value: 'SD' },
            { name: 'Tennessee', value: 'TN' },
            { name: 'Texas', value: 'TX' },
            { name: 'Utah', value: 'UT' },
            { name: 'Vermont', value: 'VT' },
            { name: 'Virgin Islands', value: 'VI' },
            { name: 'Virginia', value: 'VA' },
            { name: 'Washington', value: 'WA' },
            { name: 'West Virginia', value: 'WV' },
            { name: 'Wisconsin', value: 'WI' },
            { name: 'Wyoming', value: 'WY' }
        ]);
})();
