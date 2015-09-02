/**
 * @name AccountLoginController
 * @desc Controller for the login view */

(function() {
    'use strict';

    angular.module('cometApp')
           .controller('AccountLoginController', AccountLoginController);

        AccountLoginController.$inject = ['$rootScope', '$state', 'accountService'];

        function AccountLoginController ($rootScope, $state, accountService) {

          var vm = this;
          vm.validationErrors = null;
          vm.login = login;
          vm.user = null;

          /**
           * @name login
           * @desc calls the backend endpoint to login a user
           */
          function login () {
              accountService.login(vm.user).error(function (data) {
                vm.validationErrors = $rootScope.helpers.loadServerErrors(data);
              }).then(function () {
                  $state.go('dashboard-index');
              });
          }
      }
})();
