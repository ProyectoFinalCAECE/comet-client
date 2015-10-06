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
                                      user) {

          var vm = this;

          dashboardServiceModel.setCurrentUser(user);
          vm.user = dashboardServiceModel.getCurrentUser();
          vm.project = dashboardServiceModel.getCurrentProject();

          vm.publicChannels = null;
          vm.privateChannels = null;
          vm.logout = logout;

          activate();

          /**
           * @name activate
           * @desc controller activation logic
           */
          function activate() {

            if (!vm.user.confirmed) {
              ngToast.warning({
                content: 'Recuerda confirmar tu dirección de correo.',
                dismissButton: true
              });
            }

            // listen to project updates
            $scope.$on('currentProjectUpdated', function() {
              vm.project = dashboardServiceModel.getCurrentProject();
              loadChannels(vm.project);
            });

            // listen to user updates
            $scope.$on('currentUserUpdated', function() {
              vm.user = dashboardServiceModel.getCurrentUser();
            });

            // listen to user updates
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
              $log.log(channels);
              vm.privateChannels = lodash.filter(channels, function(c) {
                return c.type === 'P';
              });

              vm.publicChannels = lodash.filter(channels, function(c) {
                return c.type === 'S';
              });
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
