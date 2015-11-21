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
                                         'lodash',
                                         'filterFilter',
                                         'userService',
                                         'dialogService',
                                         'channels'];

        function IntegrationListController ($rootScope,
                                            $state,
                                            lodash,
                                            filterFilter,
                                            userService,
                                            dialogService,
                                            channels) {

          var vm = this;

          activate();

          /**
           * @name activate
           * @desc controller activation logic
           */
          function activate () {

          }
        }
})();
