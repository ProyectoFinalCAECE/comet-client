(function () {

  'use strict';

  /**
  * @desc directive to show a video chat overlay
  * @example <video-overlay peer-Id="{ name: 'test'}" />
  * isLocal: true,
    muted: false,
    noVideo: false,
    mouseIn: false
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
          controller: function ( $scope ) {

            $scope.mute = function() {
                console.log(':: directive - mute ::', $scope.peer);
                var peer = $scope.peer,
                    webrtc = window.webrtc;

                // local audio
                if (peer.isLocal)
                {
                  if (!peer.muted) {
                    webrtc.mute();
                  }
                  else {
                    webrtc.unmute();
                  }
                }
                else {
                    // remote audio
                    if (!peer.muted) {
                      angular.element('#' + peer.domId).prop('volume', 0);
                    }
                    else {
                      angular.element('#' + peer.domId).prop('volume', 1);
                    }
                }
                peer.muted = !peer.muted;
            };

            $scope.disableVideo = function () {

              console.log(':: directive - disable video ::', $scope.peer);
              var peer = $scope.peer,
                  webrtc = window.webrtc;

              // local video
              if (peer.isLocal)
              {
                if (!peer.noVideo) {
                  webrtc.pauseVideo();
                }
                else {
                  webrtc.resumeVideo();
                }
              }
              else {
                try {
                  var videoTrack = peer.rtcPeer.stream.getVideoTracks()[0];
                  if (!peer.noVideo) {
                    videoTrack.enabled = false;
                  }
                  else {
                    videoTrack.enabled = true;
                  }
                }
                catch (e) {
                  console.log('call-overlay - disable peer video', e);
                }
              }
              peer.noVideo = !peer.noVideo;
            };
          },
          link: function (scope) {

              scope.peer = scope.$parent.vm.peers[scope.peerId];

              // mouse over
              angular.element('#wrapper_' + scope.peer.domId).hover(function () {
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
