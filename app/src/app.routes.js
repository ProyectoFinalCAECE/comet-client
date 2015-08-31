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
                controllerAs: 'vm'
            })
            .state('user-login', {
                url: '/user/login',
                templateUrl: '/src/user/user-login.html',
                controller: 'UserController',
                controllerAs: 'vm',
                onEnter: ['$state', 'authService', function ($state, authService) {
                    if (authService.isLoggedIn()) {
                        $state.go('/');
                    }
                }]
            })
            .state('user-create', {
                url: '/user/create',
                templateUrl: '/src/user/user-create.html',
                controller: 'UserController',
                controllerAs: 'vm',
                onEnter: ['$state', 'authService', function ($state, authService) {
                    if (authService.isLoggedIn()) {
                        $state.go('/');
                    }
                }]
            })
            .state('user-profile', {
                url: '/user/profile',
                templateUrl: '/src/user/user-profile.html',
                controller: 'UserProfileController',
                controllerAs: 'vm',
                onEnter: ['$state', 'authService', function ($state, authService) {
                    if (!authService.isLoggedIn()) {
                        $state.go('/');
                    }
                }]
            })
            .state('user-forgot', {
                url: '/user/forgot',
                templateUrl: '/src/user/user-forgot.html',
                controller: 'UserController',
                controllerAs: 'vm',
                onEnter: ['$state', 'authService', function ($state, authService) {
                    if (authService.isLoggedIn()) {
                        $state.go('/');
                    }
                }]
            })
            .state('account-confirm', {
                url: '/account/confirm?token',
                templateUrl: '/src/account/account-confirm.html',
                controller: 'AccountController',
                controllerAs: 'vm'
            });

        $urlRouterProvider.otherwise('/');
    }
