/**
 * @name VideoIndexController
 * @desc Controller for the video-index view
 */

(function() {
    'use strict';

    angular.module('cometApp')
           .controller('VideoIndexController', VideoIndexController);

        VideoIndexController.$inject = ['$log',
                                        '$rootScope',
                                         '$sce',
                                         '$state',
                                         '$stateParams',
                                         'ngToast',
                                         'constraints',
                                         'lodash'];

        function VideoIndexController ($log,
                                      $rootScope,
                                      $sce,
                                      $state,
                                      $stateParams,
                                      ngToast,
                                      constraints,
                                      lodash) {

          var vm = this,
              room = $stateParams.room,
              webrtc = null,
              peers = [];

          vm.getPeers = getPeers;
          vm.mute = mute;
          vm.disableVideo = disableVideo;
          vm.mouseIn = mouseIn;
          vm.mouseOut = mouseOut;
          vm.maximize = maximize;
          vm.centerPeer = null;

          activate();

          /**
           * @name activate
           * @desc controller activation logic
          */
          function activate () {
            $log.log('video controller - activate', 'room:' + room);
            initializeRTC();
          }

          function getPeers () {
            var tempPeers = [];
            for (var i = 0; i < peers.length; i++) {
              if (peers[i].id !== vm.centerPeer.id) {
                tempPeers.push(peers[i]);
              }
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
                localVideoEl: '',
                // the id/element dom element that will hold remote videos
                remoteVideosEl: '',
                // immediately ask for camera access
                autoRequestMedia: true,
                debug: false,
                detectSpeakingEvents: true,
                autoAdjustMic: false
                //url: 'http://localhost:8888' //TODO: implementar con el server de comet
            });

            // when it's ready, join if we got a room from the URL
            webrtc.on('readyToCall', function () {
              $log.info('webrtc::readyToCall - joining:' + room);
              webrtc.joinRoom(room);
            });

            // we got access to the camera
            webrtc.on('localStream', function (stream) {

              $log.log('local', stream);

              var vendorURL = window.URL || window.webkitURL,
                  localStreamUrl = vendorURL.createObjectURL(stream);

              var localPeer = {
                id: 'local',
                name: 'peer_local',
                domId: 'localPeer',
                source: $sce.trustAsResourceUrl(localStreamUrl),
                isLocal: true,
                muted: false,
                noVideo: false,
                mouseIn: false
              };
              vm.centerPeer = localPeer;
              peers.push(localPeer);
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
                  name: 'peer_' + peer.id,
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
