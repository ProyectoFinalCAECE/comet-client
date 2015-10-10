(function() {
  'use strict';

  angular
  .module('cometApp')
  .config(config);

  config.$inject = ['$stateProvider', '$urlRouterProvider'];

  function config ($stateProvider) {

    $stateProvider
    .state('dashboard', {
      url: '/dashboard',
      templateUrl: '/src/dashboard/dashboard-index.html',
      controller: 'DashboardController',
      controllerAs: 'vm',
      ncyBreadcrumb: {
        label: 'Inicio'
      },
      redirectTo: 'dashboard.project-list',
      resolve: {
        user: ['userService', function(userService) {
          return userService.get();
        }]
      },
      onEnter: ['$state', 'authService', function ($state, authService) {
        if (!authService.isLoggedIn()) {
          $state.go('home');
        }
      }]
    })
    .state('dashboard.profile', {
      url: '/profile',
      ncyBreadcrumb: {
        label: 'Editar perfil'
      },
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
