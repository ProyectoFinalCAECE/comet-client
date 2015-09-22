/**
 * @name ProjectExploreController
 * @desc Controller for the project-explore view
 */

(function() {
    'use strict';

    angular.module('cometApp')
           .controller('ProjectExploreController', ProjectExploreController);

        ProjectExploreController.$inject = ['$rootScope',
                                         '$state',
                                         'projectService',
                                         'project',
                                         'dialogService'];

        function ProjectExploreController ($rootScope,
                                        $state,
                                        projectService,
                                        project,
                                        dialogService) {

          var vm = this;
          vm.project = null;

          activate();
          vm.gotoEditProject = gotoEditProject;

          /**
           * @name activate
           * @desc controller activation logic
           */
          function activate () {
              vm.project = project;
              console.log('project is: ' + vm.project);
          }

          /**
           * @name gotoEditProject
           * @desc controller activation logic
           */

          function gotoEditProject() {
            if (project.isOwner === true) {
              $state.go('dashboard.project-admin',  { id: project.id });
            } else {
              var message = "No puedes editar este proyecto, no eres el dueño.";
              dialogService.showModalAlert('Editar proyecto', message);
            }
          }
        }
})();
