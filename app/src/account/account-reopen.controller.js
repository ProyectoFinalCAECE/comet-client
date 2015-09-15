/**
 * @name AccountReopenController
 * @desc Controller for the reopen account views */

(function() {
    'use strict';

    angular.module('cometApp')
           .controller('AccountReopenController', AccountReopenController);

        AccountReopenController.$inject = ['$rootScope', '$state', '$stateParams', 'ngToast', 'accountService'];

        function AccountReopenController ($rootScope, $state, $stateParams, ngToast, accountService) {

          var vm = this;
          vm.validationErrors = null;
          // account-reopen
          vm.reopenAccount = reopenAccount;
          vm.reopenAccountValidate = reopenAccountValidate;
          vm.enviado = false;
          vm.email = null;
          // account-reopen-return
          vm.token = $stateParams.token;
          vm.reopenEmail = $stateParams.email;
          vm.password = null;
          vm.confirmPassword = null;
          vm.accountOpened = false;

          /**
           * @name reopenAccount
           * @desc calls the backend endpoint that sends a account reopen email
           */
          function reopenAccount () {
            accountService.reopenAccount(vm.email).error(function(data) {
                vm.validationErrors = $rootScope.helpers.loadServerErrors(data);
                vm.enviado = false;
            }).then(function() {
                vm.enviado = true;
            });
          }

          /**
           * @name reopenAccountValidate
           * @desc calls the backend endpoint that set the account state = open
           */
          function reopenAccountValidate () {
            accountService.reopenAccountValidate(vm.token, vm.password, vm.confirmPassword).error(function(data) {
                vm.validationErrors = $rootScope.helpers.loadServerErrors(data);
                if (vm.validationErrors === null)
                {
                  ngToast.danger('Ocurrió un error al consultar el servidor.');
                }
                vm.accountOpened = false;
            }).then(function() {
                vm.accountOpened = true;
            });
          }
      }
})();
