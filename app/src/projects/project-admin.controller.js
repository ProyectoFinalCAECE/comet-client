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
              if (vm.validationErrors === null)
              {
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

          function isCurrentUser(member) {
            $log.log(member, user);
            return member.email === user.email;
          }
        }
})();
