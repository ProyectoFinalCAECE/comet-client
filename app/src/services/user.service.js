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
            update:update,
            getCurrentUser:getCurrentUser
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
    }
})();
