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
        vm.logout = authService.logout;
        vm.accountConfirmed = true;

        initialize();

        /**
         * @name initialize
         * @desc loads controller initial state
         */
        function initialize() {

          if (vm.isLoggedIn()) {

            userService.get().error(function(err) {
                console.log(err);
            }).then(function (res) {
                var user = res.data.user;
                vm.accountConfirmed = user.confirmed;
                console.log(user);
            });
          }
        }
    }
})();
