(function() {

    'use strict';

    angular
        .module('cometApp')
        .factory('integrationService', integrationService);

    integrationService.$inject = ['$log', '$http', 'lodash', 'authService'];

    function integrationService ($log, $http, lodash, authService) {

        var parentUrl = '/projects/',
            resourceUrl = '/integrations/',
            statuscakeCustomUrl = 'statuscake/auth/';



        return {
            create: create,
            update: update,
            remove: remove,
            getAll: getAll,
            getProjectIntegrationById: getProjectIntegrationById,
            configureTrelloWebhook: configureTrelloWebhook,
            congifureStatusCake: congifureStatusCake
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
         * @desc update integration config
         */
        function update (projectId, projectIntegrationId, projectIntegrationConfig) {
          var url = getBaseUrl(projectId) + projectIntegrationId;
          return $http.put(url, projectIntegrationConfig, authService.getJwtHeader());
        }

        /**
         * @name delete
         * @desc delete integration config
         */
        function remove (projectId, projectIntegrationId, channelId) {
          var url = getBaseUrl(projectId) + projectIntegrationId,
              deleteData = {
                channelId: channelId,
              };

          var req = {
            method: "DELETE",
            url: url,
            data: deleteData,
            headers: {"Content-Type":"application/json;charset=utf-8",
                      "Authorization":"Bearer "+ authService.getToken()}
          };

          return $http(req);
          //return $http.delete(url, deleteData, authService.getJwtHeader());
        }

        /**
         * @name getbaseUrl
         * @desc return the base url for the integrations resource
         */
        function getBaseUrl(projectId) {
          return parentUrl + projectId + resourceUrl;
        }

        /**
         * @name getbaseUrlForStatusCake
         * @desc return the base url for the integrations resource customized for statuscake
         */
        function getbaseUrlForStatusCake(projectId) {
          return parentUrl + projectId + resourceUrl + statuscakeCustomUrl;
        }

        /**
        * @name configureTrelloWebhook
        * @desc configure a webhook at trello
        */
        function configureTrelloWebhook(token, callbackUrl, appKey, boardId){
          var url = "https://api.trello.com/1/tokens/"+ token +"/webhooks/?key=" + appKey;
          return $http({
            method: 'POST',
            url: url,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            transformRequest: function(obj){
              var str = [];
              for(var p in obj){
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
              }
              return str.join("&");
            },
            data: {'description': "Trello webhook", callbackURL: callbackUrl, idModel: boardId}
        });
      }

      /**
      * @name congifureStatusCake
      * @desc send a request to the server to auth on StatusCake and configure the integration.
      */
      function congifureStatusCake(projectId, projectIntegrationId, projectIntegrationConfig){
        var url = getbaseUrlForStatusCake(projectId) + projectIntegrationId;
        return $http.post(url, projectIntegrationConfig, authService.getJwtHeader());
      }
    }
})();
