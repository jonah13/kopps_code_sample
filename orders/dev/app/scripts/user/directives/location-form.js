/**
 * @author Dmitriy Biletskiy
 */
(function() {
    'use strict';

    angular
        .module('user.module')
        .directive('locationForm', locationForm)
        .controller('LocationFormController', LocationFormController);

    /**
     * @ngInject
     */
    function locationForm() {
        return {
            scope: {
                location: '=',
                onSave: '&',
                onClose: '&',
                buttonName: '@'
            },
            restrict: 'E',
            controller: 'LocationFormController',
            templateUrl: 'views/user/location/location-form.html'
        };
    }

    /**
     * @ngInject
     */
    function LocationFormController($scope, usStateList) {

        $scope.statesList = usStateList; // list of states
        $scope.location = $scope.location || {};

        $scope.save = function(event) {
            event.preventDefault();
            event.stopPropagation();
            $scope.onSave({ data: $scope.location });
        };
    }

})();