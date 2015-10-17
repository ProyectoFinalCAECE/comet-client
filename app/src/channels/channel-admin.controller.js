/**
 * @name ChannelAdminController
 * @desc Controller for the channel-admin view
 */

(function() {
    'use strict';

    angular.module('cometApp')
           .controller('ChannelAdminController', ChannelAdminController);

        ChannelAdminController.$inject = ['$log',
                                          '$rootScope',
                                          '$state',
                                          'ngToast',
                                          'dialogService',
                                          'channelService',
                                          'channel',
                                          'project',
                                          'user'];

        function ChannelAdminController ( $log,
                                          $rootScope,
                                          $state,
                                          ngToast,
                                          dialogService,
                                          channelService,
                                          channel,
                                          project,
                                          user) {

          var vm = this;
          vm.channel = channel;
          vm.isClosed = false;
          vm.project = project;
          vm.validationErrors = null;

          // update info
          vm.update = update;

          // invite / delete members
          vm.deleteMember = deleteMember;

          // exit from the channel
          vm.exit = exit;

          //close channel
          vm.imSure = false;
          vm.closeChannel = closeChannel;

          //delete channel
          vm.imSureDelete = false;
          vm.deleteChannel = deleteChannel;

          activate();

          /**
           * @name activate
           * @desc controller activation logic
          */
          function activate () {
            vm.isClosed = (vm.channel.state === 'C');
          }

          /**
           * @name update
           * @desc project update logic
          */
          function update () {
          /*  projectService.update(vm.project).error(function(data) {
              vm.validationErrors = $rootScope.helpers.loadServerErrors(data);
              if (vm.validationErrors === null) {
                ngToast.danger('Ocurrió un error al consultar al servidor.');
              }
            }).then(function() {
                var msg = 'El proyecto "' + vm.project.name +
                          '" ha sido editado exitosamente.';
                var dlg = dialogService.showModalAlert('Administrar proyecto', msg);
                dlg.result.then(function () {
                  $state.go('dashboard.project-list');
                });
            });*/
          }

          /**
           * @name exit
           * @desc opens the 'exit channel' dialog
          */
          function exit () {
            var msg = '¿Desea salir del canal?';
            var dlg = dialogService.showModalConfirm('Salir de canal', msg);
            dlg.result.then(function () {
              channelService
                .deleteMember(vm.project.id, vm.channel.id, user.id)
                .then(function (response) {
                  ngToast.success('Has salido del canal.');
                  $rootScope.$broadcast('channelUpdated', response.data);
                  $rootScope.$broadcast('channelsUpdated');
                  $state.go('dashboard.project.project-explore', { id: vm.project.id });
                });
              });
          }

          /**
           * @name deleteMember
           * @desc deletes selected members from channel
          */
          function deleteMember (member) {
            var msg = '¿Esta seguro que desea eliminar el participante?';
            var dlg = dialogService.showModalConfirm('Administrar proyecto', msg);
            dlg.result.then(function () {
              channelService.deleteMember(vm.project.id, vm.channel.id, member.id).error(function(data) {
                vm.validationErrors = $rootScope.helpers.loadServerErrors(data);
                if (vm.validationErrors === null) {
                  ngToast.danger('Ocurrió un error al consultar al servidor.');
                }
              });
            }).then(function() {
                var index = vm.project.members.indexOf(member);
                vm.project.members.splice(index, 1);
                ngToast.success('El participante ha sido eliminado.');
            });
          }

          /**
           * @name closeChannel
           * @desc calls the endpoint to close the channel
          */
          function closeChannel() {
            $log.log('close', vm.channel.id);
            var msg = '¿Esta seguro que desea cerrar el canal?';
            var dlg = dialogService.showModalConfirm('Administrar proyecto', msg);
            dlg.result.then(function () {
              channelService.close(vm.project.id, vm.channel.id).error(function(data) {
                vm.validationErrors = $rootScope.helpers.loadServerErrors(data);
                if (vm.validationErrors === null)
                {
                  ngToast.danger('Ocurrió un error al consultar al servidor.');
                }
              }).then(function() {
                  var msg = 'El canal se cerró exitosamente.';
                  var dlg = dialogService.showModalAlert('Administrar canal', msg);
                  dlg.result.finally(function () {
                    $state.go('dashboard.project.project-explore', { id: vm.project.id });
                  });
              });
            });
          }

          /**
           * @name deleteChannel
           * @desc calls the endpoint to delete the channel
          */
          function deleteChannel() {
            var msg = '¿Esta seguro que desea eliminar el canal? Esta operación no puede revertirse.';
            var dlg = dialogService.showModalConfirm('Administrar proyecto', msg);
            dlg.result.then(function () {
              $log.log('deleteChannel', vm.channel.id);
              channelService.deleteChannel(vm.project.id, vm.channel.id).error(function(data) {
                vm.validationErrors = $rootScope.helpers.loadServerErrors(data);
                if (vm.validationErrors === null)
                {
                  ngToast.danger('Ocurrió un error al consultar al servidor.');
                }
              }).then(function() {
                  var msg = 'El canal se eliminó exitosamente.';
                  var dlg = dialogService.showModalAlert('Administrar canal', msg);
                  dlg.result.finally(function () {
                    $state.go('dashboard.project.project-explore', { id: vm.project.id });
                  });
              });
            });
          }
        }
})();
