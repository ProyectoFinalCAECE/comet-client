(function () {

  'use strict';

  /**
  * @desc menu directive that uses the metis menu jQuery plugin
  * @example <ul metis-menu></ul>
  */
  angular
      .module('cometApp')
      .directive('metisMenu', metisMenuDirective);

  function metisMenuDirective() {
    return {
        // Restrict it to be an attribute in this case
        restrict: 'A',
        // responsible for registering DOM listeners as well as updating the DOM
        link: function(scope, element) {
            $(element).metisMenu();
        }
    };
  }
})();
