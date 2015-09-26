(function() {

    'use strict';

    angular
        .module('cometApp')
        .factory('dashboardServiceModel', dashboardServiceModel);

    dashboardServiceModel.$inject = ['$log', '$rootScope'];

    function dashboardServiceModel ($log, $rootScope) {

        var self = this;
        self.project = null;

        return {
            setCurrentProject: setCurrentProject,
            getCurrentProject: getCurrentProject
        };

        function setCurrentProject (project) {
          self.project = project;
          $rootScope.$broadcast("currentProjectUpdated");
          console.log('project is: ', project);
        }

        function getCurrentProject () {
          return self.project;
        }
    }
})();
