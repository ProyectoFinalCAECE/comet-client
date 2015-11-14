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
                                       'desktopNotificationService',
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
                                      desktopNotificationService,
                                      notificationService,
                                      user) {

          var vm = this;

          vm.user = user;
          vm.project = dashboardServiceModel.getCurrentProject();

          vm.publicChannels = null;
          vm.privateChannels = null;
          vm.availableMembers = [];

          vm.membersVisible = false;
          vm.privateNotifications = false;
          vm.showMembers = showMembers;

          vm.setActiveChannel = setActiveChannel;
          vm.activeChannel = null;
          vm.activeDirectChannel = null;
          vm.logout = logout;

          var pingTimer;

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
            $scope.$on('currentProjectUpdated', function(event, args) {

              var previousProject = args.previous;
              if (previousProject !== null) {
                // leave the previous project room
                notificationsLeaveRoom(previousProject);
              }

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

            for (var i=0;i<project.members.length;i++){
              var member = project.members[i];
                if (member.id !== vm.user.id){
                  member.isOnline = false;
                  vm.availableMembers.push(member);
                }
              }
            }

          /**
           * @name initializeNotifications
           * @desc initializes the notifications socket
           */
          function initializeNotifications() {

            if (vm.project === null) {
              return;
            }

            desktopNotificationService.init();

            // the server sends the channel with updates after a page load or a reconnect
            notificationService.on('channels-updates', function (data) {
              $log.log('notifications channels-updates', data);
              loadChannelsUpdates(data);
            });

            // notifications on the channels the user is member of
            notificationService.on('transient-notification', function (notification) {
              $log.log('transient-notification', notification);
              loadNotification(notification);
            });

            // join notifications room on reconnect
            notificationService.on('reconnect', function () {
              $log.log('notifications reconnect');
              notificationsJoinRoom();
            });

            notificationService.on('online-users', function (state) {
              $log.log('online-users', state);
              loadUserState(state);
            });

            notificationService.on('system', function (state) {
              $log.log('system', state);
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

            pingTimer = $timeout(notificationsSendPing, 10 * 1000);
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

            // group channels notifications
            notificationService.emit('join-room', {
              room: getProjectRoomId(vm.project),
              projectId: vm.project.id,
              userId: vm.user.id
            });

            // direct channels notifications
            notificationService.emit('join-room', {
              room: getDirectRoomId(),
              projectId: vm.project.id,
              userId: vm.user.id
            });
          }

          /**
           * @name notificationsLeaveRoom
           * @desc leave a project notifications room
           */
          function notificationsLeaveRoom(project) {

            if (project === null) {
              return;
            }

            notificationService.emit('leave-room', {
              room: getProjectRoomId(project)
            });

            notificationService.emit('leave-room', {
              room: getDirectRoomId(user)
            });

            $timeout.cancel(pingTimer);
          }

          /**
           * @name setChannelsUpdates
           * @desc marks the channels with updates
           */
          function loadChannelsUpdates(data) {

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
           * @name loadNotification
           * @desc marks the channel with a (transient) notification
           */
          function loadNotification(notification) {

            var notifTitle = vm.project.name,
                notifBody = '',
                notifUrl = '',
                showDesktopNotif = false;

            // public and private channels
            if (notification.type === 'channel') {
              var channel = findChannel(notification.id);
              if (channel !== undefined &&
                  !isActiveChannel(notification.id)) {
                channel.hasNotification = true;
                showDesktopNotif = true;
                notifBody = 'Nuevo mensaje en "' + channel.name + '"';
              }
            }
            else {
              if (notification.type === 'direct') {
                var userChannel = findDirectChannel(notification.id);
                if (userChannel !== undefined &&
                    !isActiveDirectChannel(notification.id)) {
                  userChannel.hasNotification = true;
                  vm.privateNotifications = true;
                  showDesktopNotif = true;
                  notifBody = 'Nuevo mensaje de "' + userChannel.alias + '"';
                }
              } else {
                if (notification.type === 'private-channel') {
                  var privatechannel = findChannel(notification.id);
                  if (privatechannel !== undefined &&
                      !isActiveChannel(notification.id)) {
                    privatechannel.hasNotification = true;
                    showDesktopNotif = true;
                    notifBody = 'Nuevo mensaje en "' + privatechannel.name + '"';
                  }
                }
              }
            }

            if (showDesktopNotif) {

              notifUrl = $state.href('dashboard.project.channel-explore', {
                channelId: notification.id,
                isDirect: vm.privateNotifications
              }, { absolute: true });

              if (!isActiveChannel(notification.id) ||
                  !isActiveDirectChannel(notification.id)) {
                desktopNotificationService.show(notifTitle, notifBody, notifUrl);
              }

              // sound
              playNotificationSound();
            }
          }

          /**
           * @name playNotificationSound
           * @desc notifies the user through sound
          */
          function playNotificationSound () {
            try {
              document.getElementById('notification-sound').play();
            }
            catch (e) {}
          }

          /**
           * @name isActiveChannel
           * @desc returns if the active channel is the same as the
           *       channel with the id parameter
          */
          function isActiveChannel(id) {
            if (vm.activeChannel === null) {
              return false;
            }
            return (vm.activeChannel.id === id);
          }

          /**
           * @name isActiveDirectChannel
           * @desc returns if the active direct channel is the same
           *       as the channel with the id parameter
          */
          function isActiveDirectChannel(id) {
            if (vm.activeDirectChannel === null) {
              return false;
            }
            return (vm.activeDirectChannel.id === id);
          }

          /**
           * @name loadUserState
           * @desc updates the user state
           */
          function loadUserState(state) {
            var user = findDirectChannel(state.id);
            if (user !== undefined) {
              if (state.type === 'add') {
                user.isOnline = true;
              }
              else {
                if (state.type === 'remove') {
                  user.isOnline = false;
                }
              }
            }
          }

          /**
           * @name setActiveChannel
           * @desc updates the channel notification status
           */
          function setActiveChannel(data) {
            var channel = null;
            vm.activeChannel = null;
            vm.activeDirectChannel = null;

            if (data.type !== 'D') {
              channel = findChannel(data.id);
              vm.activeChannel = channel;
            }
            else {
              // direct channel
              channel = findDirectChannel(data.id);
              vm.activeDirectChannel = channel;
            }
            if (channel !== undefined) {
              channel.hasNotification = false;
            }
          }

          /**
           * @name findChannel
           * @desc returns a channel searching by id
           */
          function findChannel(channelId) {
            var channel = lodash.find(vm.publicChannels, 'id', channelId);
            if (channel === undefined) {
              // search in private channels
              channel = lodash.find(vm.privateChannels, 'id', channelId);
            }
            return channel;
          }

          /**
           * @name findDirectChannel
           * @desc returns a direct channel searching by id
           */
          function findDirectChannel(userId) {
            return lodash.find(vm.availableMembers, 'id', userId);
          }

          /**
           * @name getProjectRoomId
           * @desc returns the room id for the notifications socket
           */
          function getProjectRoomId(project) {
            return 'Project_' + project.id;
          }

          /**
           * @name getDirectRoomId
           * @desc returns the room id for the direct messages notifications socket
           */
          function getDirectRoomId() {
            return 'SELF_' + user.id;
          }

          /**
           * @name showMembers
           * @desc shows/hide the members panel
           */
          function showMembers() {
            vm.membersVisible = !vm.membersVisible;

            if(vm.privateNotifications){
              vm.privateNotifications = false;
            }

            if (vm.membersVisible) {
              $timeout(setHideMembersOnClick, 100);
            }
          }

          /**
           * @name setHideMembersOnClick
           * @desc sets a event to hide the project members panel when
           *       the user clicks on any part of the page
           */
          function setHideMembersOnClick() {
            $(document).one('click', function(event){
                var isClickedElementChildOfPopup =
                        //angular.element('.cometProjectUsers')
                        angular.element
                               .find(event.target)
                               .length > 0;

                if (isClickedElementChildOfPopup) {
                  return;
                }

                $scope.$apply(function(){
                  vm.membersVisible = false;
                });
            });
          }

          /**
           * @name logout
           * @desc logout the user and redirects to home page
           */
          function logout () {
            notificationsLeaveRoom(vm.project);
            accountService.logout();
            $state.go('home');
          }
      }
})();
