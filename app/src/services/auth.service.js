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
            deleteToken:deleteToken,
            saveToken: saveToken,
            getJwtHeader: getJwtHeader
        };

        function saveToken (token) {
            $window.localStorage[storageKey] = token;
        }

        function getToken() {
            return $window.localStorage[storageKey];
        }

        function getJwtHeader(){
          return {
            headers: {
              Authorization: 'Bearer '+ getToken()
            }
          };
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

        // function currentUser () {
        //     if (isLoggedIn()) {
        //         var token = getToken();
        //         var payload = JSON.parse($window.atob(token.split('.')[1]));
        //         return payload.alias;
        //     }
        // }

        function deleteToken() {
            $window.localStorage.removeItem(storageKey);
        }
    }
})();
