(function() {

    'use strict';

    angular
        .module('cometApp')
        .factory('helpersService', helpersService);

    function helpersService (){

        return {
            loadServerErrors:loadServerErrors,
            fieldIsNotValid: fieldIsNotValid,
            randomString:randomString,
            getIntegrationImage: getIntegrationImage
        };

        /**
         * @name fieldIsNotValid
         * @desc reads the error array searching by fieldName
         */
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

        /**
         * @name randomString
         * @desc generates a random alphanumeric string
         */
        function randomString(length) {
          var s = '';
          while(s.length < length && length > 0){
              var r = Math.random();
              s+= (r < 0.1 ? Math.floor(r * 100) : String.fromCharCode(Math.floor(r * 26) + (r > 0.5 ? 97:65)));
          }
          return s;
        }
        /**
         * @name getIntegrationImage
         * @desc returns the logo image of a integration
        */
        function getIntegrationImage(integrationId) {
          switch (integrationId) {
            // Github
            case 1:
              return '../images/integraciones/github.png';
            // Trello
            case 2:
              return '../images/integraciones/trello.png';
            // Pingdom
            case 3:
              return '../images/integraciones/pingdom.png';
            }
        }
    }
})();
