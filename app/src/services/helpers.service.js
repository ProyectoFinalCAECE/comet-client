(function() {

    'use strict';

    angular
        .module('cometApp')
        .factory('helpersService', helpersService);

    function helpersService (){

        return {
            loadServerErrors:loadServerErrors,
            fieldIsNotValid: fieldIsNotValid
        };

        // function fieldIsNotValid(form, fieldName) {
        //   return form.$submitted && form[fieldName].$error;
        // }

        function fieldIsNotValid(model, fieldName) {
          if (model === null) {
            return false;
          }
          return model[fieldName] || model.all;
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
