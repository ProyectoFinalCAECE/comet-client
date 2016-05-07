/**
 * @name DashboardController
 * @desc Parent controller for the dashboard views */

(function() {
    'use strict';

    angular.module('cometApp')
           .controller('DashboardController', DashboardController);

        DashboardController.$inject = ['$log',
                                       '$q',
                                       '$rootScope',
                                       '$scope',
                                       '$state',
                                       '$stateParams',
                                       '$location',
                                       '$timeout',
                                       'ngToast',
                                       'lodash',
                                       'moment',
                                       'constraints',
                                       'systemNotificationType',
                                       'dashboardServiceModel',
                                       'accountService',
                                       'projectService',
                                       'channelService',
                                       'userService',
                                       'dialogService',
                                       'desktopNotificationService',
                                       'notificationService',
                                       'user'];

        function DashboardController ($log,
                                      $q,
                                      $rootScope,
                                      $scope,
                                      $state,
                                      $stateParams,
                                      $location,
                                      $timeout,
                                      ngToast,
                                      lodash,
                                      moment,
                                      constraints,
                                      systemNotificationType,
                                      dashboardServiceModel,
                                      accountService,
                                      projectService,
                                      channelService,
                                      userService,
                                      dialogService,
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

          vm.showNotifications = true;
          vm.systemNotifications = [];

          vm.gotoCreateProject = gotoCreateProject;

          vm.setActiveChannel = setActiveChannel;
          vm.setActiveChannelForSearch = setActiveChannelForSearch;
          vm.activeChannel = null;
          vm.activeDirectChannel = null;
          vm.activeChannelForSearch = null;
          vm.logout = logout;
          vm.close = closewindow;

          vm.buscar = buscar;
          vm.placeholder = '';
          vm.textoBusqueda = '';

          vm.showMenu = true;
          vm.showMembersList = true;
          vm.showSearch = true;
          vm.showLogout = true;
          vm.showExit = false;

          vm.therearepublicchannels = false;

          var pingTimer = null,
              urlonLoad = null;

          activate();

          /**
           * @name activate
           * @desc controller activation logic
           */
          function activate() {

            vm.therearepublicchannels = false;

            // user account confirmation alert
            if (!vm.user.confirmed) {
              ngToast.warning({
                content: 'Recuerda confirmar tu dirección de correo.',
                dismissButton: true
              });
            }

            // listen to project updates
            $scope.$on('currentProjectUpdated', function(event, args) {
              $log.log('currentProjectUpdated', args);
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

            // project channels
            loadChannels(vm.project);

            // channel-explore active channel logic
            $scope.$on('$stateChangeSuccess', function() {
              vm.placeholder = 'Buscar en proyecto';


              if ($state.current.name === 'dashboard.project.channel-explore')
              {
                vm.placeholder = 'Buscar en canal';
                // new state url
                var currentUrl = '#' + $location.url().split('#')[0];
                urlonLoad = currentUrl;

                // search channel by url
                var channel = lodash.find(vm.availableMembers, 'channelUrl', currentUrl);
                if (channel === undefined) {
                  channel = lodash.find(vm.privateChannels, 'channelUrl', currentUrl);
                }
                if (channel === undefined) {
                  channel = lodash.find(vm.publicChannels, 'channelUrl', currentUrl);
                }
                if (channel !== undefined) {
                  setActiveChannel(channel);
                  setActiveChannelForSearch(channel);
                }
              }

              if( $state.current.name !== 'dashboard.project.channel-explore' &&
                  $state.current.name !== 'dashboard.project.search-results'){
                setActiveChannel(null);
                setActiveChannelForSearch(null);
              }

              // videoconference view settings
              if ($state.current.name === 'dashboard.project.call-index') {
                vm.showMenu = false;
                vm.showNotifications = false;
                vm.showMembersList = false;
                vm.showSearch = false;
                vm.showLogout = false;
                vm.showExit = true;
              }
              else {
                vm.showMenu = true;
                vm.showNotifications = true;
                vm.showMembersList = true;
                vm.showSearch = true;
                vm.showLogout = true;
                vm.showExit = false;
              }
            });

            // notifications
            initializeNotifications();
          }

          /**
           * @name gotoCreateProject
           * @desc validates the user account and redirects to the
           *       create project page
           */
          function gotoCreateProject() {
            var message = '';

            userService.getCurrentUser().then(function (user) {

              // a user with an unconfirmed email addres cannot create projects
              if (!user.confirmed) {
                dialogService.showModalAlert('Crear proyecto',
                                             'Debes confirmar tu cuenta para poder crear un proyecto');
                return;
              }

              // check the number of created projects
              projectService.getAll().then(function (response) {
                var projects = response.data,
                    total = projects.length;

                if (total >= constraints.projectPerUser) {
                  message = 'No puedes crear un proyecto, has llegado al límite de ' +
                        constraints.projectPerUser + '.<BR/>' +
                        'Cierra algún proyecto para continuar.';
                  dialogService.showModalAlert('Crear proyecto', message);
                  return;
                }

                // ok
                $state.go('dashboard.project-create');
              });
            });
          }

          /**
           * @name loadChannels
           * @desc loads the proyect channels
           */
          function loadChannels (project) {

            var defer = $q.defer();

            if (project === null ) {
              defer.resolve();
            }
            else {
              channelService.getAll(project.id).then(function (response) {
                var channels = response.data;

                vm.privateChannels = lodash.filter(channels, function(c) {
                  c.channelUrl = $state.href('dashboard.project.channel-explore', {
                    channelId: c.id,
                    id: vm.project.id,
                    isDirect: false,
                    loadById: undefined,
                    direction: undefined,
                    messageId: undefined,
                    limit: undefined
                  });

                  if (c.channelUrl === urlonLoad) {
                    setActiveChannel(c);
                    urlonLoad = null;
                  }

                  return c.type === 'P' && c.state !== 'C';
                });

                vm.publicChannels = lodash.filter(channels, function(c) {
                  var isMember = (lodash.find(c.members, 'id', vm.user.id) !== undefined);
                  c.channelUrl = $state.href('dashboard.project.channel-explore', {
                    channelId: c.id,
                    id: vm.project.id,
                    isDirect: false,
                    loadById: undefined,
                    direction: undefined,
                    messageId: undefined,
                    limit: undefined
                  });

                  if (c.channelUrl === urlonLoad) {
                    setActiveChannel(c);
                    urlonLoad = null;
                  }

                  return c.type === 'S' && c.state !== 'C' && isMember;
                });

                var i = 0;
                var current_channel;
                while(vm.therearepublicchannels === false &&
                        i < channels.length){
                          current_channel = channels[i];
                          if(current_channel.type === 'S' &&        current_channel.state !== 'C'){
                            vm.therearepublicchannels = true;
                          }
                          i++;
                }
              });

              vm.availableMembers = [];
              for (var i = 0; i < project.members.length; i++){
                var member = project.members[i];
                if (member.id !== vm.user.id){
                  member.isOnline = false;
                  member.channelUrl = $state.href('dashboard.project.channel-explore', {
                    channelId: member.id,
                    isDirect: true,
                    loadById: undefined,
                    direction: undefined,
                    messageId: undefined,
                    limit: undefined
                  });

                  if (member.channelUrl === urlonLoad) {
                    setActiveChannel(member);
                    urlonLoad = null;
                  }

                  vm.availableMembers.push(member);
                }
              }

              defer.resolve();
            }

            return defer.promise;
          }

          function buscar (criterio) {
            console.log('buscar', criterio);

            var channelId = null;

            if(vm.activeChannelForSearch !== null){
              channelId = vm.activeChannelForSearch.id;
            }

            $state.go('dashboard.project.search-results', { criterio: criterio, channelId: channelId });

            vm.textoBusqueda = '';
          }

          /**
           * @name initializeNotifications
           * @desc initializes the notifications socket
           */
          function initializeNotifications() {

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

            notificationService.on('system', function (notification) {
              $log.log('system', notification);
              loadSystemNotification(notification.data);
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

          }

          /**
           * @name notificationsLeaveRoom
           * @desc leave a project notifications room
           */
          function notificationsLeaveRoom(project) {

            $timeout.cancel(pingTimer);

            if (project === null) {
              return;
            }

            notificationService.emit('leave-room', {
              room: getProjectRoomId(project)
            });
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

            if (!vm.showNotifications) {
              return;
            }

            var notifTitle = vm.project !== null ? vm.project.name : 'comet',
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
                    !isActiveDirectChannel(notification.id) &&
                    isActiveProject(notification.projectId)) {
                  userChannel.hasNotification = true;
                  vm.privateNotifications = true;
                  showDesktopNotif = true;
                  notifBody = 'Nuevo mensaje de "' + userChannel.alias + '"';
                }
              } else {
                if (notification.type === 'private-channel') {
                  var privatechannel = findChannel(notification.id);
                  if (privatechannel !== undefined &&
                      !isActiveChannel(notification.id) &&
                      isActiveProject(notification.projectId)) {
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
                isDirect: vm.privateNotifications,
                loadById: undefined,
                direction: undefined,
                messageId: undefined,
                limit: undefined
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
           * @name loadSystemNotification
           * @desc Loads the notification in the users notification menu
          */
          function loadSystemNotification (sysNotif) {
            //   CHANNEL_CREATE: 1,
            //   CHANNEL_CLOSE: 2,
            //   CHANNEL_JOIN: 3,
            //   PROJECT_CLOSE: 5,
            //   CHANNEL_EDIT: 6,
            //   PROJECT_EDIT: 7

            // filter notifications created by this user
            if (sysNotif.userId === user.id) {
              return;
            }

            switch (sysNotif.type) {
              case systemNotificationType.CHANNEL_CREATE:
              {
                sysNotif.text = sysNotif.alias + ' ha creado el canal: ' + sysNotif.channelName;
                sysNotif.link = $state.href('dashboard.project.channel-explore', {
                                  channelId: sysNotif.channelId
                                }, {
                                  absolute: true
                                });
                break;
              }
              case systemNotificationType.CHANNEL_CLOSE:
              {
                sysNotif.text = sysNotif.alias + ' ha cerrado el canal: ' + sysNotif.channelName;
                sysNotif.link = $state.href('dashboard.project.channel-explore', {
                                  channelId: sysNotif.channelId
                                }, {
                                  absolute: true
                                });
                break;
              }
              case systemNotificationType.CHANNEL_JOIN:
              {
                sysNotif.text = sysNotif.alias + ' te ha subscripto al canal: ' + sysNotif.channelName;
                sysNotif.link = $state.href('dashboard.project.channel-explore', {
                                  channelId: sysNotif.channelId
                                }, {
                                  absolute: true
                                });
                break;
              }
              case systemNotificationType.CHANNEL_EDIT:
              {
                sysNotif.text = sysNotif.alias + ' ha editado el canal: ' + sysNotif.channelName;
                sysNotif.link = $state.href('dashboard.project.channel-explore', {
                                  channelId: sysNotif.channelId
                                }, {
                                  absolute: true
                                });
                break;
              }
              case systemNotificationType.PROJECT_CLOSE:
              {
                sysNotif.text = sysNotif.alias + ' ha cerrado el proyecto ';
                sysNotif.link = $state.href('dashboard.project', {
                                  id: sysNotif.projectId
                                }, {
                                  absolute: true
                                });
                break;
              }
              case systemNotificationType.PROJECT_JOIN:
              {
                sysNotif.text = sysNotif.alias + ' se ha unido al proyecto ';
                sysNotif.link = $state.href('dashboard.project', {
                                  id: sysNotif.projectId
                                }, {
                                  absolute: true
                                });
                break;
              }
              case systemNotificationType.PROJECT_EDIT:
              {
                sysNotif.text = sysNotif.alias + ' ha editado el proyecto ';
                sysNotif.link = $state.href('dashboard.project', {
                                  id: sysNotif.projectId
                                }, {
                                  absolute: true
                                });

                break;
              }
              default:
                $log.log('tipo de notificacion desconocido', sysNotif);
                return;
            }

            sysNotif.formattedDate = formatNotificationDate(sysNotif.date);
            vm.systemNotifications.push(sysNotif);
          }

          /**
           * @name formatNotificationDate
           * @desc returns the formatted notification date
          */
          function formatNotificationDate(notifDate) {
            return moment(notifDate).calendar(null, {
              lastDay : '[ayer] LT',
              lastWeek : 'dddd L LT',
              sameDay : 'LT',
              sameElse : 'dddd L LT'
            });
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
          * @name isActiveProject
          * @desc returns if the active project is the same as the
          *       project with the id parameter
         */
          function isActiveProject(id){
            if (vm.project === null) {
              return false;
            }
            return (vm.project.id === id);
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
          function setActiveChannel(channel) {

            vm.activeChannel = null;
            vm.activeDirectChannel = null;

            if (channel === null) {
              return;
            }

            if (channel.isDirect) {
              vm.activeDirectChannel = channel;
            }
            else {
              vm.activeChannel = channel;
            }

            channel.hasNotification = false;

            // notify channel activation
            $rootScope.$broadcast('channelActivated', {
              type: (channel.isDirect ? 'direct' : 'channel'),
              url: channel.channelUrl
            });
          }

          /**
           * @name setActiveChannelForSearch
           * @desc saves into a variable the channel over which searchs must be performed.
           */
          function setActiveChannelForSearch(channel) {
            vm.activeChannelForSearch = channel;
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
           * @name showMembers
           * @desc shows/hide the members panel
           */
          function showMembers() {
            vm.membersVisible = !vm.membersVisible;

            if (vm.privateNotifications) {
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

            if (!vm.membersVisible) {
              return;
            }

            $(document).one('click', function(event){
                
                // search for the clicked element inside the popup
                // var $clickedElement = angular.element('.theme-config').find(event.target); 
                
                // // is a child of the members popup and is not the title div 
                // if ($clickedElement.length > 0 && !$clickedElement.hasClass('title'))
                //   return;
                
                // is not a child of the members popup -> hide 
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

          /**
           * @name close
           * @desc closes the window
           */
          function closewindow () {
            window.close();
          }
      }
})();
