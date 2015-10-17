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
                                           '$scope',
                                           '$state',
                                           '$timeout',
                                           '$modal',
                                           'lodash',
                                           'ngToast',
                                           'constraints',
                                           'dialogService',
                                           'dashboardServiceModel',
                                           'chatService',
                                           'channelService',
                                           'user',
                                           'project',
                                           'channel'];

        function ChannelExploreController ($log,
                                          $rootScope,
                                          $scope,
                                          $state,
                                          $timeout,
                                          $modal,
                                          lodash,
                                          ngToast,
                                          constraints,
                                          dialogService,
                                          dashboardServiceModel,
                                          chatService,
                                          channelService,
                                          user,
                                          project,
                                          channel) {

          var vm = this;
          vm.project = project;
          vm.channel = channel;
          vm.isClosed = false;
          vm.validationErrors = null;
          vm.isMember = false;
          vm.message = null;
          vm.messages = [];
          vm.invite = invite;
          vm.canInvite = canInvite;
          vm.sendMessage = sendMessage;

          activate();

          /**
           * @name activate
           * @desc controller activation logic
          */
          function activate () {

            if (lodash.find(vm.channel.members, 'id', user.id) !== undefined) {
              vm.isMember = true;
            }

            vm.isClosed = (vm.channel.state === 'C');

            // listen to channel updates
            $scope.$on('channelUpdated', function(event, args) {
              vm.channel = args.channel;
              activate();
            });

            // initialize chat session
            chatService.emit('join-room', {
              room: vm.channel.id
            });

            // listen to new messages
            chatService.on('message', function (data) {
              processMessageReceived(data);
            });
          }

          /**
           * @name processMessageReceived
           * @desc process a message received on the channel
          */
          function processMessageReceived (data) {

            // data validation
            if (!data || !data.message) {
              $log.log('Mensaje recibido: invalido');
              return ;
            }

            var msgPayload = data.message;

            // convert server date to local date
            msgPayload.date = convertUTCDateToLocalDate(new Date(msgPayload.date));

            // add message to message list
            addMessageToList(msgPayload);
          }

          /**
           * @name convertUTCDateToLocalDate
           * @desc converts a UTC date to local datetime
           *       http://stackoverflow.com/questions/6525538/convert-utc-date-time-to-local-date-time-using-javascript
          */
          function convertUTCDateToLocalDate(date) {

            var newDate = new Date(date.getTime() +
                          date.getTimezoneOffset() * 60 * 1000);

            var offset = date.getTimezoneOffset() / 60;
            var hours = date.getHours();

            newDate.setHours(hours - offset);

            return newDate;
          }

          /**
           * @name sendMessage
           * @desc send message to the channel
          */
          function sendMessage() {

            // construct the message payload
            var msgPayload = {
              text: vm.message,
              user: user.id,
              // for local use only, the server overwrites the date
              date: new Date().getTime()
            };

            // send the data to the server
            chatService.emit('message', {
              room: vm.channel.id,
              message: {
                message: msgPayload
              }
            });

            // add the message to the view
            addMessageToList(msgPayload);
            vm.message = '';
          }

          /**
           * @name addMessageToList
           * @desc adds the message to the list so it can be viewed on the page
          */
          function addMessageToList(msg) {
            vm.messages.push(msg);
          }

          /**
           * @name canInvite
           * @desc returns if the user can add members to the channel
          */
          function canInvite () {
            if (vm.isClosed) {
              return false;
            }

            return (vm.channel.members.length < vm.project.members.length);
          }

          /**
           * @name invite
           * @desc opens the 'add channel member' dialog
          */
          function invite () {

            if (!vm.isMember) {
              showAddCurrentMemberDialog();
            }
            else {
              if (vm.canInvite) {
                showAddMembersDialog();
              }
            }
          }

          /**
           * @name showAddCurrentMemberDialog
           * @desc shows the dialog to add the current logged in user to the
           *       the channel
          */
          function showAddCurrentMemberDialog () {
            var msg = '¿Desea agregarse como participante en este canal?';
            var dlg = dialogService.showModalConfirm('Agregar canal', msg);
            dlg.result.then(function () {
              var invites = {
                members: [
                    {
                      id: user.id
                    }
                  ]
              };

              channelService.invite(vm.project.id, vm.channel.id, invites)
                .error(channelInviteError)
                .then(function (response) {
                  console.log('add current', response.data);
                  $rootScope.$broadcast('channelUpdated', { channel: response.data });
                  $rootScope.$broadcast('channelsUpdated');
                  ngToast.success('Canal agregado.');
                });
            });
          }

          /**
           * @name channelInviteError
           * @desc shows the error message to the user
          */
          function channelInviteError (data) {
              vm.validationErrors = $rootScope.helpers.loadServerErrors(data);
              if (vm.validationErrors === null)
              {
                ngToast.danger('Ocurrió un error al consultar al servidor.');
              }
          }

          /**
           * @name showAddMembersDialog
           * @desc shows the dialog to add members to the channel
          */
          function showAddMembersDialog () {
            var modalInstance = $modal.open({
              templateUrl: '/src/channels/channel-invite.html',
              controller: 'ChannelInviteController',
              controllerAs: 'vm',
              size: 'md',
              backdrop: 'static',
              resolve: {
                project: function () {
                  return vm.project;
                },
                user: function () {
                  return user;
                },
                channel: function () {
                  return vm.channel;
                }
             }
           });
           modalInstance.result.then(function (response) {
             $rootScope.$broadcast('channelUpdated', response.data);
           });
          }
      }
})();
