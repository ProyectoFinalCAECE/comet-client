(function() {

    'use strict';

    angular
        .module('cometApp')
        .factory('accountService', accountService);

    accountService.$inject = ['$http', 'authService'];

    function accountService ($http, authService) {

        return {
            login: login,
            logout: logout,
            confirm:confirm,
            resendConfirmation: resendConfirmation,
            recoverPassword: recoverPassword,
            recoverPasswordValidate: recoverPasswordValidate,
            changePassword: changePassword
        };

        /**
         * @name login
         * @desc calls the backend endpoint to login a user
         */
        function login (user) {
            return $http.post('/account/login', user).success(function (data) {
                authService.saveToken(data.token);
            });
        }

        /**
         * @name logout
         * @desc closes the user session
         */
        function logout() {
            authService.deleteToken();
        }

        /**
         * @name confirm
         * @desc calls the backend endpoint to confirm a user email address
         */
        function confirm (token) {
          var data = {
            token: token
          };
          return $http.post('/account/confirm', data);
        }

        /**
         * @name confirm
         * @desc calls the backend endpoint to resend the confirmation email
         */
        function resendConfirmation(token) {
          var data = {
            token: token
          };
          return $http.post('/account/confirm/token', data, authService.getJwtHeader());
        }

        /**
         * @name recoverPassword
         * @desc calls the backend endpoint to send the user a email
         *       with a link to recover his/her password
         */
        function recoverPassword (email) {
            var data = {
              email: email
            };
            return $http.post('/account/password/token', data);
        }

        /**
         * @name confirm
         * @desc calls the backend endpoint to validate the token and
         *       set the new password
         */
        function recoverPasswordValidate (token, newpassword) {
            var data = {
              token: token,
              newpassword: newpassword
            };
            return $http.post('/account/password/recover', data);
        }

        /**
         * @name changePassword
         * @desc calls the backend endpoint to change the user password
         */
        function changePassword(oldPassword, newPassword) {
          var data = {
            oldpassword: oldPassword,
            newpassword: newPassword
          };
          return $http.post('/account/password/renew', data, authService.getJwtHeader());
        }
    }
})();
