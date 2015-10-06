(function() {

    'use strict';

    angular
        .module('cometApp')
        .factory('channelService', channelService);

    channelService.$inject = ['$log', '$http', 'authService'];

    function channelService ($log, $http, authService) {

        var parentUrl = '/projects/',
            resourceUrl = '/channels/';

        return {
            create: create,
            invite: invite,
            getAll: getAll,
            getById: getById,
            close: close,
            deleteChannel: deleteChannel,
        };

        /**
         * @name create
         * @desc creates a new channel
         */
        function create (projectId, channel) {
          var url = parentUrl + projectId + resourceUrl;
          return $http.post(url, channel, authService.getJwtHeader());
        }

        /**
         * @name getAll
         * @desc returns all the channels in the project
         */
        function getAll (projectId) {
          var url = parentUrl + projectId + resourceUrl;
          return $http.get(url, authService.getJwtHeader());
        }

        /**
         * @name getById
         * @desc returns a channel by id
         */
        function getById (projectId, channelId) {
          var url = parentUrl + projectId + resourceUrl + channelId;
          return $http.get(url, authService.getJwtHeader());
        }

        /**
         * @name invite
         * @desc adds new member to the channel
         */
        function invite (projectId, channelId, invites) {
          var url = parentUrl + projectId + resourceUrl + channelId + '/members';
          return $http.put(url, invites, authService.getJwtHeader());
        }

        /**
         * @name close
         * @desc calls the backend endpoint to close a channel
         */
        function close(projectId, id) {
          var url = parentUrl + projectId + resourceUrl;
          return $http.delete(url + id + '/close', authService.getJwtHeader());
        }

        /**
         * @name delete
         * @desc calls the backend endpoint to delete a channel
         */
        function deleteChannel(projectId, id) {
          var url = parentUrl + projectId + resourceUrl;
          return $http.delete(url + id, authService.getJwtHeader());
        }
    }
})();
