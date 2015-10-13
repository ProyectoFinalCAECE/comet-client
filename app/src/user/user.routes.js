(function() {
  'use strict';

  angular
  .module('cometApp')
  .config(config);

  config.$inject = ['$stateProvider'];

  function config ($stateProvider) {

    $stateProvider
      .state('user-create', {
        url: '/user/create',
        templateUrl: '/src/user/user-create.html',
        controller: 'UserCreateController',
        controllerAs: 'vm',
        onEnter: ['$state', 'authService', function ($state, authService) {
          if (authService.isLoggedIn()) {
            $state.go('home');
          }
        }]
      })
      .state('dashboard.profile', {
        url: '/profile',
        views:{
          '':{
            templateUrl: '/src/user/user-profile.html',
            controller: 'UserProfileController',
            controllerAs: 'vm'
          },
          'resend-confirmation@dashboard.profile': {
            templateUrl: '/src/account/account-resend-confirm.html',
            controller: 'AccountConfirmController',
            controllerAs: 'vmc'
          }
        }
      });
  }
})();
