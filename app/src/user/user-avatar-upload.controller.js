/**
 * @name UserAvatarUploadController
 * @desc Controller for the user-avatar-upload view
 */

(function() {
    'use strict';

    angular.module('cometApp')
           .controller('UserAvatarUploadController', UserAvatarUploadController);

        UserAvatarUploadController.$inject = ['$log',
                                              '$scope',
                                              '$modalInstance',
                                              'ngToast',
                                              'authService',
                                              'Upload'];

        function UserAvatarUploadController ($log,
                                             $scope,
                                             $modalInstance,
                                             ngToast,
                                             authService,
                                             Upload) {

          var vm = this;
          vm.sourceImage = '';
          vm.croppedImageDataUrl = '';
          vm.cancel = cancel;
          vm.upload = upload;

          /**
           * @name cancel
           * @desc close the dialog
          */
          function cancel () {
            $modalInstance.dismiss();
          }

          /**
           * @name upload
           * @desc uploads the image to the server
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
                $modalInstance.close(response.data.user);
            }, function (response) {
                if (response.status > 0) {
                  ngToast.danger('Ocurrió un error al consultar el servidor.');
                  console.log(response.status);
                }
            }, function (evt) {
                vm.progress = parseInt(100.0 * evt.loaded / evt.total);
            });
          }
      }
})();
