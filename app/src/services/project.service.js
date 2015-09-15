(function() {

    'use strict';

    angular
        .module('cometApp')
        .factory('projectService', projectService);

    projectService.$inject = ['$http', 'authService'];

    function projectService ($http, authService) {

        return {
            create: create,
            getAll: getAll,
            getById: getById,
            acceptInvitation: acceptInvitation
        };

        /**
         * @name create
         * @desc creates a new project
         */
        function create (project) {
          return $http.post('/project', project, authService.getJwtHeader());
        }

        /**
         * @name getAll
         * @desc returns all the users projects
         */
        function getAll () {
            return $http.get('/project', authService.getJwtHeader());
        }

        /**
         * @name getById
         * @desc returns a project by id
         */
        function getById (id) {
            return $http.get('/project/' + id, authService.getJwtHeader());
        }

        /**
         * @name acceptInvitation
         * @desc accepts a project invitation
         */
        function acceptInvitation (id, token) {
            var data = {
              token: token
            };
            return $http.post('/project/' + id + '/invitations/accept', data, authService.getJwtHeader());
        }
    }
})();
