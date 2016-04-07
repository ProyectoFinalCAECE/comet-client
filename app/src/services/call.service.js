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
            getById: getById,
            updateMembers: updateMembers,
            updateSummary: updateSummary
        };

        /**
         * @name create
         * @desc creates a new call
         */
        function create (projectId, channelId, call) {
          var url = getBaseUrl(projectId, channelId);
          return $http.post(url, call, authService.getJwtHeader());
        }

        /**
         * @name getById
         * @desc returns a call by id
         */
        function getById (projectId, channelId, callId) {
          var url = getBaseUrl(projectId, channelId) + callId;
          return $http.get(url, authService.getJwtHeader());
        }

        /**
         * @name update
         * @desc update call
         */
        function update (projectId, channelId, call) {
          var url = getBaseUrl(projectId, channelId) + call.id;
          return $http.put(url, call, authService.getJwtHeader());
        }

        /**
         * @name updateMembers
         * @desc update call members
         */
        function updateMembers (projectId, channelId, callId) {
          var url = getBaseUrl(projectId, channelId) + callId + '/members';
          return $http.put(url, { test : '' }, authService.getJwtHeader());
        }

        /**
         * @name updateSummary
         * @desc update call summary
         */
        function updateSummary (projectId, channelId, call) {
          var url = getBaseUrl(projectId, channelId) + call.id + '/summary';
          return $http.put(url, { summary : call.summary }, authService.getJwtHeader());
        }

        /**
         * @name getbaseUrl
         * @desc return the base url for the channels resource
         */
        function getBaseUrl(projectId, channelId) {
          //'/projects/:project_id/channels/:channel_id/calls'
          return parentUrl + projectId + '/channels/' + channelId + resourceUrl;
        }
    }
})();
