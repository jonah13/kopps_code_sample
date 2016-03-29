/**
 * @author Dmitriy Biletskiy
 */
(function() {
    'use strict';

    angular
        .module('main.module').directive('format', format);


        function format() {
            return {
                require: '?ngModel',
                link: function (scope, elem, attrs, ngModelCtrl) {
                    if(!ngModelCtrl) return;

                    ngModelCtrl.$parsers.push(function(val) {
                        var clean = (attrs.format === 'integer') ? val.replace(/[^0-9]+/g, '') : val.replace(/[^0-9.]+/g, '');

                        if (val !== clean) {
                            ngModelCtrl.$setViewValue(clean);
                            ngModelCtrl.$render();
                        }

                        if (clean)
                            return (attrs.format === 'integer') ? parseInt(clean) : parseFloat(clean);
                        else
                            return 0;
                    });

                    elem.bind('keypress', function(event) {
                        if (event.keyCode === 32)
                            event.preventDefault();
                    });

                    elem.bind('blur', function() {
                        if (!elem.val() || elem.val().toString()[0] === '0') { // sets 1 if user inputs 0 or number with 0 as first character or input is empty
                            ngModelCtrl.$setViewValue('1');
                            ngModelCtrl.$render();
                        }
                    });
                }
            };
        }

})();


