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

          vm.validationErrors = null;

          function create () {
              if (vm.frmCreateUser.$valid) {
                authService.create(vm.user).error(function(data) {
                    console.log(data);
                    loadServerErrors(data);
                }).then(function() {
                    $state.go('home');
                });
            }
          }

          // loadServerErrors({
          //   data: {
          //     errors: { email: "El email ya existe" }
          //     }
          // });
          function loadServerErrors(data) {
            vm.validationErrors = {};
            angular.forEach(data.errors, function(value, key) {
              vm.validationErrors[key] = value;
            });
            console.log(vm.validationErrors);
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
