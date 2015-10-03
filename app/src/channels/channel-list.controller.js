/**
 * @name ChannelListController
 * @desc Controller for the channel-list view
 */

(function() {
    'use strict';

    angular.module('cometApp')
           .controller('ChannelListController', ChannelListController);

        ChannelListController.$inject = ['$rootScope',
                                         '$state',
                                         'filterFilter',
                                         'userService',
                                         'dialogService',
                                         'channels'];

        function ChannelListController ($rootScope,
                                        $state,
                                        filterFilter,
                                        userService,
                                        dialogService,
                                        channels) {

          var vmc = this;
          vmc.channels = null;
          vmc.isEmpty = true;
          vmc.closedProjects = null;
          vmc.closedProjectsisEmpty = true;
          vmc.gotoCreateChannel = gotoCreateChannel;

          activate();

          /**
           * @name activate
           * @desc controller activation logic
           */
          function activate () {
              console.log('into activate!!');
              console.log('channels are: ' + channels);
              vmc.channels = filterFilter(channels, { state:'O' });
              vmc.isEmpty = (vmc.channels.length === 0);
              vmc.closedChannels = filterFilter(channels, { state:'C' });
              vmc.closedProjectsisEmpty = (vmc.closedChannels.length === 0);
          }

          /**
           * @name gotoCreateChannel
           * @desc validates the user account and redirects to the
           *       create channel page
           */
          function gotoCreateChannel(){
            userService.getCurrentUser().then(function (user) {
              if (user && user.confirmed) {
                $state.go('dashboard.channel-create');
              }
              else {
                dialogService.showModalAlert('Crear Canal', 'Debes confirmar tu cuenta para poder crear un proyecto');
              }
            });
          }
        }
})();
