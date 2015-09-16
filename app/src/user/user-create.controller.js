/**
 * @name UserCreateController
 * @desc Controller for the user-create view
 */

(function() {
    'use strict';

    angular.module('cometApp')
           .controller('UserCreateController', UserCreateController);

        UserCreateController.$inject = ['$rootScope',
                                        '$state',
                                        'ngToast',
                                        'formsConfig',
                                        'userService'];

        function UserCreateController ($rootScope, $state, ngToast, formsConfig, userService) {

          var vm = this;

          vm.user = {};
          vm.create = create;
          vm.createAndAccept = createAndAccept;

          vm.passwordPattern = formsConfig.passwordLabel;
          vm.validationErrors = null;

          /**
           * @name create
           * @desc creates a user
           */
          function create () {
            userService.create(vm.user).error(function(data) {
              vm.validationErrors = $rootScope.helpers.loadServerErrors(data);
              if (vm.validationErrors === null)
              {
                ngToast.danger('Ocurrió un error al consultar al servidor.');
              }
            }).then(function() {
                $state.go('dashboard.project-list');
            });
          }

          /**
           * @name createAndAccept
           * @desc creates a user and accepts project invitation
           */
          function createAndAccept () {
            console.log('into createAndAccept!');
            userService.create(vm.user).error(function(data) {
              vm.validationErrors = $rootScope.helpers.loadServerErrors(data);
              if (vm.validationErrors === null)
              {
                ngToast.danger('Ocurrió un error al consultar al servidor.');
              }
            }).then(function() {
                $state.go('dashboard.project-list');
            });
          }
      }
})();
