/**
 * @name UserController
 * @desc Controller for the user-create view
 */

 // SEPARAR CONTROLLER

(function() {
    'use strict';

    angular.module('cometApp')
           .controller('UserController', UserController);

        UserController.$inject = ['$rootScope', '$state', 'ngToast', 'userService'];

        function UserController ($rootScope, $state, ngToast, userService) {

          var vm = this;

          vm.user = {};
          vm.create = create;
          vm.validationErrors = null;

          /**
           * @name create
           * @desc creates a user
           */
          function create () {
            userService.create(vm.user).error(function(data) {
              vm.validationErrors = $rootScope.helpers.loadServerErrors(data);
              if (vm.validationErrors === null)
              {
                ngToast.danger('Ocurrió un error al consultar al servidor.');
              }
            }).then(function() {
                $state.go('home');
            });
          }
      }
})();
