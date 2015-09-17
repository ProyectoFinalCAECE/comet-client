(function() {

    'use strict';

    angular
        .module('cometApp')
        .factory('dialogService', dialogService);

    dialogService.$inject = ['$log', '$modal', 'dialogType'];

    function dialogService ($log, $modal, dialogType){

        return {
            showModalAlert: showModalAlert
        };

        /**
         * @name create
         * @desc calls the backend endpoint to create a new user account
         */
         function showModalAlert (title, message) {
           var modalInstance = $modal.open({
             templateUrl: '/src/dialog/dialog-modal.html',
             controller: 'DialogModalController',
             controllerAs: 'vm',
             size: 'sm',
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

           modalInstance.result.then(function (result) {
             console.log(result);
           }, function () {
             console.info('Modal dismissed at: ' + new Date());
           });
         }
    }
})();
