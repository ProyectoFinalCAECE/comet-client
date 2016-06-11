/**
 * @name ChannelCreateController
 * @desc Controller for the channel-create view
 */

(function() {
    'use strict';

    angular.module('cometApp')
           .controller('ChannelCreateController', ChannelCreateController);

        ChannelCreateController.$inject = ['$log',
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

        function ChannelCreateController ($log,
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
          vm.channel = {};
          vm.invites = [];
          vm.project = project;
          vm.validationErrors = null;
          vm.isPrivate = false;
          vm.create = create;

          console.log('channel create controller');
          //$log.log('ChannelCreateController - project', project);
          //$log.log('ChannelCreateController - user', user);

          activate();

          function activate () {
            vm.availableMembers = getAvailableMembers();
          }

          /**
           * @name getAvailableMembers
           * @desc returns the available members to add to the channel
          */
          function getAvailableMembers () {
            var projectMembers = angular.copy(vm.project.members);

            lodash.remove(projectMembers, function (m) {
              // remove the current logged in user from the list
              if (m.id === user.id) {
                return true;
              }
              return false;
            });

            return projectMembers;
          }

          /**
           * @name create
           * @desc channel creation logic
          */
          function create () {
            
            // channel name 
            vm.channel.name = $rootScope.helpers.toTitleCase(vm.channel.name);

            // channel type
            vm.channel.type = (vm.isPrivate ? 'P' : 'S');

            // members
            vm.channel.members = lodash.map(vm.invites, function(m) {
              return { id:m.id };
            });

            channelService.create(vm.project.id, vm.channel)
              .error(channelCreateError)
              .then(channelCreated);
          }

          /**
           * @name channelCreated
           * @desc shows a dialog indicating a successful operation
          */
          function channelCreated (response) {
            // notify changes
            $rootScope.$broadcast("channelsUpdated");

            // show dialog to the user
            var createdChannel = response.data;
            var msg = 'El canal "' + createdChannel.name +
                      '" ha sido creado exitosamente.';
            var dlg = dialogService.showModalAlert('Crear canal', msg);
            dlg.result.finally(function () {
              $state.go('dashboard.project.channel-explore', {
                projectId: vm.project.id,
                channelId: createdChannel.id,
                isDirect: false,
                loadById: undefined,
                direction: undefined,
                messageId: undefined,
                limit:undefined
              });
            });
          }

          /**
           * @name channelCreateError
           * @desc shows the error message to the user
          */
          function channelCreateError (data) {
              vm.validationErrors = $rootScope.helpers.loadServerErrors(data);
              if (vm.validationErrors === null)
              {
                ngToast.danger('Ocurrió un error al consultar al servidor.');
              }
          }
        }
})();
