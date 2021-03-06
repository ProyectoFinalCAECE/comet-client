(function() {

    'use strict';

    angular
        .module('cometApp')
        .factory('userService', userService);

    userService.$inject = ['$log', '$http', '$q', 'authService'];

    function userService ($log, $http, $q, authService){

        var currentUser = null;
        var resourceUrl = '/users/';

        return {
            create: create,
            get:get,
            getById:getById,
            update:update,
            getCurrentUser:getCurrentUser,
            uploadProfilePicture:uploadProfilePicture
        };

        /**
         * @name create
         * @desc calls the backend endpoint to create a new user account
         */
        function create (user) {
            return $http.post(resourceUrl, user).success(function(data){
                authService.saveToken(data.token);
            });
        }

        /**
         * @name get
         * @desc calls the backend endpoint to get the logged user data
         */
        function get () {
          return $http.get(resourceUrl, authService.getJwtHeader()).then(function (res) {
            return res.data.user;
          }, function () {
            return null;
          });
        }

        /**
         * @name getById
         * @desc calls the backend endpoint to get user data by id
         */
        function getById (userId) {
          return $http.get(resourceUrl + userId, authService.getJwtHeader()).then(function (res) {
            return res.data.user;
          }, function () {
            return null;
          });
        }

        /**
         * @name getCurrentUser
         * @desc returns the current logged in user
         */
        function getCurrentUser () {
          var deferred = $q.defer();

          if (currentUser === null) {
            return get().then(function (user) {
              currentUser = user;
              return currentUser;
            });
          }
          else {
            deferred.resolve(currentUser);
          }

          return deferred.promise;
        }

        /**
         * @name put
         * @desc calls the backend endpoint to update the logged user data
         */
        function update (user) {
          return $http.put(resourceUrl, user, authService.getJwtHeader());
        }

        /**
         * @name uploadProfilePicture
         * @desc calls the backend endpoint to update the logged user's profile picture
         */

        function uploadProfilePicture(picture){
          var fd = new FormData();
          fd.append('profilePicture', picture);
          return $http.post('/users/image', fd, {
                                                transformRequest: angular.identity,
                                                headers: {'Content-Type': undefined,
                                                          'Authorization':'Bearer '+ authService.getToken()}
                });
        }
    }
})();
