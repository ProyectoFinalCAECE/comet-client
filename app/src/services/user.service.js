(function() {

    'use strict';

    angular
        .module('cometApp')
        .factory('userService', userService);

    userService.$inject = ['$log', '$http', 'authService'];

    function userService ($log, $http, authService){

        var currentUser = null;

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
          if (currentUser === null) {
            return get().then(function (user) {
              currentUser = user;
              $log.log('getCurrentUser ajax:', user);
              return currentUser;
            });
          }
          else {
            $log.log('currentUser != null', currentUser);
            return currentUser;
          }
        }

        /**
         * @name put
         * @desc calls the backend endpoint to update the logged user data
         */
        function update (user) {
          return $http.put('/user/', user, authService.getJwtHeader());
        }
    }
})();
