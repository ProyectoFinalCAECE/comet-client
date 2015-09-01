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
            .state('user-create', {
                url: '/user/create',
                templateUrl: '/src/user/user-create.html',
                controller: 'UserController',
                controllerAs: 'vm',
                onEnter: ['$state', 'authService', function ($state, authService) {
                    if (authService.isLoggedIn()) {
                        $state.go('home');
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
                url: '/account/recover?token',
                templateUrl: '/src/account/account-recover.html',
                controller: 'AccountRecoverController',
                controllerAs: 'vm',
                onEnter: ['$state', 'authService', function ($state, authService) {
                    if (authService.isLoggedIn()) {
                        $state.go('home');
                    }
                }]
            });

        $urlRouterProvider.otherwise('/');
    }
