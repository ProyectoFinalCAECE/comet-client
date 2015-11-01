/**
 * @name DashboardController
 * @desc Parent controller for the dashboard views */

(function() {
    'use strict';

    angular.module('cometApp')
           .controller('DashboardController', DashboardController);

        DashboardController.$inject = ['$log',
                                       '$scope',
                                       '$state',
                                       '$stateParams',
                                       '$timeout',
                                       'ngToast',
                                       'lodash',
                                       'dashboardServiceModel',
                                       'accountService',
                                       'channelService',
                                       'notificationService',
                                       'user'];

        function DashboardController ($log,
                                      $scope,
                                      $state,
                                      $stateParams,
                                      $timeout,
                                      ngToast,
                                      lodash,
                                      dashboardServiceModel,
                                      accountService,
                                      channelService,
                                      notificationService,
                                      user) {

          var vm = this;

          vm.user = user;
          vm.project = dashboardServiceModel.getCurrentProject();

          vm.publicChannels = null;
          vm.privateChannels = null;
          vm.availableMembers = null;

          vm.membersVisible = false;
          vm.showMembers = showMembers;

          vm.logout = logout;

          activate();

          /**
           * @name activate
           * @desc controller activation logic
           */
          function activate() {

            // user account confirmation alert
            if (!vm.user.confirmed) {
              ngToast.warning({
                content: 'Recuerda confirmar tu dirección de correo.',
                dismissButton: true
              });
            }

            // project channels
            loadChannels(vm.project);

            // listen to project updates
            $scope.$on('currentProjectUpdated', function() {
              vm.project = dashboardServiceModel.getCurrentProject();
              loadChannels(vm.project);
              notificationsJoinRoom();
            });

            // listen to user updates
            $scope.$on('currentUserUpdated', function() {
              vm.user = dashboardServiceModel.getCurrentUser();
            });

            // listen to channel updates
            $scope.$on('channelsUpdated', function() {
              loadChannels(vm.project);
            });

            // notifications
            initializeNotifications();
          }

          /**
           * @name initializeNotifications
           * @desc initializes the notifications socket
           */
          function initializeNotifications() {

            if (vm.project === null) {
              return;
            }

            notificationService.on('channels-updates', function (data) {
              $log.log('notifications channels-updates', data);
              setChannelsUpdates(data);
            });

            notificationService.on('transient-notification', function (data) {
              $log.log('transient-notification', data);
              //setChannelsUpdates(data);
            });

            notificationService.on('reconnect', function () {
              // re join project room
              $log.log('notifications reconnect');
              notificationsJoinRoom();
            });

            notificationsJoinRoom();
            notificationsSendPing();
          }

          /**
           * @name notificationsSendPing
           * @desc sends a ping message to the server to save the
           *       user activity date.
           *        this function calls itself recursively
           */
          function notificationsSendPing() {

            if (vm.project === null) {
              return;
            }

            notificationService.emit('ping', {
              projectId: vm.project.id,
              userId: vm.user.id
            });

            $timeout(notificationsSendPing, 10 * 1000);
          }

          /**
           * @name notificationsJoinRoom
           * @desc joins the current project room
           */
          function notificationsJoinRoom() {

            $log.log('notificationsJoinRoom', vm.project);

            if (vm.project === null) {
              return;
            }

            notificationService.emit('join-room', {
              room: getProjectRoomId(),
              projectId: vm.project.id,
              userId: vm.user.id
            });
          }

          /**
           * @name loadChannels
           * @desc loads the proyect channels
           */
          function loadChannels (project) {

            if (project === null ) {
              return;
            }

            channelService.getAll(project.id).then(function (response) {
              var channels = response.data;

              vm.privateChannels = lodash.filter(channels, function(c) {
                return c.type === 'P' && c.state !== 'C';
              });

              vm.publicChannels = lodash.filter(channels, function(c) {
                var isMember = (lodash.find(c.members, 'id', vm.user.id) !== undefined);
                return c.type === 'S' && c.state !== 'C' && isMember;
              });
            });

            // members for direct chat
            vm.availableMembers = lodash.filter(vm.project.members, function(m) {
              return (m.id !== vm.user.id);
            });
          }

          /**
           * @name setChannelsUpdates
           * @desc marks the channels with updates
           */
          function setChannelsUpdates(data) {

            // public and private channels
            var channelUpdatesLen = data.channels_with_updates.length;
            for (var i = 0; i < channelUpdatesLen; i++) {
              var update = data.channels_with_updates[i];
              // search in public channels
              var channel = lodash.find(vm.publicChannels, 'id', update.id);
              if (channel === undefined) {
                // search in private channels
                channel = lodash.find(vm.privateChannels, 'id', update.id);
              }
              if (channel !== undefined) {
                channel.hasNotification = true;
              }
            }

            // direct channels
            var userUpdatesLen = data.users_with_updates.length;
            for (var j = 0; j < userUpdatesLen; j++) {
              var user = data.users_with_updates[j];
              var userChannel = lodash.find(vm.availableMembers, 'id', user.id);
              if (userChannel !== undefined) {
                userChannel.hasNotification = true;
              }
            }
          }

          /**
           * @name getProjectRoomId
           * @desc returns the room id for the notifications socket
           */
          function getProjectRoomId() {
            return 'Project_' + vm.project.id;
          }

          /**
           * @name showMembers
           * @desc shows/hide the members panel
           */
          function showMembers() {
            vm.membersVisible = !vm.membersVisible;
          }

          /**
           * @name logout
           * @desc logout the user and redirects to home page
           */
          function logout () {
            accountService.logout();
            $state.go('home');
          }
      }
})();
