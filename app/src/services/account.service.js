(function() {

    'use strict';

    angular
        .module('cometApp')
        .factory('accountService', accountService);

    accountService.$inject = ['$log', '$http', 'authService'];

    function accountService ($log, $http, authService) {

        var resourceUrl = '/accounts/';

        return {
            login: login,
            logout: logout,
            confirm:confirm,
            resendConfirmation: resendConfirmation,
            recoverPassword: recoverPassword,
            recoverPasswordValidate: recoverPasswordValidate,
            changePassword: changePassword,
            reopenAccount: reopenAccount,
            reopenAccountValidate: reopenAccountValidate,
            closeAccount: closeAccount
        };

        /**
         * @name login
         * @desc calls the backend endpoint to login a user
         */
        function login (user) {
            return $http.post(resourceUrl + 'login', user).success(function (data) {
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
          return $http.post(resourceUrl + 'confirm', data);
        }

        /**
         * @name confirm
         * @desc calls the backend endpoint to resend the confirmation email
         */
        function resendConfirmation(token) {
          var data = {
            token: token
          };
          return $http.post(resourceUrl + 'confirm/token', data, authService.getJwtHeader());
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
            return $http.post(resourceUrl + 'password/token', data);
        }

        /**
         * @name recoverPasswordValidate
         * @desc calls the backend endpoint to validate the token and
         *       set the new password
         */
        function recoverPasswordValidate (token, newpassword, confirmPassword) {
            var data = {
              token: token,
              newpassword: newpassword,
              confirmPassword: confirmPassword
            };
            return $http.post(resourceUrl + 'password/recover', data);
        }

        /**
         * @name changePassword
         * @desc calls the backend endpoint to change the user password
         */
        function changePassword(oldPassword, newPassword, confirmPassword) {
          var data = {
            oldpassword: oldPassword,
            newpassword: newPassword,
            confirmPassword: confirmPassword
          };
          return $http.post(resourceUrl + 'password/renew', data, authService.getJwtHeader());
        }

        /**
         * @name reopenAccount
         * @desc calls the backend endpoint to send the user a email
         *       with a link to reopen the account
         */
        function reopenAccount (email) {
            var data = {
              email: email
            };
            return $http.post(resourceUrl + 'reopen/token', data);
        }

        /**
         * @name reopenAccountValidate
         * @desc calls the backend endpoint to validate the token, reopen
         *       the account and set the new password
         */
        function reopenAccountValidate (token, newpassword, confirmPassword) {
            var data = {
              token: token,
              newpassword: newpassword,
              confirmPassword: confirmPassword
            };
            return $http.post(resourceUrl + 'reopen', data);
        }

        /**
         * @name closeAccount
         * @desc calls the backend endpoint to close an User account.
         *
         */
        function closeAccount (password) {
            var data = {
              password: password
            };

            var req = {
              method: "DELETE",
              url: '/users/',
              data: data,
              headers: {"Content-Type":"application/json;charset=utf-8",
                        "Authorization":"Bearer "+ authService.getToken()}
            };

            return $http(req);
        }
    }
})();
