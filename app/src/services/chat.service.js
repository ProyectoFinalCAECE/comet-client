(function() {

    'use strict';

    angular
        .module('cometApp')
        .factory('chatService', chatService);

    chatService.$inject = ['socketFactory', 'authService'];

    function chatService (socketFactory, authService) {
      console.log('chatService init', authService.getToken());
      return socketFactory({
        ioSocket: window.io.connect(':4000/messages', {
          'query': 'token=' + authService.getToken()
        })
      });
    }
})();
