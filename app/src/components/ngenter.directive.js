(function () {

  'use strict';

  /**
  * @desc directive to call a function whenever the user presses the enter key
  * @example <input ngEnter="handleEnterKey()" />
  */
  angular
      .module('cometApp')
      .directive('ngEnter', ngEnterDirective);

      function ngEnterDirective () {
          return function(scope, element, attrs) {
              element.bind("keydown", function(e) {
                  if(e.which === 13 && !event.shiftKey) {
                      scope.$apply(function(){
                          scope.$eval(attrs.ngEnter, {'e': e});
                      });
                      e.preventDefault();
                  }
              });
          };
      }
})();
