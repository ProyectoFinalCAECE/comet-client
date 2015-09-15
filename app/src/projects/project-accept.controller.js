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
                console.log(data);
                vm.acceptError = true;
                vm.errorMessage = data.errors.all;
                console.log('vm.errorMessage is ' + vm.errorMessage);
              }).then(function() {
                  vm.acceptSuccess = true;
                  $timeout( function () {
                    $state.go('dashboard.project-list');
                  }, 2000);
              });
            }
          }
        }
})();
