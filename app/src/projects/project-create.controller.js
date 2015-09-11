/**
 * @name ProjectCreateController
 * @desc Controller for the project-create view
 */

(function() {
    'use strict';

    angular.module('cometApp')
           .controller('ProjectCreateController', ProjectCreateController);

        ProjectCreateController.$inject = ['$rootScope', '$state', '$timeout', 'ngToast', 'projectService'];

        function ProjectCreateController ($rootScope, $state, $timeout, ngToast, projectService) {

          var vm = this;
          vm.project = {};
          vm.invites = [];
          vm.create = create;
          vm.addInvite = addInvite;
          vm.removeInvite = removeInvite;
          vm.validationErrors = null;

          activate();

          /**
           * @name activate
           * @desc controller activation logic
          */
          function activate () {

          }

          /**
           * @name addInvite
           * @desc adds an invite to the list of invites
          */
          function addInvite() {
            vm.invites.push({ address: 'ejemplo@gmail.com'});
          }

          /**
           * @name removeInvite
           * @desc removes an invite to the list of invites
          */
          function removeInvite(item) {
            var index = Array.indexOf(item);
            if (index > -1) {
                vm.invites.splice(index, 1);
            }
          }

          /**
           * @name create
           * @desc project creation logic
          */
          function create () {
            vm.project.members = vm.invites;
            projectService.create(vm.project).error(function(data) {
              vm.validationErrors = $rootScope.helpers.loadServerErrors(data);
              if (vm.validationErrors === null)
              {
                ngToast.danger('Ocurrió un error al consultar al servidor.');
              }
            }).then(function() {
                ngToast.success("El proyecto ha sido creado exitosamente.");
                $timeout( function () {
                  $state.go('dashboard.project-list');
                }, 1000);
            });
          }
        }
})();
