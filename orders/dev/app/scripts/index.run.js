(function() {
    'use strict';

    angular
        .module('kopp')
        .run(mainRun)
        .run(editableRun);

    /**
     * @ngInject
     */
    function mainRun(
        $rootScope,
        $window,
        $location,
        $sessionStorage,
        $state,
        $stateParams,
        AuthService,
        PaginationService,
        EventDispatcher
    ) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;

        /* Redirects if user is not logged in or is not permitted */
        $rootScope.$on('$stateChangeStart', function (event, next, nextParams, prev) {
            if (AuthService.isNotLoggedIn(next.authenticate) || AuthService.isNotPermitted(next.role)) {
                event.preventDefault();
                $sessionStorage.urlBeforeLogin = $location.$$url;
                logout();
            }

            // we don't need to unset pagination if we didn't leave module
            if (getModuleName(prev.name) !== getModuleName(next.name)) {
                PaginationService.unset();
            }
        });

        $rootScope.goTo = function() {
            var state = ($stateParams.location)
                ? 'location.admin-index'
                : ($stateParams.user)
                ? 'user.index'
                : 'account.index';

            $state.go(state);
        };

        /**
         * Redirects to the dashboard page
         */
        $rootScope.goToDashboard = function() {
            if (~['corporate_user', 'customer'].indexOf(AuthService.getRole()))
                $state.go('main.dashboard');
            else
                $state.go('main.' + AuthService.getRole() + '_dashboard');
        };

        $rootScope.breadcrumbPart = function() {
            return ($stateParams.location)
                ? 'location'
                : ($stateParams.user)
                ? 'user'
                : 'account';
        };

        /* Redirects if user has 401 error */
        EventDispatcher.on('LOGOUT', logout);

        function logout() {
            AuthService.logout();
            $window.location.href = $window.location.href.split('#')[0];
        }

        function getModuleName(moduleName) {
            return moduleName.split('.')[0] || '';
        }

        /* Prints a number of watchers on the page */
        function countWatchers() {
            var q = [$rootScope], watchers = 0, scope;

            while (q.length > 0) {
                scope = q.pop();
                if (scope.$$watchers) {
                    watchers += scope.$$watchers.length;
                }
                if (scope.$$childHead) {
                    q.push(scope.$$childHead);
                }
                if (scope.$$nextSibling) {
                    q.push(scope.$$nextSibling);
                }
            }

            console.log(watchers);
        }

        //setInterval(countWatchers, 3000);
    }


    /**
     * @ngInject
     */
    function editableRun(editableOptions, editableThemes) {
        editableThemes.bs3.inputClass = 'input-sm';
        editableThemes.bs3.buttonsClass = 'btn-sm';
        editableOptions.theme = 'bs3';
    }

})();
