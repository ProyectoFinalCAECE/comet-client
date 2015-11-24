/**
 * @name IntegrationCreateController
 * @desc Controller for the integration-create view
 */

(function() {
    'use strict';

    angular.module('cometApp')
           .controller('IntegrationCreateController', IntegrationCreateController);

        IntegrationCreateController.$inject = ['$log',
                                               '$rootScope',
                                               '$state',
                                               '$timeout',
                                               '$location',
                                               'lodash',
                                               'ngToast',
                                               'dialogService',
                                               'integrationService',
                                               'user',
                                               'project',
                                               'channels',
                                               'channelId',
                                               'projectIntegration'];

        function IntegrationCreateController ($log,
                                              $rootScope,
                                              $state,
                                              $timeout,
                                              $location,
                                              lodash,
                                              ngToast,
                                              dialogService,
                                              integrationService,
                                              user,
                                              project,
                                              channels,
                                              channelId,
                                              projectIntegration) {

          var vm = this;
          vm.integrationName = projectIntegration.name;
          vm.description = projectIntegration.description;
          vm.channels = null;
          vm.validationErrors = null;
          vm.hookUrl = null;
          vm.selectedChannel = null;
          vm.name = projectIntegration.name;

          vm.generateHookUrl = generateHookUrl;
          vm.post = post;

          var token = null,
              isUpdate = (channelId > 0),
              configuration = null;

          activate();

          function activate () {
            $log.log('projectIntegration', projectIntegration, channelId);

            if (isUpdate) {
              // get the desired configuration by channelId (TODO: must be an explicit configurationId)
              configuration = lodash.find(projectIntegration.configurations, 'ChannelId', channelId);
              $log.log('configuration', configuration);
              vm.name = configuration.name;
            }

            generateHookUrl();
            loadChannels();
          }

          function loadChannels() {
            vm.selectedChannel = channels[0];
            for (var i = 0; i < channels.length; i++) {
              var channel = channels[i];
              channel.typeDescription = (channel.type === 'S' ? 'Canales públicos' : 'Canales privados');
              $log.log(channel, channelId);
              if (channelId === channel.id) {
                vm.selectedChannel = channel;
              }
            }
            vm.channels = channels;
            $log.log('channels', channels);
          }

          /**
           * @name generateHookUrl
           * @desc return the webhook URL.
           *       Example: http://localhost:4000/hooks/KIJTUG/?integrationId=2
          */
          function generateHookUrl () {
            var combined = $location.protocol() + '://' +
                           $location.host() + ':' +
                           $location.port();
            token = $rootScope.helpers.randomString(50);
            vm.hookUrl = combined + '/hooks/' + token + '/?integrationId=' + projectIntegration.integrationId;
          }

          /**
           * @name post
           * @desc create/edit the integration config
          */
          function post() {
            if (isUpdate) {
              // update configuration
              var updateData = {
                channelId: channelId,
                name: vm.name,
                token: token,
                newChannelId: vm.selectedChannel.id
              };
              console.log('post - edicion', updateData);
              integrationService.update(project.id, projectIntegration.projectIntegrationId, updateData)
                .error(integrationConfigError)
                .then(integrationConfigCreated);
            }
            else {
              // create
              var data = {
                channelId: vm.selectedChannel.id,
                name: vm.name,
                token: token
              };
              console.log('post - alta', data);
              integrationService.create(project.id, projectIntegration.projectIntegrationId, data)
                .error(integrationConfigError)
                .then(integrationConfigCreated);
            }
          }

        /**
         * @name integrationConfigCreated
         * @desc shows a dialog indicating a successful operation
        */
        function integrationConfigCreated () {
          // show dialog to the user
          var msg = 'Integración configurada exitósamente.';
          var dlg = dialogService.showModalAlert('Configurar integración', msg);
          dlg.result.finally(function () {
            $state.go('dashboard.project.project-admin', {
              projectId: project.id,
              tab:3
            });
          });
        }

        /**
         * @name integrationConfigError
         * @desc shows the error message to the user
        */
        function integrationConfigError (data) {
            vm.validationErrors = $rootScope.helpers.loadServerErrors(data);
            if (vm.validationErrors === null)
            {
              ngToast.danger('Ocurrió un error al consultar al servidor.');
            }
        }
      }
})();
