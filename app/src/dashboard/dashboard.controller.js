/**
 * @name DashboardController
 * @desc Controller for the dashboard views */

(function() {
    'use strict';

    angular.module('cometApp')
           .controller('DashboardController', DashboardController);

        DashboardController.$inject = ['$rootScope',
                                       '$state',
                                       '$stateParams',
                                       'ngToast',
                                       'accountService',
                                       'userService'];

        function DashboardController ($rootScope, $state, $stateParams, ngToast, accountService, userService) {

          var vm = this;
          vm.logout = logout;
          vm.perfil = perfil;
          vm.user = null;

          activate();

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
           * @desc logout the user and redirects to home page
           */
          function logout () {
            accountService.logout();
            $state.go('home');
          }

          function perfil() {
            console.log("perfil");
            $state.transitionTo('dashboard.profile');
          }
      }
})();
