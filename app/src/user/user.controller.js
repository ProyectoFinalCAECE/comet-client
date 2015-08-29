/**
 * @name UserController
 * @desc Controller for the user-create view
 */

 // SEPARAR CONTROLLER

(function() {
    'use strict';

    angular.module('cometApp')
           .controller('UserController', UserController);

        UserController.$inject = ['$state', 'authService', 'ngToast'];

        function UserController ($state, authService, ngToast) {

          var vm = this;

          vm.user = {};
          vm.create = create;
          vm.login = login;
          vm.logout = logout;
          vm.validationErrors = null;

          /**
           * @name create
           * @desc calls the backend endpoint to create a user
           */
          function create () {
            authService.create(vm.user).error(function(data) {
                loadServerErrors(data);
            }).then(function() {
                $state.go('home');
            });
          }

          /**
           * @name login
           * @desc calls the backend endpoint to login a user
           */
          function login () {
              authService.login(vm.user).error(function (data) {
                  loadServerErrors(data);
              }).then(function () {
                  $state.go('home');
              });
          }

          /**
           * @name logout
           * @desc logouts a user from the application and redirects to home
           */
          function logout () {
              authService.logout();
              $state.go('home');
          }

          /**
           * @name loadServerErrors
           * @desc loads the errors returned from the server in the viewmodel
           * @param {Object} data Object of type:{ errors: { field: message }
           */
          function loadServerErrors(data) {
            if (data && data.errors) {
              vm.validationErrors = {};
              angular.forEach(data.errors, function(value, key) {
                vm.validationErrors[key] = value;
                //form[key].$setValidity("server", false);
              });
            } else {
              ngToast.danger('Ocurrió un error al consultar al servidor.');
            }
          }
      }
})();
