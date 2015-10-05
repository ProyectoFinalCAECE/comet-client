'use strict';

angular
    .module('cometApp')
    .config(config);

    config.$inject = ['$stateProvider', '$urlRouterProvider'];

    function config ($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: '/src/home/home.html',
                controller: 'HomeController',
                controllerAs: 'vm',
                onEnter: ['$state', 'authService', function ($state, authService) {
                    if (authService.isLoggedIn()) {
                        $state.go('dashboard');
                    }
                }]
            })
            .state('user-create', {
                url: '/user/create',
                templateUrl: '/src/user/user-create.html',
                controller: 'UserCreateController',
                controllerAs: 'vm',
                onEnter: ['$state', 'authService', function ($state, authService) {
                    if (authService.isLoggedIn()) {
                        $state.go('home');
                    }
                }]
            })
            .state('account-login', {
                url: '/account/login',
                templateUrl: '/src/account/account-login.html',
                controller: 'AccountLoginController',
                controllerAs: 'vm',
                onEnter: ['$state', 'authService', function ($state, authService) {
                    if (authService.isLoggedIn()) {
                        $state.go('home');
                    }
                }]
            })
            .state('account-confirm', {
                url: '/account/confirm?token',
                templateUrl: '/src/account/account-confirm.html',
                controller: 'AccountConfirmController',
                controllerAs: 'vm'
            })
            .state('account-forgot', {
                url: '/account/forgot',
                templateUrl: '/src/account/account-forgot.html',
                controller: 'AccountRecoverController',
                controllerAs: 'vm',
                onEnter: ['$state', 'authService', function ($state, authService) {
                    if (authService.isLoggedIn()) {
                        $state.go('home');
                    }
                }]
            })
            .state('account-recover', {
                url: '/account/recover?token&email',
                templateUrl: '/src/account/account-recover.html',
                controller: 'AccountRecoverController',
                controllerAs: 'vm',
                onEnter: ['$state', 'authService', function ($state, authService) {
                    if (authService.isLoggedIn()) {
                        $state.go('home');
                    }
                }]
            })
            .state('account-reopen', {
                url: '/account/reopen',
                templateUrl: '/src/account/account-reopen.html',
                controller: 'AccountReopenController',
                controllerAs: 'vm',
                onEnter: ['$state', 'authService', function ($state, authService) {
                    if (authService.isLoggedIn()) {
                        $state.go('home');
                    }
                }]
            })
            .state('account-reopen-return', {
                url: '/account/reopen-return?token&email',
                templateUrl: '/src/account/account-reopen-return.html',
                controller: 'AccountReopenController',
                controllerAs: 'vm',
                onEnter: ['$state', 'authService', function ($state, authService) {
                    if (authService.isLoggedIn()) {
                        $state.go('home');
                    }
                }]
            })
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
                templateUrl: '/src/user/user-profile.html',
                controller: 'UserProfileController',
                controllerAs: 'vm',
                ncyBreadcrumb: {
                  label: 'Editar perfil'
                }
            })
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
            .state('dashboard.project-explore', {
                url: '/project/:id',
                ncyBreadcrumb: {
                  label: '{{vm.project.name}}',
                  parent: 'dashboard.project-list'
                },
                views:{
                        '':{
                            templateUrl: '/src/projects/project-explore.html',
                            controller: 'ProjectExploreController',
                            controllerAs: 'vm',
                            resolve: {
                                      project: ['projectService', '$stateParams', 'authService', '$state', function (projectService, $stateParams, authService, $state) {
                                        return projectService.getById($stateParams.id).error(function() {
                                          $state.go('dashboard');
                                        }).then(function (response) {
                                          return response.data;
                                        });
                                      }]
                                    }
                            },
                        'channels@dashboard.project-explore': {
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
            })
            .state('dashboard.channel-create', {
                url: '/channels/create',
                templateUrl: '/src/channels/channel-create.html',
                controller: 'ChannelCreateController',
                controllerAs: 'vm',
                ncyBreadcrumb: {
                  label: 'Crear canal',
                  parent: 'dashboard.project-explore({id:vm.project.id})'
                }
            })
            .state('dashboard.channel-explore', {
                url: '/channel/:id',
                templateUrl: '/src/channels/channel-explore.html',
                controller: 'ChannelExploreController',
                controllerAs: 'vm',
                ncyBreadcrumb: {
                  label: '{{vm.channel.name}}',
                  parent: 'dashboard.project-explore({id:vm.project.id})'
                },
                resolve: {
                  channel: ['dashboardServiceModel','channelService','$stateParams', function(dashboardServiceModel, channelService, $stateParams) {
                    var currentProject = dashboardServiceModel.getCurrentProject();
                    return channelService.getById(currentProject.id, $stateParams.id)
                          .then(function(data) {
                            console.log('resolve channel', $stateParams.id, data);
                            return data.data;
                          });
                   }]
               }
            });

        $urlRouterProvider.otherwise('/');
    }
