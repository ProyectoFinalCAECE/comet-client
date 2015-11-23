(function() {

    'use strict';

    angular
        .module('cometApp')
        .factory('integrationService', integrationService);

    integrationService.$inject = ['$log', '$http', 'lodash', 'authService'];

    function integrationService ($log, $http, lodash, authService) {

        var parentUrl = '/projects/',
            resourceUrl = '/integrations/';

        return {
            create: create,
            update: update,
            getAll: getAll,
            getProjectIntegrationById: getProjectIntegrationById
        };

        /**
         * @name getAll
         * @desc returns all the integrations
         */
        function getAll (projectId) {
          var url = getBaseUrl(projectId);
          return $http.get(url, authService.getJwtHeader());
        }

        // /**
        //  * @name getById
        //  * @desc returns a integration by id
        //  */
        // function getById (projectId, integrationId) {
        //    return getAll(projectId)
        //         .then(function(data) {
        //           console.log('getById', lodash.find(data.data.integrations, 'integrationId', integrationId));
        //           return lodash.find(data.data.integrations, 'integrationId', integrationId);
        //         });
        // }

        /**
         * @name getProjectIntegrationById
         * @desc returns a project_integration by id
         *       http://localhost:4000/projects/:project_id/integrations/_project_integration_id
         */
        function getProjectIntegrationById (projectId, projectIntegrationId) {
          var url = getBaseUrl(projectId) + projectIntegrationId;
          return $http.get(url, authService.getJwtHeader());
        }

        /**
         * @name create
         * @desc creates a integration config
         */
        function create (projectId, projectIntegrationId, projectIntegrationConfig) {
          var url = getBaseUrl(projectId) + projectIntegrationId;
          return $http.post(url, projectIntegrationConfig, authService.getJwtHeader());
        }

        /**
         * @name update
         * @desc update integracion config
         */
        function update (projectId, projectIntegrationConfig) {
          var url = getBaseUrl(projectId);
          return $http.put(url, projectIntegrationConfig, authService.getJwtHeader());
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
