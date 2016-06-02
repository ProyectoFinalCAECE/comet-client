(function() {
  'use strict';

  angular
    .module('cometApp')
    .config(config);

  config.$inject = ['$stateProvider', '$urlRouterProvider'];

  function config ($stateProvider) {
    $stateProvider
      .state('dashboard.project.call-index', {
        url: '/channels/:channelId/call/:callId/:room',
        ncyBreadcrumb: {
          label: 'Videoconferencia'
        },
        views:{
          '@dashboard': {
            templateUrl: 'src/calls/call-index.html',
            controller: 'CallIndexController',
            controllerAs: 'vm'
          }
        },
        resolve: {
          channel: ['$stateParams', 'channelService', 'project',
            function($stateParams, channelService, project) {

                // for calls in direct channels
                if (parseInt($stateParams.callId, 10) === 0) {
                  return null;
                }

                return channelService.getById(project.id, $stateParams.channelId)
                       .then(function(data) {
                         return data.data;
                       });
            }]
        }
    });
  }
})();
