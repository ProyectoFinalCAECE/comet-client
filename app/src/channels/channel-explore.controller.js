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
                                           '$modal',
                                           '$location',
                                           '$anchorScroll',
                                           'lodash',
                                           'moment',
                                           'ngToast',
                                           'constraints',
                                           'dialogService',
                                           'dashboardServiceModel',
                                           'chatService',
                                           'channelService',
                                           'user',
                                           'project',
                                           'channel',
                                           'isDirect'];

        function ChannelExploreController ($log,
                                          $rootScope,
                                          $scope,
                                          $state,
                                          $modal,
                                          $location,
                                          $anchorScroll,
                                          lodash,
                                          moment,
                                          ngToast,
                                          constraints,
                                          dialogService,
                                          dashboardServiceModel,
                                          chatService,
                                          channelService,
                                          user,
                                          project,
                                          channel,
                                          isDirect) {

          var vm = this;
          vm.project = project;
          vm.channel = channel;
          vm.isClosed = false;
          vm.isDirect = isDirect;
          vm.validationErrors = null;
          vm.isMember = false;
          vm.message = null;
          vm.messages = [];
          // messages
          vm.lastMessage = null;
          vm.getMember = getMember;
          vm.formatMessageDate = formatMessageDate;
          vm.sendMessage = sendMessage;
          // update info
          vm.edit = edit;
          // invite / delete members
          vm.showMembers = false;
          vm.invite = invite;
          vm.canInvite = canInvite;
          vm.deleteMember = deleteMember;
          // exit from the channel
          vm.exit = exit;
          //close channel
          vm.imSure = false;
          vm.closeChannel = closeChannel;
          //delete channel
          vm.imSureDelete = false;
          vm.deleteChannel = deleteChannel;

          // current message Id counter
          var lastMsgId = 0;

          activate();

          /**
           * @name activate
           * @desc controller activation logic
          */
          function activate () {

            setFlags();

            // load channel messages
            channelService.getMessages(vm.project.id, vm.channel.id, 0, 0, vm.isDirect).then(function (response) {
              response.data.messages.forEach(function(entry) {
                  processMessageReceived(entry);
                  scrollToLast();
              });
            });

            // listen to channel updates
            $scope.$on('channelUpdated', function(event, args) {
              if (vm.isDirect) {
                return;
              }
              vm.channel = args.channel;
              setFlags();
            });

            // initialize chat session
            chatService.emit('join-room', {
              room: getRoomId()
            });

            // listen to new messages
            chatService.on('message', function (data) {
              processMessageReceived(data);
              scrollToLast();
            });
          }

          /**
           * @name loadFlags
           * @desc sets the flags that enables/disables actions in the view
          */
          function setFlags() {

            if (vm.isDirect) {
              vm.isMember = true;
              vm.isClosed = false;
              return;
            }

            if (lodash.find(vm.channel.members, 'id', user.id) !== undefined) {
              vm.isMember = true;
            }

            vm.isClosed = (vm.channel.state === 'C');
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

            lastMsgId = msgPayload.id;
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

            lastMsgId++;

            // construct the message payload
            var msgPayload = {
              id: lastMsgId,
              text: vm.message,
              user: user.id,
              destinationUser: (isDirect ? vm.channel.id : 0),
              date: new Date().getTime()  // for local use only, the server overwrites the date
            };

            // send the data to the server
            chatService.emit('message', {
              room: getRoomId(),
              message: {
                message: msgPayload
              }
            });

            // add the message to the view
            addMessageToList(msgPayload);
            vm.message = '';

            scrollToLast();
          }

          /**
           * @name scrollToLast
           * @desc scroll the window to the last message
          */
          function scrollToLast() {
            $location.hash('msg_' + lastMsgId);
            $anchorScroll();
          }

          /**
           * @name addMessageToList
           * @desc adds the message to the list so it can be viewed on the page
          */
          function addMessageToList(msg) {
            vm.messages.push(msg);
            vm.lastMessage = msg.date;
          }

          /**
           * @name getMember
           * @desc returns a member object by id
          */
          function getMember(memberId) {
            $log.log(vm.channel.members);
            return lodash.find(vm.channel.members, 'id', memberId);
          }

          /**
           * @name formatMessageDate
           * @desc returns the message timestamp in a readable format
          */
          function formatMessageDate (msgDate) {
            return moment(msgDate).calendar();
          }

          /**
           * @name getRoomId
           * @desc returns the room id used to broadcast the message
          */
          function getRoomId() {
            if (isDirect) {
              // the direct channel room is put together using
              // the users id's in ascending order
              var userIdFrom = user.id,
                  userIdTo = vm.channel.id;

              if (userIdFrom > userIdTo) {
                userIdTo = userIdFrom;
                userIdFrom = vm.channel.id;
              }

              return 'Direct_' + userIdFrom + '_' + userIdTo;
            }
            else {
              return vm.channel.id;
            }
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

          /**
           * @name edit
           * @desc channel update logic
          */
          function edit () {
            var modalInstance = $modal.open({
              templateUrl: '/src/channels/channel-edit.html',
              controller: 'ChannelEditController',
              controllerAs: 'vm',
              size: 'md',
              backdrop: 'static',
              resolve: {
                project: function () {
                  return vm.project;
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

          /**
           * @name exit
           * @desc opens the 'exit channel' dialog
          */
          function exit () {
            var msg = '¿Desea salir del canal?';
            var dlg = dialogService.showModalConfirm('Salir de canal', msg);
            dlg.result.then(function () {
              channelService
                .deleteMember(vm.project.id, vm.channel.id, user.id)
                .then(function (response) {
                  ngToast.success('Has salido del canal.');
                  $rootScope.$broadcast('channelUpdated', response.data);
                  $rootScope.$broadcast('channelsUpdated');
                  $state.go('dashboard.project.project-explore', { id: vm.project.id });
                });
              });
          }

          /**
           * @name deleteMember
           * @desc deletes selected members from channel
          */
          function deleteMember (member) {
            var msg = '¿Esta seguro que desea eliminar el participante?';
            var dlg = dialogService.showModalConfirm('Administrar proyecto', msg);
            dlg.result.then(function () {
              channelService.deleteMember(vm.project.id, vm.channel.id, member.id).error(function(data) {
                vm.validationErrors = $rootScope.helpers.loadServerErrors(data);
                if (vm.validationErrors === null) {
                  ngToast.danger('Ocurrió un error al consultar al servidor.');
                }
              });
            }).then(function() {
                var index = vm.project.members.indexOf(member);
                vm.project.members.splice(index, 1);
                ngToast.success('El participante ha sido eliminado.');
            });
          }

          /**
           * @name closeChannel
           * @desc calls the endpoint to close the channel
          */
          function closeChannel() {
            $log.log('close', vm.channel.id);
            var msg = '¿Esta seguro que desea cerrar el canal?';
            var dlg = dialogService.showModalConfirm('Administrar proyecto', msg);
            dlg.result.then(function () {
              channelService.close(vm.project.id, vm.channel.id).error(function(data) {
                vm.validationErrors = $rootScope.helpers.loadServerErrors(data);
                if (vm.validationErrors === null)
                {
                  ngToast.danger('Ocurrió un error al consultar al servidor.');
                }
              }).then(function() {
                ngToast.success('Canal cerrado.');
                $state.go('dashboard.project.project-explore', { id: vm.project.id });
              });
            });
          }

          /**
           * @name deleteChannel
           * @desc calls the endpoint to delete the channel
          */
          function deleteChannel() {
            var msg = '¿Esta seguro que desea eliminar el canal? Esta operación no puede revertirse.';
            var dlg = dialogService.showModalConfirm('Administrar proyecto', msg);
            dlg.result.then(function () {
              $log.log('deleteChannel', vm.channel.id);
              channelService.deleteChannel(vm.project.id, vm.channel.id).error(function(data) {
                vm.validationErrors = $rootScope.helpers.loadServerErrors(data);
                if (vm.validationErrors === null)
                {
                  ngToast.danger('Ocurrió un error al consultar al servidor.');
                }
              }).then(function() {
                  ngToast.success('Canal eliminado.');
                  $state.go('dashboard.project.project-explore', { id: vm.project.id });
              });
            });
          }
      }
})();
