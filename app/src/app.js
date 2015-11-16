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
        // lodash support
        .constant('lodash', window._)
        // momentJS support
        .constant('moment', window.moment)
        // global forms configuration
        .constant('formsConfig', {
          'passwordLabel': 'Debe tener entre 6 y 40 caracteres ' +
                           'y contener al menos una minúscula, una mayúscula y un símbolo o número.'
        })
        // global dialog types
        .constant("dialogType", {
          ALERT: 1,
          CONFIRM: 2
        })
        // message types
        .constant('messageType', {
          TEXT: '1',
          FILE: '2',
          INTEGRATION: '3',
          AUTO: '4'
        })
        // system notification types
        .constant('systemNotificationType', {
          CHANNEL_CREATE: 1,
          CHANNEL_CLOSE: 2,
          CHANNEL_JOIN: 3,
          PROJECT_CLOSE: 4,
          PROJECT_JOIN: 5,
          CHANNEL_EDIT: 6,
          PROJECT_EDIT: 7
        })
        // global constraints
        .constant('constraints', {
          projectPerUser: 30,
          membersPerProject: 50,
          membersPerProjectPerStep: 10
        })
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
