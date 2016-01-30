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
                                         'constraints'];

        function VideoIndexController ($log,
                                      $rootScope,
                                      $sce,
                                      $state,
                                      $stateParams,
                                      ngToast,
                                      constraints) {

          var vm = this,
              room = $stateParams.room,
              webrtc = null;

          vm.peers = [];
          vm.getColumns = getColumns;

          activate();

          /**
           * @name activate
           * @desc controller activation logic
          */
          function activate () {
            $log.log('video controller - activate', 'room:' + room);
            initializeRTC();
          }

          function getColumns()
          {
             var columns = 1;

             if (vm.peers.length > 0) {
               columns = 12 / vm.peers.length;
             }

             return columns;
          }

          function initializeRTC() {
            // create our webrtc connection
            webrtc = new SimpleWebRTC({
                // the id/element dom element that will hold "our" video
                localVideoEl: 'peer-main',
                // the id/element dom element that will hold remote videos
                remoteVideosEl: '',
                // immediately ask for camera access
                autoRequestMedia: true,
                debug: false,
                detectSpeakingEvents: true,
                autoAdjustMic: false,
                url: 'http://localhost:8888'
            });

            // when it's ready, join if we got a room from the URL
            webrtc.on('readyToCall', function () {
              $log.info('webrtc::readyToCall - joining:' + room);
              webrtc.joinRoom(room);
            });

            // we got access to the camera
            webrtc.on('localStream', function (stream) {
                $('#localVolume').show();
            });

            // we did not get access to the camera
            webrtc.on('localMediaError', function (err) {
              $log.log('webrtc::localMediaError', err);
              ngToast.danger('Ocurrió un error al iniciar el video.');
            });

            // local screen obtained
            webrtc.on('localScreenAdded', function (video) {
              $log.log('webrtc::localScreenAdded', video);
                // video.onclick = function () {
                //     video.style.width = video.videoWidth + 'px';
                //     video.style.height = video.videoHeight + 'px';
                // };
                //document.getElementById('localScreenContainer').appendChild(video);
                //$('#localScreenContainer').show();
            });
            // local screen removed
            webrtc.on('localScreenRemoved', function (video) {
                $log.log('webrtc::localScreenRemoved', video);
                //document.getElementById('localScreenContainer').removeChild(video);
                //$('#localScreenContainer').hide();
            });

            // a peer video has been added
            webrtc.on('videoAdded', function (video, peer) {
                $log.log('webrtc::video added', peer, video);

                var newPeer = {
                  id: peer.id,
                  domId: webrtc.getDomId(peer),
                  source: $sce.trustAsResourceUrl(video.src)
                };

                $log.info('new peer', newPeer);

                vm.peers.push(newPeer);

                // var remotes = document.getElementById('remotes');
                // if (remotes) {
                //     var container = document.createElement('div');
                //     container.className = 'videoContainer';
                //     container.id = 'container_' + webrtc.getDomId(peer);
                //     container.appendChild(video);
                //
                //     // suppress contextmenu
                //     video.oncontextmenu = function () { return false; };
                //
                //     // resize the video on click
                //     video.onclick = function () {
                //         container.style.width = video.videoWidth + 'px';
                //         container.style.height = video.videoHeight + 'px';
                //     };
                //
                //     // show the remote volume
                //     var vol = document.createElement('meter');
                //     vol.id = 'volume_' + peer.id;
                //     vol.className = 'volume';
                //     vol.min = -45;
                //     vol.max = -20;
                //     vol.low = -40;
                //     vol.high = -25;
                //     container.appendChild(vol);
                //
                //     // show the ice connection state
                //     if (peer && peer.pc) {
                //         var connstate = document.createElement('div');
                //         connstate.className = 'connectionstate';
                //         container.appendChild(connstate);
                //         peer.pc.on('iceConnectionStateChange', function (event) {
                //             switch (peer.pc.iceConnectionState) {
                //               case 'checking':
                //                   connstate.innerText = 'Connecting to peer...';
                //                   break;
                //               case 'connected':
                //               case 'completed': // on caller side
                //                   $(vol).show();
                //                   connstate.innerText = 'Connection established.';
                //                   break;
                //               case 'disconnected':
                //                   connstate.innerText = 'Disconnected.';
                //                   break;
                //               case 'failed':
                //                   connstate.innerText = 'Connection failed.';
                //                   break;
                //               case 'closed':
                //                   connstate.innerText = 'Connection closed.';
                //                   break;
                //               }
                //         });
                //     }
                //     remotes.appendChild(container);
                // }
            });
            // a peer was removed
            webrtc.on('videoRemoved', function (video, peer) {
                $log.info('webrtc::video removed ', peer);
                // var remotes = document.getElementById('remotes');
                // var el = document.getElementById(peer ? 'container_' + webrtc.getDomId(peer) : 'localScreenContainer');
                // if (remotes && el) {
                //     remotes.removeChild(el);
                // }
            });
          }

        }
})();
