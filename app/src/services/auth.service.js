(function() {

    'use strict';

    angular
        .module('cometApp')
        .factory('authService', authService);

    authService.$inject = ['$http', '$window'];

    function authService ($http, $window){

        var storageKey = 'comet-token';

        return {
            isLoggedIn:isLoggedIn,
            currentUser:currentUser,
            create:create,
            login:login,
            logout:logout
        };

        function saveToken (token) {
            $window.localStorage[storageKey] = token;
        }

        function getToken() {
            return $window.localStorage[storageKey];
        }

        function isLoggedIn() {

            try {
                var token = getToken();

                if (token) {
                    // the payload is the middle part of the token, and is base64 encoded
                    var payload = JSON.parse($window.atob(token.split('.')[1]));
                    return payload.exp > Date.now() / 1000;
                } else {
                    return false;
                }
            }
            catch (ex) {
                return false;
            }
        }

        function currentUser () {
            if (isLoggedIn()) {
                var token = getToken();
                var payload = JSON.parse($window.atob(token.split('.')[1]));
                return payload.alias;
            }
        }

        function create (user) {
            return $http.post('/user/', user).success(function(data){
                saveToken(data.token);
            });
        }

        function login (user) {
            return $http.post('/account/login', user).success(function (data) {
                saveToken(data.token);
            });
        }

        function logout() {
            $window.localStorage.removeItem(storageKey);
        }
    }
})();
