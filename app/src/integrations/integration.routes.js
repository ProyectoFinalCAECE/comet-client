(function() {
  'use strict';

  angular
  .module('cometApp')
  .config(config);

  config.$inject = ['$stateProvider', '$urlRouterProvider'];

  function config ($stateProvider) {
    $stateProvider
      .state('dashboard.project.integration', {
        url: '/integrations/:projectIntegrationId',
        ncyBreadcrumb: {
          label: 'Configurar integración',
          parent: 'dashboard.project.project-explore'
        },
        views:{
          '@dashboard': {
            templateUrl: '/src/integrations/integration-create.html',
            controller: 'IntegrationCreateController',
            controllerAs: 'vm'
          }
        }
      });
    }
  }
)();
