/**
 * @name ChannelInviteController
 * @desc Controller for the channel-invite view
 */

(function() {
    'use strict';

    angular.module('cometApp')
           .controller('ChannelInviteController', ChannelInviteController);

        ChannelInviteController.$inject = ['$log',
                                           '$rootScope',
                                           '$state',
                                           'lodash',
                                           'ngToast',
                                           '$modalInstance',
                                           'constraints',
                                           'channelService',
                                           'user',
                                           'project',
                                           'channel'];

        function ChannelInviteController ($log,
                                          $rootScope,
                                          $state,
                                          lodash,
                                          ngToast,
                                          $modalInstance,
                                          constraints,
                                          channelService,
                                          user,
                                          project,
                                          channel) {

          var vm = this;
          vm.channel = channel;
          vm.project = project;
          vm.validationErrors = null;
          vm.availableMembers = [];
          vm.invites = [];
          vm.invite = invite;
          vm.cancel = cancel;
          vm.onMemberListClick = onMemberListClick;

          activate();

          function activate () {
            vm.availableMembers = getAvailableMembers();
          }

          /**
           * @name getAvailableMembers
           * @desc returns the available members to add to the channel
          */
          function getAvailableMembers () {
            var projectMembers = angular.copy(vm.project.members);

            lodash.remove(projectMembers, function (m) {
              // remove the current logged in user from the list
              if (m.id === user.id) {
                return true;
              }
              // remove the current channel member
              if (lodash.find(vm.channel.members, 'id', m.id) !== undefined) {
                return true;
              }
              return false;
            });

            return projectMembers;
          }

          /**
           * @name onMemberListClick
           * @desc click on member checkbox
          */
          function onMemberListClick (member) {
            if (member.selected){
                vm.invites.push(member);
            } else {
              vm.invites = lodash.remove(vm.invites, function (m) {
                return m.id !== member.id;
              });
            }
          }

          /**
           * @name cancel
           * @desc close the dialog
          */
          function cancel () {
            $modalInstance.dismiss();
          }

          /**
           * @name invite
           * @desc invokes channelService to invite members
          */
          function invite () {
            var invites = {
              members: lodash.map(vm.invites, function (m) {
                return { id: m.id };
              })
            };

            channelService.invite(vm.project.id, vm.channel.id, invites)
              .error(channelInviteError)
              .then(channelInviteSuccess);
          }

          /**
           * @name channelInviteSuccess
           * @desc shows a dialog indicating a successful operation
          */
          function channelInviteSuccess (response) {
            $modalInstance.close(response.data);
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
        }
})();
