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
            'sticky',
            'trello',
            'wysiwyg.module'
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
        }).config(['TrelloApiProvider', function(TrelloApiProvider) {
          //  Configure the Provider
            TrelloApiProvider.init({
                key: '5196979cb1b5bb0191e54bc94881b5df',
                secret: '3edf69c9dd0489eb62dce6b016e209ca2932d9f8fb0b5f6a26288124fc00041a',
                scopes: {read: true, account: true},
                AppName: 'Comet Trello',
                expiration: "never"
            });
        }]);
})();
