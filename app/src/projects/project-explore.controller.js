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
                                            'dialogService',
                                            'dashboardServiceModel',
                                            'projectService',
                                            'project'];

        function ProjectExploreController ($rootScope,
                                           $state,
                                           dialogService,
                                           dashboardServiceModel,
                                           projectService,
                                           project) {

          var vm = this;
          vm.project = null;
          vm.gotoEditProject = gotoEditProject;

          activate();

          /**
           * @name activate
           * @desc controller activation logic
           */
          function activate () {
              vm.project = project;
              dashboardServiceModel.setCurrentProject(project);
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
