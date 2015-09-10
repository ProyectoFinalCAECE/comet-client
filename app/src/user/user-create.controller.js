/**
 * @name UserCreateController
 * @desc Controller for the user-create view
 */

(function() {
    'use strict';

    angular.module('cometApp')
           .controller('UserCreateController', UserCreateController);

        UserCreateController.$inject = ['$rootScope', '$state', 'ngToast', 'userService'];

        function UserCreateController ($rootScope, $state, ngToast, userService) {

          var vm = this;

          vm.user = {};
          vm.create = create;

          vm.passwordPattern = "Debe tener entre 6 y 40 caracteres " +
                                "y contener al menos una minúscula, una mayúscula y un símbolo o número.";
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
                $state.go('dashboard.project-list');
            });
          }
      }
})();
