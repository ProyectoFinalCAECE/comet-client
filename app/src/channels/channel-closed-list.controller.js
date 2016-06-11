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
                                               'project',
                                               'channels'];

        function ChannelClosedListController ($rootScope,
                                              $state,
                                              lodash,
                                              filterFilter,
                                              userService,
                                              dialogService,
                                              project,
                                              channels) {

          var vm = this;
          vm.project = project;
          vm.channels = null;
          vm.isEmpty = true;
          vm.sortType = 'closedAt';
          vm.sortReverse = false;
          vm.formatLastActivityDate = formatLastActivityDate;

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

          /**
           * @name formatLastActivityDate
           * @desc returns the last activity timestamp in a readable format
          */
          function formatLastActivityDate (activityDate) {
            return moment(activityDate).calendar(null, {
              lastDay : '[ayer] LT',
              lastWeek : 'ddd LT',
              sameDay : '[Hoy] LT',
              sameElse : 'ddd DD/MM'
            });
          }
        }
})();
