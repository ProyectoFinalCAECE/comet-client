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
            .state('usuario-login', {
                url: '/usuario/login',
                templateUrl: '/src/usuario/usuario-login.html',
                controller: 'UsuarioController',
                controllerAs: 'vm',
                onEnter: ['$state', 'autenticacionService', function ($state, autenticacionService) {
                    if (autenticacionService.estaLogueado()) {
                        $state.go('home');
                    }
                }]
            })
            .state('usuario-crear', {
                url: '/usuario/crear',
                templateUrl: '/src/usuario/usuario-crear.html',
                controller: 'UsuarioController',
                controllerAs: 'vm',
                onEnter: ['$state', 'autenticacionService', function ($state, autenticacionService) {
                    if (autenticacionService.estaLogueado()) {
                        $state.go('home');
                    }
                }]
            });

        $urlRouterProvider.otherwise('home');
    }
