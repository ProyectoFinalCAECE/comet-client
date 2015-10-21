/**
 * @name ChannelEditController
 * @desc Controller for the channel-edit view
 */

(function() {
    'use strict';

    angular.module('cometApp')
           .controller('ChannelEditController', ChannelEditController);

        ChannelEditController.$inject = ['$log',
                                         '$rootScope',
                                         '$state',
                                         'ngToast',
                                         '$modalInstance',
                                         'channelService',
                                         'project',
                                         'channel'];

        function ChannelEditController ($log,
                                        $rootScope,
                                        $state,
                                        ngToast,
                                        $modalInstance,
                                        channelService,
                                        project,
                                        channel) {

          var vm = this;
          vm.channel = channel;
          vm.project = project;
          vm.validationErrors = null;
          vm.update = update;
          vm.cancel = cancel;

          /**
           * @name cancel
           * @desc close the dialog
          */
          function cancel () {
            $modalInstance.dismiss();
          }

          /**
           * @name update
           * @desc invokes channelService to update channel info
          */
          function update () {

            channelService.update(vm.project.id, vm.channel)
              .error(channelUpdateError)
              .then(channelUpdateSuccess);
          }

          /**
           * @name channelUpdateSuccess
           * @desc shows a dialog indicating a successful operation
          */
          function channelUpdateSuccess (response) {
            $modalInstance.close(response.data);
          }

          /**
           * @name channelUpdateError
           * @desc shows the error message to the user
          */
          function channelUpdateError (data) {
              vm.validationErrors = $rootScope.helpers.loadServerErrors(data);
              if (vm.validationErrors === null)
              {
                ngToast.danger('Ocurrió un error al consultar al servidor.');
              }
          }
        }
})();
