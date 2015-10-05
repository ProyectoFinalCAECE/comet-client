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
                                           'ngToast',
                                           'constraints',
                                           'dialogService',
                                           'dashboardServiceModel',
                                           'channelService',
                                           'channel'];

        function ChannelExploreController ($log,
                                          $rootScope,
                                          $state,
                                          $timeout,
                                          $modal,
                                          ngToast,
                                          constraints,
                                          dialogService,
                                          dashboardServiceModel,
                                          channelService,
                                          channel) {

          var vm = this;
          vm.channel = channel;
          vm.project = dashboardServiceModel.getCurrentProject();
          vm.validationErrors = null;
          vm.invite = invite;
          vm.canInvite = canInvite;

          /**
           * @name canInvite
           * @desc returns if the user can add members to the channel
          */
          function canInvite () {
            $log.log('canInvite', vm.channel.members);
            $log.log('canInvite - project members', vm.project.members);
            return (vm.channel.members.length < vm.project.members.length);
          }

          /**
           * @name invite
           * @desc opens the 'add channel member' dialog
          */
          function invite () {
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
