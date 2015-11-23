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
                                               'isUpdate',
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
                                              isUpdate,
                                              projectIntegration) {

          var vm = this;
          vm.name = projectIntegration.name;
          vm.description = projectIntegration.description;
          vm.channels = null;
          vm.validationErrors = null;
          vm.hookUrl = null;

          vm.generateHookUrl = generateHookUrl;
          vm.post = post;

          var token = null;

          activate();

          function activate () {
            $log.log('projectIntegration', projectIntegration);
            generateHookUrl();
            loadChannels();
          }

          function loadChannels() {
            for (var i = 0; i < channels.length; i++) {
              channels[i].typeDescription = (channels[i].type === 'S' ? 'Canales públicos' : 'Canales privados');
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
            if (!isUpdate) {
              var data = {
                channelId: vm.selectedChannel.id,
                name: vm.postName,
                token: token
              };
              console.log('post - alta', data);
              integrationService.create(project.id, projectIntegration.projectIntegrationId, data)
                .error(integrationConfigError)
                .then(integrationConfigCreated);
            }
            else {
              console.log('post - edit');
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
