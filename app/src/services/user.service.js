(function() {

    'use strict';

    angular
        .module('cometApp')
        .factory('userService', userService);

    userService.$inject = ['$log', '$http', '$q', 'authService'];

    function userService ($log, $http, $q, authService){

        var currentUser = null;

        return {
            create: create,
            get:get,
            update:update,
            getCurrentUser:getCurrentUser,
            uploadProfilePicture:uploadProfilePicture
        };

        /**
         * @name create
         * @desc calls the backend endpoint to create a new user account
         */
        function create (user) {
            return $http.post('/user/', user).success(function(data){
                authService.saveToken(data.token);
            });
        }

        /**
         * @name get
         * @desc calls the backend endpoint to get the logged user data
         */
        function get () {
          return $http.get('/user/', authService.getJwtHeader()).then(function (res) {
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
          return $http.put('/user/', user, authService.getJwtHeader());
        }

        /**
         * @name uploadProfilePicture
         * @desc calls the backend endpoint to update the logged user's profile picture
         */

        function uploadProfilePicture(picture){
          var fd = new FormData();
          fd.append('profilePicture', picture);
          return $http.post('/user/image', fd, {
                                                transformRequest: angular.identity,
                                                headers: {'Content-Type': undefined,
                                                          'Authorization':'Bearer '+ authService.getToken()}
                });
        }
    }
})();
