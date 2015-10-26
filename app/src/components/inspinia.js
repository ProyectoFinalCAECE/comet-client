/**
 * INSPINIA - Responsive Admin Theme
 * Copyright 2014 Webapplayers.com
 *
 * Main directives.js file
 * Define directives for used plugin
 *
 *
 * Functions (directives)
 *  - sideNavigation
 *  - iboxTools
 *  - minimalizaSidebar
 *  - icheck
 *
 */

(function() {

  'use strict';

  /**
   * sideNavigation - Directive for run metsiMenu on sidebar navigation
   */
  function sideNavigation() {
      return {
          restrict: 'A',
          link: function(scope, element) {
              // Call the metsiMenu plugin and plug it to sidebar navigation
              element.metisMenu();
          }
      };
  }

  /**
   * iboxTools - Directive for iBox tools elements in right corner of ibox
   */
  function iboxTools($timeout) {
      return {
          restrict: 'A',
          scope: true,
          templateUrl: 'views/common/ibox_tools.html',
          controller: function ($scope, $element) {
              // Function for collapse ibox
              $scope.showhide = function () {
                  var ibox = $element.closest('div.ibox');
                  var icon = $element.find('i:first');
                  var content = ibox.find('div.ibox-content');
                  content.slideToggle(200);
                  // Toggle icon from up to down
                  icon.toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');
                  ibox.toggleClass('').toggleClass('border-bottom');
                  $timeout(function () {
                      ibox.resize();
                      ibox.find('[id^=map-]').resize();
                  }, 50);
              };

              // Function for close ibox
              $scope.closebox = function () {
                  var ibox = $element.closest('div.ibox');
                  ibox.remove();
              };
          }
      };
  }

  /**
   * minimalizaSidebar - Directive for minimalize sidebar
  */
  function minimalizaSidebar($timeout) {
      return {
          restrict: 'A',
          template: '<a class="navbar-minimalize minimalize-styl-2 btn btn-primary " href="" ng-click="minimalize()"><i class="fa fa-bars"></i></a>',
          controller: function ($scope) {
              $scope.minimalize = function () {
                  $("body").toggleClass("mini-navbar");
                  if (!$('body').hasClass('mini-navbar') || $('body').hasClass('body-small')) {
                      // Hide menu in order to smoothly turn on when maximize menu
                      $('#side-menu').hide();
                      // For smoothly turn on menu
                      $timeout(function () {
                          $('#side-menu').fadeIn(500);
                          }, 100);
                  } else {
                      // Remove all inline style from jquery fadeIn function to reset menu state
                      $('#side-menu').removeAttr('style');
                  }
              };
          }
      };
  }

  /**
   * icheck - Directive for custom checkbox icheck
   */
  function icheck($timeout) {
      return {
          restrict: 'A',
          require: 'ngModel',
          link: function($scope, element, $attrs, ngModel) {
              return $timeout(function() {
                  var value;
                  value = $attrs.value;

                  $scope.$watch($attrs.ngModel, function (){
                      $(element).iCheck('update');
                  });

                  return $(element).iCheck({
                      checkboxClass: 'icheckbox_square-green',
                      radioClass: 'iradio_square-green'

                  }).on('ifChanged', function(event) {
                          if ($(element).attr('type') === 'checkbox' && $attrs.ngModel) {
                              $scope.$apply(function() {
                                  return ngModel.$setViewValue(event.target.checked);
                              });
                          }
                          if ($(element).attr('type') === 'radio' && $attrs.ngModel) {
                              return $scope.$apply(function() {
                                  return ngModel.$setViewValue(value);
                              });
                          }
                      });
              });
          }
      };
  }

  /**
   *
   * Pass all functions into module
   */
  angular
      .module('inspinia', [])
      .directive('sideNavigation', sideNavigation)
      .directive('iboxTools', iboxTools)
      .directive('minimalizaSidebar', minimalizaSidebar)
      .directive('icheck', icheck);
})();
