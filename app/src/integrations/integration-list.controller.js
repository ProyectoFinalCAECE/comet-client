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
                                             'integrations'];

        function IntegrationListController ($log,
                                            $rootScope,
                                            $state,
                                            lodash,
                                            integrations) {

          var vm = this;
          vm.integrations = integrations;

          activate();

          /**
           * @name activate
           * @desc controller activation logic
           */
          function activate () {
            $log.log('integrations', integrations);
          }
        }
})();
