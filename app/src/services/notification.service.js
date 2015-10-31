(function() {

    'use strict';

    angular
        .module('cometApp')
        .factory('notificationService', notificationService);

    notificationService.$inject = ['socketFactory', 'authService'];

    function notificationService (socketFactory, authService) {
      return socketFactory({
        ioSocket: window.io.connect(':4000/notification', {
          'query': 'token=' + authService.getToken()
        })
      });
    }
})();
