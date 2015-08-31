(function() {

    'use strict';

    angular
        .module('cometApp')
        .factory('userService', userService);

    userService.$inject = ['$http', 'authService'];

    function userService ($http, authService){

        return {
            get:get
        };

        /**
         * @name get
         * @desc calls the backend endpoint to get the logged user data
         */
        function get () {
          return $http.get('/user/', authService.getJwtHeader());
        }

    }
})();
