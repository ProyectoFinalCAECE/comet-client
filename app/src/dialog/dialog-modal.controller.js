/**
 * @name ModalDialogController
 * @desc Controller used to display modal dialogs
 */

(function() {
    'use strict';

    angular.module('cometApp')
           .controller('DialogModalController', DialogModalController);

        DialogModalController.$inject = ['$modalInstance', 'dialogType', 'type', 'title', 'message'];

        function DialogModalController ($modalInstance, dialogType, type, title, message) {

          var vm = this;
          vm.type = type;
          vm.title = title;
          vm.showCancel = (vm.type === dialogType.CONFIRM);
          vm.message = message;

          vm.ok = function () {
            $modalInstance.close({ button: 'Ok' });
          };

          vm.cancel = function () {
            $modalInstance.dismiss('cancel');
          };
      }
})();
