/**
 * @name ProjectCreateController
 * @desc Controller for the project-create view
 */

(function() {
    'use strict';

    angular.module('cometApp')
           .controller('ProjectCreateController', ProjectCreateController);

        ProjectCreateController.$inject = ['$rootScope',
                                           '$state',
                                           '$timeout',
                                           'ngToast',
                                           'constraints',
                                           'dialogService',
                                           'projectService',
                                           'userService'];

        function ProjectCreateController ($rootScope,
                                          $state,
                                          $timeout,
                                          ngToast,
                                          constraints,
                                          dialogService,
                                          projectService,
                                          userService) {

          var vm = this;
          vm.project = {};
          vm.invites = [];
          vm.validationErrors = null;
          vm.invitesLimitReached = false;
          vm.membersPerProjectPerStep = constraints.membersPerProjectPerStep;
          vm.create = create;
          vm.addInvite = addInvite;
          vm.removeInvite = removeInvite;

          activate();

          /**
           * @name activate
           * @desc controller activation logic
          */
          function activate () {
            userService.getCurrentUser().then(function (user) {
              if (!user.confirmed) {
                $state.go('dashboard.project-list');
              }
            });
          }

          /**
           * @name addInvite
           * @desc adds an invite to the list of invites
          */
          function addInvite() {
            var indice = vm.invites.length + 1;
            if (indice <= constraints.membersPerProjectPerStep) {
              vm.invites.push({
                address: '',
                name: 'address_' + indice.toString()
              });
            } else {
               vm.invitesLimitReached = true;
            }
          }

          /**
           * @name removeInvite
           * @desc removes an invite to the list of invites
          */
          function removeInvite(invite) {
            console.log('before', vm.invites.length);
            vm.invitesLimitReached = false;
            vm.invites = $.grep(vm.invites, function(value) {
              return value !== invite;
            });
            console.log('after', vm.invites.length);
          }

          /**
           * @name create
           * @desc project creation logic
          */
          function create () {
            vm.project.name = $rootScope.helpers.toTitleCase(vm.project.name);
            vm.project.members = vm.invites;
            projectService.create(vm.project).error(function(data) {
              vm.validationErrors = $rootScope.helpers.loadServerErrors(data);
              if (vm.validationErrors === null)
              {
                ngToast.danger('Ocurrió un error al consultar al servidor.');
              }
            }).then(function() {
                var msg = 'El proyecto "' + vm.project.name +
                          '" ha sido creado exitosamente.';
                var dlg = dialogService.showModalAlert('Crear proyecto', msg);
                dlg.result.finally(function () {
                  $state.go('dashboard.project-list');
                });
            });
          }
        }
})();
