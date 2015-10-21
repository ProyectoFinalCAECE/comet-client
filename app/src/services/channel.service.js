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
            update: update,
            invite: invite,
            getAll: getAll,
            getById: getById,
            close: close,
            deleteChannel: deleteChannel,
            deleteMember: deleteMember,
            getMessages: getMessages,
        };

        /**
         * @name create
         * @desc creates a new channel
         */
        function create (projectId, channel) {
          var url = getBaseUrl(projectId);
          return $http.post(url, channel, authService.getJwtHeader());
        }

        /**
         * @name getAll
         * @desc returns all the channels in the project
         */
        function getAll (projectId) {
          var url = getBaseUrl(projectId);
          return $http.get(url, authService.getJwtHeader());
        }

        /**
         * @name getById
         * @desc returns a channel by id
         */
        function getById (projectId, channelId) {
          var url = getBaseUrl(projectId) + channelId;
          return $http.get(url, authService.getJwtHeader());
        }

        /**
         * @name update
         * @desc update channel info
         */
        function update (projectId, channel) {
          var url = getBaseUrl(projectId) + channel.id;
          return $http.put(url, channel, authService.getJwtHeader());
        }

        /**
         * @name invite
         * @desc adds new member to the channel
         */
        function invite (projectId, channelId, invites) {
          var url = getBaseUrl(projectId) + channelId + '/members';
          return $http.put(url, invites, authService.getJwtHeader());
        }

        /**
         * @name close
         * @desc calls the backend endpoint to close a channel
         */
        function close(projectId, id) {
          var url = getBaseUrl(projectId);
          return $http.delete(url + id + '/close', authService.getJwtHeader());
        }

        /**
         * @name delete
         * @desc calls the backend endpoint to delete a channel
         */
        function deleteChannel(projectId, id) {
          var url = getBaseUrl(projectId);
          return $http.delete(url + id, authService.getJwtHeader());
        }

        /**
         * @name deleteMember
         * @desc delete a member from project
         */
        function deleteMember (projectId, id, member_id) {
         var url = getBaseUrl(projectId);
         return $http.delete(url + id + '/members/' + member_id, authService.getJwtHeader());
        }

        /**
         * @name getbaseUrl
         * @desc return the base url for the channels resource
         */
        function getBaseUrl(projectId) {
          return parentUrl + projectId + resourceUrl;
        }

        /**
         * @name getMessages
         * @desc returns channel's messages by channelId
         */
        function getMessages (projectId, channelId, offset, limit) {
          var url = getBaseUrl(projectId) + channelId;
          return $http.get(url + '/messages', authService.getJwtHeader());
        }
    }
})();
