/**
* @desc field match directive used to validate if two fields are equals
* @example <input name="password">
           <input name="confirmpassword" fieldMatch dsfieldmatch="password">
*/
'use strict';

angular
    .module('cometApp')
    .directive('fieldMatch', fieldMatch);

function fieldMatch() {
  return {
      restrict: 'A',
      scope: true,
      require: 'ngModel',
      link: function (scope, elem, attrs, ngModel) {
          var checkFieldMatch = function () {
              // WARNING - FIXME:
              // when a validator fails (returns false), then the underlying model value is set to undefined
              //
              // http://stackoverflow.com/questions/24692775
              // http://stackoverflow.com/questions/24385104
              //
              // => solution: use ngModel.$viewValue instead of ngModel.$modelValue
              var fieldMatch = scope.$eval(attrs.dsfieldmatch).$viewValue,
                  value = ngModel.$modelValue || ngModel.$viewValue;

              // If fieldMatch or ngModel.$viewValue is defined,
              // they should match
              if (fieldMatch || value) {
                  return fieldMatch === value;
              }
              return true;
          };

          scope.$watch(checkFieldMatch, function (n) {
              //set the form control to valid if both
              //passwords are the same, else invalid
              ngModel.$setValidity('fieldMatch', n);
          });
      }
  };
}
