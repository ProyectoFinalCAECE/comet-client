/**
 * @name ChannelCreateController
 * @desc Controller for the channel-create view
 */

(function() {
    'use strict';

    angular.module('cometApp')
           .controller('ChannelCreateController', ChannelCreateController);

        ChannelCreateController.$inject = ['$log',
                                           '$rootScope',
                                           '$state',
                                           '$timeout',
                                           'lodash',
                                           'ngToast',
                                           'constraints',
                                           'dialogService',
                                           'dashboardServiceModel',
                                           'channelService'];

        function ChannelCreateController ($log,
                                          $rootScope,
                                          $state,
                                          $timeout,
                                          lodash,
                                          ngToast,
                                          constraints,
                                          dialogService,
                                          dashboardServiceModel,
                                          channelService) {

          var vm = this;
          vm.channel = {};
          vm.members = [];
          vm.project = dashboardServiceModel.getCurrentProject();
          vm.validationErrors = null;
          vm.isPrivate = false;
          vm.create = create;

          /**
           * @name create
           * @desc channel creation logic
          */
          function create () {

            // channel type
            vm.channel.type = (vm.isPrivate ? 'P' : 'S');

            // members
            vm.channel.members = lodash.map(vm.members, function(m) { return m.id; });

            channelService.create(vm.project.id, vm.channel)
              .error(channelCreateError)
              .then(channelCreated);
          }

          /**
           * @name channelCreated
           * @desc shows a dialog indicating a successful operation
          */
          function channelCreated (response) {
            var createdChannel = response.data;
            var msg = 'El canal "' + createdChannel.name +
                      '" ha sido creado exitosamente.';

            var dlg = dialogService.showModalAlert('Crear canal', msg);
            dlg.result.then(function () {
              $state.go('dashboard.channel-explore', { id: createdChannel.id  });
            }, function () {
              $state.go('dashboard.channel-explore', { id: createdChannel.id  });
            });
          }

          /**
           * @name channelCreateError
           * @desc shows the error message to the user
          */
          function channelCreateError (data) {
              vm.validationErrors = $rootScope.helpers.loadServerErrors(data);
              if (vm.validationErrors === null)
              {
                ngToast.danger('Ocurrió un error al consultar al servidor.');
              }
          }
        }
})();
