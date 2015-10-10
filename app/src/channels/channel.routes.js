(function() {
  'use strict';

  angular
  .module('cometApp')
  .config(config);

  config.$inject = ['$stateProvider', '$urlRouterProvider'];
  
  function config ($stateProvider) {
    $stateProvider
    .state('dashboard.channel-create', {
      url: '/channels/create',
      templateUrl: '/src/channels/channel-create.html',
      controller: 'ChannelCreateController',
      controllerAs: 'vm',
      ncyBreadcrumb: {
        label: 'Crear canal',
        parent: 'dashboard.project-explore({id:vm.project.id})'
      },
      resolve: {
        user: ['dashboardServiceModel',
        function(dashboardServiceModel) {
          return dashboardServiceModel.getCurrentUser();
        }],
        project: ['dashboardServiceModel',
        function(dashboardServiceModel) {
          return dashboardServiceModel.getCurrentProject();
        }]
      }
    })
    .state('dashboard.channel-explore', {
      url: '/channel/:id',
      ncyBreadcrumb: {
        label: '{{vm.channel.name}}',
        parent: 'dashboard.project-explore({id:vm.project.id})'
      },
      views:{
        '':{
          templateUrl: '/src/channels/channel-explore.html',
          controller: 'ChannelExploreController',
          controllerAs: 'vm'
        },
        'channel-admin@dashboard.channel-explore':{
          templateUrl: '/src/channels/channel-admin.html',
          controller: 'ChannelAdminController',
          controllerAs: 'vmc',
        }
      },
      resolve: {
        channel: ['dashboardServiceModel','channelService','$stateParams', function(dashboardServiceModel, channelService, $stateParams) {
          var currentProject = dashboardServiceModel.getCurrentProject();
          return channelService.getById(currentProject.id, $stateParams.id)
          .then(function(data) {
            return data.data;
          });
        }],
        project: ['dashboardServiceModel', function(dashboardServiceModel) {
          return dashboardServiceModel.getCurrentProject();
        }],
        user: ['dashboardServiceModel', function(dashboardServiceModel) {
          return dashboardServiceModel.getCurrentUser();
        }]
      }
    });
  }
}
)();
