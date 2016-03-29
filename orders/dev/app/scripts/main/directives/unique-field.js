/**
 * @author Dmitriy Biletskiy
 */
(function() {
    'use strict';

    angular.module('main.module').directive('uniqueField', uniqueField);

    /**
     * @ngInject
     */
    function uniqueField(CheckUniqueManager, $q) {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function(scope, elm, attrs, ctrl) {

                ctrl.$asyncValidators.unique = function(modelValue) {
                    if (ctrl.$isEmpty(modelValue))
                        return $q.when();

                    return CheckUniqueManager
                        .check(
                            attrs.uniqueField,
                            attrs.ngModel.split('.')[1],
                            modelValue,
                            eval('scope.' + attrs.editId) || NaN
                        ).then(function(res) {
                            if (res.exist)
                                throw 'Value exists';
                        });
                };
            }
        };
    }
})();
