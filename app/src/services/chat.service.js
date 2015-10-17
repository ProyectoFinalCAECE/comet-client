(function() {

    'use strict';

    angular
        .module('cometApp')
        .factory('chatService', chatService);

    chatService.$inject = ['socketFactory'];

    function chatService (socketFactory) {
      return socketFactory();
    }
})();
