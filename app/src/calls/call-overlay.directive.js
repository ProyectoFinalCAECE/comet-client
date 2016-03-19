(function () {

  'use strict';

  /**
  * @desc directive to show a video chat overlay
  * @example <video-overlay peer-Id="{ name: 'test'}" />
  */
  angular
      .module('cometApp')
      .directive('videoOverlay', videoOverlay);

      function videoOverlay() {
        return {
          restrict: 'E',
          scope: {
              peerId: '@'
            },
          templateUrl: '/src/calls/call-overlay.html',
          controller: function ( $scope, $element ) {

            $scope.test = function () {
              console.log(":: directive - test ::", $scope, $element);
            };

            $scope.mute = function() {
                console.log(':: directive - mute ::');
            };

          },
          link: function (scope, element, attrs) {

              console.log(':: directive ::', scope);

              scope.peer = scope.$parent.vm.peers[scope.peerId];

              console.log(":: directive - mouse id", '#' + scope.peer.domId);

              // mouse over
              angular.element('#' + scope.peer.domId).hover(function () {
                scope.peer.mouseIn = true;
                scope.$apply();
              }, function () {
                scope.peer.mouseIn = false;
                scope.$apply();
              });
          }
        };
      }
})();
