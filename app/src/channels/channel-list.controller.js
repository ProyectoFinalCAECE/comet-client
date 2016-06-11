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
                                         'lodash',
                                         'filterFilter',
                                         'userService',
                                         'dialogService',
                                         'integrationService',
                                         'project',
                                         'channels'];

        function ChannelListController ($rootScope,
                                        $state,
                                        lodash,
                                        filterFilter,
                                        userService,
                                        dialogService,
                                        integrationService,
                                        project,
                                        channels) {

          var vmc = this;
          vmc.channels = [];
          vmc.isEmpty = true; 
          vmc.sortType = 'name';
          vmc.sortReverse = false;
          vmc.gotoCreateChannel = gotoCreateChannel;

          activate();

          /**
           * @name activate
           * @desc controller activation logic
           */
          function activate () {
              loadChannels();
              loadIntegrations();
              vmc.isEmpty = (vmc.channels.length === 0);
              console.log('channels', vmc.channels);
          }

          /**
           * @name loadChannels
           * @desc loads the project opened public channels
          */
          function loadChannels() {
            var c = null;
            for (var i = 0; i < channels.length; i++) {
              c = channels[i];
              // only public and opened channels
              if (c.state === 'O' && c.type === 'S') {
                // load integrations
                vmc.channels.push(c);
              }
            }
          }

          /**
           * @name loadIntegrations
           * @desc loads the integration configuration for each channel
          */
          function loadIntegrations() {

            var integ = null,
                integTotal = 0,
                config = null,
                configTotal = 0;

            return integrationService.getAll(project.id).then(function (response) {
              var integrations = response.data.integrations;
              integTotal = integrations.length;

              for (var i = 0; i < integTotal; i++) {
                integ = integrations[i];
                configTotal = (integ.configurations ? integ.configurations.length : 0);
                for (var j = 0; j < configTotal; j++) {
                  config = integ.configurations[j];
                  if (config.active) {
                   var channel = lodash.find(vmc.channels, 'id', config.ChannelId);
                   if (channel) {
                     channel.integrations.push({
                       name: integ.name,
                       integrationId: integ.integrationId
                     });
                   }
                  }
                }
              }
            });
          }

          /**
           * @name gotoCreateChannel
           * @desc validates the user account and redirects to the
           *       create channel page
           */
          function gotoCreateChannel(){
            userService.getCurrentUser().then(function (user) {
              if (user && user.confirmed) {
                $state.go('dashboard.project.channel-create');
              }
              else {
                dialogService.showModalAlert('Crear Canal', 'Debes confirmar tu cuenta para poder crear un proyecto');
              }
            });
          }
        }
})();
