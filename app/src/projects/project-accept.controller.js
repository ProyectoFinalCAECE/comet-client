/**
 * @name ProjectAcceptController
 * @desc Controller for the project-accept view
 */

(function() {
    'use strict';

    angular.module('cometApp')
           .controller('ProjectAcceptController', ProjectAcceptController);

        ProjectAcceptController.$inject = ['$rootScope', '$state', '$timeout', 'projectService', 'authService', '$stateParams'];

        function ProjectAcceptController ($rootScope, $state, $timeout, projectService, authService, $stateParams) {

          var vm = this;
          vm.acceptInvitation = acceptInvitation;
          vm.validationErrors = null;
          vm.token = $stateParams.token;
          vm.isLoggedIn = authService.isLoggedIn;

          vm.acceptSuccess = false;
          vm.acceptError = false;
          vm.errorMessage = '';

          vm.showCreate = true;

          activate();

          /**
           * @name activate
           * @desc controller activation logic
          */
          function activate () {
            acceptInvitation();
          }

          /**
           * @name acceptInvitation
           * @desc
          */
          function acceptInvitation () {
            if (vm.isLoggedIn()) {
              projectService.acceptInvitation(1, vm.token).error(function(data) {
                vm.acceptError = true;
                if (data.errors && data.errors.all) {
                  vm.errorMessage = data.errors.all;
                }
                else
                {
                  if (data.error) {
                    vm.errorMessage = data.error.message;
                  }
                  else {
                    vm.errorMessage = 'Ocurrió un error al consultar al servidor.';
                  }
                }
              }).then(function() {
                  vm.acceptSuccess = true;
                  $timeout( function () {
                    $state.go('dashboard.project-list');
                  }, 500);
              });
            }
          }

          $rootScope.toggleForms = function() {
            vm.showCreate = vm.showCreate === false ? true : false;
          };
        }
})();
