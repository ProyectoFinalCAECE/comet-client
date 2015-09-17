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
                                         'dialogService',
                                         'projectService',
                                         'userService'];

        function ProjectListController ($rootScope,
                                        $state,
                                        filterFilter,
                                        ngToast,
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
            userService.getCurrentUser().then(function (user) {
              if (user && user.confirmed) {
                $state.go('dashboard.project-create');
              }
              else {
                var message = 'No puedes crear un proyecto sin antes ' +
                              'confirmar tu dirección de correo.';

                dialogService.showModalAlert('Confirmar cuenta', message);
              }
            });
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
