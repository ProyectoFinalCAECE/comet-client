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
                                             'channels',
                                             'integrations'];

        function IntegrationListController ($log,
                                            $rootScope,
                                            $state,
                                            lodash,
                                            channels,
                                            integrations) {

          var vm = this;
          vm.integrations = integrations;
          vm.getChannelName = getChannelName;

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
        }
})();
