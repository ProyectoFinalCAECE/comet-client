(function() {

    'use strict';

    angular
        .module('cometApp')
        .factory('projectService', projectService);

    projectService.$inject = ['$log', '$http', 'authService'];

    function projectService ($log, $http, authService) {

        var resourceUrl = '/projects/';

        return {
            create: create,
            update: update,
            close: close,
            deleteMember:deleteMember,
            getAll: getAll,
            getById: getById,
            acceptInvitation: acceptInvitation,
            addInvitations: addInvitations
        };

        /**
         * @name create
         * @desc creates a new project
         */
        function create (project) {
          return $http.post(resourceUrl, project, authService.getJwtHeader());
        }

        /**
         * @name update
         * @desc calls the backend endpoint  to edit project info
         */
        function update (project) {
          $log.log('update', project);
          return $http.put(resourceUrl + project.id, project, authService.getJwtHeader());
        }

        /**
         * @name close
         * @desc calls the backend endpoint to close a project
         */
        function close(id) {
          return $http.delete(resourceUrl + id + '/close', authService.getJwtHeader());
        }

        /**
         * @name addInvitations
         * @desc calls backend to send invitations for new members
         */
        function addInvitations(id, invites) {
          var data = {
            "addresses": invites
          };
          return $http.post(resourceUrl + id + '/invitations', data, authService.getJwtHeader());
        }

        /**
         * @name deleteMember
         * @desc delete a member from project
         */
         function deleteMember (id, member) {
           return $http.delete(resourceUrl + id + '/members/' + member.id, authService.getJwtHeader());
         }

        /**
         * @name getAll
         * @desc returns all the users projects
         */
        function getAll () {
            return $http.get(resourceUrl, authService.getJwtHeader());
        }

        /**
         * @name getById
         * @desc returns a project by id
         */
        function getById (id) {
            return $http.get(resourceUrl + id, authService.getJwtHeader());
        }

        /**
         * @name acceptInvitation
         * @desc accepts a project invitation
         */
        function acceptInvitation (id, token) {
            var data = {
              token: token
            };
            return $http.post(resourceUrl + id + '/invitations/accept', data, authService.getJwtHeader());
        }
    }
})();
