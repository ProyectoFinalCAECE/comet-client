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
                                           'ngToast'];

        function SearchResultsController ($rootScope,
                                          $state,
                                          $stateParams,
                                          ngToast) {

          var vm = this;
          vm.criterioBusqueda = $stateParams.criterio;

          activate();

          /**
           * @name activate
           * @desc controller activation logic
          */
          function activate () {
            // aca habrìa que llamar al server para hacer la busqueda
            // mientras mostrar un gif de loading
          }
        }
})();
