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
              notificationClass = attrs.notificationClass || 'has-notification',
              setActiveCallback = scope.method();

          scope.$on('$stateChangeSuccess', function(event, toState) {

            var links = element.find('a');
            links.parent('li').removeClass(activeClass);

            for (var i = links.length - 1; i >= 0; i--) {
              var link = angular.element(links[i]);
              var url = link.attr('href');

              if (url === toState.ncyBreadcrumbLink) {
                var type = link.data('type'),
                    id = link.data('id');

                link.parent('li').addClass(activeClass);
                link.removeClass(notificationClass);

                setActiveCallback({
                  type: type,
                  id: id
                });

                break;
              }
            }
          });
       }
     };
  }
})();
