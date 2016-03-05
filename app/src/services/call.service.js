(function() {

    'use strict';

    angular
        .module('cometApp')
        .factory('callService', callService);

    callService.$inject = ['$log', '$http', 'authService'];

    function callService ($log, $http, authService) {

        var parentUrl = '/projects/',
            resourceUrl = '/calls/';

        return {
            create: create,
            update: update,
            getById: getById
        };

        /**
         * @name create
         * @desc creates a new call
         */
        function create (projectId, call) {
          var url = getBaseUrl(projectId);
          return $http.post(url, call, authService.getJwtHeader());
        }

        /**
         * @name getById
         * @desc returns a call by id
         */
        function getById (projectId, callId) {
          var url = getBaseUrl(projectId) + callId;
          return $http.get(url, authService.getJwtHeader());
        }

        /**
         * @name update
         * @desc update call 
         */
        function update (projectId, call) {
          var url = getBaseUrl(projectId) + call.id;
          return $http.put(url, call, authService.getJwtHeader());
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
