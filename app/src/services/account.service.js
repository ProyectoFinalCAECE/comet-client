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
            resendConfirmation: resendConfirmation
        };

        /**
         * @name confirm
         * @desc calls the backend endpoint to confirm a user email address
         */
        function confirm (token) {
            return $http.post('/account/confirm', {token: token});
        }

        /**
         * @name confirm
         * @desc calls the backend endpoint to resend the confirmation email
         */
        function resendConfirmation(token) {
          return $http.post('/account/confirm/token', {token: token}, authService.getJwtHeader());
        }
    }
})();
