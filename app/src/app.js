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
            'ui.bootstrap',
            'ui.bootstrap.showErrors',
            'ui.router'
        ])
        .run(function($rootScope, helpersService){
          $rootScope.helpers = helpersService;
        });
})();
