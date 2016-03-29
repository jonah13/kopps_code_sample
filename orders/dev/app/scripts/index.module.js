(function() {
  'use strict';

  angular
    .module('kopp', [
          // vendors
          'ngAnimate', 'ngTouch', 'ngSanitize', 'ngMessages', 'ngStorage',
          'ui.router', 'ui.bootstrap', 'ui.select', 'duScroll',
          'toastr', 'bootstrapLightbox', 'xeditable', 'restangular',

          // app modules
          'main.module', 'user.module', 'order.module', 'product.module'
      ]);

})();
