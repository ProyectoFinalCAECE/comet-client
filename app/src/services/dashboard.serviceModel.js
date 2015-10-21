(function() {

    'use strict';

    angular
        .module('cometApp')
        .factory('dashboardServiceModel', dashboardServiceModel);

    dashboardServiceModel.$inject = ['$log', '$rootScope'];

    function dashboardServiceModel ($log, $rootScope) {

        var project = null,
            user = null;

        return {
            setCurrentUser: setCurrentUser,
            getCurrentUser: getCurrentUser,
            setCurrentProject: setCurrentProject,
            getCurrentProject: getCurrentProject
        };

        function setCurrentProject (newProject) {
          project = newProject;
          $rootScope.$broadcast('currentProjectUpdated');
        }

        function getCurrentProject () {
          return project;
        }

        function setCurrentUser (newUser) {
          user = newUser;
          $rootScope.$broadcast('currentUserUpdated');
        }

        function getCurrentUser () {
          return user;
        }
    }
})();
