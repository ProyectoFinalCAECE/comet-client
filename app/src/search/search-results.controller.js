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
          vm.channelId = $stateParams.channelId;
          vm.validationErrors = null;
          vm.resultUsers = [];
          vm.messagesInProjectDirectChannels = [];
          vm.messagesInProjectCommonChannels = [];
          vm.messagesInChannel = [];
          vm.limit = $stateParams.limit;
          vm.last_common_id = null;
          vm.last_direct_id = null;
          vm.searching = true;
          vm.getMember = getMember;
          vm.getChannelById = getChannelById;
          vm.lookForMoreResults = lookForMoreResults;

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
            if(vm.channelId){
              //buscar solamente en el canal provisto
              searchService.searchMessageInChannel(vm.projectId, vm.channelId, vm.criterioBusqueda, vm.limit, undefined).error(searchError).then(
                function (project_search_result) {
                  if(project_search_result.data.project.channels.direct){
                    vm.messagesInProjectDirectChannels = project_search_result.data.project.channels.direct;
                  }

                  if(project_search_result.data.project.channels.common){
                    vm.messagesInProjectCommonChannels = project_search_result.data.project.channels.common;
                  }
                }
              ).then(searchResult);
            } else {
              searchService.searchUserInProject(vm.projectId, vm.criterioBusqueda).error(searchError)
              .then(function (users_search_result) {
                vm.resultUsers = users_search_result.data.users;
                //Buscar en todos los canales comunes del proyecto.
                searchService.searchMessageInProject(vm.projectId, vm.criterioBusqueda, false, vm.limit, undefined).error(searchError).then(
                  function (project_common_search_result) {
                    console.log("project_common_search_result are: ", project_common_search_result);
                    vm.messagesInProjectCommonChannels = project_common_search_result.data.project.channels.common;
                  }
                ).then(function(){
                  //Buscar en todos los canales directos a los que pertenece el usuario.
                  searchService.searchMessageInProject(vm.projectId, vm.criterioBusqueda, true, vm.limit, vm.last_id).error(searchError).then(
                    function (project_direct_search_result) {
                      console.log("project_direct_search_result are: ", project_direct_search_result);
                      vm.messagesInProjectDirectChannels = project_direct_search_result.data.project.channels.direct;
                    }
                  ).then(searchResult);
                });
              });  
            }
          }

          /**
           * @name lookForMoreResults
           * @desc sends search request starting from last retrieved id
          */
          function lookForMoreResults (in_direct) {
            vm.searching = true;
            console.log("into lookForMoreResults. in_direct: ", in_direct);
            if(vm.channelId){
              //buscar solamente en el canal provisto

              var last_id;

              if(vm.last_direct_id !== null){
                last_id = vm.last_direct_id;
              }

              if(vm.last_common_id !== null){
                last_id = vm.last_common_id;
              }

              searchService.searchMessageInChannel(vm.projectId, vm.channelId, vm.criterioBusqueda, vm.limit, last_id).error(searchError).then(
                function (project_search_result) {
                  if(project_search_result.data.project.channels.direct){
                    console.log('project_search_result.data.project.channels.direct single is: ', project_search_result.data.project.channels.direct);
                    //vm.messagesInProjectDirectChannels.concat(project_search_result.data.project.channels.direct);
                    appendNewResultsToExistingOnes(project_search_result.data.project.channels.direct, false);
                  }

                  if(project_search_result.data.project.channels.common){
                    console.log('project_search_result.data.project.channels.common single is: ', project_search_result.data.project.channels.common);
                    //vm.messagesInProjectCommonChannels.concat(project_search_result.data.project.channels.common);
                    appendNewResultsToExistingOnes(project_search_result.data.project.channels.common, true);
                  }
                }
              ).then(searchResult);
            } else {

              if(in_direct){
                //Buscar en todos los canales directos a los que pertenece el usuario.
                searchService.searchMessageInProject(vm.projectId, vm.criterioBusqueda, true, vm.limit, vm.last_direct_id).error(searchError).then(
                  function (project_direct_search_result) {
                    console.log("project_direct_search_result are: ", project_direct_search_result);
                    appendNewResultsToExistingOnes(project_direct_search_result.data.project.channels.direct, false);
                  }
                ).then(searchResult);
              } else {
                //Buscar en todos los canales comunes del proyecto.
                searchService.searchMessageInProject(vm.projectId, vm.criterioBusqueda, false, vm.limit, vm.last_common_id).error(searchError).then(
                  function (project_common_search_result) {
                    console.log("project_common_search_result are: ", project_common_search_result);
                    appendNewResultsToExistingOnes(project_common_search_result.data.project.channels.common, true);
                  }
                ).then(searchResult);
              }
            }
          }

          /**
           * @name searchResult
           * @desc shows search operation result
          */
          function searchResult () {
            vm.searching = false;
            if(vm.resultUsers.length !== 0 ||
                vm.messagesInProjectDirectChannels.length !== 0 ||
                vm.messagesInProjectCommonChannels.length !== 0 ||
                  vm.messagesInChannel.length !== 0){
                    vm.isEmpty = false;

                    vm.cantidadResultados = vm.resultUsers.length + vm.messagesInChannel.length;

                    for(var i=0; i < vm.messagesInProjectDirectChannels.length; i++){
                      vm.cantidadResultados += vm.messagesInProjectDirectChannels[i].messages.length;
                    }

                    for(var j=0; j < vm.messagesInProjectCommonChannels.length; j++){
                      vm.cantidadResultados += vm.messagesInProjectCommonChannels[j].messages.length;
                    }
            }
            //Saving last retrieved ids.
            setLastDirectId();
            setLastCommonId();
          }

          /**
           * @name setLastDirectId
           * @desc saves last message retrieved for direct channels search results to 'retrieve more'
          */
          function setLastDirectId() {
              if(vm.messagesInProjectDirectChannels.length !== 0){
                var last_channel = vm.messagesInProjectDirectChannels[vm.messagesInProjectDirectChannels.length -1];
                vm.last_direct_id = last_channel.messages[last_channel.messages.length - 1].id;
                console.log("vm.last_direct_id is: ", vm.last_direct_id);
              }
          }

          /**
           * @name setLastCommonId
           * @desc saves last message retrieved for direct channels search results to 'retrieve more'
          */
          function setLastCommonId(){
              if(vm.messagesInProjectCommonChannels.length !== 0){
                var last_channel = vm.messagesInProjectCommonChannels[vm.messagesInProjectCommonChannels.length -1];
                vm.last_common_id = last_channel.messages[last_channel.messages.length - 1].id;
                console.log("vm.last_common_id is: ", vm.last_common_id);
              }
          }

          /**
           * @name searchError
           * @desc shows a dialog indicating an error on search operation
          */
          function searchError (data) {
              vm.searching = false;
              vm.validationErrors = $rootScope.helpers.loadServerErrors(data);

              if (vm.validationErrors === null){
                ngToast.danger('Ocurrió un error al consultar al servidor.');
              } else {
                ngToast.danger(vm.validationErrors.q);
              }
          }

          /**
           * @name getChannelById
           * @desc returns a channel object by id
          */
          function getChannelById(channelId){
            if(isNaN(channelId)){
              //Direct Channel
              var user_ids = channelId.split("_");

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
              lastDay : '[ayer] LTS',
              lastWeek : 'dddd L LTS',
              sameDay : 'LTS',
              sameElse : 'dddd L LTS'
            });
          }

          /**
           * @name appendNewResultsToExistingOnes
           * @desc appends new messsages to existent channel from previous search results, or adds new channel.
           */
          function appendNewResultsToExistingOnes(new_search_results, common){
              console.log('into appendNewResultsToExistingOnes');
              var old_results = vm.messagesInProjectDirectChannels;

              if(common){
                old_results = vm.messagesInProjectCommonChannels;
              }

              for(var j=0; j < new_search_results.length; j++){
                var idx = arrayObjectIndexOf(old_results, new_search_results[j].id, 'id');
                if(idx > -1){
                  old_results[idx].messages = old_results[idx].messages.concat(new_search_results[j].messages);
                } else {
                  old_results = old_results.concat(new_search_results[j]);
                }
              }

              console.log('now searc results are: ', old_results);
          }

          function arrayObjectIndexOf(myArray, searchTerm, property) {
              for(var i = 0, len = myArray.length; i < len; i++) {
                  if (myArray[i][property] === searchTerm) {
                    return i;
                  }
              }
              return -1;
          }
        }
})();
