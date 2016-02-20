(function() {
  'use strict';

  angular
  .module('cometApp')
  .config(config);

  config.$inject = ['$stateProvider', '$urlRouterProvider'];

  function config ($stateProvider, $urlRouterProvider) {

    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: '/src/home/home.html',
        controller: 'HomeController',
        controllerAs: 'vm',
        onEnter: ['$state', 'authService', function ($state, authService) {
          if (authService.isLoggedIn()) {
            $state.go('dashboard');
          }
        }]
      })
      .state('video-test', {
        url: '/test?room',
        templateUrl: '/src/video/test.html',
        controller: 'VideoIndexController',
        controllerAs: 'vm'
      });

      $urlRouterProvider.otherwise(function ($injector) {
          var $state = $injector.get('$state');
          $state.go('home');
      });
  }
})();
