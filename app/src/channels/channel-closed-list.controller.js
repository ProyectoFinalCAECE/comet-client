/**
 * @name ChannelClosedListController
 * @desc Controller for the channel-closed-list view
 */

(function() {
    'use strict';

    angular.module('cometApp')
           .controller('ChannelClosedListController', ChannelClosedListController);

        ChannelClosedListController.$inject = ['$rootScope',
                                               '$state',
                                               'lodash',
                                               'filterFilter',
                                               'userService',
                                               'dialogService',
                                               'channels'];

        function ChannelClosedListController ($rootScope,
                                              $state,
                                              lodash,
                                              filterFilter,
                                              userService,
                                              dialogService,
                                              channels) {

          var vm = this;
          vm.channels = null;
          vm.isEmpty = true;

          activate();

          /**
           * @name activate
           * @desc controller activation logic
           */
          function activate () {

              vm.channels = channels;

              // only closed channels
              lodash.remove(vm.channels, function (c) {
                if (c.state !== 'C') {
                  return true;
                }
                return false;
              });

              vm.isEmpty = (vm.channels.length === 0);
          }
        }
})();
