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
                                           '$timeout',
                                           'ngToast',
                                           'constraints',
                                           'dialogService',
                                           'projectService',
                                           'userService'];

        function SearchResultsController ($rootScope,
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
