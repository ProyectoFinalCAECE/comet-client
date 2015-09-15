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
        .constant("formsConfig", {
          "passwordLabel": "Debe tener entre 6 y 40 caracteres " +
                           "y contener al menos una minúscula, una mayúscula y un símbolo o número."
        })
        .run(function($rootScope, helpersService){
          $rootScope.helpers = helpersService;
        });
})();
