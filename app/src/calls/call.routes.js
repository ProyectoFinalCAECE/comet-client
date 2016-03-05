(function() {
  'use strict';

  angular
    .module('cometApp')
    .config(config);

  config.$inject = ['$stateProvider', '$urlRouterProvider'];

  function config ($stateProvider) {
    $stateProvider
      .state('dashboard.project.call-index', {
        url: '/call/:room',
        ncyBreadcrumb: {
          label: 'Videoconferencia'
        },
        views:{
          '@dashboard': {
            templateUrl: '/src/calls/call-index.html',
            controller: 'CallIndexController',
            controllerAs: 'vm'
          }
        }
    });
  }
})();