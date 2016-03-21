/**
 * @name VideoIndexController
 * @desc Controller for the video-index view
 */

(function() {
    'use strict';

    angular.module('cometApp')
           .controller('CallIndexController', CallIndexController);

        CallIndexController.$inject = [ '$log',
                                         '$rootScope',
                                         '$scope',
                                         '$sce',
                                         '$state',
                                         '$stateParams',
                                         '$window',
                                         '$compile',
                                         'ngToast',
                                         'constraints',
                                         'lodash',
                                         'moment',
                                         'SimpleWebRTC',
                                         'dashboardServiceModel'];

        function CallIndexController ($log,
                                      $rootScope,
                                      $scope,
                                      $sce,
                                      $state,
                                      $stateParams,
                                      $window,
                                      $compile,
                                      ngToast,
                                      constraints,
                                      lodash,
                                      moment,
                                      SimpleWebRTC,
                                      dashboardServiceModel) {

          var vm = this,
              room = $stateParams.room,
              localNickname = dashboardServiceModel.getCurrentUser().alias,
              webrtc = null,
              totalPeers = 0;

          vm.mute = mute;
          vm.disableVideo = disableVideo;
          vm.mouseIn = mouseIn;
          vm.mouseOut = mouseOut;

          vm.showChat = false;
          vm.sendMessage = sendMessage;
          vm.formatMessageDate = formatMessageDate;
          vm.messages = [];

          vm.peers = {};
          var $remotes = document.getElementById('remotes');

          activate();

          /**
           * @name activate
           * @desc controller activation logic
          */
          function activate () {

            initializeRTC();

            // close the connection on exit
            $window.onunload = function(  ) {
              $log.log("####### unload");
              if (webrtc !== null) {
                webrtc.leaveRoom();
                webrtc.disconnect();
              }
            };
          }

          /**
           * @name mute
           * @desc mute peer video sound
          */
          function mute (peer) {
            $log.log("mute", peer);
            var video = angular.element('#video_' + peer.id);
            if (peer.muted) {
                video.prop("volume", 1);
            }
            else  {
              video.prop("volume", 0);
            }
            peer.muted = !peer.muted;
          }

          /**
           * @name maximize
           * @desc disable peer video
          */
          function disableVideo (peer) {
            peer.videoDisabled = !peer.videoDisabled;
          }

          /**
           * @name mouseIn
           * @desc peer video mouse in
          */
          function mouseIn (peer) {
            peer.mouseIn = true;
          }

          /**
           * @name mouseOut
           * @desc peer video mouse out
          */
          function mouseOut (peer) {
            peer.mouseIn = false;
          }

          /**
           * @name initializeRTC
           * @desc SimpleWebRTC plugin configuration
          */
          function initializeRTC() {

            var signalingServer = 'https://' + location.hostname + ':8888';

            // create our webrtc connection
            webrtc = new SimpleWebRTC({
                // the id/element dom element that will hold "our" video
                //localVideoEl: 'peer-main',
                localVideoEl: 'localVideo',
                // the id/element dom element that will hold remote videos
                remoteVideosEl: '',
                // nickname
                nick: localNickname,
                // immediately ask for camera access
                autoRequestMedia: false,
                debug: false,
                detectSpeakingEvents: true,
                autoAdjustMic: true,
                url:  signalingServer     // comentar esta linea para usar el server en la nube
            });

            webrtc.startLocalVideo();

            // when it's ready, join if we got a room from the URL
            webrtc.on('readyToCall', function () {
              $log.info('webrtc::readyToCall - joining:' + room);
              webrtc.joinRoom(room);
            });

            // we got access to the camera
            webrtc.on('localStream', function (stream) {

              var videoTracks = stream.getVideoTracks();
              if (videoTracks.length) {
                var first = videoTracks[0];
                $log.info('local video track label', first.label);
              }

              var localStreamUrl = $window.URL.createObjectURL(stream),
                  video = document.createElement('video');
              video.id = 'localVideo';
              video.src = localStreamUrl;
              video.autoplay = true;
              video.style= 'transform: scaleX(-1);';

              var localPeer = {
                id: 'localVideo',
                name: localNickname,
                domId: 'localPeer',
                isLocal: true,
                muted: false,
                noVideo: false,
                mouseIn: false
              };

              addPeer(localPeer, video);
            });

            // we did not get access to the camera
            webrtc.on('localMediaError', function (err) {
              $log.log('webrtc::localMediaError', err);
              ngToast.danger('Ocurrió un error al iniciar el video.');
            });

            // a peer video has been added
            webrtc.on('videoAdded', function (video, peer) {
                $log.log('webrtc::video added', peer, video);

                var newPeer = {
                  id: peer.id,
                  name: peer.nick,
                  domId: webrtc.getDomId(peer),
                  muted: false,
                  noVideo: false,
                  mouseIn: false
                };

                addPeer(newPeer, video);
            });

            // a peer was removed
            webrtc.on('videoRemoved', function (video, peer) {
                $log.info('webrtc::video removed ', peer);

                // delete the parent node
                angular.element(peer.videoEl).parent('.video-wrapper').remove();

                totalPeers--;
                updateLayout();
            });

            // chat - message received
            webrtc.connection.on('message', function (data) {
              if (data.type === 'chat') {
                vm.messages.push(data.payload);
              }
            });
          }

          function addPeer(newPeer, video) {

            insertVideoBlock(newPeer, video);
            vm.peers[newPeer.id] = newPeer;

            totalPeers++;
            updateLayout();
            $log.log('totalPeers', totalPeers);

            if (totalPeers === 4) {
              angular.element('<br />').insertBefore('.video-wrapper:nth-child(3)');
            }
          }

          function insertVideoBlock(peer, video) {

            $log.log('## insertVideoBlock', peer, video);

            var containerClass = 'video-wrapper',
                wrapper = document.createElement('div'),
                overlay = $compile('<video-overlay peer-id="' + peer.id + '" />')($scope);

            wrapper.className = containerClass;
            wrapper.id = peer.domId;
            wrapper.appendChild(overlay[0]);
            wrapper.appendChild(video);

            // // mouse over
            // angular.element(wrapper).hover(function () {
            //   peer.mouseIn = true;
            // }, function () {
            //   peer.mouseIn = false;
            // });

            $remotes.appendChild(wrapper);
          }

          /**
           * @name sendMessage
           * @desc sends a chat messsage
          */
          function sendMessage(text) {
            var message = {
              content: text,
              author: localNickname,
              date: new Date()
            };

            if (webrtc) {
              webrtc.sendToAll('chat', message);
              vm.messages.push(message);
              vm.message = '';
            }
          }

          /**
           * @name formatMessageDate
           * @desc returns the message timestamp in a readable format
          */
          function formatMessageDate (msgDate) {
            return moment(msgDate).calendar(null, {
              lastDay : '[ayer] LT',
              lastWeek : 'dddd L LT',
              sameDay : 'LT',
              sameElse : 'dddd L LT'
            });
          }

          /**
           * @name updateLayout
           * @desc updates the container div's
          */
          function updateLayout () {
            angular.element('#remotes')
                   .removeClass('peers-1 peers-2 peers-3 peers-4')
                   .addClass('peers-' + (totalPeers));

          }
        }
})();
