(function () {

  'use strict';

  /**
  * @desc directive to disable an anchor element, removes the ng-click,the
  *       href and adds a class 'disabled'
  * @example <a aDisabled="isDisabled()" />
  */
  angular
      .module('cometApp')
      .directive('aDisabled', aDisabledDirective);

      function aDisabledDirective() {
        return {
            compile: function (tElement, tAttrs) {
                //Disable ngClick
                tAttrs.ngClick = '!(' + tAttrs.aDisabled + ') && (' + tAttrs.ngClick + ')';

                //Toggle "disabled" to class when aDisabled becomes true
                return function (scope, iElement, iAttrs) {
                    scope.$watch(iAttrs.aDisabled, function(newValue) {
                        if (newValue !== undefined) {
                            iElement.toggleClass('disabled', newValue);
                        }
                    });

                    //Disable href on click
                    iElement.on('click', function(e) {
                        if (scope.$eval(iAttrs.aDisabled)) {
                            e.preventDefault();
                        }
                    });
                };
            }
          };
      }
})();
