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
                                         'dialogService',
                                         'formsConfig',
                                         'accountService',
                                         'userService',
                                         'user'];

        function UserProfileController ($rootScope, $scope, $state, dialogService, formsConfig, accountService, userService, user) {

          var vm = this;
          vm.validationErrors = null;

          // profile update
          vm.user = user;
          vm.update = update;
          vm.uploadFile = uploadFile;
          vm.profilePicture = null;

          // change password
          vm.password = null;
          vm.newPassword = null;
          vm.confirmPassword = null;
          vm.changePassword = changePassword;
          vm.passwordPattern = formsConfig.passwordLabel;

          // close account
          vm.imSure = false;
          vm.close = close;

          /**
           * @name update
           * @desc calls the backend endpoint to update the user profile
           */
          function update() {
            userService.update(vm.user).error(function(data) {
                vm.validationErrors = $rootScope.helpers.loadServerErrors(data);
            }).then(function() {
                var msg = 'Tus datos se actualizaron exitosamente.';
                var dlg = dialogService.showModalAlert('Editar Perfil', msg);
                dlg.result.then(function () {
                  $state.go('dashboard.project-list');
                }, function () {
                  $state.go('dashboard.project-list');
                });
            });
          }

          /**
           * @name changePassword
           * @desc calls the backend endpoint to update the user profile
           */
          function changePassword() {
            accountService.changePassword(vm.password, vm.newPassword, vm.confirmPassword).error(function(data) {
                vm.validationErrors = $rootScope.helpers.loadServerErrors(data);
            }).then(function() {
                var msg = 'Tus datos se actualizaron exitosamente.';
                var dlg = dialogService.showModalAlert('Editar Perfil', msg);
                dlg.result.then(function () {
                  $state.go('dashboard.project-list');
                }, function () {
                  $state.go('dashboard.project-list');
                });
            });
          }

          /**
           * @name close
           * @desc calls the backend endpoint to close an account
           */
          function close() {
            //closing account on server.
            accountService.closeAccount(vm.password).error(function(data) {
                vm.validationErrors = $rootScope.helpers.loadServerErrors(data);
            }).then(function () {
              //closing client session.
              console.log('pre logout angular');
              accountService.logout();
              console.log('pre logout angular');
              $state.go('home');
            });
          }

          /**
           * @name uploadFile
           * @desc calls the backend endpoint to upload an User's profile picture
           */
          function uploadFile() {
              console.log('file is ' + vm.profilePicture);
              console.dir('vm.profilePicture: ' + vm.profilePicture);
              userService.uploadProfilePicture(vm.profilePicture);
          }
      }
})();
