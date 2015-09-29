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
                                           'ngToast',
                                           'constraints',
                                           'dialogService',
                                           'dashboardServiceModel',
                                           'channelService'];

        function ChannelCreateController ($log,
                                          $rootScope,
                                          $state,
                                          $timeout,
                                          ngToast,
                                          constraints,
                                          dialogService,
                                          dashboardServiceModel,
                                          channelService) {

          var vm = this;
          vm.channel = {};
          vm.project = dashboardServiceModel.getCurrentProject();
          vm.validationErrors = null;
          vm.create = create;

          $log.log('project', vm.project);

          /**
           * @name create
           * @desc channel creation logic
          */
          function create () {
            vm.channel.type = (vm.isPrivate === true ? 'P' : 'S');

            channelService.create(vm.project.id, vm.channel).error(function(data) {
              vm.validationErrors = $rootScope.helpers.loadServerErrors(data);
              if (vm.validationErrors === null)
              {
                ngToast.danger('Ocurrió un error al consultar al servidor.');
              }
            }).then(function(response) {
                var createdChannel = response.data;
                var msg = 'El canal "' + createdChannel.name +
                          '" ha sido creado exitosamente.';
                var dlg = dialogService.showModalAlert('Crear canal', msg);
                dlg.result.then(function () {
                  $state.go('dashboard.channel-explore', { id: createdChannel.id  });
                }, function () {
                  $state.go('dashboard.channel-explore', { id: createdChannel.id  });
                });
            });
          }
        }
})();
