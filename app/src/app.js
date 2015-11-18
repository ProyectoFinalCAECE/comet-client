(function() {

    'use strict';

    /**
     * @name cometApp
     * @description
     * # cometApp
     * Main module of the application.
     */
    angular
        .module('cometApp', [
            'angularUtils.directives.dirPagination',
            'btford.socket-io',
            'ct.ui.router.extras.previous',
            'inspinia',
            'ncy-angular-breadcrumb',
            'ngAnimate',
            'ngEmbed',
            'ngFileUpload',
            'ngImgCrop',
            'ngMessages',
            'ngSanitize',
            'ngToast',
            'ngTouch',
            'ui.bootstrap',
            'ui.bootstrap.showErrors',
            'ui.router',
            'ui.select',
            'sticky'
        ])
        .run(function($rootScope, $state, $stateParams, helpersService){
          $rootScope.helpers = helpersService;
          // required for the default child state trick to work
          $rootScope.$on('$stateChangeStart', function(evt, to, params) {
            if (to.redirectTo) {
              evt.preventDefault();
              $state.go(to.redirectTo, params);
            }
          });
          // bind $state to rootScope to allow access from views
          $rootScope.$state = $state;
          $rootScope.$stateParams = $stateParams;
        });
})();
