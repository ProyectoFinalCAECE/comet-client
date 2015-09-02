(function() {

    'use strict';

    angular
        .module('cometApp')
        .factory('accountService', accountService);

    accountService.$inject = ['$http', 'authService'];

    function accountService ($http, authService) {
        // /account/login POST
        // /account/logout POST

        // /account/confirm POST
        // /account/confirm/token POST

        // /account/password/token POST
        // /account/password/recover POST

        // /account/password/renew

        return {
            confirm:confirm,
            resendConfirmation: resendConfirmation,
            recoverPassword: recoverPassword,
            recoverPasswordValidate: recoverPasswordValidate
        };

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
    }
})();
