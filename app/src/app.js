(function() {

    'use strict';

    /**
     * @name cometApp
     * @description
     * # cometApp
     * Main module of the application.
     */
    angular
        .module('cometApp', [
            'ngAnimate',
            'ngMessages',
            'ngSanitize',
            'ngToast',
            'ngTouch',
            'ncy-angular-breadcrumb',
            'ui.bootstrap',
            'ui.bootstrap.showErrors',
            'ui.router',
            'ui.select'
        ])
        // lodash support
        .constant('lodash', window._)
        // global forms configuration
        .constant('formsConfig', {
          'passwordLabel': 'Debe tener entre 6 y 40 caracteres ' +
                           'y contener al menos una minúscula, una mayúscula y un símbolo o número.'
        })
        // global dialog types
        .constant("dialogType", {
          ALERT: 1,
          CONFIRM: 2
        })
        // global constraints
        .constant('constraints', {
          projectPerUser: 30,
          membersPerProject: 50,
          membersPerProjectPerStep: 10
        })
        .run(function($rootScope, $state, helpersService){
          $rootScope.helpers = helpersService;
          // required for the default child state trick to work
          $rootScope.$on('$stateChangeStart', function(evt, to, params) {
            if (to.redirectTo) {
              evt.preventDefault();
              $state.go(to.redirectTo, params);
            }
          });
        }).directive('fileModel', ['$parse', function ($parse) {
            return {
                restrict: 'A',
                link: function(scope, element, attrs) {
                    var model = $parse(attrs.fileModel);
                    var modelSetter = model.assign;

                    element.bind('change', function(){
                        scope.$apply(function(){
                            modelSetter(scope, element[0].files[0]);
                        });
                    });
                }
            };
          }]).directive("ngFileSelect",function(){

            return {
              link: function($scope,el){

                el.bind("change", function(e){

                  $scope.file = (e.srcElement || e.target).files[0];
                  $scope.getFile();
                });

              }

            };


          })  ;
})();
