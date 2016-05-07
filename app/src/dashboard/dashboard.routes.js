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
        templateUrl: 'src/dashboard/dashboard-index.html',
        controller: 'DashboardController',
        controllerAs: 'vm',
        ncyBreadcrumb: {
          label: 'Proyectos'
        },
        redirectTo: 'dashboard.project-list',
        resolve: {
          user: ['userService', 'dashboardServiceModel', function(userService, dashboardServiceModel) {
              return userService.get().then(function (user) {
                dashboardServiceModel.setCurrentUser(user);
                return user;
              });
          }]
        },
        onEnter: ['$state', 'authService', function ($state, authService) {
          if (!authService.isLoggedIn()) {
            $state.go('home');
          }
        }]
      });
  }
})();
