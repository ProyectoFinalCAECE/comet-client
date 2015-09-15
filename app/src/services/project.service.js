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
            getById: getById
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
    }
})();
