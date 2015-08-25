(function() {
    'use strict';

    angular
        .module('cometApp')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['authService'];

    function HomeController (authService) {

        var vm = this;

        vm.isLoggedIn = authService.isLoggedIn;
        vm.currentUser = authService.currentUser;
        vm.logout = authService.logout;

        console.log(authService.currentUser());
    }
})();
