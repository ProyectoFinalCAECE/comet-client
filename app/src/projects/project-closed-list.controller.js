/**
 * @name ProjectClosedListController
 * @desc Controller for the project-closed-list view
 */

(function() {
    'use strict';

    angular.module('cometApp')
           .controller('ProjectClosedListController', ProjectClosedListController);

        ProjectClosedListController.$inject = ['filterFilter',
                                               'projects'];

        function ProjectClosedListController (filterFilter,
                                              projects) {

          var vm = this;
          vm.closedProjects = null;
          vm.closedProjectsEmpty = false;

          activate();

          /**
           * @name activate
           * @desc controller activation logic
           */
          function activate () {
              vm.closedProjects = filterFilter(projects, { state:'C' });
              vm.closedProjectsEmpty = (vm.closedProjects.length === 0);
          }

        }
})();
