(function () {

  'use strict';

  /**
  * @desc directive to highlight the active channel in the side menu
  * @example <div nav-menu-active/>
  */
  angular
  .module('cometApp')
  .directive('navMenuActive', navMenuActive);

  navMenuActive.$inject = ['$parse'];

  function navMenuActive () {
    return {
      restrict: 'A',
       scope: {
           method:'&callback'
       },
       link: function(scope, element, attrs) {

          var activeClass = attrs.navMenuActive || 'active',
              notificationClass = attrs.notificationClass || 'has-notification';

          scope.$on('channelActivated', function (event, args) {

            var links = element.find('a');
            links.parent('li').removeClass(activeClass);

            for (var i = links.length - 1; i >= 0; i--) {
              var link = angular.element(links[i]);
              var url = link.attr('href');
              if (url === args.url) {
                link.parent('li').addClass(activeClass);
                link.removeClass(notificationClass);
                break;
              }
            }
          });
       }
     };
  }
})();
