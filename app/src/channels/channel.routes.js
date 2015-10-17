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
    })
    .state('dashboard.project.channel-closed-list', {
      url: '/channels/closed',
      ncyBreadcrumb: {
        label: 'Canales cerrados',
        parent: 'dashboard.project.project-explore'
      },
      views:{
        '@dashboard': {
          templateUrl: '/src/channels/channel-closed-list.html',
          controller: 'ChannelClosedListController',
          controllerAs: 'vm'
        }
      },
      resolve: {
        channels: ['channelService', '$stateParams', '$state', function (channelService, $stateParams, $state) {
          return channelService.getAll($stateParams.id).error(function() {
            $state.go('dashboard');
          }).then(function (response) {
            return response.data;
          });
        }]
      }
      });
    }
  }
)();
