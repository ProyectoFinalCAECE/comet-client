/**
 * @name AccountRecoverController
 * @desc Controller for the recover password views */

(function() {
    'use strict';

    angular.module('cometApp')
           .controller('AccountRecoverController', AccountRecoverController);

        AccountRecoverController.$inject = ['$rootScope', '$state', '$stateParams', 'ngToast', 'accountService'];

        function AccountRecoverController ($rootScope, $state, $stateParams, ngToast, accountService) {

          var vm = this;
          vm.validationErrors = null;
          // account-forgot
          vm.recoverPassword = recoverPassword;
          vm.recoverPasswordValidate = recoverPasswordValidate;
          vm.enviado = false;
          vm.email = null;
          // account-recover
          vm.token = $stateParams.token;
          vm.recoverEmail = $stateParams.email;
          vm.password = null;
          vm.confirmPassword = null;
          vm.passwordChanged = false;

          /**
           * @name recoverPassword
           * @desc calls the backend endpoint that sends a password reset email
           */
          function recoverPassword () {
            accountService.recoverPassword(vm.email).error(function(data) {
                vm.validationErrors = $rootScope.helpers.loadServerErrors(data);
                vm.enviado = false;
            }).then(function() {
                vm.enviado = true;
            });
          }

          /**
           * @name recoverPasswordValidate
           * @desc calls the backend endpoint that sets a new password for the user
           */
          function recoverPasswordValidate () {
            accountService.recoverPasswordValidate(vm.token, vm.password, vm.confirmPassword).error(function(data) {
                vm.validationErrors = $rootScope.helpers.loadServerErrors(data);
                if (vm.validationErrors === null)
                {
                  ngToast.danger('Ocurrió un error al consultar el servidor.');
                }
                vm.passwordChanged = false;
            }).then(function() {
                vm.passwordChanged = true;
            });
          }
      }
})();
