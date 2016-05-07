(function() {

    'use strict';

    angular
        .module('cometApp')
        .factory('dialogService', dialogService);

    dialogService.$inject = ['$log', '$modal', 'dialogType'];

    function dialogService ($log, $modal, dialogType){

        return {
            showModalAlert: showModalAlert,
            showModalConfirm:showModalConfirm
        };

        /**
          * @name showModalAlert
          * @desc shows a modal alert with "ok" button
        */
        function showModalAlert (title, message) {
          var modalInstance = $modal.open({
            templateUrl: 'src/dialog/dialog-modal.html',
            controller: 'DialogModalController',
            controllerAs: 'vm',
            size: 'sm',
            backdrop: 'static',
            resolve: {
              type: function () {
               return dialogType.ALERT;
              },
              title: function () {
               return title;
              },
              message: function () {
               return message;
              }
           }
         });

         return modalInstance;
        }

        /**
          * @name showModalConfirm
          * @desc shows a modal alert with "ok" and "cancel" button
        */
        function showModalConfirm (title, message) {
          var modalInstance = $modal.open({
            templateUrl: 'src/dialog/dialog-modal.html',
            controller: 'DialogModalController',
            controllerAs: 'vm',
            size: 'sm',
            backdrop: 'static',
            resolve: {
              type: function () {
               return dialogType.CONFIRM;
              },
              title: function () {
               return title;
              },
              message: function () {
               return message;
              }
           }
         });

         return modalInstance;
        }
    }
})();
