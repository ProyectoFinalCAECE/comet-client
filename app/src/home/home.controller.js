/**
 * @name HomeController
 * @desc HomePage controller
 */
(function() {
    'use strict';

    angular
        .module('cometApp')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['authService', 'userService'];

    function HomeController (authService, userService) {

        var vm = this;
        vm.isLoggedIn = authService.isLoggedIn;
        vm.currentUser = authService.currentUser;
        vm.logout = logout;
        vm.user = null;

        activate();

        /**
         * @name activate
         * @desc controller startup logic
         */
        function activate() {

          // current logged in user
          userService.get().error(function(err) {
              console.log(err);
          }).then(function (res) {
              vm.user = res.data.user;
          });
        }

        /**
         * @name logout
         * @desc logouts the user and cleans the state
         */
        function logout() {
          authService.logout();
        }
    }
})();
