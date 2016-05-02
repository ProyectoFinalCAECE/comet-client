/**
 * @name ProjectListController
 * @desc Controller for the project-list view
 */

(function() {
    'use strict';

    angular.module('cometApp')
           .controller('ProjectListController', ProjectListController);

        ProjectListController.$inject = ['$rootScope',
                                         '$scope',
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
                                        $scope,
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
          vm.gotoCreateProject = $scope.$parent.vm.gotoCreateProject;
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
           * @name hiddenMembersCount
           * @desc returns the number of members not displayed in the project card
           */
          function hiddenMembersCount(members, displayed) {
            return members.length - displayed.length;
          }
        }
})();
