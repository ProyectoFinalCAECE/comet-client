(function() {

    'use strict';

    angular
        .module('cometApp')
        .factory('searchService', searchService);

    searchService.$inject = ['$log', '$http', 'authService'];

    function searchService ($log, $http, authService) {

      var parentUrl = '/search/projects/',
          usersResourceUrl = '/users/',
          messagesResourceUrl = '/messages/',
          channelMessagesResourceUrl = '/channels/';

        return {
            searchUserInProject: searchUserInProject,
            searchMessageInProject: searchMessageInProject,
            searchMessageInChannel: searchMessageInChannel
        };

        /**
         * @name searchUserInProject
         * @desc searchs for users matching provided string within provided Project's Users
         */
        function searchUserInProject (projectId, searchString) {
          $log.log('into searchUserInProject', projectId, searchString);
          var url = getUsersUrl(projectId);
          return $http.get(url + generateSearchString(searchString), authService.getJwtHeader());
        }

        /**
         * @name searchMessageInProject
         * @desc searchs for messages matching provided string within provided Project's Messages
         */
        function searchMessageInProject (projectId, searchString, limit, last_id) {
          $log.log('searchMessageInProject', projectId, searchString);
          var url = getMessagesInProjectUrl(projectId);
          return $http.get(url + generateSearchString(searchString, limit, last_id), authService.getJwtHeader());
        }

        /**
         * @name searchMessageInChannel
         * @desc searchs for messages matching provided string within provided Channel's Messages
         */
        function searchMessageInChannel (projectId, channelId, searchString, limit, last_id) {
          $log.log('searchMessageInChannel', projectId, searchString);
          var url = getMessagesInChannelUrl(projectId, channelId);
          return $http.get(url + generateSearchString(searchString, limit, last_id), authService.getJwtHeader());
        }

        /**
         * @name getbaseUrl
         * @desc return the base url for the search resource
         */
        function getBaseUrl(projectId) {
          return parentUrl + projectId;
        }

        /**
         * @name getUsersUrl
         * @desc return the base url for the users search resource
         */
        function getUsersUrl(projectId){
          return getBaseUrl(projectId) + usersResourceUrl;
        }

        /**
         * @name getMessagesInProjectUrl
         * @desc return the base url for the Project's messages  search resource
         */
        function getMessagesInProjectUrl(projectId){
          return getBaseUrl(projectId) + messagesResourceUrl;
        }

        /**
         * @name getMessagesInChannelUrl
         * @desc return the base url for the Channel's messages  search resource
         */
        function getMessagesInChannelUrl(projectId, channelId){
          return getMessagesInProjectUrl(projectId) + channelMessagesResourceUrl + channelId;
        }

        /**
         * @name generateSearchString
         * @desc return the search querystring
         */
        function generateSearchString(searchString, limit, last_id){
          var querystring = '?q=' + searchString;

          if(limit){
            querystring += '&limit=' + limit;
          }

          if(last_id){
            querystring += '&last_id=' + last_id;
          }
          return querystring;
        }
    }
})();
