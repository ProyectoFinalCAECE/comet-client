/**
 * @name ProjectListController
 * @desc Controller for the project-list view
 */

(function() {
    'use strict';

    angular.module('cometApp')
           .controller('ProjectListController', ProjectListController);

        ProjectListController.$inject = ['$rootScope',
                                         '$state',
                                         'filterFilter',
                                         'ngToast',
                                         'constraints',
                                         'dialogService',
                                         'projectService',
                                         'userService'];

        function ProjectListController ($rootScope,
                                        $state,
                                        filterFilter,
                                        ngToast,
                                        constraints,
                                        dialogService,
                                        projectService,
                                        userService) {

          var vm = this;
          vm.projects = null;
          vm.isEmpty = true;
          vm.closedProjects = null;
          vm.closedProjectsEmpty = true;
          vm.gotoCreateProject = gotoCreateProject;
          vm.hiddenMembersCount = hiddenMembersCount;

          activate();

          /**
           * @name activate
           * @desc controller activation logic
           */
          function activate () {
            projectService.getAll().then(function(response){
              var projects = response.data;
              vm.projects = filterFilter(projects, { state:'O' });
              vm.isEmpty = (vm.projects.length === 0);
              vm.closedProjects = filterFilter(projects, { state:'C' });
              vm.closedProjectsEmpty = (vm.closedProjects.length === 0);
            });
          }

          /**
           * @name gotoCreateProject
           * @desc validates the user account and redirects to the
           *       create project page
           */
          function gotoCreateProject() {
            var canCreate = false,
                message = "";

            userService.getCurrentUser().then(function (user) {
              if (user && user.confirmed) {
                if (checkProjectLimit()) {
                  canCreate = true;
                }
                else {
                  message = 'No puedes crear un proyecto, has llegado al límite de ' +
                            constraints.projectPerUser + '.<BR/>' +
                            'Cierra algún proyecto para continuar.';
                }
              }
              else {
                message = 'No puedes crear mas de ' + constraints.projectPerUser +
                          ' proyectos. Cierra algún proyecto para continuar';
              }

              if (canCreate) {
                $state.go('dashboard.project-create');
              }
              else {
                dialogService.showModalAlert('Crear proyecto', message);
              }
            });
          }

          /**
           * @name checkProjectLimit
           * @desc returns if the user has reached the maximum project count
           */
          function checkProjectLimit() {
            var total = vm.projects;
            return (total < constraints.projectPerUser);
          }

          /**
           * @name hiddenMembersCount
           * @desc returns the number of members not displayed in the project card
           */
          function hiddenMembersCount(members, displayed) {
            return members.length - displayed.length;
          }
        }
})();
