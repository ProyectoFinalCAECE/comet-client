(function() {
  'use strict';

  angular
  .module('cometApp')
  .config(config);

  config.$inject = ['$stateProvider', '$urlRouterProvider'];

  function config ($stateProvider) {
    $stateProvider
      .state('dashboard.project.channel-create', {
        url: '/channels/create',
        ncyBreadcrumb: {
          label: 'Crear canal',
          parent: 'dashboard.project.project-explore'
        },
        views:{
          '@dashboard': {
            templateUrl: '/src/channels/channel-create.html',
            controller: 'ChannelCreateController',
            controllerAs: 'vm'
          }
        }
      })
      .state('dashboard.project.channel-explore', {
        url: '/channels/:channelId',
        ncyBreadcrumb: {
          label: '{{vm.channel.name}}',
          parent: 'dashboard.project.project-explore'
        },
        views:{
          '@dashboard': {
            templateUrl: '/src/channels/channel-explore.html',
            controller: 'ChannelExploreController',
            controllerAs: 'vm'
          },
          'channel-admin@dashboard.project.channel-explore': {
            templateUrl: '/src/channels/channel-admin.html',
            controller: 'ChannelAdminController',
            controllerAs: 'vmc',
          }
        },
        resolve: {
          channel: ['$stateParams', 'project','channelService',
          function($stateParams, project, channelService) {
            return channelService.getById(project.id, $stateParams.channelId)
            .then(function(data) {
              return data.data;
            });
          }]
        }
    });
  }
}
)();