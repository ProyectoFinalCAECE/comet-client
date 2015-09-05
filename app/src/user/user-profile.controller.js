/**
 * @name UserProfileController
 * @desc Controller for the user-profile view
 */

(function() {
    'use strict';

    angular.module('cometApp')
           .controller('UserProfileController', UserProfileController);

        UserProfileController.$inject = ['$rootScope',
                                         '$scope',
                                         '$state',
                                         'ngToast',
                                         'accountService',
                                         'userService',
                                         'user'];

        function UserProfileController ($rootScope, $scope, $state, ngToast, accountService, userService, user) {

          var vm = this;
          vm.validationErrors = null;

          // profile update
          vm.user = user;
          vm.update = update;

          // change password
          vm.password = null;
          vm.newPassword = null;
          vm.confirmPassword = null;
          vm.changePassword = changePassword;

          // close account


          /**
           * @name update
           * @desc calls the backend endpoint to update the user profile
           */
          function update() {

            $scope.$broadcast('show-errors-check-validity');
            if (vm.frmUpdate.$invalid) {
              return;
            }

            userService.update(vm.user).error(function(data) {
                vm.validationErrors = $rootScope.helpers.loadServerErrors(data);
            }).then(function () {
                ngToast.success("Tu perfil ha sido editado exitosamente.");
            });
          }

          /**
           * @name update
           * @desc calls the backend endpoint to update the user profile
           */
          function changePassword() {
            accountService.changePassword(vm.password, vm.newPassword).error(function(data) {
                vm.validationErrors = $rootScope.helpers.loadServerErrors(data);
            }).then(function () {
                $state.go('dashboard');
            });
          }


      }
})();
