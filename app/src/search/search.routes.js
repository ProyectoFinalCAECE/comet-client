(function() {
  'use strict';

  angular
    .module('cometApp')
    .config(config);

  config.$inject = ['$stateProvider', '$urlRouterProvider'];

  function config ($stateProvider) {
    $stateProvider
      .state('dashboard.project.search-results', {
        url: '/search-results?criterio',
        ncyBreadcrumb: {
          label: 'Resultados de la búsqueda'
        },
        views:{
          '@dashboard': {
            templateUrl: '/src/search/search-results.html',
            controller: 'SearchResultsController',
            controllerAs: 'vm'
          }
        }
    });
  }
})();
