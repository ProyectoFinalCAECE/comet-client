/**
 * @name UserProfileController
 * @desc Controller for the user-profile view
 */

(function() {
    'use strict';

    angular.module('cometApp')
           .controller('UserProfileController', UserProfileController);

        UserProfileController.$inject = ['$state', 'authService', 'ngToast'];

        function UserProfileController ($state, authService, ngToast) {

          var vm = this;

          vm.user = {};
          
          /**
           * @name create
           * @desc calls the backend endpoint to create a user
           */
          // function create () {
          //   authService.create(vm.user).error(function(data) {
          //       loadServerErrors(data);
          //   }).then(function() {
          //       $state.go('/');
          //   });
          // }

          /**
           * @name login
           * @desc calls the backend endpoint to login a user
           */
          // function login () {
          //     authService.login(vm.user).error(function (data) {
          //         loadServerErrors(data);
          //     }).then(function () {
          //         $state.go('/');
          //     });
          // }

          /**
           * @name logout
           * @desc logouts a user from the application and redirects to home
           */
          // function logout () {
          //     authService.logout();
          //     $state.go('/');
          // }
      }
})();
