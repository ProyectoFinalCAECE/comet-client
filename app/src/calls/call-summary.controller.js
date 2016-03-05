/**
 * @name CallSummaryController
 * @desc Controller for the call-summary view
 */

(function() {
    'use strict';

    angular.module('cometApp')
           .controller('CallSummaryController', CallSummaryController);

        CallSummaryController.$inject = ['$log',
                                           '$rootScope',
                                           '$state',
                                           'lodash',
                                           'ngToast',
                                           '$modalInstance',
                                           'constraints',
                                           'user',
                                           'project',
                                           'channel'];

        function CallSummaryController ($log,
                                          $rootScope,
                                          $state,
                                          lodash,
                                          ngToast,
                                          $modalInstance,
                                          constraints,
                                          user,
                                          project,
                                          channel) {

          var vm = this;
          vm.channel = channel;
          vm.project = project;
          vm.validationErrors = null;
          vm.cancel = cancel;

          activate();

          function activate () {

          }

          /**
           * @name cancel
           * @desc close the dialog
          */
          function cancel () {
            $modalInstance.dismiss();
          }

          /**
           * @name summarySaveSuccess
           * @desc shows a dialog indicating a successful operation
          */
          function summarySaveSuccess (response) {
            $modalInstance.close(response.data);
          }

          /**
           * @name summarySaveError
           * @desc shows the error message to the user
          */
          function summarySaveError (data) {
              vm.validationErrors = $rootScope.helpers.loadServerErrors(data);
              if (vm.validationErrors === null)
              {
                ngToast.danger('Ocurrió un error al consultar al servidor.');
              }
          }
        }
})();
