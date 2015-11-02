(function () {

  'use strict';

  /**
  * @desc directive to change the height of the wrapper div in the channel-explore-view
  * @example <div channel-explore-resize/>
  */
  angular
      .module('cometApp')
      .directive('channelExploreResize', channelExploreResize);

      channelExploreResize.$inject = ['$window'];

      function channelExploreResize ($window) {
          return function(scope) {

            var w = angular.element($window);

            scope.getWindowDimensions = function () {
                return {
                    'h': w.height(),
                    'w': w.width()
                };
            };

            scope.$watch(scope.getWindowDimensions, function (newValue) {
                scope.windowHeight = newValue.h;
                scope.windowWidth = newValue.w;

                angular.element(".wrapper").height(newValue.h - 30);

            }, true);

            scope.$on('$destroy', function () {
              angular.element(window).off('resize');
            });

            w.on('resize', function () {
                scope.$apply();
            });
          };
      }
})();
