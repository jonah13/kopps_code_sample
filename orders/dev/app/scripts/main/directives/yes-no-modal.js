/**
 * @author Dmitriy Biletskiy
 */
(function() {
    'use strict';

    angular
        .module('main.module')
        .directive('yesNoModal', yesNoModal)
        .controller('YesNoModalController', YesNoModalController);

    /**
     * @ngInject
     */
    function yesNoModal() {
        return {
            scope: {
                yesNoModal: '@',
                onConfirm: '&',
                onCancel: '&?',
                condition: '=',
                params: '=',
                onChange: '@'
            },
            restrict: 'A',
            controller: 'YesNoModalController'
        };
    }

    /**
     * @ngInject
     */
    function YesNoModalController($scope, $element, $modal, toastr, modalsConfigs) {

        $scope.texts = modalsConfigs[$scope.yesNoModal];

        /**
         * Options used to open a modal.
         *
         * @type {{templateUrl: string, size: string, scope: *}}
         */
        var modalOptions = {
            templateUrl: modalsConfigs[$scope.yesNoModal].templateUrl || 'views/main/modal/yes-no-modal.html',
            controller: modalsConfigs[$scope.yesNoModal].controller,
            size: 'sm',
            scope: $scope,
            resolve: {
                params: function () {
                    return $scope.params;
                }
            }
        };

        /**
         * Executes callback and show notification when modal is closed.
         *
         * @param {object} pass some object
         */
        var onModalClosed = function(data) {
            // show notification
            if (modalsConfigs[$scope.yesNoModal].notificationType)
                toastr[modalsConfigs[$scope.yesNoModal].notificationType](modalsConfigs[$scope.yesNoModal].notificationText);

            if ($scope.onConfirm)
                $scope.onConfirm({ data : data });
        };

        /**
         * Executes callback when modal is dismissed.
         */
        var onModalDismissed = function() {
            if ($scope.onCancel) $scope.onCancel();
        };

        // when clicking on attached element we open a modal
        $element.on('click', function() {
            // if it has some trully condition it shows a modal
            if ($scope.condition === true || _.isUndefined($scope.condition))
                $modal.open(modalOptions).result.then(onModalClosed, onModalDismissed);
            else
                $scope.onConfirm();
        });
    }

})();
