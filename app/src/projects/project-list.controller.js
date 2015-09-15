/**
 * @name ProjectListController
 * @desc Controller for the project-list view
 */

(function() {
    'use strict';

    angular.module('cometApp')
           .controller('ProjectListController', ProjectListController);

        ProjectListController.$inject = ['projectService'];

        function ProjectListController (projectService) {

          var vm = this;
          vm.projects = null;
          vm.isEmpty = true;
          vm.closedProjects = null;
          vm.closedProjectsEmpty = true;

          activate();

          /**
           * @name activate
           * @desc controller activation logic
           */
          function activate () {
            projectService.getAll().then(function(response){
              vm.projects = response.data;
              vm.isEmpty = vm.projects.length === 0;
            });
          }

        }
})();
