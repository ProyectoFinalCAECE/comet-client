(function() {
  'use strict';

  angular
  .module('cometApp')
  .config(config);

  config.$inject = ['$stateProvider'];

  function config ($stateProvider) {

    $stateProvider
      .state('account-login', {
        url: '/account/login',
        templateUrl: '/src/account/account-login.html',
        controller: 'AccountLoginController',
        controllerAs: 'vm',
        onEnter: ['$state', 'authService', function ($state, authService) {
          if (authService.isLoggedIn()) {
            $state.go('home');
          }
        }]
      })
      .state('account-confirm', {
        url: '/account/confirm?token',
        templateUrl: '/src/account/account-confirm.html',
        controller: 'AccountConfirmController',
        controllerAs: 'vm'
      })
      .state('account-forgot', {
        url: '/account/forgot',
        templateUrl: '/src/account/account-forgot.html',
        controller: 'AccountRecoverController',
        controllerAs: 'vm',
        onEnter: ['$state', 'authService', function ($state, authService) {
          if (authService.isLoggedIn()) {
            $state.go('home');
          }
        }]
      })
      .state('account-recover', {
        url: '/account/recover?token&email',
        templateUrl: '/src/account/account-recover.html',
        controller: 'AccountRecoverController',
        controllerAs: 'vm',
        onEnter: ['$state', 'authService', function ($state, authService) {
          if (authService.isLoggedIn()) {
            $state.go('home');
          }
        }]
      })
      .state('account-reopen', {
        url: '/account/reopen',
        templateUrl: '/src/account/account-reopen.html',
        controller: 'AccountReopenController',
        controllerAs: 'vm',
        onEnter: ['$state', 'authService', function ($state, authService) {
          if (authService.isLoggedIn()) {
            $state.go('home');
          }
        }]
      })
      .state('account-reopen-return', {
        url: '/account/reopen-return?token&email',
        templateUrl: '/src/account/account-reopen-return.html',
        controller: 'AccountReopenController',
        controllerAs: 'vm',
        onEnter: ['$state', 'authService', function ($state, authService) {
          if (authService.isLoggedIn()) {
            $state.go('home');
          }
        }]
      });
  }
})();
