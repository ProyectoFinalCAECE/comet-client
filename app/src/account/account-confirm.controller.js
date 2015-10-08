/**
 * @name AccountConfirmController
 * @desc Controller for the accounts confirm views */

(function() {
    'use strict';

    angular.module('cometApp')
           .controller('AccountConfirmController', AccountConfirmController);

        AccountConfirmController.$inject = ['$state', '$stateParams', 'accountService'];

        function AccountConfirmController ($state, $stateParams, accountService) {

          var vm = this;
          vm.confirm = confirm;
          vm.resendConfirmation = resendConfirmation;
          vm.token = $stateParams.token;
          vm.confirmedAccount = false;
          vm.confirmationError = false;
          vm.resend = false;
          vm.resendSuccess = false;
          vm.resendError = false;

          activate();

          /**
           * @name activate
           * @desc controller startup logic
           */
          function activate() {
            confirm();
          }

          /**
           * @name confirm
           * @desc calls the backend endpoint to confirm a user
           */
          function confirm () {
            accountService.confirm(vm.token).error(function(data) {
                vm.confirmationError = true;
                console.log(data);
            }).then(function() {
                vm.confirmedAccount = true;
                console.log("Cuenta confirmada");
            });
          }

          /**
           * @name confirm
           * @desc calls the backend endpoint to resend the confirmation email
           */
          function resendConfirmation () {
            vm.resend = false;

            accountService.resendConfirmation('asd').error(function(data) {
              vm.resend = true;
              vm.resendError = true;
              console.log("error:" + data);
            }).then(function() {
                vm.resend = true;
                vm.resendSuccess = true;
                console.log("confirmation resend");
            });
          }
      }
})();
