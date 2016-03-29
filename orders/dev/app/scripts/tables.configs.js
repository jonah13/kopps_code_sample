(function() {
    'use strict';

    angular
        .module('kopp')

        .value('tablesData', {
            'CUSTOMER_DASHBOARD': {
                fields: [
                    { name: 'Order ID', propertyName: 'id', sorting: true, filter: { name: 'orderId' }, class: 'link hover', redirect: { name: 'order.detail', param: 'orderId' } },
                    { name: 'PO number', propertyName: 'po', sorting: true },
                    { name: 'Number of Items', propertyName: 'total_amount', sorting: true },
                    { name: 'Total Price ($)', propertyName: 'sum_price', filter: { name: 'number', param: 2 }, sorting: true },
                    { name: 'Order Date', propertyName: 'updated_at', sorting: true },
                    { name: 'Status', propertyName: 'status', sorting: true, filter: { name: 'types', param:'order' }, class: 'label capitalize' },
                    { name: '' }
                ],
                buttons: [
                    { name: 'Duplicate Order', class: 'btn btn-sm btn-info', confirmation: 'DUPLICATE_THE_ORDER' }
                ],
                redirectParams: ['orderId'],
                onEmptyMessage: 'There is not any submitted order in the system.',
                backendSorting: false
            },

            'CUSTOMER_RECENT_ORDERS': {
                fields: [
                    { name: 'Order ID', propertyName: 'id', sorting: true, filter: { name: 'orderId' }, class: 'link hover', redirect: { name: 'order.detail', param: 'orderId' } },
                    { name: 'PO number', propertyName: 'po', sorting: true },
                    { name: 'Number of Items', propertyName: 'total_amount', sorting: true },
                    { name: 'Total Price ($)', propertyName: 'sum_price', filter: { name: 'number', param: 2 }, sorting: true },
                    { name: 'Ordered by', propertyName: 'first_name', filter: { name: 'getOwner' }, sorting: true },
                    { name: 'Order Date', propertyName: 'updated_at', sorting: true },
                    { name: 'Status', propertyName: 'status', sorting: true, filter: { name: 'types', param:'order' }, class: 'label capitalize' },
                    { name: '' }
                ],
                buttons: [
                    { name: 'Duplicate Order', class: 'btn btn-sm btn-info', confirmation: 'DUPLICATE_THE_ORDER' }
                ],
                redirectParams: ['orderId'],
                onEmptyMessage: 'There is not any order in the system.',
                backendSorting: true
            },

            'CUSTOMER_DRAFT_ORDERS': {
                fields: [
                    { name: 'Order Date', propertyName: 'created_at', sorting: true },
                    { name: 'Number of Items', propertyName: 'total_amount', sorting: true },
                    { name: 'Created by', propertyName: 'first_name', sorting: true },
                    { name: 'Total Price ($)', propertyName: 'sum_price', filter: { name: 'number', param: 2 }, sorting: true },
                    { name: '' }
                ],
                buttons: [
                    { name: 'View Order', class: 'btn btn-sm btn-info', redirect: { name: 'order.draft-view', param: 'orderId' } },
                    { name: 'Remove Order', class: 'btn btn-sm btn-danger' }
                ],
                redirectParams: ['orderId'],
                onEmptyMessage: 'You have not created any draft list yet.',
                backendSorting: true
            }
        });

})();
