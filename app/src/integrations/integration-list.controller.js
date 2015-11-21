/**
 * @name IntegrationListController
 * @desc Controller for the channel-list view
 */

(function() {
    'use strict';

    angular.module('cometApp')
           .controller('IntegrationListController', IntegrationListController);

        IntegrationListController.$inject = ['$rootScope',
                                         '$state',
                                         'lodash'];

        function IntegrationListController ($rootScope,
                                            $state,
                                            lodash) {

          var vm = this;
          vm.integrations = [];

          activate();

          /**
           * @name activate
           * @desc controller activation logic
           */
          function activate () {

          }
        }
})();
