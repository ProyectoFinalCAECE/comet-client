(function() {
  'use strict';

  angular
    .module('cometApp')
    .config(config);

  config.$inject = ['$stateProvider', '$urlRouterProvider'];

  function config ($stateProvider) {
    $stateProvider
      .state('dashboard.project.video-index', {
        url: '/video/:room',
        ncyBreadcrumb: {
          label: 'Videoconferencia'
        },
        views:{
          '@dashboard': {
            templateUrl: '/src/video/video-index.html',
            controller: 'VideoIndexController',
            controllerAs: 'vm'
          }
        }
    });
  }
})();
