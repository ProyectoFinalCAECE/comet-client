/**
 * @name DashboardController
 * @desc Parent controller for the dashboard views */

(function() {
    'use strict';

    angular.module('cometApp')
           .controller('DashboardController', DashboardController);

        DashboardController.$inject = ['$scope',
                                       '$state',
                                       '$stateParams',
                                       'ngToast',
                                       'dashboardServiceModel',
                                       'accountService',
                                       'user'];

        function DashboardController ($scope,
                                      $state,
                                      $stateParams,
                                      ngToast,
                                      dashboardServiceModel,
                                      accountService,
                                      user) {

          var vm = this;
          vm.user = user;
          vm.logout = logout;
          vm.project = dashboardServiceModel.project;
          vm.publicChannels = null;
          vm.privateChannels = null;

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
              console.log('dashboard notify currentProjectUpdated', dashboardServiceModel.getCurrentProject());
              vm.project = dashboardServiceModel.getCurrentProject();
              loadChannels(vm.project);
            });
          }

          function loadChannels (project) {
            // load project channels
            vm.privateChannels = [
              {
                name: 'my private channel - ' + project.id
              }
            ];

            vm.publicChannels = [
              {
                name: 'my public channel - ' + project.id
              }
            ];
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
