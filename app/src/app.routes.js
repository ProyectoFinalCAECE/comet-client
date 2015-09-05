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
                resolve: {
                    user: ['userService', function(userService) {
                      return userService.get();
                    }]
                }
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
            .state('dashboard', {
                url: '/dashboard',
                templateUrl: '/src/dashboard/dashboard-index.html',
                controller: 'DashboardController',
                controllerAs: 'vm',
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
            .state('dashboard.projects', {
                url: '/projects',
                templateUrl: '/src/dashboard/dashboard-projects.html',
                controller: 'UserProfileController',
                controllerAs: 'vm',
            })
            .state('dashboard.profile', {
                url: '/profile',
                templateUrl: '/src/user/user-profile.html',
                controller: 'UserProfileController',
                controllerAs: 'vm'
            });

        $urlRouterProvider.otherwise('/');
    }
