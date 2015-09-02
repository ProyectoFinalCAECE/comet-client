/**
 * @name UserProfileController
 * @desc Controller for the user-profile view
 */

(function() {
    'use strict';

    angular.module('cometApp')
           .controller('UserProfileController', UserProfileController);

        UserProfileController.$inject = ['$rootScope', '$state', 'ngToast', 'userService', 'user'];

        function UserProfileController ($rootScope, $state, ngToast, userService, user) {

          var vm = this;
          vm.user = user;
          vm.update = update;
          vm.validationErrors = null;

          console.log(user);

          /**
           * @name update
           * @desc calls the backend endpoint to update the user profile
           */
          function update () {
            userService.update(vm.user).error(function(data) {
                vm.validationErrors = $rootScope.helpers.loadServerErrors(data);
            }).then(function () {
                $state.go('dashboard');
            });
          }
      }
})();
