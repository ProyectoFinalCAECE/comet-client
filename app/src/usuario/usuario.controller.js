(function() {
    'use strict';

    angular.module('cometApp')
           .controller('UsuarioController', UsuarioController);

        UsuarioController.$inject = ['$state', 'autenticacionService'];

        function UsuarioController ($state, autenticacionService) {

          var vm = this;

          vm.usuario = {};
          vm.crear = crear;
          vm.login = login;
          vm.logout = logout;

          function crear () {
              autenticacionService.crear(vm.usuario).error(function(data) {
                  console.log(data);
                  vm.error = data;
              }).then(function() {
                  $state.go('home');
              });
          }

          function login () {
              autenticacionService.login(vm.usuario).error(function (data) {
                  vm.error = data;
              }).then(function () {
                  $state.go('home');
              });
          }

          function logout () {
              autenticacionService.logout();
              $state.go('home');
          }
      }
})();
