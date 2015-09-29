/**
 * @name ChannelExploreController
 * @desc Controller for the channel-explore view
 */

(function() {
    'use strict';

    angular.module('cometApp')
           .controller('ChannelExploreController', ChannelExploreController);

        ChannelExploreController.$inject = ['$log',
                                           '$rootScope',
                                           '$state',
                                           '$timeout',
                                           'ngToast',
                                           'constraints',
                                           'dialogService',
                                           'dashboardServiceModel',
                                           'channelService',
                                           'channel'];

        function ChannelExploreController ($log,
                                          $rootScope,
                                          $state,
                                          $timeout,
                                          ngToast,
                                          constraints,
                                          dialogService,
                                          dashboardServiceModel,
                                          channelService,
                                          channel) {

          var vm = this;
          vm.channel = channel;
          vm.project = dashboardServiceModel.getCurrentProject();
          vm.validationErrors = null;

        }
})();
