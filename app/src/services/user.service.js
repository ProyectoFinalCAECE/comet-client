(function() {

    'use strict';

    angular
        .module('cometApp')
        .factory('userService', userService);

    userService.$inject = ['$http', 'authService'];

    function userService ($http, authService){

        return {
            create: create,
            get:get
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
          return $http.get('/user/', authService.getJwtHeader());
        }
    }
})();
