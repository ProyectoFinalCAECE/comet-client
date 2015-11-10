(function() {

    'use strict';

    angular
        .module('cometApp')
        .factory('desktopNotificationService', desktopNotificationService);

    function desktopNotificationService () {

      return {
          init: init,
          show: show
      };

      /**
       * @name init
       * @desc request user permission
      */
      function init () {
        if (Notification.permission !== "granted") {
          Notification.requestPermission();
        }
      }

      /**
       * @name show
       * @desc show a desktop notification
      */
      function show (title, body, url) {

        if (!Notification) {
          console.log('Desktop notifications not available in your browser. Try Chromium.');
          return;
        }

        if (title === undefined || title === null) {
          title = 'Notificación Comet';
        }

        if (Notification.permission !== "granted") {
          Notification.requestPermission();
        }
        else {
          var notification = new Notification(title, {
            icon: '../../images/comet_logo_grey.png',
            body: body
          });

          // auto close the notification
          setTimeout(function () {
            notification.close();
          }, 3000);

          // open the source url on click
          notification.onclick = function () {
            window.open(url);
          };
        }
      }
    }
})();
