/**
 * @name ProjectAdminController
 * @desc Controller for the project-admin view
 */

(function() {
    'use strict';

    angular.module('cometApp')
           .controller('ProjectAdminController', ProjectAdminController);

        ProjectAdminController.$inject = ['$rootScope',
                                           '$state',
                                           'ngToast',
                                           'dialogService',
                                           'projectService',
                                           'project'];

        function ProjectAdminController ($rootScope,
                                          $state,
                                          ngToast,
                                          dialogService,
                                          projectService,
                                          project) {

          var vm = this;
          vm.project = project;
          vm.update = update;
          vm.validationErrors = null;

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
        }
})();
