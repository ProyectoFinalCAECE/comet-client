(function() {
  'use strict';

  angular
  .module('cometApp')
  .config(config);

  config.$inject = ['$stateProvider', '$urlRouterProvider'];

  function config ($stateProvider) {
    $stateProvider
      .state('dashboard.project.integration', {
        url: '/integrations/?projectIntegrationId&integrationId&isUpdate',
        ncyBreadcrumb: {
          label: 'Configurar integración',
          parent: 'dashboard.project.project-admin'
        },
        views:{
          '@dashboard': {
            templateUrl: '/src/integrations/integration-create.html',
            controller: 'IntegrationCreateController',
            controllerAs: 'vm'
          }
        },
        resolve: {
          projectIntegration: ['integrationService','$stateParams', 'project', function (integrationService, $stateParams, project) {
            var projectIntegrationId = parseInt($stateParams.projectIntegrationId, 10);
            return integrationService.getProjectIntegrationById(project.id, projectIntegrationId).then(function (response) {
              return response.data.integration;
            });
          }],
          channels: ['channelService', 'project', function (channelService, project) {
            return channelService.getAll(project.id).then(function (response) {
              return response.data;
            });
          }],
          isUpdate: ['$stateParams', function ($stateParams) {
            return $stateParams.isUpdate === 'true';
          }]
        }
      });
    }
  }
)();
