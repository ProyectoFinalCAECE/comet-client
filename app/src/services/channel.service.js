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
            getAll: getAll,
            getById: getById
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
    }
})();
