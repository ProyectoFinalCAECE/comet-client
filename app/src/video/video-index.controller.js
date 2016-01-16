/**
 * @name VideoIndexController
 * @desc Controller for the video-index view
 */

(function() {
    'use strict';

    angular.module('cometApp')
           .controller('VideoIndexController', VideoIndexController);

        VideoIndexController.$inject = ['$rootScope',
                                           '$state',
                                           '$timeout',
                                           'ngToast',
                                           'constraints',
                                           'dialogService',
                                           'projectService',
                                           'userService'];

        function VideoIndexController ($rootScope,
                                          $state,
                                          $timeout,
                                          ngToast,
                                          constraints,
                                          dialogService,
                                          projectService,
                                          userService) {

          var vm = this;

          activate();

          /**
           * @name activate
           * @desc controller activation logic
          */
          function activate () {

          }
        }
})();
