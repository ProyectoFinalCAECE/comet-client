(function() {

    'use strict';

    angular
        .module('cometApp')
        .factory('dashboardServiceModel', dashboardServiceModel);

    dashboardServiceModel.$inject = ['$log', '$rootScope'];

    function dashboardServiceModel ($log, $rootScope) {

        var project = null;

        return {
            setCurrentProject: setCurrentProject,
            getCurrentProject: getCurrentProject
        };

        function setCurrentProject (newProject) {
          project = newProject;
          $rootScope.$broadcast("currentProjectUpdated");
          console.log('project is: ', project);
        }

        function getCurrentProject () {
          return project;
        }
    }
})();
