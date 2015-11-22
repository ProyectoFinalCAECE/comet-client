(function() {

    'use strict';

    angular
        .module('cometApp')
        .factory('integrationService', integrationService);

    integrationService.$inject = ['$log', '$http', 'authService'];

    function integrationService ($log, $http, authService) {

        var parentUrl = '/projects/',
            resourceUrl = '/integrations/';

        return {
            getAll: getAll,
            getById: getById
        };

        /**
         * @name getAll
         * @desc returns all the integrations in the project
         */
        function getAll (projectId) {
          var url = getBaseUrl(projectId);
          return $http.get(url, authService.getJwtHeader());
        }

        /**
         * @name getById
         * @desc returns a channel by id
         */
        function getById (projectId, integrationId) {
          var url = getBaseUrl(projectId) + integrationId;
          return $http.get(url, authService.getJwtHeader());
        }

        /**
         * @name getbaseUrl
         * @desc return the base url for the channels resource
         */
        function getBaseUrl(projectId) {
          return parentUrl + projectId + resourceUrl;
        }

    }
})();
