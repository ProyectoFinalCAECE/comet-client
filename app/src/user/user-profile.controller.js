/**
 * @name UserProfileController
 * @desc Controller for the user-profile view
 */

(function() {
    'use strict';

    angular.module('cometApp')
           .controller('UserProfileController', UserProfileController);

        UserProfileController.$inject = ['$log',
                                         '$rootScope',
                                         '$scope',
                                         '$state',
                                         '$previousState',
                                         '$modal',
                                         'ngToast',
                                         'authService',
                                         'dialogService',
                                         'Upload',
                                         'formsConfig',
                                         'dashboardServiceModel',
                                         'accountService',
                                         'userService',
                                         'user'];

        function UserProfileController ($log,
                                        $rootScope,
                                        $scope,
                                        $state,
                                        $previousState,
                                        $modal,
                                        ngToast,
                                        authService,
                                        dialogService,
                                        Upload,
                                        formsConfig,
                                        dashboardServiceModel,
                                        accountService,
                                        userService,
                                        user) {

          var vm = this;
          vm.validationErrors = null;
          vm.onTabSelected = onTabSelected;
          vm.cancel = cancel;
          vm.user = user;

          // profile update
          vm.update = update;

          // avatar
          vm.sourceImage = '';
          vm.croppedImageDataUrl = '';
          vm.progress = -1;
          vm.upload = upload;

          // change password
          vm.password = null;
          vm.newPassword = null;
          vm.confirmPassword = null;
          vm.changePassword = changePassword;
          vm.passwordPattern = formsConfig.passwordLabel;

          // close account
          vm.imSure = false;
          vm.closeAccount = closeAccount;

          activate();

          /**
           * @name activate
           * @desc controler activation logic
           */
          function activate () {
            dashboardServiceModel.setCurrentProject(null);
          }

          /**
           * @name update
           * @desc calls the backend endpoint to update the user profile
           */
          function update() {
            userService.update(vm.user).error(function(data) {
                vm.validationErrors = $rootScope.helpers.loadServerErrors(data);
            }).then(userUpdateSuccess);
          }

          /**
           * @name userUpdateSuccess
           * @desc displays a successful message to the user
           */
          function userUpdateSuccess() {
            // get the updated user from backend
            userService.get().then(function (updatedUser) {
              dashboardServiceModel.setCurrentUser(updatedUser);

              var msg = 'Tus datos se actualizaron exitosamente.';
              var dlg = dialogService.showModalAlert('Editar Perfil', msg);

              dlg.result.finally(function () {
                gotoPreviousState();
              });
            });
          }

          /**
           * @name upload
           * @desc uploads the avatar image to the server
          */
          function upload (dataUrl) {
            Upload.upload({
                url: '/users/image',
                data: {
                  profilePicture: Upload.dataUrltoBlob(dataUrl)
                },
                headers: {
                  'Authorization':'Bearer ' + authService.getToken()
                }
            }).then(function (response) {
                vm.progress = -1;
                console.log(vm.user.profilePicture, response.data.user.profilePicture);
                vm.user.profilePicture = response.data.user.profilePicture;
                dashboardServiceModel.setCurrentUser(response.data.user);
                // success dialog
                var msg = 'Tu foto se actualizó exitosamente.';
                var dlg = dialogService.showModalAlert('Foto de perfil', msg);
                dlg.result.finally(function () {
                  gotoPreviousState();
                });
            }, function (response) {
                vm.progress = -1;
                if (response.status > 0) {
                  ngToast.danger('Ocurrió un error al consultar el servidor.');
                  console.log(response.status);
                }
            }, function (evt) {
                vm.progress = parseInt(100.0 * evt.loaded / evt.total);
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
                dlg.result.finally(function () {
                  gotoPreviousState();
                });
            });
          }

          /**
           * @name close
           * @desc calls the backend endpoint to close an account
           */
          function closeAccount() {
            //closing account on server.
            accountService.closeAccount(vm.password).error(function(data) {
                vm.validationErrors = $rootScope.helpers.loadServerErrors(data);
            }).then(function () {
              //closing client session.
              accountService.logout();
              $state.go('home');
            });
          }

          /**
           * @name cancel
           * @desc send the user to the previos view
           */
          function cancel () {
            gotoPreviousState();
          }

          /**
           * @name onTabSelected
           * @desc event fired when a tab is selected
           */
          function onTabSelected() {
            // reset validation state
            vm.validationErrors = null;
          }

          /**
           * @name gotoPreviousState
           * @desc navigates to the previos state. if there is no previous state
           *       then to the dashboard
           */
          function gotoPreviousState() {
            try {
              $previousState.go();
            }
            catch (e) {
              $state.go('dashboard');
            }
          }
      }
})();
