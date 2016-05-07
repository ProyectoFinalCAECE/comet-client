(function() {
  'use strict';

  angular
    .module('cometApp')
    .config(config);

  config.$inject = ['$stateProvider', '$urlRouterProvider'];

  function config ($stateProvider) {
    $stateProvider
      .state('dashboard.project.search-results', {
        url: '/search-results?criterio&channelId',
        ncyBreadcrumb: {
          label: 'Resultados de la búsqueda'
        },
        views:{
          '@dashboard': {
            templateUrl: 'src/search/search-results.html',
            controller: 'SearchResultsController',
            controllerAs: 'vm'
          }
        },
        resolve: {
          channels: ['channelService', '$stateParams', 'authService', '$state', function (channelService, $stateParams, authService, $state) {
            return channelService.getAll($stateParams.id).error(function() {
              $state.go('dashboard');
            }).then(function (response) {
              return response.data;
            });
          }]
        }
    });
  }
})();
