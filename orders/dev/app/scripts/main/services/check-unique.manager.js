/**
 * @author Dmitriy Biletskiy
 */
(function() {
    'use strict';

    angular
        .module('main.module')
        .service('CheckUniqueManager', CheckUniqueManager);

    function CheckUniqueManager(Restangular) {

        return {

            /**
             * Checks if value already was used for some table.
             *
             * @param {string} fieldName
             * @param {string} tableName
             * @param {string} val
             * @param {string} editId
             */
            check: function(tableName, fieldName, val, editId) {
                return Restangular
                    .one('table', tableName)
                    .one('field', fieldName)
                    .one('value', val)
                    .one('id', editId)
                    .get();
            }
        };

    }

})();