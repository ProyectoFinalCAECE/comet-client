/**
 * @name UnsafeFilter
 * @desc Filter to allow rendering of html content in controller scope properties
 */

(function() {
    'use strict';
    angular
      .module('cometApp')
      .filter('unsafe', UnsafeFilter);

      UnsafeFilter.$inject = ['$sce'];

      function UnsafeFilter($sce)
      {
        return $sce.trustAsHtml;
      }
})();
