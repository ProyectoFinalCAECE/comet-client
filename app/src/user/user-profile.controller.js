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
                                         'user',
                                         'fileReader'];

        function UserProfileController ($rootScope, $scope, $state, dialogService, formsConfig, accountService, userService, user, fileReader) {

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
          vm.passwordPattern = formsConfig.passwordLabel;

          // close account
          vm.imSure = false;
          vm.close = close;

          /**
           * @name update
           * @desc calls the backend endpoint to update the user profile
           */
          function update() {
            console.log('vm.user.profilePicture.mediaType is: ' + vm.user.profilePicture.type);
            userService.update(vm.user).error(function(data) {
                vm.validationErrors = $rootScope.helpers.loadServerErrors(data);
            }).then(function() {
                if(vm.user.profilePicture.type.indexOf('image/') > -1){
                    //updating profile picture if required
                    userService.uploadProfilePicture(vm.user.profilePicture).error(function(data) {
                        vm.validationErrors = $rootScope.helpers.loadServerErrors(data);
                    }).then(function(response) {
                      console.log('response is: '+ JSON.stringify(response));
                      vm.user.profilePicture = response.data.profilePicture;
                      var msg = 'Tus datos se actualizaron exitosamente.';
                      var dlg = dialogService.showModalAlert('Editar Perfil', msg);
                      dlg.result.then(function () {
                        $state.go('dashboard.project-list');
                      }, function () {
                        $state.go('dashboard.project-list');
                      });
                    });
                } else {
                  var msg = 'Tus datos se actualizaron exitosamente.';
                  var dlg = dialogService.showModalAlert('Editar Perfil', msg);
                  dlg.result.then(function () {
                    $state.go('dashboard.project-list');
                  }, function () {
                    $state.go('dashboard.project-list');
                  });
                }
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

          $scope.getFile = function () {
            $scope.progress = 0;
              fileReader.readAsDataUrl($scope.file, $scope)
                            .then(function(result) {
                                $scope.imageSrc = result;
                            });
          };
      }
})();
