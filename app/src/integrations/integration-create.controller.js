/**
 * @name IntegrationCreateController
 * @desc Controller for the integration-create view
 */

(function() {
    'use strict';

    angular.module('cometApp')
           .controller('IntegrationCreateController', IntegrationCreateController);

        IntegrationCreateController.$inject = ['$log',
                                               '$rootScope',
                                               '$state',
                                               '$timeout',
                                               '$location',
                                               'lodash',
                                               'ngToast',
                                               'dialogService',
                                               'integrationService',
                                               'user',
                                               'project',
                                               'channels',
                                               'channelId',
                                               'projectIntegration',
                                               'TrelloApi'];

        function IntegrationCreateController ($log,
                                              $rootScope,
                                              $state,
                                              $timeout,
                                              $location,
                                              lodash,
                                              ngToast,
                                              dialogService,
                                              integrationService,
                                              user,
                                              project,
                                              channels,
                                              channelId,
                                              projectIntegration,
                                              TrelloApi) {

          var vm = this;
          vm.integrationId = projectIntegration.integrationId;
          vm.integrationName = projectIntegration.name;
          vm.description = projectIntegration.description;
          vm.channels = null;
          vm.validationErrors = null;
          vm.hookUrl = null;
          vm.selectedChannel = null;
          vm.selectedBoard = null;
          vm.name = projectIntegration.name;
          vm.generateHookUrl = generateHookUrl;
          vm.post = post;
          // Github
          vm.postGitHub = postGitHub;
          // Trello
          vm.trelloAuth = trelloAuth;
          vm.trelloLogged = false;
          vm.boardsIds = [];
          vm.boards = [];
          vm.postTrello = postTrello;
          var trelloAppKey = "5196979cb1b5bb0191e54bc94881b5df";

          // StatusCake
          vm.postStatusCake = postStatusCake;
          vm.statusCakeUsername = null;
          vm.statusCakeAPIKey = null;
          vm.statusCakeIntegrationName = null;
          vm.statusCakeHookUrl = null;

          var token = null,
              isUpdate = (channelId > 0),
              configuration = null;

          activate();

          function activate () {
            $log.log('projectIntegration', projectIntegration, channelId);

            if (isUpdate) {
              // get the desired configuration by channelId (TODO: must be an explicit configurationId)
              configuration = lodash.find(projectIntegration.configurations, 'ChannelId', channelId);
              $log.log('configuration', configuration);

              switch (projectIntegration.integrationId) {
                case 3:
                  vm.statusCakeUsername = configuration.cakeUser;
                  vm.statusCakeAPIKey = configuration.cakeToken;
                  vm.statusCakeIntegrationName = configuration.name;
                  vm.statusCakeHookUrl = $location.protocol() + '://' +
                                 $location.host() + ':' +
                                 $location.port() + '/hooks/' + configuration.token +
                                 '/?integrationId=' + projectIntegration.integrationId;
                  break;
                default:
                  vm.name = configuration.name;
              }
            }

            // trello
            if (projectIntegration.integrationId === 2) {
              alreadyLogged();
            }

            generateHookUrl();
            loadChannels();
          }

          /**
           * @name loadChannels
           * @desc loads the project channels
          */
          function loadChannels() {
            vm.selectedChannel = channels[0];
            for (var i = 0; i < channels.length; i++) {
              var channel = channels[i];
              channel.typeDescription = (channel.type === 'S' ? 'Canales públicos' : 'Canales privados');
              $log.log(channel, channelId);
              if (channelId === channel.id) {
                vm.selectedChannel = channel;
              }
            }
            vm.channels = channels;
          }

          /**
           * @name generateHookUrl
           * @desc return the webhook URL.
           *       Example: http://localhost:4000/hooks/KIJTUG/?integrationId=2
          */
          function generateHookUrl () {
            var combined = $location.protocol() + '://' +
                           $location.host() + ':' +
                           $location.port();
            token = $rootScope.helpers.randomString(50);
            vm.hookUrl = combined + '/hooks/' + token + '/?integrationId=' + projectIntegration.integrationId;
          }

          /**
           * @name post
           * @desc create/edit the integration config
          */
          function postGitHub() {
            post().error(integrationConfigError)
                  .then(integrationConfigCreated);
          }

          function post() {
            vm.name = $rootScope.helpers.toTitleCase(vm.name);
            if (isUpdate) {
              // update configuration
              var updateData = {
                channelId: channelId,
                name: vm.name,
                token: token,
                newChannelId: vm.selectedChannel.id
              };
              console.log('post - edicion', updateData);
              return integrationService.update(project.id, projectIntegration.projectIntegrationId, updateData);
            }
            else {
              // create
              var data = {
                channelId: vm.selectedChannel.id,
                name: vm.name,
                token: token
              };
              console.log('post - alta', data);
              return integrationService.create(project.id, projectIntegration.projectIntegrationId, data);
            }
          }

        /**
         * @name integrationConfigCreated
         * @desc shows a dialog indicating a successful operation
        */
        function integrationConfigCreated () {
          // show dialog to the user
          var msg = 'Integración configurada exitósamente.';
          var dlg = dialogService.showModalAlert('Configurar integración', msg);
          dlg.result.finally(function () {
            $state.go('dashboard.project.project-admin', {
              projectId: project.id,
              tab: 3
            });
          });
        }

        /**
         * @name integrationConfigError
         * @desc shows the error message to the user
        */
        function integrationConfigError (data) {
            if (data.errors.all) {
              ngToast.danger(data.errors.all);
              return;
            }
            vm.validationErrors = $rootScope.helpers.loadServerErrors(data);
            if (vm.validationErrors === null)
            {
              ngToast.danger('Ocurrió un error al consultar al servidor.');
            }
        }

        /**
         * @name post
         * @desc create/edit the integration config
        */
        function postTrello() {
          if (!vm.trelloLogged) {
            ngToast.danger('Debes autenticarte en Trello para poder configurar esta integración.');
          }
          $log.log('postTrello', vm.hookUrl, vm.selectedBoard);
          post()
            .error(integrationConfigError)
            .then(function () {
              integrationService.configureTrelloWebhook(TrelloApi.Token(), vm.hookUrl, trelloAppKey, vm.selectedBoard.id)
                  .error(function () {
                    ngToast.danger('Ocurrió un error en la comunicación con Trello.');
                  })
                  .then(integrationConfigCreated);
            });
        }

        function loadBoards(){
          vm.trelloLogged = true;
          //Look for user information
          TrelloApi.Rest('GET', 'members/me').then(function(res){
            //store boards ids
            vm.boardsIds = res.idBoards;
            for (var x in vm.boardsIds) {
              TrelloApi.boards(vm.boardsIds[x], {}).then(loadBoardsCallback);
            }
          });
        }

        function loadBoardsCallback(res) {
          vm.boards.push({id:res.id, name: res.name});
          vm.selectedBoard = vm.boards[0];
        }

        function trelloAuth(){
          TrelloApi.Authenticate().then(function(){
            loadBoards();
          });
        }

        /**
         * @name post
         * @desc create/edit the integration config
        */
        function postStatusCake(){
          if (!vm.statusCakeUsername ||
              !vm.statusCakeAPIKey ||
              !vm.statusCakeIntegrationName) {
                ngToast.danger('Debes ingresar todos los parámetros del formulario para poder configurar esta integración.');
          } else {

            var data = {
              cakeUser: vm.statusCakeUsername,
              cakeToken: vm.statusCakeAPIKey,
              hookUrl: vm.hookUrl,
              channelId: vm.selectedChannel.id,
              name: vm.statusCakeIntegrationName,
              token: token
            };

            integrationService.congifureStatusCake(project.id, projectIntegration.projectIntegrationId, data)
                .error(function (error) {
                  ngToast.danger('Ocurrió un error intentando configurar StatusCake: ' + error);
                })
                .then(function () {
                  integrationConfigCreated();
                });
          }
        }

        function alreadyLogged(){
          TrelloApi.Authenticate().then(function(){
            loadBoards();
          });
        }
      }
})();
