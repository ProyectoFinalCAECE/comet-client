(function() {
  'use strict';

  angular
  .module('cometApp')
  .config(config);

  config.$inject = ['$stateProvider', '$urlRouterProvider'];

  function config ($stateProvider) {
    $stateProvider
      .state('dashboard.project-list', {
        url: '/projects',
        templateUrl: '/src/projects/project-list.html',
        controller: 'ProjectListController',
        controllerAs: 'vm',
        ncyBreadcrumb: {
          label: 'Proyectos'
        },
        resolve: {
          projects: ['projectService', function (projectService) {
            return projectService.getAll().then(function (response) {
              return response.data;
            });
          }]
        }
      })
      .state('dashboard.project', {
        abstract: true,
        url: '/projects/:id',
        resolve: {
          project: ['$stateParams', '$state', 'projectService', 'dashboardServiceModel',
          function ($stateParams, $state, projectService, dashboardServiceModel) {
            console.log('dashboard.project resolve', $stateParams.id);
            return projectService.getById($stateParams.id).error(function() {
              $state.go('dashboard');
            }).then(function (response) {
              dashboardServiceModel.setCurrentProject(response.data);
              return response.data;
            });
          }]
        }
      })
      .state('dashboard.project.project-explore', {
        url: '',
        ncyBreadcrumb: {
          label: '{{vm.project.name}}'
        },
        views:{
          '@dashboard': {
            templateUrl: '/src/projects/project-explore.html',
            controller: 'ProjectExploreController',
            controllerAs: 'vm'
          },
          'channels@dashboard.project.project-explore': {
            templateUrl: '/src/channels/channel-list.html',
            controller: 'ChannelListController',
            controllerAs: 'vmc',
            resolve: {
              channels: ['channelService', '$stateParams', 'authService', '$state', function (channelService, $stateParams, authService, $state) {
                return channelService.getAll($stateParams.id).error(function() {
                  $state.go('dashboard');
                }).then(function (response) {
                  return response.data;
                });
              }]
            }
          }
        }
      })
      .state('project-accept', {
        url: '/projects/invitations/accept?token',
        views:{
          '':{templateUrl: '/src/projects/project-accept.html',
          controller: 'ProjectAcceptController',
          controllerAs: 'vm'
        },

        'columnOne@project-accept': {
          templateUrl: '/src/projects/project-accept-create-account.html',
          controller: 'UserCreateController',
          controllerAs: 'vmc'
        },
        'columnTwo@project-accept': {
          templateUrl: '/src/projects/project-accept-login.html',
          controller: 'AccountLoginController',
          controllerAs: 'vml'
        }
      }
    })
    .state('dashboard.project-create', {
      url: '/projects/create',
      templateUrl: '/src/projects/project-create.html',
      controller: 'ProjectCreateController',
      controllerAs: 'vm',
      ncyBreadcrumb: {
        label: 'Crear proyecto'
      }
    })
    .state('dashboard.project-admin', {
      url: '/projects/admin/:id',
      templateUrl: '/src/projects/project-admin.html',
      controller: 'ProjectAdminController',
      controllerAs: 'vm',
      ncyBreadcrumb: {
        label: 'Administrar proyecto'
      },
      resolve: {
        project: ['projectService','$stateParams', function(projectService, $stateParams) {
          return projectService.getById($stateParams.id)
          .then(function(data) { return data.data; });
        }]
      },
      onEnter: ['$state', 'project', function ($state, project) {
        if (!project.isOwner) {
          $state.go('dashboard.project-list');
        }
      }]
    });
  }
})();
