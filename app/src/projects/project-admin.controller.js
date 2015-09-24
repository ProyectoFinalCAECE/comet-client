/**
 * @name ProjectAdminController
 * @desc Controller for the project-admin view
 */

(function() {
    'use strict';

    angular.module('cometApp')
           .controller('ProjectAdminController', ProjectAdminController);

        ProjectAdminController.$inject = ['$log',
                                          '$rootScope',
                                          '$state',
                                          'ngToast',
                                          'dialogService',
                                          'projectService',
                                          'user',
                                          'project'];

        function ProjectAdminController ( $log,
                                          $rootScope,
                                          $state,
                                          ngToast,
                                          dialogService,
                                          projectService,
                                          user,
                                          project) {

          var vm = this;
          vm.update = update;
          vm.deleteMember = deleteMember;
          vm.isCurrentUser = isCurrentUser;
          vm.project = project;
          vm.validationErrors = null;

          $log.log(project);

          activate();

          /**
           * @name activate
           * @desc controller activation logic
          */
          function activate () {

          }

          /**
           * @name update
           * @desc project update logic
          */
          function update () {
            projectService.update(vm.project).error(function(data) {
              vm.validationErrors = $rootScope.helpers.loadServerErrors(data);
              if (vm.validationErrors === null) {
                ngToast.danger('Ocurrió un error al consultar al servidor.');
              }
            }).then(function() {
                var msg = 'El proyecto "' + vm.project.name +
                          '" ha sido editado exitosamente.';
                var dlg = dialogService.showModalAlert('Administrar proyecto', msg);
                dlg.result.then(function () {
                  $state.go('dashboard.project-list');
                });
            });
          }

          /**
           * @name deleteMember
           * @desc deletes selected members from project
          */
          function deleteMember (member) {
            projectService.deleteMember(vm.project, member).error(function(data) {
              vm.validationErrors = $rootScope.helpers.loadServerErrors(data);
              if (vm.validationErrors === null) {
                ngToast.danger('Ocurrió un error al consultar al servidor.');
              }
            }).then(function() {
              var msg = '¿Esta seguro que desea eliminar el participante?';
              var dlg = dialogService.showModalConfirm('Administrar proyecto', msg);
              dlg.result.then(function () {
                var index = vm.project.members.indexOf(member);
                vm.project.members.splice(index, 1);
                ngToast.success('El participante ha sido eliminado.');
              });
            });
          }

          /**
           * @name isCurrentUser
           * @desc returns if the member is the current logged in user
          */
          function isCurrentUser(member) {
            return member.email === user.email;
          }
        }
})();
