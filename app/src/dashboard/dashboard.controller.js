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
                                       'ngToast',
                                       'lodash',
                                       'dashboardServiceModel',
                                       'accountService',
                                       'channelService',
                                       'chatService',
                                       'user'];

        function DashboardController ($log,
                                      $scope,
                                      $state,
                                      $stateParams,
                                      ngToast,
                                      lodash,
                                      dashboardServiceModel,
                                      accountService,
                                      channelService,
                                      chatService,
                                      user) {

          var vm = this;

          vm.user = user;
          vm.project = dashboardServiceModel.getCurrentProject();

          vm.publicChannels = null;
          vm.privateChannels = null;
          vm.availableMembers = null;
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

            // notifications

            // listen to project updates
            $scope.$on('currentProjectUpdated', function() {
              vm.project = dashboardServiceModel.getCurrentProject();
              loadChannels(vm.project);
            });

            // listen to user updates
            $scope.$on('currentUserUpdated', function() {
              vm.user = dashboardServiceModel.getCurrentUser();
            });

            // listen to channel updates
            $scope.$on('channelsUpdated', function() {
              loadChannels(vm.project);
            });
          }

          function loadChannels (project) {

            if (project === null ) {
              return;
            }

            channelService.getAll(project.id).then(function (response) {
              var channels = response.data;

              vm.privateChannels = lodash.filter(channels, function(c) {
                return c.type === 'P';
              });

              vm.publicChannels = lodash.filter(channels, function(c) {
                var isMember = (lodash.find(c.members, 'id', vm.user.id) !== undefined);
                return c.type === 'S' && isMember;
              });
            });

            // members for direct chat
            vm.availableMembers = lodash.filter(vm.project.members, function(m) {
              return (m.id !== vm.user.id);
            });
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
