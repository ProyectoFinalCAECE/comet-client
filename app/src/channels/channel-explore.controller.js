/**
 * @name ChannelExploreController
 * @desc Controller for the channel-explore view
 */

(function() {
    'use strict';

    angular.module('cometApp')
           .controller('ChannelExploreController', ChannelExploreController);

        ChannelExploreController.$inject = ['$log',
                                           '$rootScope',
                                           '$state',
                                           '$timeout',
                                           '$modal',
                                           'lodash',
                                           'ngToast',
                                           'constraints',
                                           'dialogService',
                                           'dashboardServiceModel',
                                           'channelService',
                                           'user',
                                           'project',
                                           'channel'];

        function ChannelExploreController ($log,
                                          $rootScope,
                                          $state,
                                          $timeout,
                                          $modal,
                                          lodash,
                                          ngToast,
                                          constraints,
                                          dialogService,
                                          dashboardServiceModel,
                                          channelService,
                                          user,
                                          project,
                                          channel) {

          var vm = this;
          vm.channel = channel;
          vm.project = project;
          vm.validationErrors = null;
          vm.invite = invite;
          vm.isMember = false;
          vm.canInvite = canInvite;

          activate();

          /**
           * @name activate
           * @desc controller activation logic
          */
          function activate () {
            if (lodash.find(vm.channel.members, 'id', user.id) !== undefined) {
              vm.isMember = true;
            }
          }

          /**
           * @name canInvite
           * @desc returns if the user can add members to the channel
          */
          function canInvite () {
            return (vm.channel.members.length < vm.project.members.length);
          }

          /**
           * @name invite
           * @desc opens the 'add channel member' dialog
          */
          function invite () {

            if (!vm.isMember) {
              showAddCurrentMemberDialog();
            }
            else {
              if (vm.canInvite) {
                showAddMembersDialog();
              }
            }
          }

          /**
           * @name showAddCurrentMemberDialog
           * @desc shows the dialog to add the current logged in user to the
           *       the channel
          */
          function showAddCurrentMemberDialog () {
            var msg = '¿Desea agregarse como participante en este canal?';
            var dlg = dialogService.showModalConfirm('Agregar canal', msg);
            dlg.result.then(function () {
              var invites = {
                members: [
                    {
                      id: user.id
                    }
                  ]
              };

              channelService.invite(vm.project.id, vm.channel.id, invites)
                .error(channelInviteError)
                .then(function (response) {
                  vm.channel = response.data;
                  activate();
                  $rootScope.$broadcast('channelUpdated', response.data);
                  $rootScope.$broadcast('channelsUpdated');
                  ngToast.success('Canal agregado.');
                });
            });
          }

          /**
           * @name channelInviteError
           * @desc shows the error message to the user
          */
          function channelInviteError (data) {
              vm.validationErrors = $rootScope.helpers.loadServerErrors(data);
              if (vm.validationErrors === null)
              {
                ngToast.danger('Ocurrió un error al consultar al servidor.');
              }
          }

          /**
           * @name showAddMembersDialog
           * @desc shows the dialog to add members to the channel
          */
          function showAddMembersDialog () {
            var modalInstance = $modal.open({
              templateUrl: '/src/channels/channel-invite.html',
              controller: 'ChannelInviteController',
              controllerAs: 'vm',
              size: 'md',
              backdrop: 'static',
              resolve: {
                project: function () {
                  return vm.project;
                },
                user: function () {
                  return dashboardServiceModel.getCurrentUser();
                },
                channel: function () {
                  return vm.channel;
                }
             }
           });
           modalInstance.result.then(function (updatedChannel) {
             vm.channel = updatedChannel;
             $rootScope.$broadcast('channelUpdated', updatedChannel);
           });
          }
        }
})();
