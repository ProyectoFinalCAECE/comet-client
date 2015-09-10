/**
 * @name ProjectCreateController
 * @desc Controller for the project-create view
 */

(function() {
    'use strict';

    angular.module('cometApp')
           .controller('ProjectCreateController', ProjectCreateController);

        ProjectCreateController.$inject = ['$rootScope', '$state', 'ngToast', 'projectService'];

        function ProjectCreateController ($rootScope, $state, ngToast, projectService) {

          var vm = this;
          vm.project = null;
          vm.created = false;
          vm.create = create;

          activate();

          /**
           * @name activate
           * @desc controller activation logic
           */
          function activate () {

          }

          function create () {
            projectService.create(vm.project).error(function(data) {
              vm.validationErrors = $rootScope.helpers.loadServerErrors(data);
              if (vm.validationErrors === null)
              {
                ngToast.danger('Ocurrió un error al consultar al servidor.');
              }
            }).then(function() {
                $state.go('home');
            });
          }
        }
})();
