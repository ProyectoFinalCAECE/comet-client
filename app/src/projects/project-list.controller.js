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
                                         'dashboardServiceModel',
                                         'projectService',
                                         'userService',
                                         'projects'];

        function ProjectListController ($rootScope,
                                        $state,
                                        filterFilter,
                                        ngToast,
                                        constraints,
                                        dialogService,
                                        dashboardServiceModel,
                                        projectService,
                                        userService,
                                        projects) {

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
              dashboardServiceModel.setCurrentProject(null);
              vm.projects = filterFilter(projects, { state:'O' });
              vm.isEmpty = (vm.projects.length === 0);
              vm.closedProjects = filterFilter(projects, { state:'C' });
              vm.closedProjectsEmpty = (vm.closedProjects.length === 0);
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
                if (checkProjectCount()) {
                  canCreate = true;
                }
                else {
                  message = 'No puedes crear un proyecto, has llegado al límite de ' +
                            constraints.projectPerUser + '.<BR/>' +
                            'Cierra algún proyecto para continuar.';
                }
              }
              else {
                message = 'Debes confirmar tu cuenta para poder crear un proyecto';
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
           * @name checkProjectCount
           * @desc returns if the user has reached the maximum project count
           */
          function checkProjectCount() {
            var total = vm.projects.length;
            console.log(total, constraints.projectPerUser);
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
