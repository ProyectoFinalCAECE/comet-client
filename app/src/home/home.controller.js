/**
 * @name HomeController
 * @desc HomePage controller
 */
(function() {
    'use strict';

    angular
        .module('cometApp')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['authService', 'accountService', 'user'];

    function HomeController (authService, accountService, user) {

        var vm = this;
        vm.isLoggedIn = authService.isLoggedIn;
        vm.logout = logout;
        vm.user = user;

        /**
         * @name logout
         * @desc logouts the user and cleans the state
         */
        function logout() {
          accountService.logout();
        }
    }
})();
