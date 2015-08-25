(function() {
    'use strict';

    angular.module('cometApp')
           .controller('UserController', UserController);

        UserController.$inject = ['$state', 'authService'];

        function UserController ($state, authService) {

          var vm = this;

          vm.user = {};
          vm.create = create;
          vm.login = login;
          vm.logout = logout;

          function create () {
              authService.create(vm.user).error(function(data) {
                  console.log(data);
                  vm.error = data;
              }).then(function() {
                  $state.go('home');
              });
          }

          function login () {
              authService.login(vm.user).error(function (data) {
                  vm.error = data;
              }).then(function () {
                  $state.go('home');
              });
          }

          function logout () {
              authService.logout();
              $state.go('home');
          }
      }
})();
