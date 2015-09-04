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
                                       'user'];

        function DashboardController ($rootScope, $state, $stateParams, ngToast, accountService, user) {

          var vm = this;
          vm.logout = logout;
          vm.user = user;

          /**
           * @name logout
           * @desc logout the user and redirects to home page
           */
          function logout () {
            accountService.logout();
            $state.go('home');
          }
      }
})();
