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
                                               'lodash',
                                               'ngToast',
                                               'constraints',
                                               'dialogService',
                                               'channelService',
                                               'user',
                                               'project'];

        function IntegrationCreateController ($log,
                                              $rootScope,
                                              $state,
                                              $timeout,
                                              lodash,
                                              ngToast,
                                              constraints,
                                              dialogService,
                                              channelService,
                                              user,
                                              project) {

          var vm = this;

          activate();

          function activate () {

          }
      }
})();
