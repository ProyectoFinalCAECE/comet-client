(function() {

    'use strict';

    /**
     * @ngdoc overview
     * @name cometApp
     * @description
     * # cometApp
     *
     * Main module of the application.
     */
    angular
        .module('cometApp', [
            'ngAnimate',
            'ngMessages',
            'ngSanitize',
            'ngToast',
            'ngTouch',
            'ncy-angular-breadcrumb',
            'ui.bootstrap',
            'ui.bootstrap.showErrors',
            'ui.router'
        ])
        .constant('formsConfig', {
          'passwordLabel': 'Debe tener entre 6 y 40 caracteres ' +
                           'y contener al menos una minúscula, una mayúscula y un símbolo o número.'
        })
        .constant("dialogType", {
          ALERT: 1,
          CONFIRM: 2
        })
        .constant('constraints', {
          projectPerUser: 30,
          membersPerProject: 50,
          membersPerProjectPerStep: 10 
        })
        .run(function($rootScope, $state, helpersService){
          $rootScope.helpers = helpersService;
          // required for the default child state trick to work
          $rootScope.$on('$stateChangeStart', function(evt, to, params) {
            if (to.redirectTo) {
              evt.preventDefault();
              $state.go(to.redirectTo, params);
            }
          });
        });
})();
