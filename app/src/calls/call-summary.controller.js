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
                                           'channel',
                                           'call'];

        function CallSummaryController ($log,
                                          $rootScope,
                                          $state,
                                          lodash,
                                          ngToast,
                                          $modalInstance,
                                          constraints,
                                          user,
                                          project,
                                          channel,
                                          call) {

          var vm = this;
          vm.summary = '';
          vm.call = call;
          vm.validationErrors = null;
          vm.saveSummary = saveSummary;
          vm.cancel = cancel;

          // textarea plugin options
          vm.customMenu = [
            ['bold', 'italic', 'underline'],
            ['font'],
            ['font-size'],
            ['font-color'],
            ['remove-format'],
            ['ordered-list', 'unordered-list', 'outdent', 'indent'],
            ['left-justify', 'center-justify', 'right-justify'],
            ['quote']
          ];

          activate();

          function activate () {

          }

          function saveSummary () {
            // callService.update(project.id, call)
            //   .error(summarySaveError)
            //   .then(summarySaveSuccess);
            summarySaveSuccess();
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
            $modalInstance.close(vm.summary);
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
