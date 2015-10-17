(function () {

  'use strict';

  /**
  * @desc
  */
  angular
      .module('cometApp')
      .directive('ngEnter', ngEnterDirective);

      function ngEnterDirective () {
          return function(scope, element, attrs) {
              element.bind("keydown", function(e) {
                  if(e.which === 13) {
                      scope.$apply(function(){
                          scope.$eval(attrs.ngEnter, {'e': e});
                      });
                      e.preventDefault();
                  }
              });
          };
      }
})();
