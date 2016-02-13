/**
 * @name SearchResultsController
 * @desc Controller for the search-result view
 */

(function() {
    'use strict';

    angular.module('cometApp')
           .controller('SearchResultsController', SearchResultsController);

        SearchResultsController.$inject = ['$rootScope',
                                           '$state',
                                           '$stateParams',
                                           'ngToast',
                                           'searchService',
                                           'channels',
                                           'project',
                                           'lodash',
                                           'moment'];

        function SearchResultsController ($rootScope,
                                          $state,
                                          $stateParams,
                                          ngToast,
                                          searchService,
                                          channels,
                                          project,
                                          lodash,
                                          moment) {

          var vm = this;
          vm.criterioBusqueda = $stateParams.criterio;
          vm.channels = channels;
          vm.project = project;
          vm.isEmpty = true;
          vm.cantidadResultados = 0;
          vm.projectId = $stateParams.id;
          vm.validationErrors = null;
          vm.resultUsers = [];
          vm.messagesInProjectDirectChannels = [];
          vm.messagesInProjectCommonChannels = [];
          vm.messagesInChannel = [];
          vm.limit = $stateParams.limit;
          vm.last_id = null;
          vm.getMember = getMember;
          vm.getChannelById = getChannelById;

          // ngEmbed options
          vm.options = {
              linkTarget: '_blank',
              basicVideo: false,
              code: {
                  highlight: false,
                  lineNumbers: true
              },
              gdevAuth: 'AIzaSyAQONTdSSaKwqB1X8i6dHgn9r_PtusDhq0',
              video: {
                  embed: true,
                  width: 800,
                  ytTheme: 'light',
                  details: true
              },
              tweetEmbed       : true,
              tweetOptions     : {
                  lang      : 'es'
              },
              image: {
                  embed: true
              }
          };

          vm.formatMessageDate = formatMessageDate;

          activate();

          /**
           * @name activate
           * @desc controller activation logic
          */
          function activate () {
            // aca habrìa que llamar al server para hacer la busqueda
            // mientras mostrar un gif de loading

            console.log('vm.criterioBusqueda is: ', vm.criterioBusqueda);
            console.log('$stateParams is: ', $stateParams);
            searchService.searchUserInProject(vm.projectId, vm.criterioBusqueda).error(searchError)
            .then(function (users_search_result) {
              console.log('users_search_result are: ', users_search_result);
              vm.resultUsers = users_search_result.data.users;

              searchService.searchMessageInProject(vm.projectId, vm.criterioBusqueda, vm.limit, vm.last_id).error(searchError).then(
                function (project_search_result) {
                  console.log('messages_in_project are: ', project_search_result);
                  vm.messagesInProjectDirectChannels = project_search_result.data.project.channels.direct;
                  vm.messagesInProjectCommonChannels = project_search_result.data.project.channels.common;

                  // SETEAR LAST ID, PARA SIGUIENTE BUSQUEDA (VER MAS)
                }
              ).then(searchResult);
            });
          }

          /**
           * @name searchResult
           * @desc shows search operation result
          */
          function searchResult () {
            console.log('exito');
            if(vm.resultUsers.length !== 0 ||
                vm.messagesInProjectDirectChannels.length !== 0 ||
                vm.messagesInProjectCommonChannels.length !== 0 ||
                  vm.messagesInChannel.length !== 0){
                    vm.isEmpty = false;

                    console.log('vm.resultUsers.length is: ', vm.resultUsers.length);
                    console.log('vm.messagesInProjectDirectChannels.length is: ', vm.messagesInProjectDirectChannels.length);
                    console.log('vm.messagesInProjectCommonChannels.length is: ', vm.messagesInProjectCommonChannels.length);
                    console.log('vm.messagesInChannel.length is: ', vm.messagesInChannel.length);

                    vm.cantidadResultados = vm.resultUsers.length +
                                            vm.messagesInProjectDirectChannels.length +
                                            vm.messagesInProjectCommonChannels.length +
                                            vm.messagesInChannel.length;

                    console.log('vm.cantidadResultados is: ', vm.cantidadResultados);
            }
            /*var msg = 'Integración configurada exitósamente.';
            var dlg = dialogService.showModalAlert('Configurar integración', msg);
            dlg.result.finally(function () {
              $state.go('dashboard.project.project-admin', {
                projectId: project.id,
                tab: 3
              });
            });*/
          }

          /**
           * @name searchError
           * @desc shows a dialog indicating an error on search operation
          */
          function searchError (data) {
              vm.validationErrors = $rootScope.helpers.loadServerErrors(data);
              if (vm.validationErrors === null){
                ngToast.danger('Ocurrió un error al consultar al servidor.');
              }
          }

          /**
           * @name getChannelById
           * @desc returns a channel object by id
          */
          function getChannelById(channelId){
            console.log('getChannelById is: ', getChannelById);
            console.log('channelId is: ', channelId);
            if(isNaN(channelId)){
              //Direct Channel
              var user_ids = channelId.split("_");

              console.log('user_ids is: ', user_ids);

              console.log('user_ids[1]: ', user_ids[1]);
              console.log('user_ids[2]: ', user_ids[2]);

              var user_1 = lodash.find(vm.project.members, 'id', parseInt(user_ids[1]));
              var user_2 = lodash.find(vm.project.members, 'id', parseInt(user_ids[2]));

              user_1 = user_1.firstName + ' ' + user_1.lastName;
              user_2 = user_2.firstName + ' ' + user_2.lastName;

              return { name : 'Canal Directo entre ' + user_1 + ' y ' + user_2 };
            }

            //Common Channel
            return lodash.find(vm.channels, 'id', channelId);
          }

          /**
           * @name getMember
           * @desc returns a member object by id
          */
          function getMember(userId) {
                return lodash.find(vm.project.members, 'id', userId);
          }

          /**
           * @name formatMessageDate
           * @desc returns the message timestamp in a readable format
          */
          function formatMessageDate (msgDate) {
            return moment(msgDate).calendar(null, {
              lastDay : '[ayer] LT',
              lastWeek : 'dddd L LT',
              sameDay : 'LT',
              sameElse : 'dddd L LT'
            });
          }
        }

})();
