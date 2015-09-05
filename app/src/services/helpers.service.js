(function() {

    'use strict';

    angular
        .module('cometApp')
        .factory('helpersService', helpersService);

    function helpersService (){

        return {
            loadServerErrors:loadServerErrors,
            fieldIsValid: fieldIsValid
        };

        function fieldIsValid(form, fieldName) {
          return form.$submitted && form[fieldName].$error;
        }

        /**
         * @name loadServerErrors
         * @desc loads the errors returned from the server in the viewmodel
         * @param {Object} data Object of type:{ errors: { field: message }
         */
        function loadServerErrors(data) {
          var validationErrors = null;
          console.log("loadServerErrors", data);
          if (data && data.errors) {
            validationErrors = {};
            angular.forEach(data.errors, function(value, key) {
              validationErrors[key] = value;
              //form[key].$setValidity("server", false);
            });
          }
          return validationErrors;
        }
    }
})();
