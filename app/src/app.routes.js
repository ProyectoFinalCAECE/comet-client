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
                    }else {
                        console.log("pasè por dashboard");
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
            });

        $urlRouterProvider.otherwise('/');
    }
