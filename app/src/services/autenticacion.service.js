(function() {

    'use strict';

    angular
        .module('cometApp')
        .factory('autenticacionService', autenticacionService);

    autenticacionService.$inject = ['$http', '$window'];

    function autenticacionService ($http, $window){

        var storageKey = 'comet-token';

        return {
            estaLogueado: estaLogueado,
            usuarioActual:usuarioActual,
            crear:crear,
            login:login,
            logout:logout
        };

        function saveToken (token) {
            $window.localStorage[storageKey] = token;
        }

        function getToken() {
            return $window.localStorage[storageKey];
        }

        function estaLogueado() {

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

        function usuarioActual () {
            if (estaLogueado()) {
                var token = getToken();
                var payload = JSON.parse($window.atob(token.split('.')[1]));
                return payload.alias;
            }
        }

        function crear (user) {
            return $http.post('/usuario/crear', user).success(function(data){
                saveToken(data.token);
            });
        }

        function login (user) {
            return $http.post('/usuario/login', user).success(function (data) {
                saveToken(data.token);
            });
        }

        function logout() {
            $window.localStorage.removeItem(storageKey);
        }
    }
})();