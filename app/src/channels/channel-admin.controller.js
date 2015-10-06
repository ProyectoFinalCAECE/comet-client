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
                                          'project'];

        function ChannelAdminController ( $log,
                                          $rootScope,
                                          $state,
                                          ngToast,
                                          dialogService,
                                          channelService,
                                          channel,
                                          project) {

          var vm = this;
          vm.channel = channel;
          vm.project = project;
          vm.validationErrors = null;

          // update info
          vm.update = update;

          // invite / delete members
          vm.deleteMember = deleteMember;

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
           * @name deleteMember
           * @desc deletes selected members from channel
          */
          function deleteMember (member) {
            channelService.deleteMember(vm.project.id, vm.channel.id, member.id).error(function(data) {
              vm.validationErrors = $rootScope.helpers.loadServerErrors(data);
              if (vm.validationErrors === null) {
                ngToast.danger('Ocurrió un error al consultar al servidor.');
              }
            }).then(function() {
              var msg = '¿Esta seguro que desea eliminar el participante?';
              var dlg = dialogService.showModalConfirm('Administrar proyecto', msg);
              dlg.result.then(function () {
              //  var index = vm.project.members.indexOf(member);
              //  vm.project.members.splice(index, 1);
                ngToast.success('El participante ha sido eliminado.');
              });
            });
          }

          /**
           * @name closeChannel
           * @desc calls the endpoint to close the channel
          */
          function closeChannel() {
            $log.log('close', vm.channel.id);
            channelService.close(vm.project.id, vm.channel.id).error(function(data) {
              vm.validationErrors = $rootScope.helpers.loadServerErrors(data);
              if (vm.validationErrors === null)
              {
                ngToast.danger('Ocurrió un error al consultar al servidor.');
              }
            }).then(function() {
                var msg = 'El canal se cerró exitosamente.';
                var dlg = dialogService.showModalAlert('Administrar canal', msg);
                dlg.result.then(function () {
                  $state.go('dashboard.project-explore');
                }, function () {
                  $state.go('dashboard.project-explore');
                });
            });
          }

          /**
           * @name deleteChannel
           * @desc calls the endpoint to delete the channel
          */
          function deleteChannel() {
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
                dlg.result.then(function () {
                  $state.go('dashboard.project-explore');
                }, function () {
                  $state.go('dashboard.project-explore');
                });
            });
          }
        }
})();
