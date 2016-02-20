/**
 * @name VideoIndexController
 * @desc Controller for the video-index view
 */

(function() {
    'use strict';

    angular.module('cometApp')
           .controller('VideoIndexController', VideoIndexController);

        VideoIndexController.$inject = [ '$log',
                                         '$rootScope',
                                         '$scope',
                                         '$sce',
                                         '$state',
                                         '$stateParams',
                                         '$window',
                                         'ngToast',
                                         'constraints',
                                         'lodash',
                                         'moment',
                                         'dashboardServiceModel'];

        function VideoIndexController ($log,
                                      $rootScope,
                                      $scope,
                                      $sce,
                                      $state,
                                      $stateParams,
                                      $window,
                                      ngToast,
                                      constraints,
                                      lodash,
                                      moment,
                                      dashboardServiceModel) {

          var vm = this,
              room = $stateParams.room,
              localNickname = dashboardServiceModel.getCurrentUser().alias,
              webrtc = null,
              peers = [];

          vm.getPeers = getPeers;
          vm.mute = mute;
          vm.disableVideo = disableVideo;
          vm.mouseIn = mouseIn;
          vm.mouseOut = mouseOut;
          vm.maximize = maximize;
          vm.centerPeer = null;

          vm.showChat = false;
          vm.sendMessage = sendMessage;
          vm.formatMessageDate = formatMessageDate;
          vm.messages = [];

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

          function getPeers () {
            var tempPeers = [];
            for (var i = 0; i < peers.length; i++) {
              //if (peers[i].id !== vm.centerPeer.id) {
                tempPeers.push(peers[i]);
              //}
            }

            return tempPeers;
          }

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

          function disableVideo (peer) {
            peer.videoDisabled = !peer.videoDisabled;
          }

          function maximize (peer) {
            vm.centerPeer = peer;
          }

          function mouseIn (peer) {
            peer.mouseIn = true;
          }

          function mouseOut (peer) {
            peer.mouseIn = false;
          }

          function initializeRTC() {
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
                autoAdjustMic: false
                //url: 'http://localhost:8888' //TODO: implementar con el server de comet
            });

            webrtc.startLocalVideo();

            // when it's ready, join if we got a room from the URL
            webrtc.on('readyToCall', function () {
              $log.info('webrtc::readyToCall - joining:' + room);
              webrtc.joinRoom(room);
            });

            // we got access to the camera
            webrtc.on('localStream', function (stream) {

              $log.log('local', stream);

              var videoTracks = stream.getVideoTracks();
              console.log('how many video tracks?', videoTracks.length);
              if (videoTracks.length) {
                var first = videoTracks[0];
                console.log('video track label', first.label);
              }

              var localStreamUrl = $window.URL.createObjectURL(stream);

              var localPeer = {
                id: 'localVideo',
                name: localNickname,
                domId: 'localPeer',
                source: $sce.trustAsResourceUrl(localStreamUrl),
                isLocal: true,
                muted: false,
                noVideo: false,
                mouseIn: false
              };

              //vm.centerPeer = localPeer;
              peers.push(localPeer);

              $scope.$apply();
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
                  source: $sce.trustAsResourceUrl(video.src),
                  muted: false,
                  noVideo: false,
                  mouseIn: false
                };

                $log.info('new peer', newPeer);

                if (peer && peer.pc) {
                  peer.pc.on('iceConnectionStateChange', function () {
                    $log.info('iceConnectionStateChange', peer);
                    switch (peer.pc.iceConnectionState) {
                      case 'checking':
                          newPeer.state = 'Conectando..';
                          break;
                      case 'connected':
                      case 'completed': // on caller side
                          //$(vol).show();
                          newPeer.state = 'Conexión establecida';
                          break;
                      case 'disconnected':
                          newPeer.state = 'Desconectado.';
                          break;
                      case 'failed':
                          newPeer.state = 'Error de conexión.';
                          break;
                      case 'closed':
                          newPeer.state = 'Conexión cerrada.';
                          break;
                      }
                  });
                }
                peers.push(newPeer);
            });

            // a peer was removed
            webrtc.on('videoRemoved', function (video, peer) {
                $log.info('webrtc::video removed ', peer);
                removePeer(peer);
            });

            // chat - message received
            webrtc.connection.on('message', function (data) {
              //$log.info('chat received (message)', data);
              if (data.type === 'chat') {
                console.log('chat received (message)', data.payload);
                vm.messages.push(data.payload);
              }
            });
          }

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

          function removePeer (peer) {
            lodash.remove(peers, function (p) {
              if (p.id === peer.id) {
                return true;
              }
              return false;
            });
          }
        }
})();
