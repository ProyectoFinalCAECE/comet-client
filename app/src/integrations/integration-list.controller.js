/**
 * @name IntegrationListController
 * @desc Controller for the channel-list view
 */

(function() {
    'use strict';

    angular.module('cometApp')
           .controller('IntegrationListController', IntegrationListController);

        IntegrationListController.$inject = ['$log',
                                             '$rootScope',
                                             '$state',
                                             'lodash',
                                             'ngToast',
                                             'dialogService',
                                             'integrationService',
                                             'project',
                                             'channels',
                                             'integrations'];

        function IntegrationListController ($log,
                                            $rootScope,
                                            $state,
                                            lodash,
                                            ngToast,
                                            dialogService,
                                            integrationService,
                                            project,
                                            channels,
                                            integrations) {

          var vm = this;
          vm.integrations = integrations;
          vm.getChannelName = getChannelName;
          vm.deleteConfiguredIntegration = deleteConfiguredIntegration;

          activate();

          /**
           * @name activate
           * @desc controller activation logic
           */
          function activate () {

          }

          /**
           * @name getChannelName
           * @desc return the channel name searching by id
           */
          function getChannelName(id) {
            var channel = lodash.find(channels, 'id', id);
            if (channel !== undefined) {
              return channel.name;
            }
          }

          /**
           * @name deleteConfiguredIntegration
           * @desc deletes the selected integration configuration
           */
          function deleteConfiguredIntegration (integration, configuration) {
            var msg = '¿ Está seguro que desea eliminar esta integración configurada ?',
                dlg = dialogService.showModalConfirm('Eliminar integración', msg);

            dlg.result.then(function () {
              integrationService
                .remove(project.id, integration.projectIntegrationId, configuration.ChannelId)
                .then(function () {
                  ngToast.success('Configuración eliminada.');
                  console.log(integration, configuration);
                  lodash.remove(integration.configurations, function(c) {
                    return (c.ChannelId === configuration.ChannelId);
                  });
                },
                function () {
                  ngToast.danger('Ocurrió un error al borrar la configuración');
                });
              });
          }
        }
})();
