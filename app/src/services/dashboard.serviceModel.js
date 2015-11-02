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
          var previous = project;
          project = newProject;
          $rootScope.$broadcast('currentProjectUpdated', {
            previous: previous,
            new: newProject
          });
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
