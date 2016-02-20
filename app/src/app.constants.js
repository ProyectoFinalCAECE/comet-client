(function() {

    'use strict';

    /**
     *  Application constants
     */
    angular
      .module('cometApp')
        // lodash support
        .constant('lodash', window._)
        // momentJS support
        .constant('moment', window.moment)
        // momentJS support
        .constant('SimpleWebRTC', window.SimpleWebRTC)
        // Dropbox chooser
        .constant('dropboxChooser', window.Dropbox)
        // global forms configuration
        .constant('formsConfig', {
          'passwordLabel': 'Debe tener entre 6 y 40 caracteres ' +
                           'y contener al menos una minúscula, una mayúscula y un símbolo o número.'
        })
        // global dialog types
        .constant("dialogType", {
          ALERT: 1,
          CONFIRM: 2
        })
        // message types
        .constant('messageType', {
          TEXT: 1,
          FILE: 2,
          INTEGRATION: 3,
          AUTO: 4,
          INTEGRATION_DROPBOX: 5,
          INTEGRATION_GITHUB: 6,
          INTEGRATION_TRELLO: 7,
          INTEGRATION_PINGDOM: 8
        })
        // system notification types
        .constant('systemNotificationType', {
          CHANNEL_CREATE: 1,
          CHANNEL_CLOSE: 2,
          CHANNEL_JOIN: 3,
          PROJECT_CLOSE: 4,
          PROJECT_JOIN: 5,
          CHANNEL_EDIT: 6,
          PROJECT_EDIT: 7
        })
        // global constraints
        .constant('constraints', {
          projectPerUser: 30,
          membersPerProject: 50,
          membersPerProjectPerStep: 10
        });
})();
